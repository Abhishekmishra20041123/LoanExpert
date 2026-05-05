import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { AdminUser } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
})

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = PasswordChangeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const admin = await AdminUser.findOne({ email: auth.adminEmail })
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

  const ok = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash)
  if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10)
  admin.passwordHash = newHash
  admin.updatedAt = new Date()
  await admin.save()

  return NextResponse.json({ ok: true })
}

