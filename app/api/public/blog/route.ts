import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { BlogPost } from '@/lib/models'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  const posts = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ posts })
}
