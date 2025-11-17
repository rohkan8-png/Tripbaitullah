import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const mockTravels = [
  {
    id: '1',
    username: 'alhijaz-indowisata',
    name: 'Alhijaz Indowisata',
    description: 'Travel umroh terpercaya dengan pengalaman lebih dari 10 tahun',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+62 21 1234567',
    email: 'info@alhijaz.com',
    website: 'https://alhijaz.com',
    rating: 4.8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'raudhah-travel',
    name: 'Raudhah Travel',
    description: 'Spesialis paket umroh keluarga dengan pelayanan terbaik',
    logo: 'https://images.unsplash.com/photo-1591515256056-8ab5f29c0a59?w=100&h=100&fit=crop',
    address: 'Jl. Ahmad Yani No. 456, Surabaya',
    phone: '+62 31 7654321',
    email: 'info@raudhah.com',
    website: 'https://raudhah.com',
    rating: 4.9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'safira-travel',
    name: 'Safira Travel',
    description: 'Paket umroh hemat dengan fasilitas lengkap dan nyaman',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    address: 'Jl. Gatot Subroto No. 789, Medan',
    phone: '+62 61 9876543',
    email: 'info@safira.com',
    website: 'https://safira.com',
    rating: 4.6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    username: 'nabawi-travel',
    name: 'Nabawi Travel',
    description: 'Travel premium dengan fasilitas bintang 5 dan pelayanan eksklusif',
    logo: 'https://images.unsplash.com/photo-1464219666558-726c2a426654?w=100&h=100&fit=crop',
    address: 'Jl. Thamrin No. 321, Jakarta Selatan',
    phone: '+62 21 2468135',
    email: 'info@nabawi.com',
    website: 'https://nabawi.com',
    rating: 4.9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    username: 'ziarah-travel',
    name: 'Ziarah Travel',
    description: 'Paket umroh plus ziarah ke berbagai negara Islam',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
    address: 'Jl. Diponegoro No. 654, Jakarta Utara',
    phone: '+62 21 1357924',
    email: 'info@ziarah.com',
    website: 'https://ziarah.com',
    rating: 4.7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    username: 'madinah-travel',
    name: 'Madinah Travel',
    description: 'Spesialis paket umroh dengan hotel dekat Masjid Nabawi',
    logo: 'https://images.unsplash.com/photo-1591515256056-8ab5f29c0a59?w=100&h=100&fit=crop',
    address: 'Jl. Merdeka No. 111, Bandung',
    phone: '+62 22 3456789',
    email: 'info@madinah.com',
    website: 'https://madinah.com',
    rating: 4.8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    username: 'arafah-tour',
    name: 'Arafah Tour',
    description: 'Paket umroh dengan program spiritual dan edukasi',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    address: 'Jl. Pahlawan No. 222, Makassar',
    phone: '+62 411 5678901',
    email: 'info@arafah.com',
    website: 'https://arafah.com',
    rating: 4.6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    username: 'makkah-express',
    name: 'Makkah Express',
    description: 'Travel umroh cepat dengan jadwal fleksibel',
    logo: 'https://images.unsplash.com/photo-1464219666558-726c2a426654?w=100&h=100&fit=crop',
    address: 'Jl. Veteran No. 333, Semarang',
    phone: '+62 24 7890123',
    email: 'info@makkahexpress.com',
    website: 'https://makkahexpress.com',
    rating: 4.7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    username: 'barokah-travel',
    name: 'Barokah Travel',
    description: 'Paket umroh berkah dengan harga terjangkau',
    logo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=100&h=100&fit=crop',
    address: 'Jl. Kemerdekaan No. 444, Palembang',
    phone: '+62 711 2345678',
    email: 'info@barokah.com',
    website: 'https://barokah.com',
    rating: 4.5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const location = searchParams.get('location')

    // Build where clause
    const where: any = { isActive: true }

    if (location && location !== 'all') {
      where.OR = [
        { address: { contains: location } },
        { city: { contains: location } }
      ]
    }

    if (search) {
      const searchLower = search.toLowerCase().replace('@', '')
      where.OR = [
        { name: { contains: searchLower } },
        { username: { contains: searchLower } },
        { description: { contains: searchLower } },
        { address: { contains: searchLower } },
        { city: { contains: searchLower } }
      ]
    }

    // Get travels from database
    const travels = await db.travel.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: [
        { isVerified: 'desc' }, // Verified first
        { createdAt: 'desc' }   // Then by newest
      ],
      include: {
        _count: {
          select: {
            packages: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: travels,
      total: travels.length
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch travels',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Convert arrays to JSON strings for storage
    const travelData: any = {
      username: body.username,
      name: body.name,
      description: body.description,
      logo: body.logo,
      coverImage: body.coverImage,
      address: body.address,
      city: body.city,
      phone: body.phone,
      email: body.email,
      website: body.website,
      rating: body.rating || 0,
      totalReviews: body.totalReviews || 0,
      totalJamaah: body.totalJamaah || 0,
      yearEstablished: body.yearEstablished,
      isActive: body.isActive !== undefined ? body.isActive : true
    }

    // Convert arrays to JSON strings
    if (body.licenses) {
      travelData.licenses = JSON.stringify(body.licenses)
    }
    if (body.facilities) {
      travelData.facilities = JSON.stringify(body.facilities)
    }
    if (body.services) {
      travelData.services = JSON.stringify(body.services)
    }
    if (body.gallery) {
      travelData.gallery = JSON.stringify(body.gallery)
    }
    if (body.legalDocs) {
      travelData.legalDocs = JSON.stringify(body.legalDocs)
    }

    // Create travel in database
    const newTravel = await db.travel.create({
      data: travelData
    })

    console.log('New travel added to database:', newTravel)

    return NextResponse.json({
      success: true,
      data: newTravel,
      message: 'Travel created successfully'
    })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create travel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}