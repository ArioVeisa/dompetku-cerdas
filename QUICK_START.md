# Quick Start Guide

## ⚡ Langkah Cepat untuk Menjalankan Aplikasi

### Prerequisites
- ✅ Node.js 18+ terinstall
- ✅ MySQL berjalan
- ✅ Git terinstall

### 1. Clone & Setup (5 menit)

```bash
# Clone repository
git clone <your-repo-url>
cd dompetku-cerdas

# Setup otomatis (install dependencies + database)
npm run setup
```

### 2. Jalankan Aplikasi (2 menit)

**Opsi A: Jalankan Keduanya Sekaligus**
```bash
npm run dev:all
```

**Opsi B: Jalankan Terpisah**
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend  
npm run dev
```

### 3. Akses Aplikasi

- 🌐 **Frontend**: http://localhost:8080
- 🔧 **Backend API**: http://localhost:3000

### 4. Login & Mulai

1. Masukkan nama dan email di halaman login
2. Dashboard akan menampilkan ringkasan keuangan
3. Klik "+" untuk menambah transaksi
4. Gunakan filter untuk melihat data bulan tertentu

## 🚨 Troubleshooting Cepat

### Database Error?
```bash
# Cek MySQL berjalan
mysql -u root -p -e "SELECT 1;"

# Setup ulang database
cd finance-backend
npm run db:setup
```

### Port Terpakai?
```bash
# Cek port yang digunakan
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill proses jika perlu
taskkill /PID <process_id>    # Windows
kill -9 <process_id>          # Mac/Linux
```

### CORS Error?
- Pastikan backend berjalan di port 3000
- Frontend menggunakan proxy, restart kedua server

## 📱 Fitur Utama

- 💰 **Catat Transaksi**: Pemasukan & pengeluaran
- 📊 **Dashboard**: Ringkasan keuangan real-time  
- 🏷️ **Kategori & Tag**: Organisasi transaksi
- 📈 **Grafik Tren**: Visualisasi bulanan
- 📤 **Ekspor CSV**: Download data
- 🌙 **Dark Mode**: Toggle tema

## 🔧 Scripts Penting

```bash
# Development
npm run dev          # Frontend only
npm run backend      # Backend only  
npm run dev:all      # Both

# Database
npm run db:setup     # Setup database lengkap
npm run db:seed      # Seed data sample

# Build
npm run build        # Build frontend
npm run preview      # Preview build
```

## 📞 Butuh Bantuan?

- 📖 Lihat [README.md](README.md) untuk dokumentasi lengkap
- 🚨 Cek [TROUBLESHOOTING.md](TROUBLESHOOTING.md) untuk solusi masalah
- 💬 Buat issue di repository jika masih ada masalah
