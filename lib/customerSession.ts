import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export const CUSTOMER_SESSION_COOKIE = 'customer_token'

export async function getCustomerEmailFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'customer') return null

  return payload.email
}
