'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { PackageCard } from '@/components/package-card'
import { TravelCard } from '@/components/travel-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Package {
  id: string
  image: string
  packageName: string
  travelName: string
  departureDate: string
  departureDateRaw: string
  duration: string
  departureCity: string
  price: number
  originalPrice?: number
  quota?: number
  cashback?: number
}

interface Travel {
  id: string
  name: string
  address: string
  logo?: string
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  
  const [packages, setPackages] = useState<Package[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(queryParam)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setSearchQuery(queryParam)
  }, [queryParam])

  const fetchData = async () => {
    try {
      const [packagesRes, travelsRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/travels')
      ])

      const packagesResult = await packagesRes.json()
      const travelsResult = await travelsRes.json()

      if (packagesResult.success) {
        // Map API data to PackageCard format
        const mappedPackages = packagesResult.data.map((pkg: any) => ({
          id: pkg.id,
          image: pkg.image,
          packageName: pkg.name,
          travelName: pkg.travel?.name || '',
          departureDate: new Date(pkg.departureDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          departureDateRaw: pkg.departureDate,
          duration: pkg.duration,
          departureCity: pkg.departureCity,
          price: pkg.price,
          originalPrice: pkg.originalPrice,
          quota: pkg.quota,
          cashback: pkg.cashback
        }))
        setPackages(mappedPackages)
      }
      if (travelsResult.success) {
        setTravels(travelsResult.data)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const filteredPackages = searchQuery.trim() 
    ? packages.filter(pkg => 
        pkg.packageName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.travelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.departureCity?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const filteredTravels = searchQuery.trim()
    ? travels.filter((travel: any) => {
        const searchLower = searchQuery.toLowerCase().replace('@', '') // Remove @ if present
        return (
          travel.name?.toLowerCase().includes(searchLower) ||
          travel.username?.toLowerCase().includes(searchLower) ||
          travel.address?.toLowerCase().includes(searchLower)
        )
      })
    : []

  return (
    <MobileLayout hideBottomNav>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold">Pencarian</h1>
            </div>
            
            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari paket atau travel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10"
                  autoFocus
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Batal
              </Button>
            </div>
          </div>
        </header>

        {/* Results */}
        <main className="container mx-auto max-w-7xl px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat...</p>
            </div>
          ) : searchQuery.trim() ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Ditemukan {filteredPackages.length} paket dan {filteredTravels.length} travel untuk "{searchQuery}"
                </p>
              </div>

              {/* Packages Results */}
              {filteredPackages.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Paket Umroh ({filteredPackages.length})</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredPackages.map((pkg) => (
                      <PackageCard key={pkg.id} {...pkg} />
                    ))}
                  </div>
                </section>
              )}

              {/* Travels Results */}
              {filteredTravels.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4">Travel Umroh ({filteredTravels.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredTravels.map((travel) => (
                      <TravelCard key={travel.id} {...travel} />
                    ))}
                  </div>
                </section>
              )}

              {filteredPackages.length === 0 && filteredTravels.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Tidak ada hasil untuk "{searchQuery}"</p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Coba kata kunci lain
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Masukkan kata kunci untuk mencari paket atau travel</p>
            </div>
          )}
        </main>
      </div>
    </MobileLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MobileLayout hideBottomNav>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </MobileLayout>
    }>
      <SearchContent />
    </Suspense>
  )
}
