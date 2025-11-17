'use client'

import { Card } from '@/components/ui/card'
import { PlaneTakeoff, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface TravelCardProps {
  id: string
  name: string
  username?: string
  address: string
  city?: string
  logo?: string
  isVerified?: boolean
}

export function TravelCard({ id, name, username, address, city, logo, isVerified }: TravelCardProps) {
  // Use username from database, or generate from name as fallback
  const travelUsername = username || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  return (
    <Card 
      className="group cursor-pointer bg-card border-border hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl"
      onClick={() => window.location.href = `/${travelUsername}`}
    >
      <div className="p-2.5 md:p-3">
        <div className="flex items-center gap-3">
          {/* Logo Travel */}
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all">
              <Image
                src={logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=80&bold=true`}
                alt={name}
                width={80}
                height={80}
                className="object-cover rounded-xl"
              />
            </div>
            {/* Verified Badge - Shield Style */}
            {isVerified && (
              <div className="absolute -top-1 -right-1">
                <svg className="w-6 h-6 text-blue-500 drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Info Travel */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
            
            {/* Departure City */}
            <div className="flex items-start gap-1">
              <PlaneTakeoff className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground line-clamp-1">
                {city || address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
