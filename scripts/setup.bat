@echo off
REM  Setup Script for Windows - Production Inventory Management System

echo.
echo ════════════════════════════════════════════════════
echo   Production Inventory Management - Setup
echo ════════════════════════════════════════════════════
echo.

REM Check prerequisites
echo  Checking prerequisites...

java -version >nul 2>&1
if errorlevel 1 (
    echo  Java is not installed. Please install Java 11+
    exit /b 1
)
for /f "tokens=*" %%i in ('java -version 2^>^&1') do set JAVA_VER=%%i
echo ✓ Java found: %JAVA_VER%

node --version >nul 2>&1
if errorlevel 1 (
    echo  Node.js is not installed. Please install Node.js 16+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✓ Node.js found: %NODE_VER%

echo.
echo  Setting up Backend...

cd backend
echo    Building Maven dependencies...
call mvn clean install -q -DskipTests

cd ..

echo.
echo  Setting up Frontend...

cd frontend
echo    Installing Node dependencies...
call npm install --silent

cd ..

echo.
echo ════════════════════════════════════════════════════
echo   ✓ Setup complete!
echo ════════════════════════════════════════════════════
echo.
echo  To start the application:
echo.
echo    Option 1: Individual PowerShell terminals
echo    PS^> cd backend ; mvn quarkus:dev
echo    PS^> cd frontend ; npm start
echo.
echo    Option 2: Docker (requires Docker Desktop)
echo    PS^> docker-compose up -d
echo.
echo  Access the application:
echo    Frontend: http://localhost:3001
echo    Backend:  http://localhost:8082
echo.
