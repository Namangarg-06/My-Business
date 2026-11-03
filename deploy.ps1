# Deploy to https://github.com/Namangarg-06/My-Business.git
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       PREMIUM PACKAGING SOLUTIONS (P2S) - DEPLOY TO MY-BUSINESS" -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "Target: https://github.com/Namangarg-06/My-Business.git`n" -ForegroundColor White

git branch -M main
git remote set-url origin https://github.com/Namangarg-06/My-Business.git 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote add origin https://github.com/Namangarg-06/My-Business.git
}

Write-Host "[1/3] Adding all files..." -ForegroundColor Green
git add .

Write-Host "[2/3] Committing..." -ForegroundColor Green
git commit -m "Deploy Premium Packaging Solutions (P2S) website and invoice engine"

Write-Host "[3/3] Pushing to GitHub main branch..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==============================================================================" -ForegroundColor Green
    Write-Host "       SUCCESS! DEPLOYED SUCCESSFULLY TO MY-BUSINESS!" -ForegroundColor Yellow
    Write-Host "==============================================================================" -ForegroundColor Green
    Write-Host "Live Website URL: https://namangarg-06.github.io/My-Business/`n" -ForegroundColor Cyan
} else {
    Write-Host "`nIf push is rejected because of existing README in repo, run:" -ForegroundColor Yellow
    Write-Host "git push -u origin main --force`n" -ForegroundColor White
}

pause
