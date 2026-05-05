import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { Customer } from '@/lib/models'
import { getCustomerEmailFromRequest } from '@/lib/customerSession'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  const email = await getCustomerEmailFromRequest(req)
  if (!email) {
    return NextResponse.json({ authenticated: false })
  }

  const customer = await Customer.findOne({ email }).select({ name: 1, email: 1, phone: 1, city: 1 }).lean()
  if (!customer) {
    return NextResponse.json({ authenticated: false })
  }

  return NextResponse.json({
    authenticated: true,
    customer: {
      name: (customer as any).name,
      email: (customer as any).email,
      phone: (customer as any).phone,
      city: (customer as any).city,
    },
  })
}
