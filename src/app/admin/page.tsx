'use client'

import { Card } from '@/components/ui/card'
import { 
  Plane, 
  Package, 
  FileText, 
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTravels: 0,
    totalPackages: 0,
    totalArticles: 0,
    totalUsers: 0
  })

  useEffect(() => {
    // Fetch stats from API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [travelsRes, packagesRes] = await Promise.all([
        fetch('/api/travels'),
        fetch('/api/packages')
      ])

      const travelsData = await travelsRes.json()
      const packagesData = await packagesRes.json()

      setStats({
        totalTravels: travelsData.total || 0,
        totalPackages: packagesData.total || 0,
        totalArticles: 12, // Mock data
        totalUsers: 150 // Mock data
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Travel',
      value: stats.totalTravels,
      icon: Plane,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Paket',
      value: stats.totalPackages,
      icon: Package,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Total Artikel',
      value: stats.totalArticles,
      icon: FileText,
      color: 'bg-purple-500',
      trend: '+5%'
    },
    {
      title: 'Total User',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-orange-500',
      trend: '+23%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang, Admin! 👋</h1>
        <p className="text-gray-600">Berikut adalah ringkasan data website Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Packages */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Paket Terbaru
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Umroh Premium {i}</p>
                  <p className="text-xs text-gray-500">Rp 35.000.000</p>
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Articles */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Artikel Terbaru
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Tips Umroh {i}</p>
                  <p className="text-xs text-gray-500">2 hari yang lalu</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <Plane className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Tambah Travel</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Tambah Paket</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Tambah Artikel</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Tambah User</p>
          </button>
        </div>
      </Card>
    </div>
  )
}
