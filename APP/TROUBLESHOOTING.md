# Troubleshooting Guide

## "Network error. Please try again."

This error typically occurs when the application cannot connect to the server or database. Follow these steps:

### 1. Check if the Development Server is Running

Make sure you've started the Next.js development server:

```bash
npm run dev
```

You should see output like:
```
✓ Ready in 2.3s
○ Compiling / ...
✓ Compiled / in 1.2s
```

The server should be running on `http://localhost:3000`

### 2. Check Database Configuration

Verify that you have a `.env` file in the project root with your database connection string:

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=development
```

**To get a free PostgreSQL database:**
1. Go to https://neon.tech/
2. Sign up for a free account
3. Create a new project
4. Copy the connection string from the dashboard
5. Paste it into your `.env` file as `DATABASE_URL`

### 3. Verify Database Connection

Test your database connection by visiting:
```
http://localhost:3000/healthz
```

This should return a JSON response with `"status": "healthy"` if everything is working.

### 4. Check Browser Console

Open your browser's developer console (F12) and look for error messages. Common issues:

- **CORS errors**: Usually means the server isn't running
- **404 errors**: API routes not found - check if server is running
- **500 errors**: Server-side error - check server logs in terminal

### 5. Check Server Logs

Look at your terminal where `npm run dev` is running. You should see:
- Database connection errors
- API request logs
- Any error stack traces

### 6. Common Issues and Solutions

#### Issue: "Cannot connect to server"
**Solution**: Make sure `npm run dev` is running in your terminal

#### Issue: "Database connection failed"
**Solution**: 
1. Verify your `DATABASE_URL` in `.env` is correct
2. Check if your Neon database is active (not paused)
3. Ensure the connection string includes `?sslmode=require`

#### Issue: "DATABASE_URL environment variable is not set"
**Solution**: Create a `.env` file in the project root with your database URL

#### Issue: Port 3000 already in use
**Solution**: 
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### 7. Reset Everything

If nothing works, try a fresh start:

```bash
# Stop the server (Ctrl+C)

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Make sure .env file exists with DATABASE_URL
# Then start again
npm run dev
```

### 8. Still Having Issues?

1. Check that Node.js is installed: `node --version` (should be 18+)
2. Check that npm is installed: `npm --version`
3. Verify your `.env` file is in the project root (same folder as `package.json`)
4. Make sure there are no typos in your `DATABASE_URL`
5. Try accessing the health endpoint directly: `http://localhost:3000/healthz`

## Getting Help

If you're still experiencing issues:
1. Check the server terminal for detailed error messages
2. Check the browser console (F12) for client-side errors
3. Verify all environment variables are set correctly
4. Ensure your database is accessible and not paused

