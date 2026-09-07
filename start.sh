#!/usr/bin/env bash
# FILE: start.sh
# PURPOSE: POSIX launcher for Pravah platform on Linux / macOS
# PHASE: 8 | DEPENDS ON: Python 3.10+, Node 18+ | LAST TOUCHED: Phase 8

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "======================================================="
echo "  Pravah (प्रवाह) - National Skill Intelligence Platform"
echo "  Starting Backend (FastAPI :8000) & Frontend (Vite :5174)"
echo "======================================================="

# 1. Check Python venv
if [ -f "$DIR/backend/venv/bin/python" ]; then
    PYTHON="$DIR/backend/venv/bin/python"
elif [ -f "$DIR/backend/venv/Scripts/python.exe" ]; then
    PYTHON="$DIR/backend/venv/Scripts/python.exe"
else
    echo "[ERROR] Virtual environment not found in backend/venv."
    exit 1
fi

# 2. Check Node modules
if [ ! -d "$DIR/frontend/node_modules" ]; then
    echo "[INFO] Installing frontend npm packages..."
    cd "$DIR/frontend" && npm install && cd "$DIR"
fi

# 3. Start Backend
echo "[INFO] Starting backend on http://127.0.0.1:8000 ..."
cd "$DIR/backend"
$PYTHON -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
cd "$DIR"

# 4. Start Frontend
echo "[INFO] Starting frontend on http://127.0.0.1:5174 ..."
cd "$DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 5174 &
FRONTEND_PID=$!
cd "$DIR"

echo "$BACKEND_PID $FRONTEND_PID" > "$DIR/.pids"

echo "======================================================="
echo "  Pravah is running!"
echo "  Frontend: http://127.0.0.1:5174"
echo "  API Docs: http://127.0.0.1:8000/docs"
echo "  To stop: ./stop.sh"
echo "======================================================="
