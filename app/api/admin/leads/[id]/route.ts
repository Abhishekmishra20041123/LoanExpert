import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Lead } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const LeadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'approved', 'rejected', 'closed']).optional(),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
  contactedDate: z.string().optional(),
  selectedBank: z.string().optional(),
  loanAmount: z.number().finite().optional(),
  income: z.number().finite().optional(),
  employmentType: z.string().optional(),
  cibilScore: z.number().finite().optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = LeadUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const updateData: any = parsed.data

  if (updateData.status === 'contacted' && !updateData.contactedDate) {
    updateData.contactedDate = new Date().toISOString()
  }

  if (updateData.cibilScore === null) updateData.cibilScore = undefined

  const { id } = await params
  const updated = await Lead.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true }
  ).lean()

  if (!updated) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  return NextResponse.json({
    lead: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      city: updated.city,
      loanType: updated.loanType,
      loanAmount: updated.loanAmount,
      income: updated.income,
      employmentType: updated.employmentType,
      cibilScore: updated.cibilScore,
      appliedDate: updated.appliedDate,
      status: updated.status,
      selectedBank: updated.selectedBank,
      notes: updated.notes,
      adminNotes: updated.adminNotes,
      contactedDate: updated.contactedDate,
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
  const deleted = await Lead.deleteOne({ id })
  if (deleted.deletedCount === 0) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

