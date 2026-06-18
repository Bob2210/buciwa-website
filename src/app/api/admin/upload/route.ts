// POST /api/admin/upload
// 双协议兼容：
//   1. multipart/form-data + file 字段 → 走老版 put()，文件大小受限于 Vercel 4.5MB
//   2. application/json + HandleUploadBody → 走 @vercel/blob/client.handleUpload，前端直传，绕开 4.5MB 限制
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const IMG_MAX = 10 * 1024 * 1024
const VID_MAX = 150 * 1024 * 1024

const IMG_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]
const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const ALL_TYPES = [...IMG_TYPES, ...VID_TYPES]

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || ""

  // —— 协议 A：multipart/form-data（老前端、单文件、≤4.5MB）——
  if (ct.includes("multipart/form-data")) {
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

  // —— 协议 B：application/json（新前端、客户端直传、可上 150MB 视频）——
  try {
    const body = (await req.json()) as HandleUploadBody
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
        console.log("upload completed:", blob.url, blob.pathname)
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "upload failed" }, { status: 400 })
  }
}
