// POST /api/admin/upload  - 上传图片/视频到 Vercel Blob
// 限制：图片 ≤10MB / 视频 ≤150MB
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
// Next.js 默认 body 限制 1MB，需要明确放开
export const maxDuration = 60 // Vercel Hobby 上限

const IMG_MAX = 10 * 1024 * 1024
const VID_MAX = 150 * 1024 * 1024

const IMG_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]
const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "file 必填" }, { status: 400 })
    }
    const isImg = IMG_TYPES.includes(file.type)
    const isVid = VID_TYPES.includes(file.type)
    if (!isImg && !isVid) {
      return NextResponse.json(
        { error: `不支持的文件类型: ${file.type}` },
        { status: 400 }
      )
    }
    if (isImg && file.size > IMG_MAX) {
      return NextResponse.json(
        { error: `图片不能超过 ${IMG_MAX / 1024 / 1024}MB` },
        { status: 400 }
      )
    }
    if (isVid && file.size > VID_MAX) {
      return NextResponse.json(
        { error: `视频不能超过 ${VID_MAX / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // 文件名加时间戳避免重名（Vercel Blob 默认会加随机后缀，但我们前缀加可读时间）
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
    return NextResponse.json(
      { error: e?.message || "upload failed" },
      { status: 500 }
    )
  }
}
