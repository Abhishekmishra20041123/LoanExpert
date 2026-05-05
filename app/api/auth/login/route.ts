import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { Customer } from '@/lib/models'
import { CUSTOMER_SESSION_COOKIE } from '@/lib/customerSession'
import { signToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

const DUMMY_HASH = bcrypt.hashSync('invalid-password', 10)

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  const body = await req.json().catch(() => ({}))
  const { email, password } = body as any

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const emailLower = email.trim().toLowerCase()

  const customer = await Customer.findOne({ email: emailLower }).lean()
  if (!customer) {
    await bcrypt.compare(password, DUMMY_HASH)
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const ok = await bcrypt.compare(password, (customer as any).passwordHash)
  if (!ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = signToken({
    email: (customer as any).email,
    role: 'customer',
    name: (customer as any).name,
  }, '7d')

  const res = NextResponse.json({
    ok: true,
    customer: {
      name: (customer as any).name,
      email: (customer as any).email,
      phone: (customer as any).phone,
      city: (customer as any).city,
    },
  })

  res.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return res
}
