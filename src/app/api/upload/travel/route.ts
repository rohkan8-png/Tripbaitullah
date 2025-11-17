import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'logo' or 'cover'
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file uploaded'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type'
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Max 10MB'
      }, { status: 400 })
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary with appropriate folder
    const folder = type === 'cover' ? 'travel_covers' : 'travel_logos'
    const result = await uploadToCloudinary(buffer, folder)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId
    })
  } catch (error) {
    console.error('Error uploading travel image:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image'
    }, { status: 500 })
  }
}
