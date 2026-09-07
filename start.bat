@echo off
REM FILE: start.bat
REM PURPOSE: One-click launcher for Pravah platform (FastAPI backend + Vite frontend)
REM PHASE: 8 | DEPENDS ON: Python 3.10+, Node 18+ | LAST TOUCHED: Phase 8

echo =======================================================
echo   Pravah (प्रवाह) - National Skill Intelligence Platform
echo   Launching Backend (FastAPI :8000) and Frontend (Vite :5174)
echo =======================================================

cd /d "%~dp0"

REM 1. Check Python virtual environment
if not exist "backend\venv\Scripts\python.exe" (
    echo [ERROR] Virtualenv not found at backend\venv.
    echo Please create the virtualenv: python -m venv backend\venv
    echo And install requirements: .\backend\venv\Scripts\pip install -r backend\requirements.txt
    pause
    exit /b 1
)

REM 2. Check Frontend node modules
if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

REM 3. Start Backend server
echo [INFO] Starting FastAPI backend on http://127.0.0.1:8000 ...
start "Pravah Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM 4. Start Frontend development server
echo [INFO] Starting Vite frontend on http://127.0.0.1:5174 ...
start "Pravah Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5174"

echo =======================================================
echo   Pravah is now running!
echo   Frontend: http://127.0.0.1:5174
echo   API Docs: http://127.0.0.1:8000/docs
echo   To stop all servers, run: stop.bat
echo =======================================================

timeout /t 3 /nobreak >nul
start http://127.0.0.1:5174
