// POST /api/admin/logout
import { NextResponse } from "next/server"
import { clearLoginCookie } from "@/lib/admin-auth"

export const runtime = "nodejs"

export async function POST() {
  clearLoginCookie()
  return NextResponse.json({ ok: true })
}
