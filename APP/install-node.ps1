# Node.js Installation Helper Script
# This script helps you install Node.js on Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Installation Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
    Write-Host ""
    $continue = Read-Host "Do you want to continue with setup? (y/n)"
    if ($continue -eq "y" -or $continue -eq "Y") {
        & .\setup.ps1
    }
    exit 0
}

Write-Host "Node.js is not installed on your system." -ForegroundColor Yellow
Write-Host ""
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Download Node.js installer (recommended)" -ForegroundColor White
Write-Host "2. Install via winget (if available)" -ForegroundColor White
Write-Host "3. Install via Chocolatey (if installed)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose an option (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening Node.js download page..." -ForegroundColor Yellow
        Write-Host "Please download and install the LTS version." -ForegroundColor White
        Write-Host "After installation, restart PowerShell and run: .\setup.ps1" -ForegroundColor White
        Start-Process "https://nodejs.org/"
    }
    "2" {
        Write-Host ""
        Write-Host "Attempting to install via winget..." -ForegroundColor Yellow
        winget install OpenJS.NodeJS.LTS
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js installed! Please restart PowerShell and run: .\setup.ps1" -ForegroundColor Green
        } else {
            Write-Host "❌ winget installation failed. Try option 1 instead." -ForegroundColor Red
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Attempting to install via Chocolatey..." -ForegroundColor Yellow
        choco install nodejs-lts -y
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js installed! Please restart PowerShell and run: .\setup.ps1" -ForegroundColor Green
        } else {
            Write-Host "❌ Chocolatey installation failed. Try option 1 instead." -ForegroundColor Red
        }
    }
    default {
        Write-Host "Invalid option. Opening download page..." -ForegroundColor Yellow
        Start-Process "https://nodejs.org/"
    }
}

Write-Host ""

