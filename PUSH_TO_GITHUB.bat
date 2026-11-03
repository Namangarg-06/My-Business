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

echo [2/3] Committing changes (Voice Speech Swagatam Greeting, All Products Side Drawer, Decluttered Clean Luxury Layout)...
git commit -m "Add Voice Speech Swagatam Greeting for client login & links, luxury All Products side drawer & decluttered clean homepage" --allow-empty

echo [3/3] Pushing to GitHub...
git push -u origin main --force

if %ERRORLEVEL% equ 0 (
    color 0A
    echo.
    echo ==============================================================================
    echo       SUCCESS! UPDATED WEBSITE PUSHED TO GITHUB!
    echo ==============================================================================
    echo.
    echo Client Website Link:
    echo   https://namangarg-06.github.io/My-Business/
    echo ==============================================================================
) else (
    color 0C
    echo Push failed.
)

pause
