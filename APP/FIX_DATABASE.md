# 🔧 Fix Database Connection Error

## Current Issue

Your `.env` file has a **placeholder** connection string:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

This is just a template - you need to replace it with your **real** database connection string.

## Quick Fix (5 minutes)

### Step 1: Get a Free Neon Database

1. **Go to**: https://neon.tech/
2. **Sign up** (free, no credit card needed)
3. **Click "Create a project"**
4. **Choose a name** (e.g., "tinylink")
5. **Select a region** (closest to you)
6. **Click "Create project"**

### Step 2: Copy Your Connection String

1. In the Neon dashboard, you'll see **"Connection string"**
2. It looks like this:
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Click the copy button** to copy the entire string

### Step 3: Update Your .env File

1. **Open** your `.env` file in the project root
2. **Replace** the placeholder line:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   ```
   
   **With your real connection string**:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```

3. **Save** the file

### Step 4: Restart Your Server

**IMPORTANT**: You must restart the server for changes to take effect!

1. **Stop** the server: Press `Ctrl+C` in your terminal
2. **Start** it again:
   ```powershell
   npm run dev
   ```

### Step 5: Verify It Works

1. **Open**: http://localhost:3000/healthz
2. **You should see**:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "uptime": 123,
     "uptimeFormatted": "2m 3s"
   }
   ```

✅ **If you see "healthy", you're all set!**

## Still Having Issues?

### Check Your .env File

Make sure:
- ✅ No extra spaces around the `=` sign
- ✅ No quotes around the connection string
- ✅ The connection string starts with `postgresql://`
- ✅ It ends with `?sslmode=require`

### Example of Correct .env File:

```env
DATABASE_URL=postgresql://myuser:mypass123@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
```

### Common Mistakes:

❌ **Wrong**: `DATABASE_URL="postgresql://..."` (quotes)
❌ **Wrong**: `DATABASE_URL = postgresql://...` (spaces around =)
❌ **Wrong**: `DATABASE_URL=postgresql://...` (missing ?sslmode=require)

✅ **Correct**: `DATABASE_URL=postgresql://user:pass@host/db?sslmode=require`

## Need More Help?

- See `setup-database.md` for detailed instructions
- See `TROUBLESHOOTING.md` for more troubleshooting tips

