const { Pool } = require('pg');

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please create a .env file with: DATABASE_URL=your_connection_string');
}

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Track initialization state
let initPromise = null;
let isInitialized = false;

// Initialize database schema
async function initDB() {
  // If already initialized, return
  if (isInitialized) {
    return;
  }
  
  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }
  
  // Start initialization
  initPromise = (async () => {
    try {
      // Check if DATABASE_URL is set
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
      }
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          code VARCHAR(8) UNIQUE NOT NULL,
          original_url TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_clicked_at TIMESTAMP
        );
      `);
      
      // Create indexes separately to avoid errors if they already exist
      try {
        await pool.query('CREATE INDEX IF NOT EXISTS idx_code ON links(code);');
      } catch (e) {
        // Index might already exist, ignore
      }
      
      try {
        await pool.query('CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at);');
      } catch (e) {
        // Index might already exist, ignore
      }
      
      isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      isInitialized = false;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

// Generate a random code
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate code format
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate URL
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Check if code exists
async function codeExists(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }
  try {
    const result = await pool.query('SELECT id FROM links WHERE code = $1', [code.trim()]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking code existence:', error);
    throw error;
  }
}

// Create a new link
async function createLink(originalUrl, customCode = null) {
  // Validate inputs
  if (!originalUrl || typeof originalUrl !== 'string' || !originalUrl.trim()) {
    throw new Error('Original URL is required');
  }
  
  // Ensure database is initialized
  await initDB().catch(() => {}); // Ignore if already initialized
  
  let code = customCode;
  
  if (!code) {
    // Generate unique code
    let attempts = 0;
    const maxAttempts = 20; // Increased from 10 for better reliability
    do {
      code = generateCode(6);
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique code after multiple attempts');
      }
    } while (await codeExists(code));
  } else {
    // Validate and trim custom code
    if (typeof code !== 'string' || !code.trim()) {
      throw new Error('Invalid code format');
    }
    code = code.trim();
    
    // Check if custom code already exists
    if (await codeExists(code)) {
      throw new Error('DUPLICATE_CODE');
    }
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING *',
      [code, originalUrl.trim()]
    );
    
    if (!result.rows || result.rows.length === 0) {
      throw new Error('Failed to create link');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error in createLink:', error);
    // If table doesn't exist, try to create it
    if (error.message.includes('does not exist') || error.code === '42P01') {
      await initDB();
      // Retry the insert
      const result = await pool.query(
        'INSERT INTO links (code, original_url) VALUES ($1, $2) RETURNING *',
        [code, originalUrl.trim()]
      );
      return result.rows[0];
    }
    // Check for duplicate key error
    if (error.code === '23505') {
      throw new Error('DUPLICATE_CODE');
    }
    throw error;
  }
}

// Get all links
async function getAllLinks(sortBy = 'created_at', order = 'desc', filter = '') {
  // Ensure database is initialized
  await initDB().catch(() => {}); // Ignore if already initialized
  
  let query = 'SELECT * FROM links';
  const params = [];
  
  if (filter) {
    query += ' WHERE original_url ILIKE $1 OR code ILIKE $1';
    params.push(`%${filter}%`);
  }
  
  const validSortColumns = ['created_at', 'clicks', 'code', 'original_url'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  
  // Use validated column name (already validated above, safe to interpolate)
  query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error in getAllLinks:', error);
    // If table doesn't exist, try to create it
    if (error.message.includes('does not exist') || error.code === '42P01') {
      await initDB();
      // Retry the query
      const result = await pool.query(query, params);
      return result.rows;
    }
    throw error;
  }
}

// Get link by code
async function getLinkByCode(code) {
  if (!code || typeof code !== 'string') {
    return null;
  }
  
  try {
    // Ensure database is initialized
    await initDB().catch(() => {});
    
    const trimmedCode = code.trim();
    const result = await pool.query('SELECT * FROM links WHERE code = $1', [trimmedCode]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getLinkByCode:', error);
    // If table doesn't exist, try to create it
    if (error.message.includes('does not exist') || error.code === '42P01') {
      await initDB();
      const result = await pool.query('SELECT * FROM links WHERE code = $1', [code.trim()]);
      return result.rows[0] || null;
    }
    throw error;
  }
}

// Increment click count
async function incrementClick(code) {
  if (!code || typeof code !== 'string') {
    throw new Error('Code is required');
  }
  
  try {
    // Ensure database is initialized
    await initDB().catch(() => {});
    
    const trimmedCode = code.trim();
    const result = await pool.query(
      'UPDATE links SET clicks = COALESCE(clicks, 0) + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = $1 RETURNING *',
      [trimmedCode]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Link not found');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error in incrementClick:', error);
    // If table doesn't exist, try to create it
    if (error.message.includes('does not exist') || error.code === '42P01') {
      await initDB();
      const result = await pool.query(
        'UPDATE links SET clicks = COALESCE(clicks, 0) + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = $1 RETURNING *',
        [code.trim()]
      );
      return result.rows[0];
    }
    throw error;
  }
}

// Delete link
async function deleteLink(code) {
  if (!code || typeof code !== 'string') {
    return null;
  }
  
  try {
    // Ensure database is initialized
    await initDB().catch(() => {});
    
    const trimmedCode = code.trim();
    const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [trimmedCode]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteLink:', error);
    // If table doesn't exist, try to create it
    if (error.message.includes('does not exist') || error.code === '42P01') {
      await initDB();
      const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code.trim()]);
      return result.rows[0] || null;
    }
    throw error;
  }
}

// Initialize database on module load (non-blocking)
if (typeof window === 'undefined') {
  // Initialize in background, don't block module loading
  initDB().catch((error) => {
    console.error('Failed to initialize database on startup:', error.message);
    // Don't throw - let individual queries handle initialization
  });
}

module.exports = {
  pool,
  initDB,
  generateCode,
  isValidCode,
  isValidUrl,
  codeExists,
  createLink,
  getAllLinks,
  getLinkByCode,
  incrementClick,
  deleteLink,
};

