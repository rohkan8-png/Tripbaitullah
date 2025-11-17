'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { PackageCard } from '@/components/package-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, X, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  rating?: number
  category: string
}

export default function PaketUmroh() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departureCity, setDepartureCity] = useState('all')
  const [sortBy, setSortBy] = useState('termurah')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Advanced filters
  const [departureMonth, setDepartureMonth] = useState('all')
  const [duration, setDuration] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000000])

  useEffect(() => {
    fetchPackages()
  }, [sortBy])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/packages')
      const result = await response.json()
      
      if (result.success) {
        let formattedPackages = result.data.map((pkg: any) => ({
          id: pkg.id,
          image: pkg.image,
          packageName: pkg.name,
          travelName: pkg.travel.name,
          travelLogo: pkg.travel.logo || null,
          travelVerified: pkg.travel.isVerified || false,
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
          quota: pkg.quotaAvailable,
          cashback: pkg.cashback,
          rating: pkg.rating,
          category: pkg.category
        }))

        // Sort packages
        if (sortBy === 'termurah') {
          formattedPackages.sort((a: Package, b: Package) => a.price - b.price)
        } else if (sortBy === 'termahal') {
          formattedPackages.sort((a: Package, b: Package) => b.price - a.price)
        } else if (sortBy === 'rating') {
          formattedPackages.sort((a: Package, b: Package) => (b.rating || 0) - (a.rating || 0))
        }

        setPackages(formattedPackages)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setDepartureCity('all')
    setSortBy('termurah')
    setDepartureMonth('all')
    setDuration('all')
    setPriceRange([0, 100000000])
    setIsFilterOpen(false)
  }

  const filteredPackages = packages.filter(pkg => {
    // Search filter
    const matchSearch = pkg.packageName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.travelName.toLowerCase().includes(search.toLowerCase()) ||
      pkg.departureCity.toLowerCase().includes(search.toLowerCase())
    
    // Departure city filter
    const matchCity = departureCity === 'all' || pkg.departureCity.toLowerCase().includes(departureCity.toLowerCase())
    
    // Departure month filter
    let matchMonth = true
    if (departureMonth !== 'all') {
      const pkgDate = new Date(pkg.departureDateRaw)
      matchMonth = pkgDate.getMonth() === parseInt(departureMonth)
    }
    
    // Duration filter
    let matchDuration = true
    if (duration !== 'all') {
      const days = parseInt(pkg.duration.split(' ')[0])
      if (duration === '7-9') matchDuration = days >= 7 && days <= 9
      else if (duration === '10-12') matchDuration = days >= 10 && days <= 12
      else if (duration === '13+') matchDuration = days >= 13
    }
    
    // Price range filter
    const matchPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    
    return matchSearch && matchCity && matchMonth && matchDuration && matchPrice
  })

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 py-3">
            <h1 className="text-lg md:text-xl font-bold text-primary">Paket Umroh</h1>
            <p className="text-sm text-muted-foreground">Temukan paket umroh terbaik</p>
          </div>
        </header>

        {/* Filters */}
        <section className="bg-card px-4 md:px-6 py-3 md:py-4 border-b border-border">
          <div className="container mx-auto max-w-7xl">
            <div className="space-y-3">
              {/* Search and Filter */}
              <div className="flex gap-2 md:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    placeholder="Cari paket umroh..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 md:pl-12 h-10 md:h-12"
                  />
                </div>

                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-[120px] md:w-[140px] h-10 md:h-12">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="text-sm md:text-base">Filter</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] px-6">
                    <SheetHeader>
                      <SheetTitle className="text-primary">Filter Lanjutan</SheetTitle>
                      <SheetDescription>
                        Sesuaikan pencarian paket umroh Anda
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6 px-2">
                      {/* Kota Keberangkatan */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Kota Keberangkatan</label>
                        <Select value={departureCity} onValueChange={setDepartureCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kota" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Kota</SelectItem>
                            <SelectItem value="jakarta">Jakarta</SelectItem>
                            <SelectItem value="surabaya">Surabaya</SelectItem>
                            <SelectItem value="bandung">Bandung</SelectItem>
                            <SelectItem value="medan">Medan</SelectItem>
                            <SelectItem value="semarang">Semarang</SelectItem>
                            <SelectItem value="yogyakarta">Yogyakarta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Urutkan */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Urutkan Berdasarkan</label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih urutan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="termurah">Termurah</SelectItem>
                            <SelectItem value="termahal">Termahal</SelectItem>
                            <SelectItem value="rating">Rating Tertinggi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Bulan Keberangkatan */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Bulan Keberangkatan</label>
                        <Select value={departureMonth} onValueChange={setDepartureMonth}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih bulan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Bulan</SelectItem>
                            <SelectItem value="0">Januari</SelectItem>
                            <SelectItem value="1">Februari</SelectItem>
                            <SelectItem value="2">Maret</SelectItem>
                            <SelectItem value="3">April</SelectItem>
                            <SelectItem value="4">Mei</SelectItem>
                            <SelectItem value="5">Juni</SelectItem>
                            <SelectItem value="6">Juli</SelectItem>
                            <SelectItem value="7">Agustus</SelectItem>
                            <SelectItem value="8">September</SelectItem>
                            <SelectItem value="9">Oktober</SelectItem>
                            <SelectItem value="10">November</SelectItem>
                            <SelectItem value="11">Desember</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Durasi */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Durasi</label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih durasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Durasi</SelectItem>
                            <SelectItem value="7-9">7-9 Hari</SelectItem>
                            <SelectItem value="10-12">10-12 Hari</SelectItem>
                            <SelectItem value="13+">13+ Hari</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rentang Harga */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Rentang Harga: Rp {priceRange[0].toLocaleString('id-ID')} - Rp {priceRange[1].toLocaleString('id-ID')}
                        </label>
                        <Slider
                          min={0}
                          max={100000000}
                          step={1000000}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="mt-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Rp 0</span>
                          <span>Rp 100 Jt</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={resetFilters}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reset Filter
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          Terapkan Filter
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <main className="container mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-6">
          <div className="mb-4 md:mb-6">
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {loading ? 'Memuat...' : `${filteredPackages.length} paket ditemukan`}
            </p>
          </div>

          {/* Package Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <p className="text-gray-500 text-base md:text-lg mb-4">Tidak ada paket yang ditemukan</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filter
              </Button>
            </div>
          )}
        </main>
      </div>
    </MobileLayout>
  )
}