import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { SiteSettings } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const settings = await SiteSettings.findOne({ key: 'main' }).lean()
  return NextResponse.json({ settings: settings || {} })
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { whatsappNumber, contactPhone, contactEmail, siteName, siteContent } = body as any

  const update: Record<string, any> = { key: 'main' }
  if (whatsappNumber !== undefined) update.whatsappNumber = whatsappNumber
  if (contactPhone !== undefined) update.contactPhone = contactPhone
  if (contactEmail !== undefined) update.contactEmail = contactEmail
  if (siteName !== undefined) update.siteName = siteName
  if (siteContent !== undefined) update.siteContent = siteContent

  await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    update,
    { upsert: true, new: true }
  )

  return NextResponse.json({ ok: true })
}
