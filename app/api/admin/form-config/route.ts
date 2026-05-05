import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { FormConfig } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

// GET — fetch all form configs
export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const configs = await FormConfig.find({}).lean()
  return NextResponse.json({ configs })
}

// PUT — save form config for a specific formId
export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { formId, fields } = body as any

  if (!formId) {
    return NextResponse.json({ error: 'formId is required' }, { status: 400 })
  }

  await FormConfig.findOneAndUpdate(
    { formId },
    { formId, fields: fields || [] },
    { upsert: true, new: true }
  )

  return NextResponse.json({ ok: true })
}
