# diagnose.ps1
# Script to run services manually and log output to find errors

Write-Host "Running Backend Diagnostics..." -ForegroundColor Cyan

function Test-Service($Name, $Command, $WorkDir, $LogFile) {
    Write-Host "Testing $Name..." -NoNewline
    $process = Start-Process powershell -ArgumentList "-Command", "cd $WorkDir; $Command > $LogFile 2>&1" -PassThru
    Start-Sleep -Seconds 5
    if ($process.HasExited) {
        Write-Host " FAILED" -ForegroundColor Red
        Get-Content $LogFile | Select-Object -Last 10
    } else {
        Write-Host " RUNNING" -ForegroundColor Green
        Stop-Process $process -Force
    }
}

Test-Service "FastAPI" "python main.py" "backend" "backend_log.txt"
Test-Service "Flask" "python chat_app.py" "backend" "chatbot_log.txt"
Test-Service "Next.js" "npm run dev" "frontend" "frontend_log.txt"

Write-Host "Diagnostics complete. Check *_log.txt files for details."
