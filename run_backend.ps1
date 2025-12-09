# Activate virtual environment and run Flask backend
$venvPath = ".\venv\Scripts\Activate.ps1"

# Check if venv exists
if (-Not (Test-Path $venvPath)) {
    Write-Host "Virtual environment not found at $venvPath" -ForegroundColor Red
    exit 1
}

# Activate venv
& $venvPath

# Change to backend directory
Set-Location .\backend

# Run Flask app
python app.py
