import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, oldPassword, newPassword } = body

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Semua field wajib diisi'
      }, { status: 400 })
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Password baru minimal 6 karakter'
      }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User tidak ditemukan'
      }, { status: 404 })
    }

    // Verify old password with bcrypt
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isOldPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Password lama salah'
      }, { status: 401 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.user.update({
      where: { email },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah'
    })
  } catch (error) {
    console.error('Change Password Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat mengubah password',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
