'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock, Plane, PlaneTakeoff } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

interface PackageCardProps {
  id: string
  image: string
  packageName: string
  travelName: string
  travelLogo?: string
  travelVerified?: boolean
  departureDate: string
  departureDateRaw?: string
  duration: string
  departureCity: string
  price: number
  originalPrice?: number
  quota?: number
  cashback?: number
}

export function PackageCard({
  id,
  image,
  packageName,
  travelName,
  travelLogo,
  travelVerified,
  departureDate,
  departureDateRaw,
  duration,
  departureCity,
  price,
  originalPrice,
  quota,
  cashback
}: PackageCardProps) {
  // Calculate departure timing
  const getDepartureTiming = () => {
    if (!departureDateRaw) return null
    
    const now = new Date()
    const departure = new Date(departureDateRaw)
    
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const departureMonth = departure.getMonth()
    const departureYear = departure.getFullYear()
    
    if (departureYear === currentYear && departureMonth === currentMonth) {
      return 'Bulan Ini'
    } else if (
      (departureYear === currentYear && departureMonth === currentMonth + 1) ||
      (currentMonth === 11 && departureYear === currentYear + 1 && departureMonth === 0)
    ) {
      return 'Bulan Depan'
    }
    
    return null
  }

  const departureTiming = getDepartureTiming()

  return (
    <Card 
      className="group cursor-pointer bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl p-0"
      onClick={() => window.location.href = `/paket-umroh/${id}`}
    >
      {/* Image Section - No padding */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={packageName || 'Paket Umroh'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
          {cashback && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-semibold">
              Cashback {formatCurrency(cashback)}
            </Badge>
          )}
          {departureTiming && (
            <Badge className={`${departureTiming === 'Bulan Ini' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white text-[10px] font-semibold flex items-center gap-1`}>
              <Plane className="w-2.5 h-2.5" />
              {departureTiming}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="px-2 pt-1.5 pb-2">
        <div className="space-y-1">
          {/* Package Name */}
          <h3 className="font-semibold text-xs md:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {packageName}
          </h3>
          
          {/* Travel Name */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {travelLogo ? (
                <Image
                  src={travelLogo}
                  alt={`Logo ${travelName || 'Travel'}`}
                  width={20}
                  height={20}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(travelName || 'Travel')}&background=10b981&color=fff&size=32&bold=true`}
                  alt={`Logo ${travelName || 'Travel'}`}
                  width={20}
                  height={20}
                  className="object-cover"
                />
              )}
            </div>
            <span className="text-xs md:text-sm text-primary font-medium line-clamp-1">{travelName}</span>
            {travelVerified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Departure Info */}
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <div className="flex items-center gap-0.5 text-xs md:text-sm text-muted-foreground">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="line-clamp-1">{departureDate}</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs md:text-sm text-muted-foreground">
              <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span>{duration}</span>
            </div>
          </div>
          
          {/* Price and Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-xs md:text-sm text-muted-foreground">
              <PlaneTakeoff className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="line-clamp-1">{departureCity}</span>
            </div>
            <div className="text-right">
              {originalPrice && originalPrice > price && (
                <p className="text-[10px] md:text-xs text-muted-foreground line-through">
                  {formatCurrency(originalPrice)}
                </p>
              )}
              <p className="text-xs md:text-base font-bold text-primary">
                {formatCurrency(price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}