import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Faq } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const faqs = await Faq.find({}).sort({ displayOrder: 1, createdAt: 1 }).lean()
  return NextResponse.json({ faqs })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { question, answer, category, displayOrder, isActive } = body as any

  if (!question?.trim() || !answer?.trim())
    return NextResponse.json({ error: 'question and answer required' }, { status: 400 })

  const count = await Faq.countDocuments()
  const faq = await Faq.create({
    id: randomUUID(),
    question,
    answer,
    category: category || 'General',
    displayOrder: displayOrder ?? count,
    isActive: isActive !== false,
  })

  return NextResponse.json({ faq }, { status: 201 })
}
