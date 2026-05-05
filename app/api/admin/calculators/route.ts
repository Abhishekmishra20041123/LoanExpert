import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { CalculatorConfig } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const docs = await CalculatorConfig.find({}).lean()
  const configs: Record<string, any> = {}
  for (const d of docs) {
    configs[(d as any).calculatorType] = (d as any).config
  }
  return NextResponse.json({ configs })
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { calculatorType, config } = body as { calculatorType: string; config: any }

  if (!calculatorType) return NextResponse.json({ error: 'calculatorType required' }, { status: 400 })

  await CalculatorConfig.findOneAndUpdate(
    { calculatorType },
    { calculatorType, config, updatedBy: auth.adminEmail },
    { upsert: true, new: true }
  )

  return NextResponse.json({ ok: true })
}
