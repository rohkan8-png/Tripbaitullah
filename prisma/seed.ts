import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed Users
  const users = [
    {
      email: 'user@test.com',
      password: '123456',
      name: 'Test User',
      phone: '+62 812 3456 7890'
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    })
  }

  // Seed Travels
  const travels = [
    {
      username: 'alhijaz-indowisata',
      name: 'Alhijaz Indowisata',
      description: 'Travel umroh terpercaya dengan pengalaman lebih dari 10 tahun',
      logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      phone: '+62 21 1234567',
      email: 'info@alhijaz.com',
      website: 'https://alhijaz.com',
      rating: 4.8,
      isActive: true
    },
    {
      username: 'raudhah-travel',
      name: 'Raudhah Travel',
      description: 'Spesialis paket umroh keluarga dengan pelayanan terbaik',
      logo: 'https://images.unsplash.com/photo-1591515256056-8ab5f29c0a59?w=100&h=100&fit=crop',
      address: 'Jl. Ahmad Yani No. 456, Surabaya',
      phone: '+62 31 7654321',
      email: 'info@raudhah.com',
      website: 'https://raudhah.com',
      rating: 4.9,
      isActive: true
    },
    {
      username: 'safira-travel',
      name: 'Safira Travel',
      description: 'Paket umroh hemat dengan fasilitas lengkap dan nyaman',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      address: 'Jl. Gatot Subroto No. 789, Medan',
      phone: '+62 61 9876543',
      email: 'info@safira.com',
      website: 'https://safira.com',
      rating: 4.6,
      isActive: true
    }
  ]

  for (const travel of travels) {
    await prisma.travel.upsert({
      where: { username: travel.username },
      update: {},
      create: travel
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
