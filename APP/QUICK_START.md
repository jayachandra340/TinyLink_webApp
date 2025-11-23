# Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Node.js
**If Node.js is not installed:**
1. Download from: https://nodejs.org/ (choose LTS version)
2. Run the installer
3. **Restart your terminal/PowerShell**
4. Verify: `node --version` and `npm --version`

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Set Up Database
1. **Create Neon account:** https://neon.tech/ (free tier available)
2. **Create a new project** in Neon dashboard
3. **Copy your connection string** from Neon dashboard
4. **Create `.env` file** in project root:
   ```
   DATABASE_URL=your_neon_connection_string_here
   NODE_ENV=development
   ```
   (Replace `your_neon_connection_string_here` with your actual string)

### Step 4: Run Locally
```powershell
npm run dev
```
Open: http://localhost:3000

### Step 5: Deploy to Vercel
1. **Push to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/
   - Click "Add New Project"
   - Import your GitHub repo
   - Add environment variable: `DATABASE_URL` = your Neon connection string
   - Click "Deploy"

**Done!** Your app is live at `https://your-project.vercel.app`

## 🆘 Need Help?

- **Detailed setup:** See `SETUP.md`
- **Deployment guide:** See `DEPLOYMENT.md`
- **API documentation:** See `README.md`

## ✅ Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Neon database created
- [ ] `.env` file created with `DATABASE_URL`
- [ ] Local server running (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel with environment variables


