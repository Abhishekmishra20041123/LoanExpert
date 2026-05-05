import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { connectMongo, ensureSeedData } from '@/lib/mongo'
import { Lead } from '@/lib/models'

const LeadCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  city: z.string().optional().default(''),
  loanType: z.string().min(1),
  loanAmount: z.number().finite(),
  income: z.number().finite().optional().default(0),
  employmentType: z.string().optional().default('salaried'),
  cibilScore: z.number().finite().optional().nullable(),
  appliedDate: z.string().optional(),
  notes: z.string().optional().default('Submitted via contact form'),
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  await connectMongo()
  await ensureSeedData()

  const body = await req.json().catch(() => ({}))
  const parsed = LeadCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const now = new Date().toISOString()

  const created = await Lead.create({
    id: parsed.data.id || randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city || '',
    loanType: parsed.data.loanType,
    loanAmount: parsed.data.loanAmount,
    income: parsed.data.income ?? 0,
    employmentType: parsed.data.employmentType || 'salaried',
    cibilScore: parsed.data.cibilScore == null ? undefined : parsed.data.cibilScore,
    appliedDate: parsed.data.appliedDate || now,
    status: 'new',
    notes: parsed.data.notes || 'Submitted via contact form',
  })

  return NextResponse.json({
    lead: {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      city: created.city,
      loanType: created.loanType,
      loanAmount: created.loanAmount,
      income: created.income,
      employmentType: created.employmentType,
      cibilScore: created.cibilScore,
      appliedDate: created.appliedDate,
      status: created.status,
      selectedBank: created.selectedBank,
      notes: created.notes,
      contactedDate: created.contactedDate,
    },
  })
}

