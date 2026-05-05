import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_change_in_production'

export type JwtPayload = {
  email: string
  role: 'admin' | 'customer'
  name?: string
}

export function signToken(payload: JwtPayload, expiresIn: string = '7d'): string {
  // @ts-ignore - expiresIn type mismatch with jwt.SignOptions
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}


export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch {
    return null
  }
}
