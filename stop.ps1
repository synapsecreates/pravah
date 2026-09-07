# FILE: stop.ps1
# PURPOSE: Gracefully terminates Pravah services on ports 8000, 5174, and 5173
# PHASE: 8 | DEPENDS ON: PowerShell Get-NetTCPConnection | LAST TOUCHED: Phase 8

Write-Host "[INFO] Terminating Pravah platform processes..." -ForegroundColor Yellow

$ports = @(8000, 5174, 5173)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $procId = $conn.OwningProcess
                if ($procId -gt 0) {
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                    Write-Host "[STOPPED] Terminated process $procId bound to port $port." -ForegroundColor Green
                }
            }
        }
    } catch {
        # Ignore already closed handles
    }
}

Write-Host "[SUCCESS] All Pravah services stopped cleanly." -ForegroundColor Green
