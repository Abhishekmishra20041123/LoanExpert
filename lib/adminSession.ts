import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export const ADMIN_SESSION_COOKIE = 'admin_token'

export async function getAdminEmailFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null

  return payload.email
}
