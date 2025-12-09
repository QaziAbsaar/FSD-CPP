# Activate virtual environment and run Vite dev server
$venvPath = ".\venv\Scripts\Activate.ps1"

# Check if venv exists
if (-Not (Test-Path $venvPath)) {
    Write-Host "Virtual environment not found at $venvPath" -ForegroundColor Red
    exit 1
}

# Activate venv
& $venvPath

# Change to frontend directory
Set-Location .\frontend

# Install dependencies if needed and run dev server
npm run dev
