'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [travels, setTravels] = useState<any[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    duration: '12 Hari',
    departureCity: '',
    departureDate: '',
    quota: 45,
    quotaAvailable: 45,
    category: 'premium',
    flightType: 'langsung',
    travelId: '',
    facilities: '',
    includes: '',
    excludes: '',
    isActive: true
  })

  const [priceOptions, setPriceOptions] = useState([
    {
      name: 'Paket Silver',
      price: 35000000,
      originalPrice: 40250000,
      cashback: 1000000,
      hotelMakkah: 'Hotel Bintang 4 (500m dari Masjidil Haram)',
      hotelMadinah: 'Hotel Bintang 4 (400m dari Masjid Nabawi)',
      description: 'Paket standar dengan lokasi strategis',
      isBestSeller: false
    }
  ])

  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      title: 'Keberangkatan',
      description: 'Berkumpul di bandara dan penerbangan'
    }
  ])

  useEffect(() => {
    fetchTravels()
  }, [])

  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travels')
      const result = await response.json()
      if (result.success) {
        setTravels(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch travels:', error)
    }
  }

  const handleTravelChange = (travelId: string) => {
    const selectedTravel = travels.find(t => t.id === travelId)
    if (selectedTravel) {
      setFormData({
        ...formData,
        travelId,
        departureCity: selectedTravel.city || ''
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)

    try {
      let imageUrl = formData.image

      // Upload image if file selected
      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch('/api/upload/package', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          imageUrl = uploadResult.url
        } else {
          alert('Gagal upload gambar')
          setLoading(false)
          setUploading(false)
          return
        }
      }

      if (!imageUrl) {
        alert('Gambar paket harus diisi')
        setLoading(false)
        setUploading(false)
        return
      }

      // Find best seller option
      const bestSellerOption = priceOptions.find(opt => opt.isBestSeller)
      const isBestSeller = !!bestSellerOption

      const packageData = {
        ...formData,
        image: imageUrl,
        price: priceOptions[0]?.price || 0,
        cashback: priceOptions[0]?.cashback || 0,
        isBestSeller,
        facilities: formData.facilities.split(',').map(s => s.trim()).filter(Boolean),
        includes: formData.includes.split(',').map(s => s.trim()).filter(Boolean),
        excludes: formData.excludes.split(',').map(s => s.trim()).filter(Boolean),
        priceOptions,
        itinerary
      }

      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      })

      const result = await response.json()

      if (result.success) {
        alert('Paket berhasil ditambahkan!')
        router.push('/admin/packages')
      } else {
        alert('Gagal menambahkan paket')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const addPriceOption = () => {
    setPriceOptions([...priceOptions, {
      name: '',
      price: 0,
      originalPrice: 0,
      cashback: 0,
      hotelMakkah: '',
      hotelMadinah: '',
      description: '',
      isBestSeller: false
    }])
  }

  const removePriceOption = (index: number) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index))
  }

  const addItinerary = () => {
    setItinerary([...itinerary, {
      day: itinerary.length + 1,
      title: '',
      description: ''
    }])
  }

  const removeItinerary = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tambah Paket Umroh</h1>
          <p className="text-gray-600">Tambahkan paket umroh baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Informasi Dasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Nama Paket *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Contoh: Umroh Premium Ramadhan 2025"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Deskripsi *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Deskripsi paket umroh"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Travel *</label>
              <select
                value={formData.travelId}
                onChange={(e) => handleTravelChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Pilih Travel</option>
                {travels.map(travel => (
                  <option key={travel.id} value={travel.id}>
                    {travel.name} {travel.city && `(${travel.city})`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Kota keberangkatan akan otomatis terisi sesuai travel</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="premium">Premium</option>
                <option value="reguler">Reguler</option>
                <option value="hemat">Hemat</option>
                <option value="keluarga">Keluarga</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Gambar Paket</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="imageFile"
                className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    {imageFile ? imageFile.name : 'Klik untuk upload gambar'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WebP (Max 5MB) - Rekomendasi 800x600px</p>
                </div>
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {imagePreview && (
              <div className="relative aspect-video w-full max-w-md border rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label htmlFor="imageUrl" className="text-sm font-medium mb-2 block">Atau masukkan URL gambar</label>
              <Input
                id="imageUrl"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/package.jpg"
              />
            </div>
          </div>
        </Card>

        {/* Departure Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Informasi Keberangkatan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Kota Keberangkatan *</label>
              <Input
                value={formData.departureCity}
                onChange={(e) => setFormData({...formData, departureCity: e.target.value})}
                placeholder="Jakarta"
                required
                disabled={!!formData.travelId}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.travelId ? 'Otomatis terisi dari travel yang dipilih' : 'Pilih travel terlebih dahulu'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Jenis Penerbangan *</label>
              <select
                value={formData.flightType}
                onChange={(e) => setFormData({...formData, flightType: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="langsung">Langsung</option>
                <option value="transit">Transit</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tanggal Keberangkatan *</label>
              <Input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Durasi *</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="12 Hari"
                required
              />
            </div>
          </div>
        </Card>

        {/* Price Options */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Pilihan Paket</h3>
              <p className="text-sm text-gray-500">Harga pilihan pertama akan menjadi harga dasar di card paket</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPriceOption}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pilihan
            </Button>
          </div>
          <div className="space-y-4">
            {priceOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                      Harga Dasar
                    </span>
                  </div>
                )}
                {priceOptions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600"
                    onClick={() => removePriceOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nama Paket *</label>
                    <Input
                      value={option.name}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].name = e.target.value
                        setPriceOptions(newOptions)
                      }}
                      placeholder="Paket Silver"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`bestSeller-${index}`}
                      checked={option.isBestSeller}
                      onCheckedChange={(checked) => {
                        const newOptions = priceOptions.map((opt, i) => ({
                          ...opt,
                          isBestSeller: i === index ? !!checked : false
                        }))
                        setPriceOptions(newOptions)
                      }}
                    />
                    <label htmlFor={`bestSeller-${index}`} className="text-sm font-medium cursor-pointer">
                      Best Seller
                    </label>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Harga Setelah Diskon *</label>
                    <Input
                      type="number"
                      value={option.price}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].price = parseInt(e.target.value)
                        setPriceOptions(newOptions)
                      }}
                      placeholder="35000000"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Harga Coret (Sebelum Diskon)</label>
                    <Input
                      type="number"
                      value={option.originalPrice}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].originalPrice = parseInt(e.target.value)
                        setPriceOptions(newOptions)
                      }}
                      placeholder="40250000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Harga sebelum diskon (akan dicoret)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cashback</label>
                    <Input
                      type="number"
                      value={option.cashback}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].cashback = parseInt(e.target.value)
                        setPriceOptions(newOptions)
                      }}
                      placeholder="1000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cashback yang didapat jamaah</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hotel Makkah *</label>
                    <Input
                      value={option.hotelMakkah}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].hotelMakkah = e.target.value
                        setPriceOptions(newOptions)
                      }}
                      placeholder="Hotel Bintang 4 (500m dari Masjidil Haram)"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hotel Madinah *</label>
                    <Input
                      value={option.hotelMadinah}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].hotelMadinah = e.target.value
                        setPriceOptions(newOptions)
                      }}
                      placeholder="Hotel Bintang 4 (400m dari Masjid Nabawi)"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">Deskripsi Paket</label>
                    <Input
                      value={option.description}
                      onChange={(e) => {
                        const newOptions = [...priceOptions]
                        newOptions[index].description = e.target.value
                        setPriceOptions(newOptions)
                      }}
                      placeholder="Paket standar dengan lokasi strategis"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Itinerary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Itinerary</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItinerary}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Hari
            </Button>
          </div>
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg relative">
                {itinerary.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600"
                    onClick={() => removeItinerary(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Hari ke-{item.day}</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Judul</label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItinerary = [...itinerary]
                        newItinerary[index].title = e.target.value
                        setItinerary(newItinerary)
                      }}
                      placeholder="Keberangkatan Jakarta - Jeddah"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItinerary = [...itinerary]
                        newItinerary[index].description = e.target.value
                        setItinerary(newItinerary)
                      }}
                      placeholder="Berkumpul di bandara dan penerbangan"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Facilities & Includes */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Fasilitas & Termasuk</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fasilitas (pisahkan dengan koma)</label>
              <Textarea
                value={formData.facilities}
                onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                placeholder="Hotel Bintang 5, Transportasi AC, Makan 3x Sehari"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Termasuk dalam Paket (pisahkan dengan koma)</label>
              <Textarea
                value={formData.includes}
                onChange={(e) => setFormData({...formData, includes: e.target.value})}
                placeholder="Tiket pesawat PP, Hotel bintang 5, Makan 3x sehari"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tidak Termasuk (pisahkan dengan koma)</label>
              <Textarea
                value={formData.excludes}
                onChange={(e) => setFormData({...formData, excludes: e.target.value})}
                placeholder="Pengeluaran pribadi, Tips guide & driver"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading || uploading}>
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Mengupload...' : loading ? 'Menyimpan...' : 'Simpan Paket'}
          </Button>
        </div>
      </form>
    </div>
  )
}
