import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { AdminUser } from '@/lib/models'
import { requireAdmin, ADMIN_SESSION_COOKIE } from '@/lib/adminAuth'
import { signToken } from '@/lib/jwt'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const admin = await AdminUser.findOne({ email: auth.adminEmail }).lean()
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

  return NextResponse.json({
    authenticated: true,
    email: (admin as any).email,
    fullName: (admin as any).fullName || '',
    phone: (admin as any).phone || '',
  })

}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { fullName, phone, email } = body as { fullName?: string; phone?: string; email?: string }

  // Check if trying to change email to one that already exists (for a different user, though there's only one admin currently)
  if (email && email.toLowerCase() !== auth.adminEmail.toLowerCase()) {
    const existing = await AdminUser.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }
  }

  const updatedAdmin = await AdminUser.findOneAndUpdate(
    { email: auth.adminEmail },
    { $set: { 
        fullName: fullName ?? '', 
        phone: phone ?? '', 
        email: email ? email.toLowerCase() : auth.adminEmail,
        updatedAt: new Date() 
      } 
    },
    { new: true }
  ).lean()

  if (!updatedAdmin) {
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true, email: (updatedAdmin as any).email })

  // If email was changed, we MUST update the JWT cookie because our auth logic depends on the email in the payload
  if (email && email.toLowerCase() !== auth.adminEmail.toLowerCase()) {
    const token = signToken({ email: (updatedAdmin as any).email, role: 'admin' }, '7d')
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
  }

  return res
}
