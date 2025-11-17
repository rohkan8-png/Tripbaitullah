import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET package by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const packageData = await db.package.findUnique({
      where: { id },
      include: {
        travel: {
          select: {
            id: true,
            name: true,
            rating: true,
            logo: true,
            city: true,
            username: true,
            isVerified: true
          }
        }
      }
    })

    if (!packageData) {
      return NextResponse.json({
        success: false,
        error: 'Package not found'
      }, { status: 404 })
    }

    // Parse JSON fields
    const parsedPackage = {
      ...packageData,
      facilities: packageData.facilities ? JSON.parse(packageData.facilities) : [],
      includes: packageData.includes ? JSON.parse(packageData.includes) : [],
      excludes: packageData.excludes ? JSON.parse(packageData.excludes) : [],
      priceOptions: packageData.priceOptions ? JSON.parse(packageData.priceOptions) : [],
      itinerary: packageData.itinerary ? JSON.parse(packageData.itinerary) : []
    }

    return NextResponse.json({
      success: true,
      data: parsedPackage
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch package'
    }, { status: 500 })
  }
}

// PUT update package by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Calculate lowest price and highest cashback from priceOptions
    let price = body.price || 0
    let originalPrice = body.originalPrice
    let cashback = body.cashback || 0

    if (body.priceOptions && body.priceOptions.length > 0) {
      const lowestPriceOption = body.priceOptions.reduce((min: any, option: any) => 
        option.price < min.price ? option : min
      )
      price = lowestPriceOption.price
      originalPrice = lowestPriceOption.originalPrice

      const highestCashback = Math.max(...body.priceOptions.map((opt: any) => opt.cashback || 0))
      cashback = highestCashback
    }

    // Update package in database
    const updatedPackage = await db.package.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        price,
        originalPrice,
        cashback,
        duration: body.duration,
        departureCity: body.departureCity,
        departureDate: new Date(body.departureDate),
        quota: body.quota || 45,
        quotaAvailable: body.quotaAvailable || body.quota || 45,
        category: body.category || 'reguler',
        flightType: body.flightType || 'langsung',
        isBestSeller: body.isBestSeller || false,
        facilities: JSON.stringify(body.facilities || []),
        includes: JSON.stringify(body.includes || []),
        excludes: JSON.stringify(body.excludes || []),
        priceOptions: JSON.stringify(body.priceOptions || []),
        itinerary: JSON.stringify(body.itinerary || []),
        isActive: body.isActive !== undefined ? body.isActive : true,
        travelId: body.travelId
      },
      include: {
        travel: {
          select: {
            id: true,
            name: true,
            rating: true,
            logo: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Package updated successfully'
    })
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update package'
    }, { status: 500 })
  }
}

// DELETE package by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.package.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete package'
    }, { status: 500 })
  }
}
