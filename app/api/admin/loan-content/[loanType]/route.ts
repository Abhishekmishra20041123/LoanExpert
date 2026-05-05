import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { LoanContent } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

const LoanContentUpdateSchema = z.object({
  overview: z.string().optional(),
  keyBenefits: z.array(z.string()).optional(),
  eligibilityCriteria: z.array(z.string()).optional(),
  requiredDocuments: z.array(z.string()).optional(),
  processingTime: z.string().optional(),
  interestRates: z.string().optional(),
  maxLoanAmount: z.string().optional(),
  tenureRange: z.string().optional(),
  schemes: z.array(z.object({ name: z.string(), detail: z.string() })).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ loanType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const { loanType } = await params
  const doc = await LoanContent.findOne({ loanType }).lean()
  if (!doc) return NextResponse.json({ loanContent: null })

  return NextResponse.json({
    loanContent: {
      loanType: doc.loanType,
      overview: doc.overview,
      keyBenefits: doc.keyBenefits,
      eligibilityCriteria: doc.eligibilityCriteria,
      requiredDocuments: doc.requiredDocuments,
      processingTime: doc.processingTime,
      interestRates: doc.interestRates,
      maxLoanAmount: doc.maxLoanAmount,
      tenureRange: doc.tenureRange,
      schemes: doc.schemes || [],
      lastUpdated: doc.lastUpdated,
      updatedBy: doc.updatedBy,
    },
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ loanType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const parsed = LoanContentUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { loanType } = await params
  const updated = await LoanContent.findOneAndUpdate(
    { loanType },
    {
      $set: {
        overview: parsed.data.overview ?? '',
        keyBenefits: parsed.data.keyBenefits ?? [],
        eligibilityCriteria: parsed.data.eligibilityCriteria ?? [],
        requiredDocuments: parsed.data.requiredDocuments ?? [],
        processingTime: parsed.data.processingTime ?? '',
        interestRates: parsed.data.interestRates ?? '',
        maxLoanAmount: parsed.data.maxLoanAmount ?? '',
        tenureRange: parsed.data.tenureRange ?? '',
        schemes: parsed.data.schemes ?? [],
        lastUpdated: now,
        updatedBy: auth.adminEmail,
      },
    },
    { new: true, upsert: true }
  ).lean()

  return NextResponse.json({ loanContent: updated })
}

