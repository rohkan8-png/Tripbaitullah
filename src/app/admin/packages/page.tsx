'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Filter
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

interface Package {
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
  }
  isActive: boolean
}

export default function PackagesPage() {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      const result = await response.json()
      
      if (result.success) {
        setPackages(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus paket "${name}"?`)) {
      alert('Fitur hapus akan segera diimplementasikan')
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.travel.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.departureCity.toLowerCase().includes(search.toLowerCase())
    
    const matchCategory = categoryFilter === 'all' || pkg.category === categoryFilter
    
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paket Umroh</h1>
          <p className="text-gray-600">Kelola data paket umroh</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => router.push('/admin/packages/create')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Cari paket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Semua Kategori</option>
            <option value="premium">Premium</option>
            <option value="reguler">Reguler</option>
            <option value="hemat">Hemat</option>
            <option value="keluarga">Keluarga</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keberangkatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kuota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data paket
                  </td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={pkg.image}
                            alt={pkg.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-500">{pkg.duration} • {pkg.departureCity}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-primary font-medium">{pkg.travel.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{formatCurrency(pkg.price)}</div>
                      {pkg.cashback && (
                        <div className="text-xs text-orange-600">Cashback {formatCurrency(pkg.cashback)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(pkg.departureDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.quotaAvailable}/{pkg.quota}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pkg.category === 'premium' ? 'bg-purple-100 text-purple-800' :
                        pkg.category === 'reguler' ? 'bg-blue-100 text-blue-800' :
                        pkg.category === 'hemat' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {pkg.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/paket-umroh/${pkg.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/packages/edit/${pkg.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(pkg.id, pkg.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Paket</p>
          <p className="text-2xl font-bold text-gray-800">{packages.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Premium</p>
          <p className="text-2xl font-bold text-purple-600">
            {packages.filter(p => p.category === 'premium').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Reguler</p>
          <p className="text-2xl font-bold text-blue-600">
            {packages.filter(p => p.category === 'reguler').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Hemat</p>
          <p className="text-2xl font-bold text-green-600">
            {packages.filter(p => p.category === 'hemat').length}
          </p>
        </Card>
      </div>
    </div>
  )
}
