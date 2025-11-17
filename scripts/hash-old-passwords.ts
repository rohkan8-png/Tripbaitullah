/**
 * Script untuk hash password lama yang masih plain text
 * 
 * GUNAKAN INI jika Anda migrate data dari SQLite lama
 * dan password users masih dalam plain text
 * 
 * CARA PAKAI:
 * npx tsx scripts/hash-old-passwords.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function hashOldPasswords() {
  console.log('🔐 Memulai proses hash password lama...\n')

  try {
    // Ambil semua users
    const users = await db.user.findMany()

    if (users.length === 0) {
      console.log('⚠️  Tidak ada users di database')
      return
    }

    console.log(`📦 Ditemukan ${users.length} users`)

    let hashedCount = 0
    let skippedCount = 0

    for (const user of users) {
      // Cek apakah password sudah di-hash (bcrypt hash selalu dimulai dengan $2a$ atau $2b$)
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        console.log(`⏭️  Skip ${user.email} - password sudah di-hash`)
        skippedCount++
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10)

      // Update di database
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })

      console.log(`✅ Hash password untuk: ${user.email}`)
      hashedCount++
    }

    console.log('\n📊 SUMMARY:')
    console.log(`   ✅ ${hashedCount} password berhasil di-hash`)
    console.log(`   ⏭️  ${skippedCount} password sudah di-hash sebelumnya`)
    console.log('\n🎉 SELESAI! Semua password sudah aman.')

  } catch (error) {
    console.error('\n❌ Error:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Jalankan script
hashOldPasswords()
  .then(() => {
    console.log('\n✅ Script selesai')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script gagal:', error)
    process.exit(1)
  })
