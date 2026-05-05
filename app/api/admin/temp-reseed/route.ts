import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { LoanContent } from '@/lib/models'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await LoanContent.deleteMany({})
  await ensureSeedData()
  return NextResponse.json({ success: true, message: 'LoanContent re-seeded with 100% matched detail logic' })
}
