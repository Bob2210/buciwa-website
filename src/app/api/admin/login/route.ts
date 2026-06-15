// POST /api/admin/login
// body: { password: string }
import { NextResponse } from "next/server"
import { signAdminToken, setLoginCookie } from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD not configured" },
        { status: 500 }
      )
    }
    if (password !== expected) {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      )
    }
    const token = await signAdminToken()
    setLoginCookie(token)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "login failed" },
      { status: 500 }
    )
  }
}
