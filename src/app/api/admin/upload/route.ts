// POST /api/admin/upload  - 客户端直传 Vercel Blob 的签名后端
// 改造原因：Vercel Serverless 请求体硬限制 4.5MB，无法直接上传大视频
// 用 @vercel/blob/client 的 handleUpload，前端拿到 token 后直接 PUT 到 Blob CDN，绕过 4.5MB 限制
// 限制：图片 ≤10MB / 视频 ≤150MB（在 onBeforeGenerateToken 内根据 contentType 校验）
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { isLoggedIn } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const IMG_MAX = 10 * 1024 * 1024
const VID_MAX = 150 * 1024 * 1024

const IMG_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]
const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const ALL_TYPES = [...IMG_TYPES, ...VID_TYPES]

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        _pathname: string,
        clientPayload: string | null
      ) => {
        // 1. 鉴权：必须已登录
        const ok = await isLoggedIn()
        if (!ok) throw new Error("未登录，请重新登录后台")

        // 2. 解析前端传过来的元信息（type / size）以决定大小上限
        let payload: { type?: string; size?: number } = {}
        try {
          if (clientPayload) payload = JSON.parse(clientPayload)
        } catch {}

        const isImg = payload.type ? IMG_TYPES.includes(payload.type) : false
        const isVid = payload.type ? VID_TYPES.includes(payload.type) : false
        if (!isImg && !isVid) {
          throw new Error(`不支持的文件类型: ${payload.type || "未知"}`)
        }
        // 服务端再做一次大小校验（前端已经先校验过一次）
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
        // 客户端上传完成后 Blob 服务回调本接口的钩子；本项目无需写库
        // 注意：本地开发（localhost）下此回调无法触达，仅生产环境会回调
        console.log("upload completed:", blob.url, blob.pathname)
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "upload failed" },
      { status: 400 }
    )
  }
}
