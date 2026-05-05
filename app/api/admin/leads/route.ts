import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Lead } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const leadsDocs = await Lead.find({}).sort({ appliedDate: -1 }).lean()
  const leads = leadsDocs.map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    city: l.city,
    loanType: l.loanType,
    loanAmount: l.loanAmount,
    income: l.income,
    employmentType: l.employmentType,
    cibilScore: l.cibilScore,
    appliedDate: l.appliedDate,
    status: l.status,
    selectedBank: l.selectedBank,
    notes: l.notes,
    contactedDate: l.contactedDate,
  }))

  return NextResponse.json({ leads })
}

