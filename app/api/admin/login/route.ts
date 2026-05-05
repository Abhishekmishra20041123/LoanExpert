import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ensureSeedData } from '@/lib/mongo'
import { loginAdmin } from '@/lib/adminAuth'

const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  await ensureSeedData()

  const body = await req.json().catch(() => ({}))
  console.log('[DEBUG-ROUTE] Body received:', JSON.stringify(body))
  
  const parsed = LoginBodySchema.safeParse(body)
  if (!parsed.success) {
    console.log('[DEBUG-ROUTE] Zod parse FAILED:', parsed.error.format())
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  console.log('[DEBUG-ROUTE] Zod parse SUCCESS, passing to loginAdmin')
  return loginAdmin(req, parsed.data)


}

