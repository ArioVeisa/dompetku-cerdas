#!/bin/bash

echo "🚀 Setup DompetKu Cerdas"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
    exit 1
fi

echo "✅ Node.js ditemukan: $(node --version)"

# Check if MySQL is running (basic check)
echo "🔍 Memeriksa koneksi MySQL..."
if ! mysql -u root -e "SELECT 1;" &> /dev/null; then
    echo "⚠️  Warning: MySQL tidak dapat diakses. Pastikan MySQL berjalan."
    echo "   Jika menggunakan password, edit finance-backend/.env"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd finance-backend
npm install

# Setup database
echo "🗄️  Setting up database..."
npm run db:setup

# Back to root
cd ..

echo ""
echo "✅ Setup selesai!"
echo ""
echo "🚀 Untuk menjalankan aplikasi:"
echo "   1. Terminal 1: cd finance-backend && npm run dev"
echo "   2. Terminal 2: npm run dev"
echo ""
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend:  http://localhost:3000"
echo ""
echo "📖 Lihat README.md untuk informasi lebih lanjut"
