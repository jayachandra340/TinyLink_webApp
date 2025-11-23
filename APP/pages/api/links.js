const { createLink, getAllLinks, isValidUrl, isValidCode } = require('../../lib/db');

async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Validate request body exists
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Request body is required' });
      }

      const { url, code } = req.body;
      
      // Validate URL - check for missing, empty, or whitespace-only
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      if (typeof url !== 'string') {
        return res.status(400).json({ error: 'URL must be a string' });
      }
      
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        return res.status(400).json({ error: 'URL cannot be empty' });
      }
      
      // Validate URL length (max 2048 characters for URLs)
      if (trimmedUrl.length > 2048) {
        return res.status(400).json({ error: 'URL is too long (maximum 2048 characters)' });
      }
      
      if (!isValidUrl(trimmedUrl)) {
        return res.status(400).json({ error: 'Invalid URL format. Must be http:// or https://' });
      }
      
      // Validate custom code if provided
      if (code !== undefined && code !== null) {
        if (typeof code !== 'string') {
          return res.status(400).json({ 
            error: 'Code must be a string' 
          });
        }
        
        const trimmedCode = code.trim();
        if (!trimmedCode) {
          // Empty code is allowed (will generate random)
          // But if they provide code, it shouldn't be empty
          return res.status(400).json({ 
            error: 'Code cannot be empty. Leave it blank to auto-generate.' 
          });
        }
        
        if (!isValidCode(trimmedCode)) {
          return res.status(400).json({ 
            error: 'Invalid code format. Must be 6-8 alphanumeric characters [A-Za-z0-9]' 
          });
        }
      }
      
      // Create link with trimmed values
      const link = await createLink(trimmedUrl, code ? code.trim() : null);
      
      return res.status(201).json({
        code: link.code,
        originalUrl: link.original_url,
        clicks: link.clicks || 0,
        createdAt: link.created_at,
      });
    } catch (error) {
      if (error.message === 'DUPLICATE_CODE') {
        return res.status(409).json({ error: 'Code already exists' });
      }
      console.error('Error creating link:', error);
      console.error('Error stack:', error.stack);
      
      // Check for database connection errors
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        return res.status(503).json({ 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file.' 
        });
      }
      
      // Check for missing DATABASE_URL
      if (error.message.includes('DATABASE_URL is not set')) {
        return res.status(503).json({ 
          error: 'DATABASE_URL is not configured. Please set it in your .env file.' 
        });
      }
      
      // Check for table not found
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return res.status(503).json({ 
          error: 'Database table not found. The database may not be initialized. Please check your database connection.' 
        });
      }
      
      return res.status(500).json({ 
        error: error.message || 'Internal server error',
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  if (req.method === 'GET') {
    try {
      // Validate and sanitize query parameters
      let { sortBy = 'created_at', order = 'desc', filter = '' } = req.query;
      
      // Validate sortBy
      const validSortColumns = ['created_at', 'clicks', 'code', 'original_url'];
      if (typeof sortBy !== 'string' || !validSortColumns.includes(sortBy)) {
        sortBy = 'created_at';
      }
      
      // Validate order
      if (typeof order !== 'string') {
        order = 'desc';
      }
      order = order.toLowerCase();
      if (order !== 'asc' && order !== 'desc') {
        order = 'desc';
      }
      
      // Validate and sanitize filter (prevent SQL injection)
      if (typeof filter !== 'string') {
        filter = '';
      }
      // Limit filter length to prevent abuse
      filter = filter.trim().substring(0, 100);
      
      const links = await getAllLinks(sortBy, order, filter);
      
      // Always return an array, even if empty
      return res.status(200).json(
        (links || []).map(link => ({
          code: link.code,
          originalUrl: link.original_url,
          clicks: link.clicks || 0,
          createdAt: link.created_at,
          lastClickedAt: link.last_clicked_at || null,
        }))
      );
    } catch (error) {
      console.error('Error fetching links:', error);
      console.error('Error stack:', error.stack);
      
      // Check for database connection errors
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        return res.status(503).json({ 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file.' 
        });
      }
      
      // Check for missing DATABASE_URL
      if (error.message.includes('DATABASE_URL is not set')) {
        return res.status(503).json({ 
          error: 'DATABASE_URL is not configured. Please set it in your .env file.' 
        });
      }
      
      // Check for table not found
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return res.status(503).json({ 
          error: 'Database table not found. The database may not be initialized. Please check your database connection.' 
        });
      }
      
      return res.status(500).json({ 
        error: error.message || 'Internal server error',
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
