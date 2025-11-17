/**
 * Script untuk migrate data dari SQLite ke PostgreSQL (Neon.tech)
 * 
 * CARA PAKAI:
 * 1. Pastikan file SQLite lama masih ada di: prisma/db/custom.db
 * 2. Jalankan: npx tsx scripts/migrate-data.ts
 */

import { PrismaClient as SQLiteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'

async function migrateData() {
  console.log('🚀 Memulai migrasi data dari SQLite ke PostgreSQL...\n')

  // Client untuk SQLite (database lama)
  const oldDb = new SQLiteClient({
    datasources: {
      db: {
        url: 'file:./prisma/db/custom.db'
      }
    }
  })

  // Client untuk PostgreSQL (Neon.tech)
  const newDb = new PostgresClient()

  try {
    // 1. Migrate Users
    console.log('📦 Migrasi Users...')
    const users = await oldDb.user.findMany()
    if (users.length > 0) {
      for (const user of users) {
        await newDb.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        })
      }
      console.log(`✅ ${users.length} users berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada users untuk dimigrate')
    }

    // 2. Migrate Travels
    console.log('\n📦 Migrasi Travels...')
    const travels = await oldDb.travel.findMany()
    if (travels.length > 0) {
      for (const travel of travels) {
        await newDb.travel.upsert({
          where: { id: travel.id },
          update: travel,
          create: travel
        })
      }
      console.log(`✅ ${travels.length} travels berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada travels untuk dimigrate')
    }

    // 3. Migrate Packages
    console.log('\n📦 Migrasi Packages...')
    const packages = await oldDb.package.findMany()
    if (packages.length > 0) {
      for (const pkg of packages) {
        await newDb.package.upsert({
          where: { id: pkg.id },
          update: pkg,
          create: pkg
        })
      }
      console.log(`✅ ${packages.length} packages berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada packages untuk dimigrate')
    }

    // 4. Migrate Articles
    console.log('\n📦 Migrasi Articles...')
    const articles = await oldDb.article.findMany()
    if (articles.length > 0) {
      for (const article of articles) {
        await newDb.article.upsert({
          where: { id: article.id },
          update: article,
          create: article
        })
      }
      console.log(`✅ ${articles.length} articles berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada articles untuk dimigrate')
    }

    // 5. Migrate Bookings
    console.log('\n📦 Migrasi Bookings...')
    const bookings = await oldDb.booking.findMany()
    if (bookings.length > 0) {
      for (const booking of bookings) {
        await newDb.booking.upsert({
          where: { id: booking.id },
          update: booking,
          create: booking
        })
      }
      console.log(`✅ ${bookings.length} bookings berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada bookings untuk dimigrate')
    }

    // 6. Migrate Favorites
    console.log('\n📦 Migrasi Favorites...')
    const favorites = await oldDb.favorite.findMany()
    if (favorites.length > 0) {
      for (const favorite of favorites) {
        await newDb.favorite.upsert({
          where: { id: favorite.id },
          update: favorite,
          create: favorite
        })
      }
      console.log(`✅ ${favorites.length} favorites berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada favorites untuk dimigrate')
    }

    // 7. Migrate Videos
    console.log('\n📦 Migrasi Videos...')
    const videos = await oldDb.video.findMany()
    if (videos.length > 0) {
      for (const video of videos) {
        await newDb.video.upsert({
          where: { id: video.id },
          update: video,
          create: video
        })
      }
      console.log(`✅ ${videos.length} videos berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada videos untuk dimigrate')
    }

    // 8. Migrate Settings
    console.log('\n📦 Migrasi Settings...')
    const settings = await oldDb.settings.findMany()
    if (settings.length > 0) {
      for (const setting of settings) {
        await newDb.settings.upsert({
          where: { id: setting.id },
          update: setting,
          create: setting
        })
      }
      console.log(`✅ ${settings.length} settings berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada settings untuk dimigrate')
    }

    // 9. Migrate Sliders
    console.log('\n📦 Migrasi Sliders...')
    const sliders = await oldDb.slider.findMany()
    if (sliders.length > 0) {
      for (const slider of sliders) {
        await newDb.slider.upsert({
          where: { id: slider.id },
          update: slider,
          create: slider
        })
      }
      console.log(`✅ ${sliders.length} sliders berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada sliders untuk dimigrate')
    }

    console.log('\n🎉 MIGRASI SELESAI! Semua data berhasil dipindahkan ke Neon.tech PostgreSQL')

  } catch (error) {
    console.error('\n❌ Error saat migrasi:', error)
    throw error
  } finally {
    await oldDb.$disconnect()
    await newDb.$disconnect()
  }
}

// Jalankan migrasi
migrateData()
  .then(() => {
    console.log('\n✅ Script selesai')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script gagal:', error)
    process.exit(1)
  })
