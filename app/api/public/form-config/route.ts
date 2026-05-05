import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { FormConfig } from '@/lib/models'

// Public endpoint — returns custom fields for a specific form
export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const formId = req.nextUrl.searchParams.get('formId')
  if (!formId) {
    return NextResponse.json({ fields: [] })
  }

  const config = await FormConfig.findOne({ formId }).lean()
  return NextResponse.json({ fields: (config as any)?.fields || [] })
}
