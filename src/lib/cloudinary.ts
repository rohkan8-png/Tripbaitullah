import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder: `travel_app/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }
    )

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
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
