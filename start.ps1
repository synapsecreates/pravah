# FILE: start.ps1
# PURPOSE: One-click PowerShell launcher for Pravah platform
# PHASE: 8 | DEPENDS ON: PowerShell 5.1+, Python 3.10+, Node 18+ | LAST TOUCHED: Phase 8

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  Pravah (प्रवाह) - National Skill Intelligence Platform" -ForegroundColor Green
Write-Host "  Launching Backend (FastAPI :8000) & Frontend (Vite :5174)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# 1. Verify Backend Virtualenv
$pythonPath = Join-Path $root "backend\venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) {
    Write-Error "Virtual environment not found at $pythonPath. Please configure backend\venv first."
    exit 1
}

# 2. Verify Frontend Dependencies
$nodeModules = Join-Path $root "frontend\node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "[INFO] Installing frontend node_modules..." -ForegroundColor Yellow
    Set-Location (Join-Path $root "frontend")
    npm install
    Set-Location $root
}

# 3. Start Backend
Write-Host "[INFO] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath $pythonPath -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory (Join-Path $root "backend") -PassThru

# 4. Start Frontend
Write-Host "[INFO] Launching Vite Frontend on http://127.0.0.1:5174 ..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev -- --host 127.0.0.1 --port 5174" -WorkingDirectory (Join-Path $root "frontend") -PassThru

Write-Host "=======================================================" -ForegroundColor Green
Write-Host "  Pravah is now active!" -ForegroundColor Green
Write-Host "  Frontend UI: http://127.0.0.1:5174" -ForegroundColor Cyan
Write-Host "  FastAPI Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "  To terminate all services, run: .\stop.ps1" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Green

Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:5174"
