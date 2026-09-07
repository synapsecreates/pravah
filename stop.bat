@echo off
REM FILE: stop.bat
REM PURPOSE: One-click graceful teardown for Pravah processes on ports 8000 and 5174
REM PHASE: 8 | DEPENDS ON: Windows PowerShell / netstat / taskkill | LAST TOUCHED: Phase 8

echo =======================================================
echo   Stopping Pravah Platform Servers...
echo =======================================================

cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 8000, 5174, 5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Write-Host '[SUCCESS] All Pravah backend and frontend processes stopped successfully.'"

echo Pravah shutdown complete.
