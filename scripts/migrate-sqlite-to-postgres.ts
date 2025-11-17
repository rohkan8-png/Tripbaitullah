/**
 * Script untuk migrate data dari SQLite ke PostgreSQL (Neon.tech)
 * 
 * CARA PAKAI:
 * 1. Pastikan file SQLite lama masih ada di: prisma/db/custom.db
 * 2. Jalankan: npx tsx scripts/migrate-sqlite-to-postgres.ts
 */

import Database from 'better-sqlite3'
import { PrismaClient } from '@prisma/client'

const newDb = new PrismaClient()

async function migrateData() {
  console.log('🚀 Memulai migrasi data dari SQLite ke PostgreSQL...\n')

  // Connect to SQLite
  const sqliteDb = new Database('./prisma/db/custom.db', { readonly: true })

  try {
    // 1. Migrate Users
    console.log('📦 Migrasi Users...')
    const users = sqliteDb.prepare('SELECT * FROM User').all()
    if (users.length > 0) {
      for (const user of users as any[]) {
        await newDb.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            preferredLocation: user.preferredLocation,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          },
          create: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            preferredLocation: user.preferredLocation,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        })
      }
      console.log(`✅ ${users.length} users berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada users untuk dimigrate')
    }

    // 2. Migrate Travels
    console.log('\n📦 Migrasi Travels...')
    const travels = sqliteDb.prepare('SELECT * FROM Travel').all()
    if (travels.length > 0) {
      for (const travel of travels as any[]) {
        await newDb.travel.upsert({
          where: { id: travel.id },
          update: {
            username: travel.username,
            name: travel.name,
            description: travel.description,
            logo: travel.logo,
            coverImage: travel.coverImage,
            address: travel.address,
            city: travel.city,
            phone: travel.phone,
            email: travel.email,
            website: travel.website,
            rating: travel.rating,
            totalReviews: travel.totalReviews,
            totalJamaah: travel.totalJamaah,
            yearEstablished: travel.yearEstablished,
            licenses: travel.licenses,
            facilities: travel.facilities,
            services: travel.services,
            gallery: travel.gallery,
            legalDocs: travel.legalDocs,
            isActive: travel.isActive === 1,
            isVerified: travel.isVerified === 1,
            createdAt: new Date(travel.createdAt),
            updatedAt: new Date(travel.updatedAt)
          },
          create: {
            id: travel.id,
            username: travel.username,
            name: travel.name,
            description: travel.description,
            logo: travel.logo,
            coverImage: travel.coverImage,
            address: travel.address,
            city: travel.city,
            phone: travel.phone,
            email: travel.email,
            website: travel.website,
            rating: travel.rating,
            totalReviews: travel.totalReviews,
            totalJamaah: travel.totalJamaah,
            yearEstablished: travel.yearEstablished,
            licenses: travel.licenses,
            facilities: travel.facilities,
            services: travel.services,
            gallery: travel.gallery,
            legalDocs: travel.legalDocs,
            isActive: travel.isActive === 1,
            isVerified: travel.isVerified === 1,
            createdAt: new Date(travel.createdAt),
            updatedAt: new Date(travel.updatedAt)
          }
        })
      }
      console.log(`✅ ${travels.length} travels berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada travels untuk dimigrate')
    }

    // 3. Migrate Packages
    console.log('\n📦 Migrasi Packages...')
    const packages = sqliteDb.prepare('SELECT * FROM Package').all()
    if (packages.length > 0) {
      for (const pkg of packages as any[]) {
        await newDb.package.upsert({
          where: { id: pkg.id },
          update: {
            name: pkg.name,
            description: pkg.description,
            image: pkg.image,
            price: pkg.price,
            originalPrice: pkg.originalPrice,
            cashback: pkg.cashback,
            duration: pkg.duration,
            departureCity: pkg.departureCity,
            departureDate: new Date(pkg.departureDate),
            returnDate: pkg.returnDate ? new Date(pkg.returnDate) : null,
            quota: pkg.quota,
            quotaAvailable: pkg.quotaAvailable,
            rating: pkg.rating,
            category: pkg.category,
            flightType: pkg.flightType,
            isBestSeller: pkg.isBestSeller === 1,
            facilities: pkg.facilities,
            includes: pkg.includes,
            excludes: pkg.excludes,
            priceOptions: pkg.priceOptions,
            itinerary: pkg.itinerary,
            isActive: pkg.isActive === 1,
            travelId: pkg.travelId,
            createdAt: new Date(pkg.createdAt),
            updatedAt: new Date(pkg.updatedAt)
          },
          create: {
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            image: pkg.image,
            price: pkg.price,
            originalPrice: pkg.originalPrice,
            cashback: pkg.cashback,
            duration: pkg.duration,
            departureCity: pkg.departureCity,
            departureDate: new Date(pkg.departureDate),
            returnDate: pkg.returnDate ? new Date(pkg.returnDate) : null,
            quota: pkg.quota,
            quotaAvailable: pkg.quotaAvailable,
            rating: pkg.rating,
            category: pkg.category,
            flightType: pkg.flightType,
            isBestSeller: pkg.isBestSeller === 1,
            facilities: pkg.facilities,
            includes: pkg.includes,
            excludes: pkg.excludes,
            priceOptions: pkg.priceOptions,
            itinerary: pkg.itinerary,
            isActive: pkg.isActive === 1,
            travelId: pkg.travelId,
            createdAt: new Date(pkg.createdAt),
            updatedAt: new Date(pkg.updatedAt)
          }
        })
      }
      console.log(`✅ ${packages.length} packages berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada packages untuk dimigrate')
    }

    // 4. Migrate Settings
    console.log('\n📦 Migrasi Settings...')
    const settings = sqliteDb.prepare('SELECT * FROM Settings').all()
    if (settings.length > 0) {
      for (const setting of settings as any[]) {
        await newDb.settings.upsert({
          where: { key: setting.key },
          update: {
            key: setting.key,
            value: setting.value,
            createdAt: new Date(setting.createdAt),
            updatedAt: new Date(setting.updatedAt)
          },
          create: {
            id: setting.id,
            key: setting.key,
            value: setting.value,
            createdAt: new Date(setting.createdAt),
            updatedAt: new Date(setting.updatedAt)
          }
        })
      }
      console.log(`✅ ${settings.length} settings berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada settings untuk dimigrate')
    }

    // 5. Migrate Videos
    console.log('\n📦 Migrasi Videos...')
    const videos = sqliteDb.prepare('SELECT * FROM Video').all()
    if (videos.length > 0) {
      for (const video of videos as any[]) {
        await newDb.video.upsert({
          where: { id: video.id },
          update: {
            title: video.title,
            description: video.description,
            youtubeUrl: video.youtubeUrl,
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            isActive: video.isActive === 1,
            createdAt: new Date(video.createdAt),
            updatedAt: new Date(video.updatedAt)
          },
          create: {
            id: video.id,
            title: video.title,
            description: video.description,
            youtubeUrl: video.youtubeUrl,
            videoId: video.videoId,
            thumbnail: video.thumbnail,
            isActive: video.isActive === 1,
            createdAt: new Date(video.createdAt),
            updatedAt: new Date(video.updatedAt)
          }
        })
      }
      console.log(`✅ ${videos.length} videos berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada videos untuk dimigrate')
    }

    // 6. Migrate Favorites
    console.log('\n📦 Migrasi Favorites...')
    const favorites = sqliteDb.prepare('SELECT * FROM Favorite').all()
    if (favorites.length > 0) {
      for (const favorite of favorites as any[]) {
        await newDb.favorite.upsert({
          where: { id: favorite.id },
          update: {
            userId: favorite.userId,
            packageId: favorite.packageId,
            createdAt: new Date(favorite.createdAt)
          },
          create: {
            id: favorite.id,
            userId: favorite.userId,
            packageId: favorite.packageId,
            createdAt: new Date(favorite.createdAt)
          }
        })
      }
      console.log(`✅ ${favorites.length} favorites berhasil dimigrate`)
    } else {
      console.log('⚠️  Tidak ada favorites untuk dimigrate')
    }

    // 7. Migrate Sliders
    console.log('\n📦 Migrasi Sliders...')
    const sliders = sqliteDb.prepare('SELECT * FROM Slider').all()
    if (sliders.length > 0) {
      for (const slider of sliders as any[]) {
        await newDb.slider.upsert({
          where: { id: slider.id },
          update: {
            title: slider.title,
            description: slider.description,
            image: slider.image,
            link: slider.link,
            targetCity: slider.targetCity,
            order: slider.order,
            isActive: slider.isActive === 1,
            showOverlay: slider.showOverlay === 1,
            objectFit: slider.objectFit,
            createdAt: new Date(slider.createdAt),
            updatedAt: new Date(slider.updatedAt)
          },
          create: {
            id: slider.id,
            title: slider.title,
            description: slider.description,
            image: slider.image,
            link: slider.link,
            targetCity: slider.targetCity,
            order: slider.order,
            isActive: slider.isActive === 1,
            showOverlay: slider.showOverlay === 1,
            objectFit: slider.objectFit,
            createdAt: new Date(slider.createdAt),
            updatedAt: new Date(slider.updatedAt)
          }
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
    sqliteDb.close()
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
