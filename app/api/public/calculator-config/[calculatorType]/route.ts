import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { CalculatorConfig } from '@/lib/models'

// Public endpoint — no auth required
// Returns the saved config for a given calculator type, or empty object
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ calculatorType: string }> }
): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const { calculatorType } = await params
  const doc = await CalculatorConfig.findOne({ calculatorType }).lean()
  return NextResponse.json({ config: (doc as any)?.config ?? null })
}
