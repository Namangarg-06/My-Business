@echo off
setlocal enabledelayedexpansion
title Deploying P6S Packaging to GitHub

cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"

color 0B
echo ==============================================================================
echo        PREMIUM PACKAGING SOLUTIONS (P6S) - 1-CLICK GITHUB PUSH
echo ==============================================================================
echo Working Directory: %CD%
echo Target Repository: https://github.com/Namangarg-06/My-Business.git
echo.

if not exist ".git\objects" (
    echo Re-initializing clean git repository...
    rd /s /q ".git" >nul 2>&1
    git init -b main
)

git config user.email "namangarg620@gmail.com"
git config user.name "Naman-Garg-06"
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Namangarg-06/My-Business.git

echo [1/3] Adding all files...
git add -A

echo [2/3] Committing changes (One-time Initial Link Welcome, 5 Realistic Sachet Sample Packaging Mockups with Interactive Flip)...
git commit -m "One-time initial link welcome splash only, add realistic 3D packaging sample mockups for all 5 sachets & flavors" --allow-empty

echo [3/3] Pushing to https://github.com/Namangarg-06/My-Business.git ...
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    color 0A
    echo.
    echo ==============================================================================
    echo       SUCCESS! WEBSITE PUSHED SUCCESSFULLY TO GITHUB!
    echo ==============================================================================
    echo 1. Primary Live Link:   https://naman-garg-06.github.io/My-Business/
    echo 2. Secondary Live Link: https://namangarg-06.github.io/My-Business/
    echo ==============================================================================
    start https://naman-garg-06.github.io/My-Business/
) else (
    color 0E
    echo Push to Naman-Garg-06 failed. Trying Namangarg-06...
    git remote set-url origin https://github.com/Namangarg-06/My-Business.git
    git push -u origin main --force
    if !ERRORLEVEL! equ 0 (
        color 0A
        echo.
        echo ==============================================================================
        echo       SUCCESS! WEBSITE PUSHED TO Namangarg-06!
        echo ==============================================================================
        echo Live Link: https://namangarg-06.github.io/My-Business/
    ) else (
        color 0C
        echo.
        echo Push failed.
    )
)

pause
