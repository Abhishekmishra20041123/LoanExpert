import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { EligibilityRule } from '@/lib/models'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ loanType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const { loanType } = await params
  const rule = await EligibilityRule.findOne({ loanType }).lean()
  if (!rule) {
    return NextResponse.json({ eligibilityRule: null }, { status: 404 })
  }

  return NextResponse.json({
    eligibilityRule: {
      loanType: rule.loanType,
      minAge: rule.minAge,
      maxAge: rule.maxAge,
      minIncome: rule.minIncome,
      minCibil: rule.minCibil,
      maxLoanAmount: rule.maxLoanAmount,
      processingTime: rule.processingTime,
    },
  })
}

