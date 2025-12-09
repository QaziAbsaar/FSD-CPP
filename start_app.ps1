# Start both backend and frontend servers
$venvPath = ".\venv\Scripts\Activate.ps1"

# Check if venv exists
if (-Not (Test-Path $venvPath)) {
    Write-Host "Virtual environment not found at $venvPath" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Campus Hub Application..." -ForegroundColor Green
Write-Host "`nStarting Backend (Flask) on port 5000..." -ForegroundColor Cyan

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\'; & '$venvPath'; cd backend; python app.py"

Write-Host "Backend started. Waiting 3 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "`nStarting Frontend (Vite) on port 3000..." -ForegroundColor Cyan

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\'; & '$venvPath'; cd frontend; npm run dev"

Write-Host "`n✓ Campus Hub is starting!" -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nClose this window when done." -ForegroundColor Yellow
