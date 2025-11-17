import { NextResponse } from 'next/server'

const mockArticles = [
  {
    id: '1',
    title: 'Panduan Lengkap Ibadah Umrah untuk Pemula',
    content: 'Umrah adalah ibadah yang sangat dianjurkan dalam Islam. Berikut panduan lengkap untuk melaksanakan ibadah umrah bagi pemula...',
    excerpt: 'Pelajari tata cara dan doa-doa lengkap untuk ibadah umrah yang benar dan sesuai syariat.',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&h=400&fit=crop',
    slug: 'panduan-lengkap-ibadah-umrah-untuk-pemula',
    tags: 'umrah,panduan,ibadah',
    views: 1520,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    travelId: '1',
    travel: {
      id: '1',
      name: 'Alhijaz Indowisata'
    }
  },
  {
    id: '2',
    title: 'Tips Memilih Travel Umroh Terpercaya',
    content: 'Memilih travel umroh yang tepat sangat penting untuk kenyamanan dan keamanan ibadah Anda. Berikut tips-tips penting...',
    excerpt: 'Wajib baca! Tips jitu memilih travel umroh yang terpercaya dan berpengalaman.',
    image: 'https://images.unsplash.com/photo-1591515256056-8ab5f29c0a59?w=600&h=400&fit=crop',
    slug: 'tips-memilih-travel-umroh-terpercaya',
    tags: 'travel,tips,umroh',
    views: 2100,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    travelId: '2',
    travel: {
      id: '2',
      name: 'Raudhah Travel'
    }
  },
  {
    id: '3',
    title: 'Persiapan Fisik dan Mental Sebelum Berangkat Umrah',
    content: 'Persiapan yang matang sangat penting sebelum berangkat umrah. Mulai dari fisik hingga mental harus dipersiapkan dengan baik...',
    excerpt: 'Persiapkan diri Anda dengan baik sebelum berangkat umrah untuk ibadah yang lebih khusyuk.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    slug: 'persiapan-fisik-dan-mental-sebelum-berangkat-umrah',
    tags: 'persiapan,kesehatan,umroh',
    views: 1850,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    travelId: '3',
    travel: {
      id: '3',
      name: 'Safira Travel'
    }
  },
  {
    id: '4',
    title: 'Doa-Doa Mustajab Selama Ibadah Umrah',
    content: 'Berikut kumpulan doa-doa yang dianjurkan untuk dibaca selama melaksanakan ibadah umrah dari awal hingga akhir...',
    excerpt: 'Kumpulan doa-doa penting yang harus Anda ketahui selama ibadah umrah.',
    image: 'https://images.unsplash.com/photo-1464219666558-726c2a426654?w=600&h=400&fit=crop',
    slug: 'doa-doa-mustajab-selama-ibadah-umrah',
    tags: 'doa,ibadah,umroh',
    views: 3200,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    travelId: '4',
    travel: {
      id: '4',
      name: 'Nabawi Travel'
    }
  },
  {
    id: '5',
    title: 'Waktu Terbaik untuk Berangkat Umrah',
    content: 'Memilih waktu yang tepat untuk berangkat umrah dapat mempengaruhi kenyamanan dan biaya perjalanan Anda...',
    excerpt: 'Kapan waktu terbaik untuk berangkat umrah? Temukan jawabannya di sini.',
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&h=400&fit=crop',
    slug: 'waktu-terbaik-untuk-berangkat-umrah',
    tags: 'waktu,tips,umroh',
    views: 1450,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    travelId: '5',
    travel: {
      id: '5',
      name: 'Ziarah Travel'
    }
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const limit = searchParams.get('limit')
  const tags = searchParams.get('tags')

  let filteredArticles = mockArticles.filter(article => article.isPublished)

  if (search) {
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      article.content?.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (tags) {
    const tagArray = tags.split(',')
    filteredArticles = filteredArticles.filter(article => 
      tagArray.some(tag => article.tags?.includes(tag))
    )
  }

  if (limit) {
    filteredArticles = filteredArticles.slice(0, parseInt(limit))
  }

  return NextResponse.json({
    success: true,
    data: filteredArticles,
    total: filteredArticles.length
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In a real app, you would save to database here
    const newArticle = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newArticle,
      message: 'Article created successfully'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create article',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}