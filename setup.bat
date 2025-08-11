@echo off
echo 🚀 Setup DompetKu Cerdas
echo ========================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)

echo ✅ Node.js ditemukan

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd finance-backend
call npm install

REM Setup database
echo 🗄️  Setting up database...
call npm run db:setup

REM Back to root
cd ..

echo.
echo ✅ Setup selesai!
echo.
echo 🚀 Untuk menjalankan aplikasi:
echo    1. Terminal 1: cd finance-backend ^&^& npm run dev
echo    2. Terminal 2: npm run dev
echo.
echo 📱 Frontend: http://localhost:8080
echo 🔧 Backend:  http://localhost:3000
echo.
echo 📖 Lihat README.md untuk informasi lebih lanjut
pause
