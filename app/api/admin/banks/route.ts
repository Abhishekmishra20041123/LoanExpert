import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Bank, LoanRate } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'
import { LOAN_TYPES } from '@/lib/constants'

const RateItemSchema = z.object({
  loanType: z.string(),
  interestRate: z.number().min(0),
  processingFee: z.number().min(0),
})

const BankCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  logo: z.string().optional().default('🏦'),
  contactPerson: z.string().optional().default(''),
  initialRates: z.array(RateItemSchema).optional(),
})

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const banksDocs = await Bank.find({}).sort({ createdAt: -1 }).lean()
  const banks = banksDocs.map(b => ({
    id: b.id,
    name: b.name,
    logo: b.logo,
    contactPerson: b.contactPerson,
  }))

  return NextResponse.json({ banks })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = BankCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const bankId = data.id || randomUUID()

  const created = await Bank.create({
    id: bankId,
    name: data.name,
    logo: data.logo,
    contactPerson: data.contactPerson,
  })

  // Insert initial rates if provided
  if (data.initialRates && data.initialRates.length > 0) {
    const rateDocs = data.initialRates.map(r => ({
      bankId,
      loanType: r.loanType,
      interestRate: r.interestRate,
      processingFee: r.processingFee,
    }))

    await LoanRate.insertMany(rateDocs, { ordered: false }).catch(() => {
      // Ignore duplicate key errors silently
    })
  } else {
    // Auto-create default rates for all loan types
    const defaultRates = LOAN_TYPES.map(lt => ({
      bankId,
      loanType: lt.id,
      interestRate: 10.0,
      processingFee: 1.0,
    }))
    await LoanRate.insertMany(defaultRates, { ordered: false }).catch(() => {})
  }

  return NextResponse.json({
    bank: {
      id: created.id,
      name: created.name,
      logo: created.logo,
      contactPerson: created.contactPerson,
    },
  })
}
