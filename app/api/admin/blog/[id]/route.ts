import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { BlogPost } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectMongo()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { title, excerpt, content, category, author, imageUrl, readTime, isPublished } = body as any

  const update: any = { title, excerpt, content, category, author, imageUrl, readTime, isPublished }
  if (isPublished) update.publishedAt = new Date().toISOString()

  const post = await BlogPost.findOneAndUpdate({ id: params.id }, { $set: update }, { new: true })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ post })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectMongo()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  await BlogPost.deleteOne({ id: params.id })
  return NextResponse.json({ ok: true })
}
