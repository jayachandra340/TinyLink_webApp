# URL Shortener Setup Script
# This script automates the setup process

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL Shortener - Automated Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
$npmVersion = npm --version 2>$null

if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://nodejs.org/ (LTS version)" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Opening Node.js download page..." -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    exit 1
}

Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Check for .env file
Write-Host "Checking for .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To complete setup:" -ForegroundColor Yellow
    Write-Host "1. Create a Neon PostgreSQL database at: https://neon.tech/" -ForegroundColor White
    Write-Host "2. Copy your connection string from Neon dashboard" -ForegroundColor White
    Write-Host "3. Create a .env file with:" -ForegroundColor White
    Write-Host "   DATABASE_URL=your_connection_string_here" -ForegroundColor Gray
    Write-Host "   NODE_ENV=development" -ForegroundColor Gray
    Write-Host ""
    
    $createEnv = Read-Host "Would you like to create a .env template file now? (y/n)"
    if ($createEnv -eq "y" -or $createEnv -eq "Y") {
        @"
# Database connection string (Neon PostgreSQL)
# Get this from your Neon dashboard: https://console.neon.tech/
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Node environment
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ .env template created! Please update it with your Neon database URL." -ForegroundColor Green
    }
} else {
    Write-Host "✅ .env file found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure your .env file has a valid DATABASE_URL" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""

