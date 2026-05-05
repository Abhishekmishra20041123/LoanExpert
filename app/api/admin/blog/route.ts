import { NextRequest, NextResponse } from 'next/server'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { BlogPost } from '@/lib/models'
import { requireAdmin } from '@/lib/adminAuth'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const auth = await requireAdmin(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => ({}))
  const { title, excerpt, content, category, author, imageUrl, readTime, isPublished } = body as any

  if (!title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) + '-' + Date.now()

  const post = await BlogPost.create({
    id: randomUUID(),
    title,
    slug,
    excerpt: excerpt || '',
    content: content || '',
    category: category || 'General',
    author: author || 'Admin',
    imageUrl: imageUrl || '',
    readTime: readTime || '5 min read',
    isPublished: !!isPublished,
    publishedAt: isPublished ? new Date().toISOString() : '',
  })

  return NextResponse.json({ post }, { status: 201 })
}
