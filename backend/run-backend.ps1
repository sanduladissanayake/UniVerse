# University Backend Startup Script (PowerShell)
# This script builds and runs the backend application
# Environment variables are automatically loaded from .env file

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  UniverseApplication Backend Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if .env file exists
$envFilePath = Join-Path $scriptPath ".env"
if (-Not (Test-Path $envFilePath)) {
    Write-Host "[WARNING] .env file not found at: $envFilePath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create a .env file with Stripe credentials:" -ForegroundColor Yellow
    Write-Host '  STRIPE_API_KEY=sk_test_your_key_here' -ForegroundColor Cyan
    Write-Host '  STRIPE_WEBHOOK_SECRET=whsec_your_secret_here' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Get credentials from:" -ForegroundColor Cyan
    Write-Host "  - API Key: https://dashboard.stripe.com/apikeys" -ForegroundColor Cyan
    Write-Host "  - Webhook Secret: https://dashboard.stripe.com/webhooks" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter after creating .env file"
    
    if (-Not (Test-Path $envFilePath)) {
        Write-Host "[ERROR] .env file still not found!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[OK] .env file found" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Building and Starting Backend Server..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location $scriptPath

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
mvn clean package -DskipTests -q

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Run the application
Write-Host "Starting application..." -ForegroundColor Yellow
Write-Host "(Environment variables loaded from .env file)" -ForegroundColor Cyan
Write-Host ""
java -jar target/universe-backend-1.0.0.jar

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to start backend!" -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  - Java is installed and in PATH" -ForegroundColor Cyan
    Write-Host "  - target/universe-backend-1.0.0.jar exists" -ForegroundColor Cyan
    Write-Host "  - MySQL server is running" -ForegroundColor Cyan
    Write-Host "  - .env file has correct Stripe credentials" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
}
