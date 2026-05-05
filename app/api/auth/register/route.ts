import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { Customer } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  const body = await req.json().catch(() => ({}))
  const { name, email, phone, city, password } = body as any

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }

  const emailLower = email.trim().toLowerCase()

  // Check if email already exists
  const exists = await Customer.findOne({ email: emailLower }).lean()
  if (exists) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await Customer.create({
    name: name.trim(),
    email: emailLower,
    phone: phone?.trim() || '',
    city: city?.trim() || '',
    passwordHash,
  })

  return NextResponse.json({ ok: true })
}
