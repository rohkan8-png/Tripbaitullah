# 🚀 Panduan Migrasi Database ke Neon.tech

## ✅ Yang Sudah Dilakukan

### 1. Password Hashing dengan bcryptjs
- ✅ Install `bcryptjs` dan `@types/bcryptjs`
- ✅ Update `/api/auth/register` - Password di-hash sebelum disimpan
- ✅ Update `/api/auth/login` - Verifikasi password dengan bcrypt.compare()
- ✅ Update `/api/auth/change-password` - Hash password baru
- ✅ Validasi password minimal 6 karakter

### 2. Migrasi Database SQLite → PostgreSQL (Neon.tech)
- ✅ Update `prisma/schema.prisma` dari SQLite ke PostgreSQL
- ✅ Update `.env` dengan connection string Neon.tech
- ✅ Generate Prisma Client untuk PostgreSQL
- ✅ Jalankan migration ke Neon.tech
- ✅ Database schema sudah sync dengan Neon.tech

## 📋 Cara Migrate Data Lama (Opsional)

Jika Anda ingin memindahkan data dari SQLite lama ke PostgreSQL baru:

```bash
# Pastikan file SQLite lama masih ada di: prisma/db/custom.db
npx tsx scripts/migrate-data.ts
```

Script ini akan memindahkan semua data:
- Users (dengan password lama - perlu di-hash ulang!)
- Travels
- Packages
- Articles
- Bookings
- Favorites
- Videos
- Settings
- Sliders

## ⚠️ PENTING: Hash Password Lama

Jika Anda migrate data users dari SQLite lama, password mereka masih dalam plain text!

**Solusi:**
1. **Opsi 1 (Recommended)**: Minta semua user reset password
2. **Opsi 2**: Jalankan script untuk hash semua password lama

### Script Hash Password Lama:

```bash
npx tsx scripts/hash-old-passwords.ts
```

## 🔐 Environment Variables

File `.env` sekarang berisi:

```env
# Database - Neon.tech PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_xFAMC2in0rYN@ep-autumn-sea-a1ljzug9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Untuk Production (Vercel):**
- Generate NEXTAUTH_SECRET baru: `openssl rand -base64 32`
- Update NEXTAUTH_URL dengan domain production Anda

## 🧪 Testing

1. **Test Registrasi:**
   - Buka http://localhost:3000/register
   - Daftar user baru
   - Password akan otomatis di-hash

2. **Test Login:**
   - Login dengan user yang baru didaftarkan
   - Verifikasi bcrypt.compare() bekerja

3. **Test Database:**
   - Cek Neon.tech dashboard
   - Data harus tersimpan di PostgreSQL

## 📊 Monitoring Database

Dashboard Neon.tech: https://console.neon.tech
- Lihat tables
- Monitor queries
- Check storage usage

## 🚀 Next Steps

1. ✅ Password Hashing - **SELESAI**
2. ✅ Database Migration - **SELESAI**
3. ⏳ File Upload ke Cloud Storage (Cloudinary/Vercel Blob)
4. ⏳ Environment Variables lengkap
5. ⏳ Authentication Middleware
6. ⏳ Cleanup console.logs
7. ⏳ Fix build errors

## 🆘 Troubleshooting

### Error: Connection timeout
- Cek internet connection
- Verifikasi connection string benar
- Cek Neon.tech dashboard (database aktif?)

### Error: Migration failed
- Hapus folder `prisma/migrations`
- Jalankan ulang: `npx prisma migrate dev --name init`

### Error: Prisma Client not generated
- Jalankan: `npx prisma generate`
- Restart dev server

## 📝 Notes

- SQLite file lama masih ada di `prisma/db/custom.db` (backup)
- Bisa dihapus setelah yakin migrasi berhasil
- Jangan commit file `.env` ke git!
