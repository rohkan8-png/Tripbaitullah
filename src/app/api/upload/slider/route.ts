import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file uploaded'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, and WebP allowed.'
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: 'File too large. Maximum 10MB.'
      }, { status: 400 })
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, 'sliders')

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to upload to cloud storage',
        error: result.error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.url,
      publicId: result.publicId
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to upload file',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
