# start_app.ps1
# HealthAI - Robust Multi-Service Startup Script

$ErrorActionPreference = "Continue" # Don't stop on individual cleanup errors

function Liberate-Port($Port) {
    Write-Host "Checking Port $Port..." -NoNewline
    $processId = (Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1)
    if ($processId) {
        Write-Host " Occupied by PID $processId. Killing..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host " Free." -ForegroundColor Green
    }
}

function Wait-ForPort($Port, $TimeoutSeconds = 45) {
    Write-Host "Waiting for service on port $Port..." -NoNewline
    $StartTime = Get-Date
    while ((Get-Date) -lt $StartTime.AddSeconds($TimeoutSeconds)) {
        if (Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet) {
            Write-Host " Ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 2
        Write-Host "." -NoNewline
    }
    Write-Host " Timeout!" -ForegroundColor Red
    return $false
}

Write-Host "`n--- HealthAI System Startup ---" -ForegroundColor Cyan

# 1. Cleanup Stale Processes
Write-Host "`n[1/4] Cleaning up ports..."
Liberate-Port 3000
Liberate-Port 5001
Liberate-Port 5002

# 2. Start FastAPI Backend (Port 5002)
Write-Host "`n[2/4] Launching FastAPI Backend..." -ForegroundColor Green
# Using 'wt' if available, otherwise standard powershell
$command = "cd backend; python main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- FastAPI Backend Log ---' -ForegroundColor Green; $command"
if (!(Wait-ForPort 5002)) {
    Write-Host "`nWarning: FastAPI Backend is taking longer than expected. Check the backend window for errors." -ForegroundColor Yellow
}

# 3. Start Flask Chatbot (Port 5001)
Write-Host "`n[3/4] Launching Flask Chatbot..." -ForegroundColor Green
$commandChat = "cd backend; python chat_app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Flask Chatbot Log ---' -ForegroundColor Green; $commandChat"
if (!(Wait-ForPort 5001)) {
    Write-Host "`nWarning: Flask Chatbot is taking longer than expected. Check the chatbot window for errors." -ForegroundColor Yellow
}

# 4. Start Next.js Frontend (Port 3000)
Write-Host "`n[4/4] Launching Next.js Frontend..." -ForegroundColor Green
$commandFront = "cd frontend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Next.js Frontend Log ---' -ForegroundColor Cyan; $commandFront"
if (!(Wait-ForPort 3000)) {
    Write-Host "`nWarning: Next.js Frontend is taking longer than expected. It might be available at http://localhost:3001 if port 3000 was still busy." -ForegroundColor Yellow
}

Write-Host "`n--- System Active ---" -ForegroundColor Cyan
Write-Host "Primary URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "If port 3000 fails, try http://localhost:3001" -ForegroundColor Gray
Write-Host "Keep the logs windows open to maintain the services." -ForegroundColor Yellow
