@REM University Backend Startup Script
@REM This script builds and runs the backend application
@REM Environment variables are automatically loaded from .env file

@echo off
color 0A

echo.
echo ========================================
echo  UniverseApplication Backend Startup
echo ========================================
echo.

@REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo.
    echo Please create a .env file with Stripe credentials:
    echo   STRIPE_API_KEY=sk_test_your_key_here
    echo   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
    echo.
    echo Get credentials from:
    echo   - API Key: https://dashboard.stripe.com/apikeys
    echo   - Webhook Secret: https://dashboard.stripe.com/webhooks
    echo.
    pause
    
    if not exist ".env" (
        echo [ERROR] .env file still not found!
        pause
        exit /b 1
    )
)

echo [OK] .env file found
echo.

echo ========================================
echo  Building and Starting Backend Server...
echo ========================================
echo.

echo Building project...
mvn clean package -DskipTests -q

if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo Starting application...
echo (Environment variables loaded from .env file)
echo.
java -jar target/universe-backend-1.0.0.jar

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend!
    echo Please ensure:
    echo  - Java is installed and in PATH
    echo  - target/universe-backend-1.0.0.jar exists
    echo  - MySQL server is running
    echo  - .env file has correct Stripe credentials
    echo.
    pause
)
