# Debugging 500 Server Errors

## Quick Fixes

### 1. Check Your Server Terminal

The **most important** step: Look at your terminal where `npm run dev` is running. You should see detailed error messages that tell you exactly what's wrong.

Common errors you might see:

#### "DATABASE_URL is not set"
**Fix**: Make sure your `.env` file exists and has:
```
DATABASE_URL=your_actual_connection_string
```

#### "relation 'links' does not exist" or "42P01"
**Fix**: The database table hasn't been created. The app will try to create it automatically, but if it fails:
1. Check your database connection string
2. Make sure your database user has permission to create tables
3. Restart your server

#### "ECONNREFUSED" or "connect"
**Fix**: Your database server is not reachable:
1. Check your `DATABASE_URL` is correct
2. If using Neon, make sure your database is not paused
3. Verify the connection string includes `?sslmode=require`

### 2. Check Browser Console

1. Open browser DevTools (F12)
2. Go to the **Console** tab
3. Look for error messages
4. Go to the **Network** tab
5. Click on the failed request (usually `/api/links`)
6. Check the **Response** tab to see the error message

### 3. Verify Database Connection

Test your database connection:
```
http://localhost:3000/healthz
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123
}
```

If you see `"status": "unhealthy"`, check the error message for details.

### 4. Common Issues and Solutions

#### Issue: Database table doesn't exist
**Solution**: 
- The app should create it automatically
- If it doesn't, check your database user permissions
- Try restarting the server

#### Issue: Invalid DATABASE_URL format
**Solution**: 
- Connection string should start with `postgresql://`
- Should include `?sslmode=require` at the end
- No quotes around the value in `.env`

#### Issue: Database connection timeout
**Solution**:
- Check if your Neon database is paused (free tier pauses after inactivity)
- Wake it up in the Neon dashboard
- Try the connection again

#### Issue: SSL/TLS error
**Solution**:
- Make sure your connection string includes `?sslmode=require`
- For Neon, this is required

### 5. Step-by-Step Debugging

1. **Stop your server** (Ctrl+C)

2. **Check your `.env` file**:
   ```powershell
   Get-Content .env
   ```
   Make sure `DATABASE_URL` is set correctly

3. **Test database connection**:
   - Go to Neon dashboard
   - Try the connection string in a database client
   - Or use: `psql "your_connection_string"`

4. **Restart server**:
   ```powershell
   npm run dev
   ```

5. **Watch the terminal** for error messages

6. **Check the health endpoint**:
   - Visit: http://localhost:3000/healthz
   - Should return `{"status":"healthy",...}`

7. **Try the API directly**:
   - Visit: http://localhost:3000/api/links
   - Should return `[]` (empty array) or a list of links

### 6. Get Detailed Error Information

The error response should now include:
- `error`: Human-readable error message
- `code`: Database error code (if applicable)
- `details`: Full error stack (in development mode)

Check the **Response** tab in browser DevTools Network tab to see these details.

### 7. Still Not Working?

1. **Check server logs** - Look at terminal output
2. **Check browser console** - Look for client-side errors
3. **Verify `.env` file** - Make sure it's in the project root
4. **Restart everything**:
   - Stop server (Ctrl+C)
   - Delete `.next` folder: `Remove-Item -Recurse -Force .next`
   - Restart: `npm run dev`

### 8. Need More Help?

- Check `TROUBLESHOOTING.md` for general issues
- Check `FIX_DATABASE.md` for database setup
- Check server terminal for specific error messages

