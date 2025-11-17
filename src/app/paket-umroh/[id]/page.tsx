'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { ArrowLeft, MapPin, Calendar, Clock, Plane, CheckCircle, Building2, Share2, Heart } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface PriceOption {
  id: string
  name: string
  price: number
  originalPrice?: number
  cashback?: number
  hotelMakkah: string
  hotelMadinah: string
  description?: string
  isBestSeller?: boolean
}

interface PackageDetail {
  id: string
  name: string
  description: string
  image: string
  price: number
  duration: string
  departureCity: string
  departureDate: string
  quota: number
  quotaAvailable: number
  cashback?: number
  category: string
  travel: {
    id: string
    name: string
    rating: number
    logo?: string
    username?: string
    isVerified?: boolean
  }
  priceOptions: PriceOption[]
  facilities: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
  }>
  includes: string[]
  excludes: string[]
}

export default function DetailPaketUmroh() {
  const params = useParams()
  const router = useRouter()
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPrice, setSelectedPrice] = useState<PriceOption | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleToggleFavorite = async () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const user = localStorage.getItem('currentUser')
    
    if (!isLoggedIn || !user) {
      // Show modern login modal
      setShowLoginModal(true)
      return
    }

    const userData = JSON.parse(user)
    
    try {
      if (!isFavorite) {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userData.email,
            packageId: packageDetail?.id
          })
        })

        const result = await response.json()

        if (result.success) {
          setIsFavorite(true)
          setAlertMessage('Paket berhasil disimpan ke favorit!')
          setAlertType('success')
        } else {
          setAlertMessage(result.message || 'Gagal menyimpan ke favorit')
          setAlertType('error')
        }
      } else {
        // Remove from favorites
        const response = await fetch(`/api/favorites?email=${encodeURIComponent(userData.email)}&packageId=${packageDetail?.id}`, {
          method: 'DELETE'
        })

        const result = await response.json()

        if (result.success) {
          setIsFavorite(false)
          setAlertMessage('Paket dihapus dari favorit')
          setAlertType('error')
        } else {
          setAlertMessage(result.message || 'Gagal menghapus dari favorit')
          setAlertType('error')
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error)
      setAlertMessage('Terjadi kesalahan')
      setAlertType('error')
    }
    
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleShare = async () => {
    const shareData = {
      title: packageDetail?.name || 'Paket Umroh',
      text: packageDetail?.description || 'Lihat paket umroh ini',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setAlertMessage('Link berhasil disalin!')
        setAlertType('success')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  useEffect(() => {
    fetchPackageDetail()
    checkFavoriteStatus()
  }, [params.id])

  const checkFavoriteStatus = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const user = localStorage.getItem('currentUser')
    
    if (isLoggedIn && user) {
      const userData = JSON.parse(user)
      
      try {
        const response = await fetch(`/api/favorites?email=${encodeURIComponent(userData.email)}`)
        const result = await response.json()
        
        if (result.success) {
          setIsFavorite(result.data.includes(params.id as string))
        }
      } catch (error) {
        console.error('Check favorite error:', error)
        setIsFavorite(false)
      }
    } else {
      setIsFavorite(false)
    }
  }

  const fetchPackageDetail = async () => {
    try {
      const response = await fetch(`/api/packages/${params.id}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        const pkg = result.data
        
        // Transform data to match interface
        // Add id to priceOptions if not exists
        const priceOptionsWithId = (pkg.priceOptions || []).map((opt: any, index: number) => ({
          ...opt,
          id: opt.id || `price-${index}`
        }))
        
        const packageData: PackageDetail = {
          id: pkg.id,
          name: pkg.name,
          description: pkg.description,
          image: pkg.image,
          price: pkg.price,
          duration: pkg.duration,
          departureCity: pkg.departureCity,
          departureDate: pkg.departureDate,
          quota: pkg.quota,
          quotaAvailable: pkg.quotaAvailable,
          cashback: pkg.cashback,
          category: pkg.category,
          travel: pkg.travel,
          priceOptions: priceOptionsWithId,
          facilities: pkg.facilities || [],
          itinerary: pkg.itinerary || [],
          includes: pkg.includes || [],
          excludes: pkg.excludes || []
        }
        
        setPackageDetail(packageData)
        
        // Set default selected price to first option
        if (packageData.priceOptions && packageData.priceOptions.length > 0) {
          setSelectedPrice(packageData.priceOptions[0])
        }
      } else {
        setAlertMessage('Paket tidak ditemukan')
        setAlertType('error')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Failed to fetch package:', error)
      setAlertMessage('Gagal memuat data paket')
      setAlertType('error')
      setShowAlert(true)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Memuat...</p>
        </div>
      </MobileLayout>
    )
  }

  if (!packageDetail) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p>Paket tidak ditemukan</p>
        </div>
      </MobileLayout>
    )
  }

  const getDepartureTiming = () => {
    const now = new Date()
    const departure = new Date(packageDetail.departureDate)
    const currentMonth = now.getMonth()
    const departureMonth = departure.getMonth()
    
    if (currentMonth === departureMonth) return 'Bulan Ini'
    if (currentMonth + 1 === departureMonth) return 'Bulan Depan'
    return null
  }

  const departureTiming = getDepartureTiming()

  return (
    <MobileLayout hideBottomNav>
      <div className="min-h-screen bg-background">
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="relative bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-300">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-2">Login Diperlukan</h3>
              
              {/* Message */}
              <p className="text-center text-muted-foreground mb-6">
                Silakan login terlebih dahulu untuk menyimpan paket umroh ke favorit Anda
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLoginModal(false)}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setShowLoginModal(false)
                    router.push('/login')
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {showAlert && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
            <div className={`px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm ${
              alertType === 'success' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}>
              <p className="font-medium">{alertMessage}</p>
            </div>
          </div>
        )}

        {/* Header with Back Button */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">Detail Paket</h1>
          </div>
        </header>

        {/* Content */}
        <div className="container mx-auto max-w-7xl px-4 pt-4 pb-6 space-y-6">
          {/* Image Hero */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden">
            <Image
              src={packageDetail.image}
              alt={packageDetail.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Package Info */}
          <Card className="p-4 md:p-6">
            {/* Departure Timing Badge and Action Buttons */}
            <div className="flex items-start justify-between mb-2">
              {departureTiming && (
                <Badge className={`${departureTiming === 'Bulan Ini' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                  <Plane className="w-3 h-3 mr-1" />
                  {departureTiming}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2"
                >
                  <Heart 
                    className={`w-4 h-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span className="hidden sm:inline">{isFavorite ? 'Tersimpan' : 'Simpan'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">{packageDetail.name}</h2>
            
            {/* Travel Info - Clickable */}
            <div 
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer mb-4"
              onClick={() => {
                if (packageDetail.travel.username) {
                  router.push(`/${packageDetail.travel.username}`)
                } else {
                  router.push(`/travel-umroh/${packageDetail.travel.id}`)
                }
              }}
            >
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="w-full h-full overflow-hidden rounded-full">
                  {packageDetail.travel.logo ? (
                    <Image
                      src={packageDetail.travel.logo}
                      alt={packageDetail.travel.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(packageDetail.travel.name)}&background=10b981&color=fff&size=56&bold=true`}
                      alt={packageDetail.travel.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  )}
                </div>
                {/* Verified Badge - Top Right */}
                {packageDetail.travel.isVerified && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Diselenggarakan oleh</p>
                <p className="font-semibold text-base md:text-lg text-primary">{packageDetail.travel.name}</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-muted-foreground rotate-180" />
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-4">
              {packageDetail.description}
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Keberangkatan</p>
                  <p className="text-sm font-medium">{new Date(packageDetail.departureDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi</p>
                  <p className="text-sm font-medium">{packageDetail.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Dari</p>
                  <p className="text-sm font-medium">{packageDetail.departureCity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Penerbangan</p>
                  <p className="text-sm font-medium">Langsung</p>
                </div>
              </div>
            </div>

          </Card>

          {/* Tabs */}
          <Tabs defaultValue="itinerary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl h-auto">
              <TabsTrigger 
                value="itinerary" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-2.5 font-medium"
              >
                Itinerary
              </TabsTrigger>
              <TabsTrigger 
                value="facilities" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-2.5 font-medium"
              >
                Fasilitas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {packageDetail.itinerary.map((item, index) => (
                    <div key={item.day} className={`flex gap-4 ${index !== packageDetail.itinerary.length - 1 ? 'pb-4 border-b' : ''}`}>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                          {item.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="facilities" className="mt-4">
              <Card className="p-4">
                <div className="space-y-6">
                  {/* Termasuk dalam Paket */}
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">✓ Termasuk dalam Paket</h3>
                    <div className="space-y-2">
                      {packageDetail.includes.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t"></div>

                  {/* Tidak Termasuk */}
                  <div>
                    <h3 className="font-semibold mb-3 text-red-600">✗ Tidak Termasuk</h3>
                    <div className="space-y-2">
                      {packageDetail.excludes.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-red-600 flex-shrink-0">✗</span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Pilih Paket Section - Moved to Bottom */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Pilih Paket</h3>
              <p className="text-xs text-muted-foreground">Geser untuk melihat paket lainnya →</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 pt-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {packageDetail.priceOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedPrice(option)}
                  className={`flex-shrink-0 w-[280px] md:w-[320px] p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedPrice?.id === option.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  {/* Best Seller Badge */}
                  {option.isBestSeller && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-orange-500 text-white shadow-lg px-2.5 py-1 text-xs">
                        ⭐ Best Seller
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h4 className="font-bold text-base md:text-lg mb-2">{option.name}</h4>
                    <div>
                      {/* Harga Coret - dari database */}
                      {option.originalPrice && option.originalPrice > option.price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(option.originalPrice)}
                        </p>
                      )}
                      {/* Harga Sebenarnya dengan "per orang" sejajar */}
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(option.price)}</p>
                        <p className="text-xs text-muted-foreground">per orang</p>
                      </div>
                      {/* Cashback - dari database */}
                      {option.cashback && option.cashback > 0 && (
                        <div className="mt-1 inline-block">
                          <Badge className="bg-orange-100 text-orange-600 border border-orange-300">
                            💰 Cashback {formatCurrency(option.cashback)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pb-3 border-b mb-3"></div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">Hotel Makkah</p>
                        <p className="text-sm font-medium">{option.hotelMakkah}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">Hotel Madinah</p>
                        <p className="text-sm font-medium">{option.hotelMadinah}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Bottom CTA - Desktop & Mobile */}
        <div className="sticky bottom-0 bg-white border-t p-4 shadow-lg z-50">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{selectedPrice?.name || 'Harga'}</p>
                <p className="text-lg md:text-xl font-bold text-primary">
                  {selectedPrice ? formatCurrency(selectedPrice.price) : formatCurrency(packageDetail.price)}
                </p>
                {(selectedPrice?.cashback || packageDetail.cashback) && (
                  <p className="text-xs text-orange-600 font-medium mt-0.5">
                    💰 Cashback {formatCurrency(selectedPrice?.cashback || packageDetail.cashback || 0)}
                  </p>
                )}
              </div>
              <Button 
                size="lg" 
                className="flex-1 md:flex-none md:px-12 bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Booking Sekarang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
