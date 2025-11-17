'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PackageCard } from '@/components/package-card'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Users,
  Award,
  Calendar,
  CheckCircle,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Plane,
  PlaneTakeoff,
  Shield,
  ShieldCheck
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface TravelDetail {
  id: string
  username: string
  name: string
  description: string
  logo: string
  coverImage: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  rating: number
  totalReviews: number
  totalJamaah: number
  yearEstablished: number
  licenses: string[]
  facilities: string[]
  services: string[]
  gallery: string[]
  legalDocs: Array<{ name: string; number: string; validUntil: string }>
  isVerified?: boolean
}

interface Package {
  id: string
  packageName: string
  image: string
  departureDate: string
  duration: string
  departureCity: string
  price: number
  originalPrice?: number
  quota?: number
  cashback?: number
}

export default function TravelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [travel, setTravel] = useState<TravelDetail | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [packagesCount, setPackagesCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [activeTab, setActiveTab] = useState('packages')
  const tabsRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  useEffect(() => {
    fetchTravelDetail()
    fetchPackages()
  }, [params.username])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Auto scroll when tab changes
    if (tabsRef.current) {
      const tabIndex = ['packages', 'gallery', 'legal'].indexOf(value)
      if (tabIndex >= 1) {
        // Scroll to show next tab when 2nd or 3rd tab is active
        tabsRef.current.scrollTo({
          left: tabIndex * 120,
          behavior: 'smooth'
        })
      } else if (tabIndex === 0) {
        // Scroll back to start
        tabsRef.current.scrollTo({
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: travel?.name || 'Travel Umroh',
      text: travel?.description || 'Lihat travel umroh terpercaya',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link berhasil disalin!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image)
    setSelectedImageIndex(index)
  }

  const handleNextImage = () => {
    if (travel && selectedImageIndex < travel.gallery.length - 1) {
      const nextIndex = selectedImageIndex + 1
      setSelectedImageIndex(nextIndex)
      setSelectedImage(travel.gallery[nextIndex])
    }
  }

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1
      setSelectedImageIndex(prevIndex)
      setSelectedImage(travel!.gallery[prevIndex])
    }
  }

  const handleCloseImage = () => {
    setSelectedImage(null)
  }

  const fetchTravelDetail = async () => {
    try {
      const response = await fetch(`/api/travels/${params.username}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        const travelData = result.data
        
        // Parse JSON strings to arrays
        const parsedTravel: TravelDetail = {
          ...travelData,
          licenses: travelData.licenses ? JSON.parse(travelData.licenses) : [],
          facilities: travelData.facilities ? JSON.parse(travelData.facilities) : [],
          services: travelData.services ? JSON.parse(travelData.services) : [],
          gallery: travelData.gallery ? JSON.parse(travelData.gallery) : [],
          legalDocs: travelData.legalDocs ? JSON.parse(travelData.legalDocs) : []
        }
        
        setTravel(parsedTravel)
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch travel detail:', error)
      setLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch(`/api/packages?username=${params.username}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        // Transform data to match Package interface
        const transformedPackages = result.data.map((pkg: any) => ({
          id: pkg.id,
          packageName: pkg.name, // API uses 'name', interface uses 'packageName'
          image: pkg.image,
          departureDate: pkg.departureDate,
          duration: pkg.duration,
          departureCity: pkg.departureCity,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          quota: pkg.quotaAvailable,
          cashback: pkg.cashback
        }))
        
        setPackages(transformedPackages)
        setPackagesCount(transformedPackages.length)
      }
      setLoadingPackages(false)
    } catch (error) {
      console.error('Failed to fetch packages:', error)
      setLoadingPackages(false)
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

  if (!travel) {
    return (
      <MobileLayout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <p>Travel tidak ditemukan</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout hideBottomNav>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-primary">Detail Travel</h1>
          </div>
        </header>

        {/* Cover Image */}
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <div className="relative aspect-[16/9] md:aspect-[21/6] rounded-2xl overflow-hidden">
            <Image
              src={travel.coverImage}
              alt={travel.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
          {/* Travel Info Card */}
          <Card className="p-4 md:p-6">
            <div className="flex gap-4 mb-4">
              {/* Logo with Shield Badge */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                <div className="w-full h-full overflow-hidden rounded-xl">
                  <Image
                    src={travel.logo}
                    alt={travel.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Verified Badge - Shield Style */}
                {travel.isVerified && (
                  <div className="absolute -top-1 -right-1">
                    <svg className="w-7 h-7 md:w-8 md:h-8 text-blue-500 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-xs text-primary font-medium mb-0.5">@{travel.username}</p>
                <h2 className="text-xl md:text-2xl font-bold mb-2">{travel.name}</h2>
                <div className="flex items-center gap-2">
                  {/* Departure City Badge */}
                  {travel.city && (
                    <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 flex items-center gap-1.5 px-2.5 py-1">
                      <PlaneTakeoff className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-medium">{travel.city}</span>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-primary/5 rounded-xl p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{packagesCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Paket Tersedia</div>
              </div>
              <div className="bg-primary/5 rounded-xl p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {travel.yearEstablished ? new Date().getFullYear() - travel.yearEstablished : 0}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Tahun Pengalaman</div>
              </div>
              <div className="bg-primary/5 rounded-xl p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {travel.legalDocs && travel.legalDocs.length > 0 
                    ? travel.legalDocs.length 
                    : travel.licenses?.length || 0}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Legalitas</div>
              </div>
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-4 whitespace-pre-line">
              {travel.description}
            </p>

            {/* Services */}
            {travel.services && travel.services.length > 0 && (
              <div className="py-4 border-t">
                <h3 className="font-semibold text-sm mb-3 text-primary">Layanan Kami</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {travel.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Licenses */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {travel.licenses.map((license, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {license}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div ref={tabsRef} className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <TabsList className="inline-flex w-auto bg-muted/50 p-1 rounded-xl h-auto gap-2">
                <TabsTrigger 
                  value="packages" 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-2.5 px-6 font-medium text-sm whitespace-nowrap"
                >
                  Paket Umroh
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-2.5 px-6 font-medium text-sm whitespace-nowrap"
                >
                  Galeri Foto
                </TabsTrigger>
                <TabsTrigger 
                  value="legal" 
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all py-2.5 px-6 font-medium text-sm whitespace-nowrap"
                >
                  Legalitas
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="packages" className="mt-4">
              {loadingPackages ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <div className="p-2 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : packages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      id={pkg.id}
                      image={pkg.image}
                      packageName={pkg.packageName}
                      travelName={travel?.name || ''}
                      travelLogo={travel?.logo}
                      travelVerified={travel?.isVerified}
                      departureDate={new Date(pkg.departureDate).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      departureDateRaw={pkg.departureDate}
                      duration={pkg.duration}
                      departureCity={pkg.departureCity}
                      price={pkg.price}
                      originalPrice={pkg.originalPrice}
                      quota={pkg.quota}
                      cashback={pkg.cashback}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>Belum ada paket umroh tersedia</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {travel.gallery.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    onClick={() => handleImageClick(image, index)}
                  >
                    <Image
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                        Lihat Foto
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-4">
              <div className="space-y-3">
                {travel.legalDocs && travel.legalDocs.length > 0 ? (
                  // Jika ada legalDocs (format JSON lengkap)
                  travel.legalDocs.map((doc, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{doc.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1">No: {doc.number}</p>
                          <p className="text-xs text-muted-foreground">Berlaku hingga: {doc.validUntil}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">Aktif</Badge>
                      </div>
                    </Card>
                  ))
                ) : travel.licenses && travel.licenses.length > 0 ? (
                  // Fallback: Tampilkan dari licenses (format sederhana)
                  travel.licenses.map((license, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{license}</h4>
                          <p className="text-xs text-muted-foreground">Lisensi resmi dan terdaftar</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">Aktif</Badge>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    <p>Belum ada data legalitas</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Info Card */}
          <Card className="p-4 md:p-6">
            <h3 className="font-bold text-lg mb-4 text-primary">Informasi Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Alamat</p>
                  <p className="text-sm font-medium">{travel.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Telepon</p>
                  <p className="text-sm font-medium">
                    {travel.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium break-all">
                    {travel.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Website</p>
                  <p className="text-sm font-medium break-all">
                    {travel.website}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Tertarik dengan Travel Kami?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hubungi kami untuk informasi lebih lanjut dan konsultasi gratis
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Phone className="w-4 h-4 mr-2" />
                  Hubungi Kami
                </Button>
                <Button size="lg" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Image Popup Full Screen */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <p className="text-white text-sm font-medium">
                {selectedImageIndex + 1} / {travel?.gallery.length}
              </p>
            </div>

            {/* Previous Button */}
            {selectedImageIndex > 0 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Next Button */}
            {travel && selectedImageIndex < travel.gallery.length - 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full p-4 flex items-center justify-center">
              <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                <Image
                  src={selectedImage}
                  alt={`Gallery ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Swipe hint for mobile */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm md:hidden">
              <p className="text-white text-xs">Geser untuk foto berikutnya</p>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
