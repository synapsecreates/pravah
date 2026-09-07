#!/usr/bin/env bash
# FILE: stop.sh
# PURPOSE: POSIX shutdown script for Pravah platform
# PHASE: 8 | DEPENDS ON: kill, lsof / fuser | LAST TOUCHED: Phase 8

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "[INFO] Stopping Pravah processes..."

if [ -f "$DIR/.pids" ]; then
    for pid in $(cat "$DIR/.pids"); do
        kill -9 $pid 2>/dev/null || true
    done
    rm -f "$DIR/.pids"
fi

# Also kill any remaining processes on ports 8000 and 5174
for port in 8000 5174 5173; do
    lsof -ti :$port | xargs kill -9 2>/dev/null || true
done

echo "[SUCCESS] Pravah platform stopped cleanly."
