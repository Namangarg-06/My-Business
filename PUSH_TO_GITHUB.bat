@echo off
setlocal enabledelayedexpansion
title Deploying P2S Packaging to GitHub

:: Step 0: Ensure we are in the script directory
cd /d "%~dp0"

:: Step 1: Ensure Git is in PATH
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"

color 0B
echo ==============================================================================
echo        PREMIUM PACKAGING SOLUTIONS (P2S) - 1-CLICK GITHUB PUSH
echo ==============================================================================
echo Working Directory: %CD%
echo Target Repository: https://github.com/Namangarg-06/My-Business.git
echo.

:: Check Git
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Git could not be found!
    echo Looked in: C:\Program Files\Git\cmd
    pause
    exit /b
)

echo [1/5] Checking Git repository initialization...
if not exist ".git\objects" (
    echo Re-initializing clean git repository...
    rd /s /q ".git" >nul 2>&1
    git init -b main
)

:: Configure user identity
git config user.email "namangarg620@gmail.com"
git config user.name "Naman-Garg-06"

echo [2/5] Setting up branch and remote URL...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Namangarg-06/My-Business.git

echo [3/5] Adding all files (HTML, CSS, JS, Invoices, Workflows)...
git add -A

echo [4/5] Committing changes...
git commit -m "Deploy Premium Packaging Solutions (P2S) Live Website" --allow-empty

echo [5/5] Pushing to https://github.com/Namangarg-06/My-Business.git ...
echo (If a GitHub login popup appears, please click Sign in with Browser)
echo.

git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    color 0A
    echo.
    echo ==============================================================================
    echo       SUCCESS! WEBSITE PUSHED SUCCESSFULLY TO GITHUB!
    echo ==============================================================================
    echo.
    echo GitHub Actions will deploy your website live within 1 minute!
    echo.
    echo Live Website Link:
    echo   https://namangarg-06.github.io/My-Business/
    echo.
    echo Repository Link:
    echo   https://github.com/Namangarg-06/My-Business
    echo ==============================================================================
) else (
    color 0C
    echo.
    echo ==============================================================================
    echo  Push failed with error code: %ERRORLEVEL%
    echo  Please check the error message above.
    echo ==============================================================================
)

echo.
echo Press any key to exit...
pause >nul
