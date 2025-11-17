'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, User, Eye, Share2, Heart, ArrowUp } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface ArticleDetail {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  image: string
  tags: string
  views: number
  createdAt: string
  travelName: string
  author: string
}

export default function DetailArtikel() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [readProgress, setReadProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Ahmad Fauzi',
      date: '2 hari yang lalu',
      text: 'Artikel yang sangat bermanfaat! Terima kasih atas panduannya.',
      avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=10b981&color=fff'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      date: '3 hari yang lalu',
      text: 'Sangat membantu untuk persiapan umroh pertama saya. Jazakallah khair.',
      avatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=10b981&color=fff'
    }
  ])

  useEffect(() => {
    fetchArticleDetail()
  }, [params.slug])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      // Calculate read progress
      const scrollableHeight = documentHeight - windowHeight
      const progress = (scrollTop / scrollableHeight) * 100
      setReadProgress(Math.min(progress, 100))
      
      // Show scroll to top button after scrolling 300px
      setShowScrollTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const fetchArticleDetail = async () => {
    try {
      // Mock data
      const mockData: ArticleDetail = {
        id: '1',
        slug: params.slug as string,
        title: 'Panduan Lengkap Persiapan Umroh untuk Pemula',
        excerpt: 'Pelajari langkah-langkah penting dalam mempersiapkan ibadah umroh pertama Anda',
        content: `
          <h2>Persiapan Dokumen</h2>
          <p>Sebelum berangkat umroh, pastikan Anda telah menyiapkan dokumen-dokumen penting seperti:</p>
          <ul>
            <li>Paspor dengan masa berlaku minimal 6 bulan</li>
            <li>Visa umroh yang telah diurus oleh travel</li>
            <li>Kartu vaksinasi meningitis</li>
            <li>Buku kesehatan</li>
          </ul>

          <h2>Persiapan Fisik dan Mental</h2>
          <p>Ibadah umroh memerlukan stamina yang baik. Mulailah mempersiapkan kondisi fisik Anda minimal 2 bulan sebelum keberangkatan dengan:</p>
          <ul>
            <li>Olahraga rutin seperti jalan kaki atau jogging</li>
            <li>Menjaga pola makan yang sehat</li>
            <li>Istirahat yang cukup</li>
            <li>Memperbanyak ibadah dan dzikir</li>
          </ul>

          <h2>Perlengkapan yang Harus Dibawa</h2>
          <p>Berikut adalah daftar perlengkapan penting yang harus Anda bawa:</p>
          <ul>
            <li>Pakaian ihram (2-3 set)</li>
            <li>Sandal yang nyaman</li>
            <li>Tas kecil untuk membawa barang saat thawaf</li>
            <li>Obat-obatan pribadi</li>
            <li>Perlengkapan mandi dan toiletries</li>
            <li>Power bank dan charger</li>
          </ul>

          <h2>Tips Selama di Tanah Suci</h2>
          <p>Agar ibadah umroh Anda lancar dan khusyuk, perhatikan hal-hal berikut:</p>
          <ul>
            <li>Selalu ikuti arahan dari pembimbing</li>
            <li>Jaga kesehatan dengan minum air yang cukup</li>
            <li>Hindari berdesakan saat thawaf dan sa'i</li>
            <li>Manfaatkan waktu untuk beribadah sebanyak-banyaknya</li>
            <li>Jaga kebersihan dan ketertiban</li>
          </ul>

          <h2>Kesimpulan</h2>
          <p>Persiapan yang matang akan membuat ibadah umroh Anda lebih nyaman dan khusyuk. Semoga panduan ini bermanfaat untuk Anda yang akan menunaikan ibadah umroh pertama kali.</p>
        `,
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80',
        tags: 'Panduan, Tips, Persiapan',
        views: 1520,
        createdAt: '15 Januari 2025',
        travelName: 'Al-Hijrah Tour',
        author: 'Admin'
      }
      setArticle(mockData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch article:', error)
      setLoading(false)
    }
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        name: 'Anda',
        date: 'Baru saja',
        text: commentText,
        avatar: 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff'
      }
      setComments([newComment, ...comments])
      setCommentText('')
      setAlertMessage('✅ Komentar berhasil ditambahkan!')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      setAlertMessage('✅ Artikel berhasil disimpan!')
    } else {
      setAlertMessage('❌ Artikel dihapus dari favorit')
    }
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleShare = async () => {
    const shareData = {
      title: article?.title || 'Artikel',
      text: article?.excerpt || 'Baca artikel ini',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setAlertMessage('🔗 Link berhasil disalin!')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <p>Memuat...</p>
        </div>
      </MobileLayout>
    )
  }

  if (!article) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <p>Artikel tidak ditemukan</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout hideBottomNav>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Alert */}
        {showAlert && (
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none">
            <div 
              className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl px-6 py-4 border border-white/20"
              style={{ animation: 'slideDown 0.5s ease-out forwards' }}
            >
              <p className="text-sm font-medium text-gray-800">{alertMessage}</p>
            </div>
          </div>
        )}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}} />

        {/* Header with Progress Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">Detail Artikel</h1>
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-primary transition-all duration-150"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        </header>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
            size="icon"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}

        {/* Content */}
        <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Info */}
          <Card className="p-4 md:p-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>

            {/* Meta Info */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{article.travelName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{article.createdAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>5 menit baca</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToggleFavorite}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </Card>

          {/* Comments Section */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Komentar ({comments.length})</h2>
            
            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" disabled={!commentText.trim()}>
                  Kirim Komentar
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={comment.avatar}
                      alt={comment.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Related Articles */}
          <Card className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Artikel Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={`https://images.unsplash.com/photo-159160412993${i}-f1efa4d9f7fa?w=200&q=80`}
                      alt="Related article"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      Tips Memilih Paket Umroh yang Tepat
                    </h3>
                    <p className="text-xs text-muted-foreground">5 menit baca</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  )
}
