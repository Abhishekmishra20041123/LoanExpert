import { NextRequest, NextResponse } from 'next/server'
import { connectMongo } from '@/lib/mongo'
import { AdminUser } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest): Promise<NextResponse> {
  await connectMongo()

  const defaultEmail = 'admin@loanexpert.com'
  const defaultPassword = 'admin@123'

  try {
    // Delete any existing admin to be 100% sure we have a clean slate
    await AdminUser.deleteMany({})

    const passwordHash = await bcrypt.hash(defaultPassword, 10)
    await AdminUser.create({
      email: defaultEmail,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return new NextResponse(`
      <div style="font-family: sans-serif; padding: 20px;">
        <h1 style="color: green;">✓ Admin Account Reset Successful!</h1>
        <p><strong>Email:</strong> ${defaultEmail}</p>
        <p><strong>Password:</strong> ${defaultPassword}</p>
        <hr/>
        <a href="/admin/login" style="padding: 10px 20px; background: #2563eb; color: white; border-radius: 5px; text-decoration: none;">Go to Login</a>
      </div>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
