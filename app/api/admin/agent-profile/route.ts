import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { AgentProfile } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const profile = await AgentProfile.findOne({ key: 'main' }).lean()
  return NextResponse.json({ profile: profile || {} })
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))

  const update: Record<string, any> = { key: 'main' }
  const fields = [
    'fullName', 'title', 'photoUrl', 'bio', 'experience',
    'achievements', 'certifications', 'specializations',
    'linkedinUrl', 'instagramUrl', 'twitterUrl', 'facebookUrl', 'youtubeUrl',
    'personalPhone', 'personalEmail', 'location',
  ]

  for (const f of fields) {
    if ((body as any)[f] !== undefined) update[f] = (body as any)[f]
  }

  await AgentProfile.findOneAndUpdate(
    { key: 'main' },
    update,
    { upsert: true, new: true }
  )

  return NextResponse.json({ ok: true })
}
