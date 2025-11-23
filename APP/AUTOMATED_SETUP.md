# Automated Setup Instructions

I've created automation scripts to help you set up the project quickly!

## 🚀 Quick Setup (2 Steps)

### Step 1: Install Node.js

**Option A - Automated (Recommended):**
```powershell
.\install-node.ps1
```
This script will:
- Check if Node.js is installed
- Help you download/install Node.js
- Guide you through the process

**Option B - Manual:**
1. Download from: https://nodejs.org/ (LTS version)
2. Run the installer
3. Restart PowerShell

### Step 2: Run Setup Script

Once Node.js is installed, run:
```powershell
.\setup.ps1
```

This script will automatically:
- ✅ Check for Node.js installation
- ✅ Install all npm dependencies
- ✅ Create .env file template
- ✅ Guide you through database setup

## 📝 What You Still Need to Do

After running the setup script, you need to:

1. **Create Neon Database:**
   - Go to https://neon.tech/
   - Create a free account
   - Create a new project
   - Copy your connection string

2. **Update .env File:**
   - Open the `.env` file created by the script
   - Replace `DATABASE_URL` with your actual Neon connection string

3. **Start Development Server:**
   ```powershell
   npm run dev
   ```

4. **Deploy to Vercel:**
   - Push code to GitHub
   - Import to Vercel
   - Add `DATABASE_URL` environment variable
   - Deploy!

## 🎯 All-in-One Command

If Node.js is already installed, you can run:
```powershell
.\setup.ps1
```

## 📚 Scripts Created

- **`install-node.ps1`** - Helps install Node.js
- **`setup.ps1`** - Automates project setup
- **`.env`** - Environment variables (created by setup script)

## ⚠️ Important Notes

- The setup scripts require PowerShell (which you're already using)
- Node.js installation may require administrator privileges
- After installing Node.js, **restart PowerShell** before running setup
- The `.env` file contains your database credentials - never commit it to Git

## 🆘 Troubleshooting

**"Script cannot be loaded" error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Node.js not found after installation:**
- Restart PowerShell
- Verify installation: `node --version`

**Dependencies fail to install:**
- Check internet connection
- Try: `npm install --verbose` for detailed errors

