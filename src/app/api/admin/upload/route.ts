// POST /api/admin/upload
// 双协议兼容：
//   1. multipart/form-data + file 字段 → 走老版 put()，文件大小受限于 Vercel 4.5MB
//   2. application/json + HandleUploadBody → 走 @vercel/blob/client.handleUpload，前端直传，绕开 4.5MB 限制
//
// 鉴权策略（middleware 已把本路由放白名单，由这里内部校验）：
//   - multipart/form-data       (浏览器发起)        → 必须有 admin cookie
//   - JSON: blob.generate-client-token (浏览器发起) → 必须有 admin cookie
//   - JSON: blob.upload-completed      (Vercel 平台回调，无 cookie) → 放行（Vercel 内部已用 token 校验）
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { jwtVerify } from "jose"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const IMG_MAX = 10 * 1024 * 1024
const VID_MAX = 150 * 1024 * 1024

const IMG_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]
const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const ALL_TYPES = [...IMG_TYPES, ...VID_TYPES]

const COOKIE_NAME = "bcw_admin_token"

function readAdminCookie(req: Request): string | undefined {
  const cookieHeader = req.headers.get("cookie") || ""
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim()
    if (trimmed.startsWith(COOKIE_NAME + "=")) {
      return trimmed.slice(COOKIE_NAME.length + 1)
    }
  }
  return undefined
}

async function verifyAdminFromReq(req: Request): Promise<boolean> {
  const token = readAdminCookie(req)
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

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || ""

  // —— 协议 A：multipart/form-data（浏览器发起，必须 admin）——
  if (ct.includes("multipart/form-data")) {
    if (!(await verifyAdminFromReq(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    try {
      const form = await req.formData()
      const file = form.get("file") as File | null
      if (!file) {
        return NextResponse.json({ error: "file 必填" }, { status: 400 })
      }
      const isImg = IMG_TYPES.includes(file.type)
      const isVid = VID_TYPES.includes(file.type)
      if (!isImg && !isVid) {
        return NextResponse.json({ error: `不支持的文件类型: ${file.type}` }, { status: 400 })
      }
      if (isImg && file.size > IMG_MAX) {
        return NextResponse.json({ error: `图片不能超过 ${IMG_MAX / 1024 / 1024}MB` }, { status: 400 })
      }
      if (isVid && file.size > VID_MAX) {
        return NextResponse.json({ error: `视频不能超过 ${VID_MAX / 1024 / 1024}MB` }, { status: 400 })
      }
      const ts = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const folder = isImg ? "images" : "videos"
      const blob = await put(`${folder}/${ts}_${safeName}`, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
      })
      return NextResponse.json({
        ok: true,
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type,
      })
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || "upload failed" }, { status: 500 })
    }
  }

  // —— 协议 B：application/json（client.upload 直传 + Vercel 平台回调）——
  // 先解析 body 看 type
  let body: HandleUploadBody
  try {
    body = (await req.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "invalid json body" }, { status: 400 })
  }

  // 浏览器侧的"申请 token"必须是已登录 admin；Vercel 平台回调 (upload-completed) 不带 cookie，放行
  if ((body as any)?.type === "blob.generate-client-token") {
    if (!(await verifyAdminFromReq(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname: string, clientPayload: string | null) => {
        let payload: { type?: string; size?: number } = {}
        try {
          if (clientPayload) payload = JSON.parse(clientPayload)
        } catch {}
        const isImg = payload.type ? IMG_TYPES.includes(payload.type) : false
        const isVid = payload.type ? VID_TYPES.includes(payload.type) : false
        if (!isImg && !isVid) {
          throw new Error(`不支持的文件类型: ${payload.type || "未知"}`)
        }
        if (isImg && payload.size && payload.size > IMG_MAX) {
          throw new Error(`图片不能超过 ${IMG_MAX / 1024 / 1024}MB`)
        }
        if (isVid && payload.size && payload.size > VID_MAX) {
          throw new Error(`视频不能超过 ${VID_MAX / 1024 / 1024}MB`)
        }
        const maximumSizeInBytes = isImg ? IMG_MAX : VID_MAX
        return {
          allowedContentTypes: ALL_TYPES,
          maximumSizeInBytes,
          tokenPayload: "",
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // 来自 Vercel Blob 平台的回调，不需要 admin cookie
        console.log("upload completed:", blob.url, blob.pathname)
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "upload failed" }, { status: 400 })
  }
}
