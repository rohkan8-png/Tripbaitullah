'use client'

import { Card } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import Image from 'next/image'

interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  readTime: string
  category: string
}

export function ArticleCard({ id, title, excerpt, image, date, readTime, category }: ArticleCardProps) {
  return (
    <Card 
      className="group cursor-pointer bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl p-0"
      onClick={() => window.location.href = `/artikel/${id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-2">
        <h3 className="font-semibold text-xs line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
