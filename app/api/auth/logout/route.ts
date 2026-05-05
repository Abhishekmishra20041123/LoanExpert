import { NextRequest, NextResponse } from 'next/server'
import { CUSTOMER_SESSION_COOKIE } from '@/lib/customerSession'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(CUSTOMER_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return res
}
