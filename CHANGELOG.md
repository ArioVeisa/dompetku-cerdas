# Changelog

## [1.1.0] - 2025-01-11

### 🎉 Fitur Baru
- **Sistem Autentikasi Multi-User**: Sekarang aplikasi mendukung login/logout dengan user yang berbeda
- **Data User-Specific**: Setiap user memiliki data transaksi, kategori, dan tag yang terpisah
- **Session Management**: Implementasi session token untuk keamanan
- **Grafik Tren Multi-Bulan**: Grafik tren sekarang menampilkan data untuk beberapa bulan

### 🔧 Perbaikan
- **API Endpoints**: Semua endpoint API sekarang menggunakan user ID yang proper
- **Database Schema**: Data seed yang lebih lengkap dengan transaksi multi-bulan
- **UI/UX**: 
  - Tombol logout di header
  - Informasi user yang sedang login
  - Grafik tren yang lebih informatif dengan dots dan tooltip yang lebih baik
  - Format bulan yang lebih user-friendly (Jun '25, Jul '25, dst)

### 🐛 Bug Fixes
- **CORS Issues**: Konfigurasi CORS yang proper di backend
- **User Data Isolation**: Data transaksi sekarang terisolasi per user
- **Chart Rendering**: Grafik tren sekarang menampilkan pergerakan data dengan benar

### 📊 Data Demo
- **3 User Demo**: demo@example.com, john@example.com, jane@example.com
- **Data Multi-Bulan**: Transaksi untuk Juni, Juli, dan Agustus 2025
- **Kategori & Tag**: Setiap user memiliki kategori dan tag yang lengkap

### 🔐 Keamanan
- **Authorization Headers**: API calls menggunakan Bearer token
- **Session Validation**: Validasi session token di frontend
- **User Isolation**: Data terisolasi berdasarkan user ID

## [1.0.0] - 2025-01-10

### 🎉 Release Pertama
- Dashboard keuangan pribadi dengan fitur dasar
- CRUD transaksi (Create, Read, Update, Delete)
- Kategori dan tag untuk organisasi transaksi
- Grafik tren dan breakdown kategori
- Export CSV
- Dark/Light mode
- Responsive design

### 🛠️ Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Next.js 15 + TypeScript + Prisma + MySQL
- **Charts**: Recharts
- **State Management**: React Query
- **Routing**: React Router DOM
