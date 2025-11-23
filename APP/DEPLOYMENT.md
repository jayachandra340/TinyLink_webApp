# Deployment Guide

## Quick Start Checklist

- [ ] Install Node.js from https://nodejs.org/
- [ ] Run `npm install` in the project directory
- [ ] Create a Neon PostgreSQL database at https://neon.tech/
- [ ] Update `.env` file with your `DATABASE_URL`
- [ ] Run `npm run dev` to test locally
- [ ] Deploy to Vercel

## Detailed Steps

### 1. Install Node.js

**Windows:**
1. Download the LTS installer from https://nodejs.org/
2. Run the installer and follow the prompts
3. Restart your terminal/PowerShell
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### 2. Install Project Dependencies

Open PowerShell in the project directory and run:
```powershell
npm install
```

This will install:
- Next.js 14
- React 18
- PostgreSQL client (pg)
- Tailwind CSS
- And other dependencies

### 3. Set Up Neon PostgreSQL Database

#### Create Neon Account & Database:

1. **Sign up at https://neon.tech/**
   - Free tier includes 0.5 GB storage
   - No credit card required for free tier

2. **Create a new project:**
   - Click "Create Project"
   - Choose a project name
   - Select a region (closest to you)
   - Click "Create Project"

3. **Get Connection String:**
   - In your project dashboard, find "Connection Details"
   - Copy the connection string
   - It looks like: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

#### Create .env File:

1. In the project root, create a file named `.env` (if it doesn't exist)
2. Add the following content:
   ```
   DATABASE_URL=your_neon_connection_string_here
   NODE_ENV=development
   ```
3. Replace `your_neon_connection_string_here` with your actual Neon connection string

**Important:** The `.env` file is in `.gitignore` and won't be committed to Git.

### 4. Test Locally

Run the development server:
```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

**First Run:** The database schema will be automatically created when you first access the application.

**Test Health Check:**
- Visit: http://localhost:3000/api/healthz
- Should return: `{"status":"healthy","timestamp":"..."}`

### 5. Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)

1. **Push to GitHub:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/
   - Sign up/Login (can use GitHub account)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables:**
   - In project settings → "Environment Variables"
   - Add new variable:
     - Name: `DATABASE_URL`
     - Value: Your Neon PostgreSQL connection string
   - Select all environments (Production, Preview, Development)
   - Click "Save"

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   vercel
   ```
   - Follow prompts to link project
   - When asked about environment variables, add `DATABASE_URL`

4. **Add Environment Variable:**
   ```powershell
   vercel env add DATABASE_URL
   ```
   - Paste your Neon connection string
   - Select all environments

5. **Deploy to Production:**
   ```powershell
   vercel --prod
   ```

## Post-Deployment

### Verify Deployment:

1. **Health Check:**
   - Visit: `https://your-project.vercel.app/api/healthz`
   - Should return healthy status

2. **Test Features:**
   - Create a short link
   - Test redirect functionality
   - View statistics

### Update Environment Variables:

If you need to update `DATABASE_URL`:
- Vercel Dashboard → Project → Settings → Environment Variables
- Edit the variable and redeploy

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Database Connection Errors
- Verify `DATABASE_URL` is correct in `.env` (local) or Vercel dashboard (production)
- Check Neon dashboard to ensure database is active
- Ensure connection string includes `?sslmode=require`

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Ensure `DATABASE_URL` is set in environment variables
- Verify all dependencies are in `package.json`

### 404 Errors on Redirects
- Check that links exist in database
- Verify redirect route is working: `/api/healthz` should work

## Security Notes

- Never commit `.env` file to Git (already in `.gitignore`)
- Use environment variables in Vercel, not hardcoded values
- Neon connection strings contain credentials - keep them secret
- Use Vercel's environment variable encryption

## Support Resources

- **Neon Docs:** https://neon.tech/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project Issues:** Check README.md for API documentation


