import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET travel by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const travel = await db.travel.findUnique({
      where: {
        id: params.id
      }
    })

    if (!travel) {
      return NextResponse.json({
        success: false,
        error: 'Travel not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: travel
    })
  } catch (error) {
    console.error('Error fetching travel:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch travel'
    }, { status: 500 })
  }
}

// UPDATE travel by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Prepare travel data
    const travelData: any = {
      name: body.name,
      description: body.description,
      logo: body.logo,
      coverImage: body.coverImage,
      address: body.address,
      city: body.city,
      phone: body.phone,
      email: body.email,
      website: body.website,
      rating: body.rating || 0,
      totalReviews: body.totalReviews || 0,
      totalJamaah: body.totalJamaah || 0,
      yearEstablished: body.yearEstablished,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isVerified: body.isVerified !== undefined ? body.isVerified : false
    }

    // Convert arrays to JSON strings
    if (body.licenses) {
      travelData.licenses = JSON.stringify(body.licenses)
    }
    if (body.facilities) {
      travelData.facilities = JSON.stringify(body.facilities)
    }
    if (body.services) {
      travelData.services = JSON.stringify(body.services)
    }
    if (body.gallery) {
      travelData.gallery = JSON.stringify(body.gallery)
    }
    if (body.legalDocs) {
      travelData.legalDocs = JSON.stringify(body.legalDocs)
    }

    // Update travel in database
    const updatedTravel = await db.travel.update({
      where: {
        id: params.id
      },
      data: travelData
    })

    return NextResponse.json({
      success: true,
      data: updatedTravel,
      message: 'Travel updated successfully'
    })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to update travel',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}

// DELETE travel by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if travel exists
    const travel = await db.travel.findUnique({
      where: {
        id: params.id
      },
      include: {
        packages: true,
        articles: true
      }
    })

    if (!travel) {
      return NextResponse.json({
        success: false,
        error: 'Travel not found'
      }, { status: 404 })
    }

    // Check if travel has related packages or articles
    if (travel.packages.length > 0 || travel.articles.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Cannot delete travel. It has ${travel.packages.length} package(s) and ${travel.articles.length} article(s) associated with it. Please delete them first.`
      }, { status: 400 })
    }

    // Delete travel
    await db.travel.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Travel deleted successfully'
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete travel'
    }, { status: 500 })
  }
}
