# Quick Database Setup Guide

## The Error You're Seeing

```
{"status":"unhealthy","error":"Database connection failed"}
```

This means your database is not connected. Follow these steps to fix it.

## Step 1: Get a Free PostgreSQL Database

### Option A: Neon (Recommended - Free Tier Available)

1. Go to **https://neon.tech/**
2. Click **"Sign Up"** (you can use GitHub, Google, or email)
3. Click **"Create a project"**
4. Choose a project name (e.g., "tinylink")
5. Select a region closest to you
6. Click **"Create project"**

### Option B: Other Free PostgreSQL Services

- **Supabase**: https://supabase.com/
- **Railway**: https://railway.app/
- **Render**: https://render.com/

## Step 2: Copy Your Connection String

### For Neon:

1. In your Neon dashboard, click on your project
2. Look for **"Connection string"** or **"Connection details"**
3. You'll see something like:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **Copy this entire string**

### Important Notes:
- The connection string should start with `postgresql://`
- It should include `?sslmode=require` at the end
- Keep it secret - don't share it publicly!

## Step 3: Create .env File

1. In your project folder (where `package.json` is), create a file named `.env`
2. Add this content:

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NODE_ENV=development
```

3. **Replace** `postgresql://username:password@host:port/database?sslmode=require` with your actual connection string from Step 2

### Example .env file:

```env
DATABASE_URL=postgresql://myuser:mypass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
```

## Step 4: Restart Your Server

1. **Stop** your current server (press `Ctrl+C` in the terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

## Step 5: Test the Connection

1. Open your browser
2. Go to: `http://localhost:3000/healthz`
3. You should see:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "uptime": 123,
     "uptimeFormatted": "2m 3s"
   }
   ```

## Common Issues

### Issue: "DATABASE_URL environment variable is not set"
**Fix**: Make sure your `.env` file exists in the project root (same folder as `package.json`)

### Issue: "Cannot connect to database server"
**Fix**: 
- Check if your connection string is correct
- Make sure your Neon database is not paused (some free tiers pause after inactivity)
- Verify the connection string includes `?sslmode=require`

### Issue: "Database authentication failed"
**Fix**: Your username or password in the connection string is incorrect. Get a fresh connection string from Neon.

### Issue: Still not working?
1. Check the server terminal for detailed error messages
2. Verify your `.env` file has no extra spaces or quotes
3. Make sure you restarted the server after creating `.env`
4. Try getting a new connection string from Neon

## Need More Help?

See `TROUBLESHOOTING.md` for more detailed troubleshooting steps.

