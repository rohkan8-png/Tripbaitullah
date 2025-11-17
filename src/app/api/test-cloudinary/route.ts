import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : undefined,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
    }

    // Try to ping Cloudinary
    const result = await cloudinary.api.ping()

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      config,
      ping: result
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
        api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || 'NOT SET'
      }
    }, { status: 500 })
  }
}
