// 后台登录态：JWT cookie + 服务端校验
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const COOKIE_NAME = "bcw_admin_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 天

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET
  if (!s) throw new Error("ADMIN_JWT_SECRET not set")
  return new TextEncoder().encode(s)
}

export async function signAdminToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload.role === "admin"
  } catch {
    return false
  }
}

/** 在 Server Component / API Route 里读 cookie 校验登录态 */
export async function isLoggedIn(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifyAdminToken(token)
}

/** 设置登录 cookie（在 Route Handler 里调用） */
export function setLoginCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export function clearLoginCookie() {
  cookies().delete(COOKIE_NAME)
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME
