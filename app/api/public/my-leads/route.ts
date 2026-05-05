import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { Lead } from '@/lib/models'
import { getCustomerEmailFromRequest } from '@/lib/customerSession'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  // Verify customer is logged in
  const customerEmail = await getCustomerEmailFromRequest(req)
  if (!customerEmail) {
    return NextResponse.json({ leads: [] })
  }

  // Fetch leads matching the customer's email
  const leads = await Lead.find({ email: customerEmail })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  return NextResponse.json({
    leads: leads.map((l: any) => ({
      loanType: l.loanType,
      loanAmount: l.loanAmount,
      status: l.status,
      appliedDate: l.appliedDate,
      createdAt: l.createdAt,
      notes: l.notes,
    })),
  })
}
