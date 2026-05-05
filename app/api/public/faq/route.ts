import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Faq } from '@/lib/models'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()
  const faqs = await Faq.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 }).lean()
  return NextResponse.json({ faqs })
}
