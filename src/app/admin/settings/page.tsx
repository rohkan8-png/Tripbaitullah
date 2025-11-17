'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Upload, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [cities, setCities] = useState('')
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    fetchLogo()
    fetchCities()
  }, [])

  const fetchLogo = async () => {
    try {
      const response = await fetch('/api/settings?key=siteLogo')
      const result = await response.json()
      
      if (result.success && result.data) {
        setLogoUrl(result.data.value)
        setPreviewUrl(result.data.value)
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'siteLogo',
          value: logoUrl
        })
      })

      const result = await response.json()

      if (result.success) {
        setPreviewUrl(logoUrl)
        alert('Logo berhasil diupdate! Halaman akan di-refresh.')
        window.location.reload()
      } else {
        alert('Gagal menyimpan logo: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving logo:', error)
      alert('Gagal menyimpan logo')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadResponse = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResult.success) {
        alert('Gagal upload logo: ' + uploadResult.error)
        return
      }

      // Save the uploaded logo URL to settings
      const saveResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'siteLogo',
          value: uploadResult.url
        })
      })

      const saveResult = await saveResponse.json()

      if (saveResult.success) {
        setLogoUrl(uploadResult.url)
        setPreviewUrl(uploadResult.url)
        setSelectedFile(null)
        alert('Logo berhasil diupload dan disimpan! Halaman akan di-refresh.')
        window.location.reload()
      } else {
        alert('Gagal menyimpan logo: ' + saveResult.error)
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Gagal upload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = async () => {
    if (confirm('Yakin ingin reset logo ke default?')) {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            key: 'siteLogo',
            value: ''
          })
        })

        setLogoUrl('')
        setPreviewUrl('')
        setSelectedFile(null)
        alert('Logo berhasil direset! Halaman akan di-refresh.')
        window.location.reload()
      } catch (error) {
        console.error('Error resetting logo:', error)
        alert('Gagal reset logo')
      }
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/settings?key=departureCities')
      const result = await response.json()
      
      if (result.success && result.data) {
        setCities(result.data.value)
      } else {
        // Set default cities
        setCities('Jakarta, Surabaya, Bandung, Medan, Semarang, Yogyakarta, Makassar, Palembang, Tangerang, Depok, Bekasi, Bogor, Malang, Bali, Balikpapan, Pontianak, Manado, Batam, Pekanbaru, Banjarmasin')
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleSaveCities = async () => {
    setLoadingCities(true)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'departureCities',
          value: cities
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('Daftar kota berhasil disimpan!')
      } else {
        alert('Gagal menyimpan daftar kota: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving cities:', error)
      alert('Gagal menyimpan daftar kota')
    } finally {
      setLoadingCities(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Website</h1>
        <p className="text-gray-600">Kelola pengaturan dan konfigurasi website</p>
      </div>

      {/* Logo Settings */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Logo Website</h2>
            <p className="text-sm text-gray-600">
              Upload atau masukkan URL logo yang akan ditampilkan di header website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              {/* Upload File Section */}
              <div>
                <Label htmlFor="logoFile">Upload Logo</Label>
                <div className="mt-2">
                  <label
                    htmlFor="logoFile"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Klik untuk pilih file'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, SVG (Max 2MB)
                      </p>
                    </div>
                  </label>
                  <input
                    id="logoFile"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Simpan Logo
                    </>
                  )}
                </Button>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">atau</span>
                </div>
              </div>

              {/* URL Input Section */}
              <div>
                <Label htmlFor="logoUrl">URL Logo</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Atau masukkan URL gambar logo
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading || !logoUrl}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan URL
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading || uploading}
                >
                  Reset
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  💡 Tips Upload Logo:
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Gunakan format PNG dengan background transparan</li>
                  <li>• Ukuran rekomendasi: 200x200px atau 1:1 ratio</li>
                  <li>• Maksimal ukuran file: 2MB</li>
                  <li>• Upload langsung dari komputer atau gunakan URL</li>
                </ul>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <Label>Preview Logo</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-lg shadow-md flex items-center justify-center p-4">
                        <img
                          src={previewUrl}
                          alt="Logo Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://ui-avatars.com/api/?name=TB&background=10b981&color=fff&size=128&bold=true'
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Logo Aktif</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Logo ini akan ditampilkan di header website
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-1">Belum ada logo</p>
                    <p className="text-xs text-gray-500">
                      Masukkan URL logo untuk melihat preview
                    </p>
                  </div>
                )}
              </div>

              {/* Current Logo Display */}
              {previewUrl && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Tampilan di Header:</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1">
                      <img
                        src={previewUrl}
                        alt="Header Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Tripbaitullah</p>
                      <p className="text-xs text-gray-500">Temukan paket umroh terbaik</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Departure Cities Settings */}
      <Card className="p-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">Kota Keberangkatan</h2>
          <p className="text-sm text-gray-600 mb-4">
            Kelola daftar kota keberangkatan untuk travel umroh (pisahkan dengan koma)
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cities">Daftar Kota</Label>
              <Input
                id="cities"
                placeholder="Jakarta, Surabaya, Bandung, Medan, Semarang"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Pisahkan setiap kota dengan koma. Kota-kota ini akan muncul sebagai pilihan dropdown saat input data travel.
              </p>
            </div>
            <Button 
              onClick={handleSaveCities}
              disabled={loadingCities}
              className="bg-primary hover:bg-primary/90"
            >
              {loadingCities ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Daftar Kota
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Additional Settings (Placeholder) */}
      <Card className="p-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">Pengaturan Lainnya</h2>
          <p className="text-sm text-gray-600 mb-4">
            Fitur pengaturan tambahan akan segera hadir
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-1">Nama Website</h3>
              <p className="text-sm text-gray-500">Ubah nama website</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-1">Kontak</h3>
              <p className="text-sm text-gray-500">Email dan nomor telepon</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-1">Social Media</h3>
              <p className="text-sm text-gray-500">Link media sosial</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 mb-1">SEO</h3>
              <p className="text-sm text-gray-500">Meta tags dan deskripsi</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
