import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email dan password wajib diisi'
      }, { status: 400 })
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Email atau password salah'
      }, { status: 401 })
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Email atau password salah'
      }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'Login berhasil'
    })
  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
