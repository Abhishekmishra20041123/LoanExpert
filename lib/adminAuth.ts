import { NextRequest, NextResponse } from 'next/server'
import { AdminUser } from '@/lib/models'
import bcrypt from 'bcryptjs'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { ADMIN_CREDENTIALS } from '@/lib/constants'
import { signToken, verifyToken } from '@/lib/jwt'

export const ADMIN_SESSION_COOKIE = 'admin_token'

const DUMMY_PASSWORD_HASH = bcrypt.hashSync('invalid-password', 10)

export async function getAdminEmailFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null

  return payload.email
}

export async function requireAdmin(req: NextRequest): Promise<{ adminEmail: string } | NextResponse> {
  const adminEmail = await getAdminEmailFromRequest(req)
  if (!adminEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return { adminEmail }
}

export async function loginAdmin(req: NextRequest, providedBody?: any): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  console.log('[DEBUG-AUTH] loginAdmin called, providedBody:', providedBody ? 'YES' : 'NO')
  console.log('[DEBUG-AUTH] Body content:', JSON.stringify(providedBody))
  
  const body = providedBody || await req.json().catch(() => ({}))
  const email = (body as any).email?.trim().toLowerCase()
  const password = (body as any).password


  const admin = await AdminUser.findOne({ email }).lean()
  console.log('[DEBUG] Login attempt for:', email)
  
  if (!admin) {
    console.log('[DEBUG] Admin user NOT found in DB search')
    await bcrypt.compare(password || '', DUMMY_PASSWORD_HASH)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }


  const ok = await bcrypt.compare(password || '', (admin as any).passwordHash)
  console.log('[DEBUG] Password match result:', ok)

  if (!ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }



  const token = signToken({ email: (admin as any).email, role: 'admin' }, '7d')

  const res = NextResponse.json({ ok: true, email: (admin as any).email })
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return res
}

export async function logoutAdmin(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return res
}
