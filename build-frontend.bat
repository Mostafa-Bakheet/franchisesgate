@echo off
REM Build Frontend for Production - Windows Script
REM Run this before deploying to VPS

echo [33m📦 Building Franchise Gate Frontend...[0m

cd /d "%~dp0frontend"

echo Installing dependencies...
call npm ci 2>nul || call npm install
if errorlevel 1 (
    echo [31m❌ Failed to install dependencies[0m
    exit /b 1
)

echo Building for production...
call npm run build
if errorlevel 1 (
    echo [31m❌ Build failed[0m
    exit /b 1
)

echo [32m✅ Build completed successfully![0m
echo 📁 Build output: frontend/dist/
echo.
echo Next steps:
echo   1. Run: bash deploy-vps.sh
echo   2. Or manually upload frontend/dist/ to server
