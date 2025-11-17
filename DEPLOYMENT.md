# 🚀 Panduan Deploy ke Vercel

## 📋 Checklist Sebelum Deploy

### ✅ Yang Sudah Siap
- ✅ Password hashing dengan bcryptjs
- ✅ Database PostgreSQL (Neon.tech)
- ✅ Environment variables configured
- ✅ .gitignore configured
- ✅ Next.js config optimized

### ⚠️ Yang Perlu Diperhatikan
- ⚠️ File upload masih menggunakan filesystem (tidak akan jalan di Vercel)
- ⚠️ Perlu setup cloud storage (Cloudinary/Vercel Blob)
- ⚠️ Generate NEXTAUTH_SECRET baru untuk production

---

## 🔧 Setup GitHub

### 1. Initialize Git (jika belum)
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

### 2. Create GitHub Repository
1. Buka https://github.com/new
2. Buat repository baru (misal: `tripbaitullah-mobile`)
3. **JANGAN** centang "Initialize with README" (sudah ada)

### 3. Push ke GitHub
```bash
git remote add origin https://github.com/USERNAME/tripbaitullah-mobile.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deploy ke Vercel

### Cara 1: Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Login dengan GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import repository GitHub Anda
   - Vercel akan auto-detect Next.js

3. **Configure Environment Variables**
   
   Tambahkan di Vercel Dashboard → Settings → Environment Variables:
   
   ```env
   DATABASE_URL=postgresql://neondb_owner:npg_xFAMC2in0rYN@ep-autumn-sea-a1ljzug9-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   
   NEXTAUTH_SECRET=<generate-baru-dengan-command-dibawah>
   
   NEXTAUTH_URL=https://your-project.vercel.app
   ```

4. **Generate NEXTAUTH_SECRET**
   
   Di terminal lokal, jalankan:
   ```bash
   openssl rand -base64 32
   ```
   
   Copy hasilnya dan paste ke Vercel environment variable.

5. **Deploy**
   - Click "Deploy"
   - Tunggu build selesai (2-3 menit)
   - Vercel akan berikan URL production

### Cara 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy to production
vercel --prod
```

---

## 🔐 Environment Variables untuk Vercel

### Required Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | Connection string dari Neon.tech |
| `NEXTAUTH_SECRET` | `<random-string>` | Generate dengan `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | URL production Anda |

### Optional (untuk cloud storage nanti):

| Variable | Value | Notes |
|----------|-------|-------|
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Jika pakai Cloudinary |
| `CLOUDINARY_API_KEY` | `your-api-key` | Jika pakai Cloudinary |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Jika pakai Cloudinary |

---

## ⚠️ MASALAH YANG HARUS DIPERBAIKI SETELAH DEPLOY

### 1. File Upload Tidak Akan Jalan

**Masalah:**
- Upload file menggunakan `fs/promises` (filesystem)
- Vercel serverless tidak punya persistent filesystem
- File yang diupload akan hilang setelah function selesai

**Solusi:**
Pilih salah satu:

#### A. Cloudinary (Recommended - Free tier bagus)
```bash
npm install cloudinary
```

#### B. Vercel Blob Storage
```bash
npm install @vercel/blob
```

#### C. AWS S3
```bash
npm install @aws-sdk/client-s3
```

### 2. Console.log Berlebihan

**Masalah:**
- 50+ console.log di production
- Bisa expose data sensitif di logs

**Solusi:**
- Hapus atau ganti dengan proper logging
- Atau gunakan conditional logging:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}
```

---

## 🧪 Testing Setelah Deploy

### 1. Test Basic Functionality
- [ ] Homepage load
- [ ] API routes working
- [ ] Database connection OK

### 2. Test Authentication
- [ ] Register user baru
- [ ] Login dengan user tersebut
- [ ] Change password

### 3. Test Database
- [ ] Data tersimpan di Neon.tech
- [ ] Query performance OK
- [ ] No connection errors

### 4. Test yang AKAN GAGAL (perlu diperbaiki)
- [ ] ❌ Upload avatar
- [ ] ❌ Upload package image
- [ ] ❌ Upload travel logo
- [ ] ❌ Upload slider image

---

## 📊 Monitoring

### Vercel Dashboard
- Build logs
- Function logs
- Analytics
- Performance metrics

### Neon.tech Dashboard
- Database queries
- Connection pooling
- Storage usage
- Query performance

---

## 🔄 Update Deployment

Setiap kali push ke GitHub main branch:
```bash
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel akan otomatis:
1. Detect push baru
2. Build project
3. Deploy ke production
4. Update URL

---

## 🆘 Troubleshooting

### Build Failed
- Cek Vercel build logs
- Pastikan tidak ada TypeScript errors
- Cek environment variables sudah diset

### Database Connection Error
- Verifikasi DATABASE_URL benar
- Cek Neon.tech database aktif
- Pastikan connection string pakai pooled connection

### 500 Internal Server Error
- Cek Vercel function logs
- Lihat error message
- Debug di local dulu

### File Upload Error
- Normal! Perlu implement cloud storage
- Lihat section "File Upload" di atas

---

## 📝 Next Steps Setelah Deploy

1. ✅ Deploy ke Vercel
2. ⏳ Setup Cloudinary untuk file upload
3. ⏳ Update upload API routes
4. ⏳ Test semua fitur
5. ⏳ Setup custom domain (optional)
6. ⏳ Enable analytics
7. ⏳ Setup monitoring

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET generated (baru, bukan yang di .env local)
- [ ] NEXTAUTH_URL updated ke production URL
- [ ] Database connection tested
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Authentication working
- [ ] API routes working
- [ ] Images loading
- [ ] Mobile responsive
- [ ] Performance OK (Lighthouse score)

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Neon.tech Dashboard: https://console.neon.tech
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- Vercel Environment Variables: https://vercel.com/docs/environment-variables
