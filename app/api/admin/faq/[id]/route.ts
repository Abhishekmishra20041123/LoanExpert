import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { Faq } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectMongo()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { question, answer, category, displayOrder, isActive } = body as any

  const faq = await Faq.findOneAndUpdate(
    { id: params.id },
    { $set: { question, answer, category, displayOrder, isActive } },
    { new: true }
  )
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ faq })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectMongo()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  await Faq.deleteOne({ id: params.id })
  return NextResponse.json({ ok: true })
}
