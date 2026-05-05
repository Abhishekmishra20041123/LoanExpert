import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { LoanRate } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const RateUpsertSchema = z.object({
  bankId: z.string().min(1),
  loanType: z.string().min(1),
  interestRate: z.number().finite(),
  processingFee: z.number().finite(),
})

export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = RateUpsertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { bankId, loanType, interestRate, processingFee } = parsed.data

  const updated = await LoanRate.findOneAndUpdate(
    { bankId, loanType },
    { $set: { interestRate, processingFee } },
    { new: true, upsert: true }
  ).lean()

  return NextResponse.json({
    rate: {
      bankId: updated?.bankId || bankId,
      loanType: updated?.loanType || loanType,
      interestRate: updated?.interestRate ?? interestRate,
      processingFee: updated?.processingFee ?? processingFee,
    },
  })
}

