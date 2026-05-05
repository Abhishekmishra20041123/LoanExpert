import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Bank, LoanRate, Lead } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const BankUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().optional(),
  contactPerson: z.string().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = BankUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = await params
  const updated = await Bank.findOneAndUpdate(
    { id },
    { $set: parsed.data },
    { new: true }
  ).lean()

  if (!updated) return NextResponse.json({ error: 'Bank not found' }, { status: 404 })

  return NextResponse.json({
    bank: {
      id: updated.id,
      name: updated.name,
      logo: updated.logo,
      contactPerson: updated.contactPerson,
    },
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const deleted = await Bank.deleteOne({ id })
  if (deleted.deletedCount === 0) return NextResponse.json({ error: 'Bank not found' }, { status: 404 })

  await LoanRate.deleteMany({ bankId: id }).catch(() => {})
  await Lead.updateMany({ selectedBank: id }, { $unset: { selectedBank: '' } }).catch(() => {})

  return NextResponse.json({ ok: true })
}

