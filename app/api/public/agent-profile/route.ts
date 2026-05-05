import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { AgentProfile } from '@/lib/models'

// Public endpoint — no auth required
export async function GET(_req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const doc = await AgentProfile.findOne({ key: 'main' }).lean()
  if (!doc) {
    return NextResponse.json({ profile: null })
  }

  const profile = {
    fullName: (doc as any).fullName || '',
    title: (doc as any).title || 'Loan Expert',
    photoUrl: (doc as any).photoUrl || '',
    bio: (doc as any).bio || '',
    experience: (doc as any).experience || '',
    achievements: (doc as any).achievements || [],
    certifications: (doc as any).certifications || [],
    specializations: (doc as any).specializations || [],
    linkedinUrl: (doc as any).linkedinUrl || '',
    instagramUrl: (doc as any).instagramUrl || '',
    twitterUrl: (doc as any).twitterUrl || '',
    facebookUrl: (doc as any).facebookUrl || '',
    youtubeUrl: (doc as any).youtubeUrl || '',
    personalPhone: (doc as any).personalPhone || '',
    personalEmail: (doc as any).personalEmail || '',
    location: (doc as any).location || '',
  }

  return NextResponse.json({ profile })
}
