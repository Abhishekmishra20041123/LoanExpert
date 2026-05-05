import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { EligibilityRule } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const EligibilityUpdateSchema = z
  .object({
    minAge: z.number().finite().optional(),
    maxAge: z.number().finite().optional(),
    minIncome: z.number().finite().optional(),
    minCibil: z.number().finite().optional(),
    maxLoanAmount: z.number().finite().optional(),
    processingTime: z.string().optional(),
  })
  .refine(v => Object.keys(v).length > 0, { message: 'No fields provided' })

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ loanType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { loanType } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = EligibilityUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await EligibilityRule.findOneAndUpdate(
    { loanType },
    { $set: parsed.data },
    { new: true, upsert: true }
  ).lean()

  if (!updated) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  return NextResponse.json({ rule: updated })
}

