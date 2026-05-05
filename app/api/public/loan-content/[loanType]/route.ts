import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { LoanContent, LoanRate, Bank } from '@/lib/models'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ loanType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  // No need to ensureSeedData here if we trust the admin/config flow has done it, 
  // but for safety on first public hit:
  await ensureSeedData()

  const { loanType } = await params
  const [doc, rates, allBanks] = await Promise.all([
    LoanContent.findOne({ loanType }).lean(),
    LoanRate.find({ loanType }).lean(),
    Bank.find({}).lean()
  ])
  
  if (!doc) return NextResponse.json({ loanContent: null })

  // Map rates to bank names
  const comparisonRates = rates.map(r => {
    const bankDoc = allBanks.find(b => b.id === r.bankId)
    return {
      bankName: bankDoc ? bankDoc.name : 'Other Bank',
      interestRate: r.interestRate
    }
  }).sort((a, b) => a.interestRate - b.interestRate)

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
      comparisonRates: comparisonRates.length > 0 ? comparisonRates : null
    },
  })
}
