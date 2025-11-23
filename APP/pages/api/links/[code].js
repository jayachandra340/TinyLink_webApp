const { getLinkByCode, deleteLink, isValidCode } = require('../../../lib/db');

async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;
  
  // Validate code parameter
  if (!code) {
    return res.status(400).json({ error: 'Code parameter is required' });
  }
  
  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Code must be a string' });
  }
  
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return res.status(400).json({ error: 'Code cannot be empty' });
  }
  
  // Validate code format (6-8 alphanumeric)
  if (!isValidCode(trimmedCode)) {
    return res.status(400).json({ 
      error: 'Invalid code format. Code must be 6-8 alphanumeric characters [A-Za-z0-9]' 
    });
  }
  
  if (req.method === 'GET') {
    try {
      const link = await getLinkByCode(trimmedCode);
      
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }
      
      return res.status(200).json({
        code: link.code,
        originalUrl: link.original_url,
        clicks: link.clicks || 0,
        createdAt: link.created_at,
        lastClickedAt: link.last_clicked_at || null,
      });
    } catch (error) {
      console.error('Error fetching link:', error);
      console.error('Error stack:', error.stack);
      
      // Check for database connection errors
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        return res.status(503).json({ 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file.' 
        });
      }
      
      return res.status(500).json({ 
        error: error.message || 'Internal server error',
        code: error.code
      });
    }
  }
  
  if (req.method === 'DELETE') {
    try {
      const link = await deleteLink(trimmedCode);
      
      if (!link) {
        return res.status(404).json({ error: 'Link not found' });
      }
      
      return res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      console.error('Error stack:', error.stack);
      
      // Check for database connection errors
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        return res.status(503).json({ 
          error: 'Database connection failed. Please check your DATABASE_URL in .env file.' 
        });
      }
      
      return res.status(500).json({ 
        error: error.message || 'Internal server error',
        code: error.code
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
