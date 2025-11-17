'use client'

import { MobileLayout } from '@/components/mobile-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, PlaneTakeoff, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Travel {
  id: string
  username: string
  name: string
  description: string
  logo: string
  address: string
  city?: string
  phone: string
  email: string
  website: string
  rating: number
  isVerified?: boolean
}

export default function TravelUmroh() {
  const [travels, setTravels] = useState<Travel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [preferredLocation, setPreferredLocation] = useState<string>('')

  useEffect(() => {
    // Load preferred location from localStorage
    const savedLocation = localStorage.getItem('preferredLocation')
    if (savedLocation && savedLocation !== 'all') {
      setPreferredLocation(savedLocation)
    }
    
    fetchTravels(savedLocation || '')
  }, [])

  const fetchTravels = async (location: string = '') => {
    try {
      const locationParam = location && location !== 'all' ? `?location=${location}` : ''
      const response = await fetch(`/api/travels${locationParam}`)
      const result = await response.json()
      
      if (result.success) {
        setTravels(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch travels:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTravels = travels.filter(travel => {
    const matchesSearch = travel.name.toLowerCase().includes(search.toLowerCase()) ||
      travel.description?.toLowerCase().includes(search.toLowerCase()) ||
      travel.address?.toLowerCase().includes(search.toLowerCase())
    
    return matchesSearch
  })

  return (
    <MobileLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <h1 className="text-lg md:text-xl font-bold text-primary">Travel Umroh</h1>
            <p className="text-sm text-muted-foreground">Travel penyelenggara umroh pilihan</p>
          </div>
        </header>

        {/* Search */}
        <section className="bg-card border-b border-border">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari travel umroh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <main className="container mx-auto max-w-7xl px-4 py-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Memuat...' : `${filteredTravels.length} travel ditemukan`}
            </p>
          </div>

          {/* Travel List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTravels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTravels.map((travel) => {
                return (
                  <Card 
                    key={travel.id} 
                    className="hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl cursor-pointer group"
                    onClick={() => window.location.href = `/${travel.username}`}
                  >
                    <div className="p-4 md:p-5">
                      <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="relative">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all">
                          <Image
                            src={travel.logo}
                            alt={travel.name}
                            width={80}
                            height={80}
                            className="object-cover rounded-xl"
                          />
                        </div>
                        {/* Verified Badge - Shield Style */}
                        {travel.isVerified && (
                          <div className="absolute -top-1 -right-1">
                            <svg className="w-6 h-6 text-blue-500 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                            {travel.name}
                          </h3>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {travel.description}
                        </p>
                        
                        {/* Departure City */}
                        {(travel.city || travel.address) && (
                          <div className="flex items-start gap-1.5">
                            <PlaneTakeoff className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                              {travel.city || travel.address}
                            </p>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada travel yang ditemukan</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearch('')}>
                Reset Pencarian
              </Button>
            </div>
          )}
        </main>
      </div>
    </MobileLayout>
  )
}