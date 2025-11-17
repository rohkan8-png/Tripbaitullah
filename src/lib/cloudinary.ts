import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with explicit checks
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary credentials missing:', {
    cloudName: cloudName ? 'SET' : 'MISSING',
    apiKey: apiKey ? 'SET' : 'MISSING',
    apiSecret: apiSecret ? 'SET' : 'MISSING'
  })
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
})

export default cloudinary

/**
 * Upload file to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Folder name in Cloudinary (e.g., 'avatars', 'packages')
 * @returns Cloudinary upload result with secure_url
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string
) {
  try {
    console.log('Starting upload to Cloudinary...')
    console.log('Folder:', folder)
    console.log('File type:', Buffer.isBuffer(file) ? 'Buffer' : 'String')
    console.log('File size:', Buffer.isBuffer(file) ? file.length : file.length)

    // Convert buffer to base64 data URI
    const base64String = Buffer.isBuffer(file) 
      ? file.toString('base64')
      : file
    
    const dataURI = `data:image/jpeg;base64,${base64String}`

    console.log('Uploading to Cloudinary...')
    
    // Upload without upload_preset (signed upload)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `travel_app/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
      // Don't use upload_preset for signed uploads
    })

    console.log('Upload successful:', result.secure_url)

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return { success: false, error }
  }
}
