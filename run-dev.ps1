param(
  [Parameter(Mandatory=$true)]
  [string]$GrokKey
)

# Set env vars for this script's processes
$env:GROK_API_KEY = $GrokKey
$env:GROQ_API_KEY = $GrokKey

$python = Join-Path $PSScriptRoot ".venv-1\Scripts\python.exe"
$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

Write-Host "Starting backend (uvicorn) on port 5002..."
Start-Process -FilePath $python -ArgumentList "-m","uvicorn","main:app","--host","0.0.0.0","--port","5002" -WorkingDirectory $backendDir

Start-Sleep -Seconds 1
Write-Host "Starting Flask chatbot (port 5001)..."
Start-Process -FilePath $python -ArgumentList "chat_app.py" -WorkingDirectory $backendDir

Start-Sleep -Seconds 1
Write-Host "Starting frontend dev server (npm run dev)..."
Start-Process -FilePath "npm" -ArgumentList "run","dev" -WorkingDirectory $frontendDir

Write-Host "Started backend, chatbot, and frontend. Use http://localhost:3000 to view the app (or 3001 if 3000 is occupied)."
