# Setup Instructions

## Prerequisites

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/ (LTS version recommended)
   - This will also install npm (Node Package Manager)

2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

## Step 1: Install Dependencies

Once Node.js is installed, run:
```bash
npm install
```

## Step 2: Set Up Neon PostgreSQL Database

1. **Create a Neon account** (if you don't have one):
   - Go to https://neon.tech/
   - Sign up for a free account

2. **Create a new project**:
   - Click "Create Project"
   - Choose a name and region
   - Note: Neon provides a free tier with 0.5 GB storage

3. **Get your connection string**:
   - In your Neon dashboard, go to your project
   - Click on "Connection Details" or "Connection String"
   - Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

4. **Update .env file**:
   - Open the `.env` file in the project root
   - Replace the `DATABASE_URL` value with your actual Neon connection string
   - Example:
     ```
     DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
     ```

## Step 3: Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

**Note**: The database schema will be automatically created on first run.

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

4. **Add environment variable**:
   ```bash
   vercel env add DATABASE_URL
   ```
   Paste your Neon PostgreSQL connection string when prompted.

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard (Recommended)

1. **Push to Git**:
   - Create a repository on GitHub, GitLab, or Bitbucket
   - Push your code:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin <your-repo-url>
     git push -u origin main
     ```

2. **Import to Vercel**:
   - Go to https://vercel.com/
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variable**:
   - In the project settings, go to "Environment Variables"
   - Add `DATABASE_URL` with your Neon PostgreSQL connection string
   - Make sure to add it for Production, Preview, and Development environments

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application automatically

## Troubleshooting

### npm command not found
- Make sure Node.js is installed: https://nodejs.org/
- Restart your terminal after installing Node.js

### Database connection errors
- Verify your `DATABASE_URL` in the `.env` file is correct
- Check that your Neon database is running
- Ensure SSL mode is set to `require` in the connection string

### Build errors on Vercel
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Check the build logs in Vercel dashboard for specific errors

## Testing the Application

1. **Health Check**: Visit `http://localhost:3000/api/healthz` (should return `{"status":"healthy"}`)

2. **Create a Link**: 
   - Go to the dashboard
   - Enter a URL (e.g., `https://example.com`)
   - Optionally add a custom code
   - Click "Create Short Link"

3. **Test Redirect**: 
   - Click on a short link or visit `http://localhost:3000/{code}`
   - Should redirect to the original URL

4. **View Stats**: 
   - Click "Stats" on any link
   - View click count and other statistics


