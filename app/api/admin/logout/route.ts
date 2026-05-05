import { NextRequest, NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/adminAuth'

export async function POST(req: NextRequest): Promise<NextResponse> {
  return logoutAdmin(req)
}

