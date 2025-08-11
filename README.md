# DompetKu Cerdas - Personal Finance Dashboard

Aplikasi dashboard keuangan pribadi untuk mencatat pemasukan dan pengeluaran dengan fitur kategori, tag, grafik tren, dan ekspor CSV.
<img width="1458" height="838" alt="image" src="https://github.com/user-attachments/assets/1ad7ce40-5bf8-4386-b33d-d5b79e697993" />

## 🚀 Fitur

- 📊 Dashboard dengan ringkasan keuangan
- 💰 Catat pemasukan dan pengeluaran
- 🏷️ Kategori dan tag untuk organisasi
- 📈 Grafik tren bulanan
- 📋 Tabel transaksi dengan filter
- 📤 Ekspor data ke CSV
- 🌙 Mode gelap/terang
- 📱 Responsive design

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite untuk build tool
- Tailwind CSS + shadcn/ui
- React Router untuk routing
- React Query untuk state management
- Recharts untuk grafik

### Backend
- Next.js 15 + TypeScript
- Prisma ORM
- MySQL database
- REST API

## 📦 Instalasi

### Prerequisites
- Node.js 18+
- MySQL database
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd dompetku-cerdas
```

### 2. Setup Database
```bash
# Masuk ke direktori backend
cd finance-backend

# Install dependencies
npm install

# Setup database (generate client, push schema, seed data)
npm run db:setup
```

### 3. Setup Frontend
```bash
# Kembali ke root directory
cd ..

# Install dependencies
npm install
```

## 🚀 Menjalankan Aplikasi

### Development Mode

1. **Jalankan Backend** (Terminal 1):
```bash
cd finance-backend
npm run dev
```
Backend akan berjalan di `http://localhost:3000`

2. **Jalankan Frontend** (Terminal 2):
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:8080`

### Production Build

1. **Build Backend**:
```bash
cd finance-backend
npm run build
npm start
```

2. **Build Frontend**:
```bash
npm run build
npm run preview
```

## 🔧 Konfigurasi

### Environment Variables

**Backend** (`finance-backend/.env`):
```env
DATABASE_URL="mysql://username:password@localhost:3306/dompetku_cerdas"
```

**Frontend** (`.env`):
```env
VITE_API_BASE="http://localhost:3000"
```

## 📊 Database Schema

Aplikasi menggunakan MySQL dengan schema berikut:
- `User` - Data pengguna
- `Category` - Kategori transaksi (Pemasukan/Pengeluaran)
- `Tag` - Tag untuk organisasi transaksi
- `Transaction` - Data transaksi
- `TransactionTag` - Relasi many-to-many transaksi dan tag

## 🎯 Penggunaan

1. **Login**: Masukkan nama dan email untuk masuk
2. **Dashboard**: Lihat ringkasan keuangan bulanan
3. **Tambah Transaksi**: Klik tombol "+" untuk mencatat transaksi baru
4. **Filter**: Gunakan dropdown untuk filter berdasarkan bulan dan jenis
5. **Ekspor**: Klik tombol "Ekspor CSV" untuk download data

## 🐛 Troubleshooting

### Masalah CORS
- Pastikan backend berjalan di port 3000
- Frontend menggunakan proxy Vite untuk development
- Cek konfigurasi CORS di `finance-backend/next.config.ts`

### Database Connection
- Pastikan MySQL berjalan
- Cek `DATABASE_URL` di `.env` backend
- Jalankan `npm run db:setup` untuk setup database

### Port Conflicts
- Backend: 3000
- Frontend: 8080
- Pastikan port tidak digunakan aplikasi lain

## 📝 Scripts

### Backend Scripts
- `npm run dev` - Development server
- `npm run build` - Build production
- `npm run db:setup` - Setup database lengkap
- `npm run db:seed` - Seed data sample

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Build production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License
