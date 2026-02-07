@echo off
REM Verify Setup Script - Checks that all dependencies are installed and configured
REM Run this after setup.bat to verify everything is working correctly

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo 🔍 Verifying Quest Hands Installation...
echo ============================================================
echo.

REM Check Java
echo Checking Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%A in ('java -version 2^>^&1') do (
        echo ✓ Java found: %%A
        goto :java_found
    )
)
echo ✗ Java not found
exit /b 1

:java_found

REM Check Maven
echo Checking Maven...
mvn -v >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Maven found
) else (
    echo ✗ Maven not found
    exit /b 1
)

REM Check Node
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%A in ('node --version') do (
        echo ✓ Node found: %%A
    )
) else (
    echo ✗ Node.js not found
    exit /b 1
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%A in ('npm --version') do (
        echo ✓ npm found: %%A
    )
) else (
    echo ✗ npm not found
    exit /b 1
)

REM Check PostgreSQL
echo Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ PostgreSQL found
) else (
    echo ⚠ PostgreSQL not found (OK if using Docker^)
)

REM Check Docker
echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Docker found
) else (
    echo ⚠ Docker not found (optional^)
)

REM Check backend build
echo.
echo Checking backend build...
if exist "backend\target\quarkus-app\quarkus-run.jar" (
    echo ✓ Backend JAR exists
) else (
    echo ⚠ Backend not built yet
)

REM Check frontend dependencies
echo Checking frontend dependencies...
if exist "frontend\node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo ⚠ Frontend dependencies not installed
)

REM Check .env files
echo.
echo Checking environment files...
if exist "frontend\.env" (
    echo ✓ frontend\.env
) else (
    echo ✗ frontend\.env (create from .env.example^)
)

if exist "backend\.env" (
    echo ✓ backend\.env
) else (
    echo ✗ backend\.env (create from .env.example^)
)

REM Summary
echo.
echo ============================================================
echo ✅ Verification complete!
echo ============================================================
echo.
echo Next steps:
echo 1. Start PostgreSQL (if not in Docker^): createdb estoque
echo 2. Run backend: cd backend ^&^& mvn quarkus:dev
echo 3. Run frontend: cd frontend ^&^& npm start
echo 4. Or use Docker: docker-compose up -d
echo.
echo Access the app at: http://localhost:3001
echo.

endlocal
