import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { SiteSettings } from '@/lib/models'

// Public endpoint — no auth required
export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    await connectMongo()
    await ensureSeedData()

    const doc = await SiteSettings.findOne({ key: 'main' }).lean()
    if (!doc) {
      return NextResponse.json({ settings: null })
    }

    const settings = {
      whatsappNumber: (doc as any).whatsappNumber || '',
      contactPhone: (doc as any).contactPhone || '',
      contactEmail: (doc as any).contactEmail || '',
      siteName: (doc as any).siteName || 'LoanExpert',
      siteContent: (doc as any).siteContent || {},
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[ERROR] /api/public/site-settings failed:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
