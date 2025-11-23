// Health check endpoint - returns JSON status
// This file handles /healthz route and returns JSON response

export default function HealthCheck() {
  // This component should never render as we return JSON in getServerSideProps
  return null;
}

export async function getServerSideProps({ res, req }) {
  const { pool } = require('../lib/db');
  
  // Track server start time for uptime calculation
  // Note: This will reset on server restart, but that's acceptable for this use case
  const startTime = process.env.START_TIME ? parseInt(process.env.START_TIME) : Date.now();
  if (!process.env.START_TIME) {
    process.env.START_TIME = startTime.toString();
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
  
  // Only allow GET method
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return { props: {} };
  }

  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    const uptime = Math.floor((Date.now() - startTime) / 1000); // uptime in seconds
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      uptimeFormatted: formatUptime(uptime)
    };
    
    // Always return JSON
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
    return { props: {} };
  } catch (error) {
    console.error('Health check failed:', error);
    const errorResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    };
    
    // Always return JSON
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errorResponse));
    return { props: {} };
  }
}

