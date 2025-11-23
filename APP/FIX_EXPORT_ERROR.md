# Fix: "Page /api/links does not export a default function"

## Quick Fix

The error is likely due to Next.js cache. Follow these steps:

### Step 1: Stop the Server
Press `Ctrl+C` in your terminal to stop the development server.

### Step 2: Clear Next.js Cache
Delete the `.next` folder:

**PowerShell:**
```powershell
Remove-Item -Recurse -Force .next
```

**Or manually:**
- Delete the `.next` folder in your project root

### Step 3: Restart the Server
```powershell
npm run dev
```

## If That Doesn't Work

### Option 1: Check File Syntax
Make sure `pages/api/links.js` ends with:
```javascript
module.exports = handler;
```

### Option 2: Verify the Handler Function
The handler should be defined as:
```javascript
async function handler(req, res) {
  // ... your code
}

module.exports = handler;
```

### Option 3: Try Alternative Export
If the above doesn't work, try:
```javascript
module.exports = async function(req, res) {
  // ... your code
};
```

## Verification

After clearing cache and restarting:
1. Check the terminal - you should see "Ready" without errors
2. Visit: http://localhost:3000/api/links
3. Should return `[]` (empty array) or a list of links

## Still Having Issues?

1. Check that all API route files have `module.exports = handler;` at the end
2. Make sure there are no syntax errors in the files
3. Try deleting `node_modules/.cache` if it exists
4. Restart your terminal/IDE

The export syntax is correct - this is almost certainly a caching issue!

