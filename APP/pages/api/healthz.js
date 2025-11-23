const { pool } = require('../../lib/db');

// Track server start time for uptime calculation
const startTime = Date.now();

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ 
        status: 'unhealthy', 
        error: 'DATABASE_URL environment variable is not set',
        message: 'Please create a .env file with your database connection string. See TROUBLESHOOTING.md for help.'
      });
    }

    // Check database connection
    await pool.query('SELECT 1');
    
    const uptime = Math.floor((Date.now() - startTime) / 1000); // uptime in seconds
    
    return res.status(200).json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: uptime,
      uptimeFormatted: formatUptime(uptime)
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Database connection failed';
    let errorDetails = error.message;
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to database server';
      errorDetails = 'The database server is not reachable. Check your DATABASE_URL.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Database host not found';
      errorDetails = 'The database host in your DATABASE_URL is incorrect.';
    } else if (error.code === '28P01' || error.message.includes('password')) {
      errorMessage = 'Database authentication failed';
      errorDetails = 'Invalid username or password in DATABASE_URL.';
    } else if (error.message.includes('does not exist')) {
      errorMessage = 'Database does not exist';
      errorDetails = 'The database name in your DATABASE_URL does not exist.';
    }
    
    return res.status(503).json({ 
      status: 'unhealthy', 
      error: errorMessage,
      details: errorDetails,
      code: error.code,
      hint: 'Check your .env file and ensure DATABASE_URL is correct. See TROUBLESHOOTING.md for setup instructions.'
    });
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
}

export default handler;
