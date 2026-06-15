// 守 /admin/* 路由：未登录跳 /admin/login
// （Edge runtime 用 jose 校验 JWT，不能用 cookies() helper）
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "bcw_admin_token"

async function isLoggedIn(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) return false
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )
    return payload.role === "admin"
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 登录页 + 登录 API 不守
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login"
  ) {
    return NextResponse.next()
  }

  // 守 /admin/* 和 /api/admin/*
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    const ok = await isLoggedIn(token)
    if (!ok) {
      // 未登录：UI 跳转到登录页，API 返 401
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }
      const url = req.nextUrl.clone()
      url.pathname = "/admin/login"
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
