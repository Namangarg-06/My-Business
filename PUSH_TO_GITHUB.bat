@echo off
setlocal enabledelayedexpansion
title Deploying P6S Packaging to GitHub

cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"

color 0B
echo ==============================================================================
echo        PREMIUM PACKAGING SOLUTIONS (P6S) - 1-CLICK GITHUB PUSH
echo ==============================================================================
echo Target Repository: https://github.com/Namangarg-06/My-Business.git
echo.

if not exist ".git\objects" (
    rd /s /q ".git" >nul 2>&1
    git init -b main
)

git config user.email "namangarg620@gmail.com"
git config user.name "Naman-Garg-06"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Namangarg-06/My-Business.git

echo [1/3] Adding updated files...
git add -A

echo [2/3] Committing changes (Add PWA Progressive Web App support, mobile download button, app icons & service worker)...
git commit -m "Add PWA mobile app download support, home screen icons and service worker" --allow-empty

echo [3/3] Pushing to GitHub (Namangarg-06/My-Business)...
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    color 0A
    echo.
    echo ==============================================================================
    echo       SUCCESS! UPDATED WEBSITE PUSHED TO GITHUB!
    echo ==============================================================================
    echo.
    echo 1. PRIMARY LIVE LINK (Naman-Garg-06):
    echo    https://naman-garg-06.github.io/My-Business/
    echo.
    echo 2. SECONDARY LINK:
    echo    https://namangarg-06.github.io/My-Business/
    echo ==============================================================================
    echo.
    echo Opening live website in your default browser...
    start https://naman-garg-06.github.io/My-Business/
) else (
    color 0E
    echo.
    echo Trying alternative remote (Naman-Garg-06)...
    git remote set-url origin https://github.com/Naman-Garg-06/My-Business.git
    git push -u origin main --force
    if !ERRORLEVEL! equ 0 (
        color 0A
        echo.
        echo ==============================================================================
        echo       SUCCESS! PUSHED TO Naman-Garg-06/My-Business!
        echo ==============================================================================
        echo Live Link: https://naman-garg-06.github.io/My-Business/
        start https://naman-garg-06.github.io/My-Business/
    ) else (
        color 0C
        echo.
        echo Push failed. Please check your GitHub login in Windows.
    )
)

pause
