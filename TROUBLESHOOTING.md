# Troubleshooting Guide

## 🚨 Masalah Umum dan Solusinya

### 1. CORS Error
**Gejala**: Error di browser console tentang CORS policy
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solusi**:
- Pastikan backend berjalan di port 3000: `cd finance-backend && npm run dev`
- Frontend menggunakan proxy Vite, jadi tidak perlu khawatir CORS di development
- Jika masih error, restart kedua server

### 2. Database Connection Error
**Gejala**: Error saat menjalankan `npm run db:setup`
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solusi**:
- Pastikan MySQL berjalan
- Cek konfigurasi di `finance-backend/.env`:
  ```env
  DATABASE_URL="mysql://root:@localhost:3306/dompetku_cerdas"
  ```
- Jika menggunakan password, tambahkan: `mysql://root:password@localhost:3306/dompetku_cerdas`
- Buat database jika belum ada: `CREATE DATABASE dompetku_cerdas;`

### 3. Port Already in Use
**Gejala**: Error saat menjalankan server
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi**:
- Cek proses yang menggunakan port: `netstat -ano | findstr :3000` (Windows) atau `lsof -i :3000` (Mac/Linux)
- Kill proses tersebut atau gunakan port lain
- Untuk backend, edit `finance-backend/package.json` script dev: `"dev": "next dev -p 3001"`

### 4. Module Not Found
**Gejala**: Error saat import module
```
Module not found: Can't resolve '@/components/ui/button'
```

**Solusi**:
- Pastikan semua dependencies terinstall: `npm install`
- Cek path alias di `tsconfig.json` dan `vite.config.ts`
- Restart development server

### 5. Prisma Client Not Generated
**Gejala**: Error saat menjalankan aplikasi
```
PrismaClient is not generated
```

**Solusi**:
- Generate Prisma client: `cd finance-backend && npm run db:generate`
- Atau jalankan setup lengkap: `npm run db:setup`

### 6. API Endpoint Not Found
**Gejala**: 404 error saat mengakses API
```
GET http://localhost:3000/api/transactions 404 (Not Found)
```

**Solusi**:
- Pastikan backend berjalan
- Cek struktur folder API di `finance-backend/src/app/api/`
- Pastikan file route.ts ada di folder yang benar

### 7. React Query Error
**Gejala**: Error di console tentang React Query
```
QueryClient not found
```

**Solusi**:
- Pastikan QueryClientProvider membungkus aplikasi di `App.tsx`
- Cek import dan setup React Query

### 8. Tailwind CSS Not Working
**Gejala**: Styling tidak muncul atau error
```
Tailwind CSS classes not applied
```

**Solusi**:
- Pastikan Tailwind CSS terinstall: `npm install -D tailwindcss`
- Cek konfigurasi di `tailwind.config.ts`
- Pastikan CSS diimport di `src/index.css`

### 9. TypeScript Errors
**Gejala**: Error TypeScript di editor atau build
```
Type 'X' is not assignable to type 'Y'
```

**Solusi**:
- Cek tipe data di `src/types/finance.ts`
- Pastikan interface sesuai dengan API response
- Jalankan `npm run lint` untuk cek error

### 10. Build Error
**Gejala**: Error saat build production
```
Build failed with errors
```

**Solusi**:
- Cek error di console
- Pastikan semua dependencies terinstall
- Cek TypeScript errors
- Coba build development dulu: `npm run build:dev`

## 🔧 Debug Mode

### Enable Debug Logging
Tambahkan di `finance-backend/.env`:
```env
DEBUG=prisma:*
```

### Check API Response
Buka browser developer tools -> Network tab untuk melihat request/response API.

### Database Inspection
```bash
# Masuk ke MySQL
mysql -u root -p

# Pilih database
USE dompetku_cerdas;

# Cek tabel
SHOW TABLES;

# Cek data
SELECT * FROM Transaction LIMIT 10;
```

## 📞 Getting Help

Jika masalah masih berlanjut:

1. Cek error message dengan teliti
2. Pastikan semua langkah setup sudah benar
3. Coba restart semua service
4. Cek versi Node.js dan dependencies
5. Buat issue di repository dengan detail error

## 🔄 Reset Everything

Jika ingin reset semuanya:

```bash
# Hapus node_modules
rm -rf node_modules
rm -rf finance-backend/node_modules

# Hapus database
mysql -u root -p -e "DROP DATABASE IF EXISTS dompetku_cerdas; CREATE DATABASE dompetku_cerdas;"

# Reinstall dan setup ulang
npm run setup
```
