import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, youtubeUrl, videoId, thumbnail, isActive } = body
    const id = params.id

    if (!title || !youtubeUrl || !videoId) {
      return NextResponse.json(
        { success: false, error: 'Title, YouTube URL, and Video ID are required' },
        { status: 400 }
      )
    }

    const video = await prisma.video.update({
      where: { id },
      data: {
        title,
        description: description || '',
        youtubeUrl,
        videoId,
        thumbnail: thumbnail || '',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      data: video
    })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update video' },
      { status: 500 }
    )
  }
}
