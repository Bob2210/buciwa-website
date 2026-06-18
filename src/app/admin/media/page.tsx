"use client"
import { useEffect, useState, useRef } from "react"
import { upload } from "@vercel/blob/client"
import AdminNav from "../_components/AdminNav"

interface Blob {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

const IMG_RE = /\.(png|jpg|jpeg|webp|gif|svg)$/i
const VID_RE = /\.(mp4|webm|mov)$/i

function fmtSize(b: number): string {
  if (b < 1024) return b + " B"
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB"
  return (b / 1024 / 1024).toFixed(2) + " MB"
}

export default function MediaPage() {
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  )
  const [filter, setFilter] = useState<"all" | "image" | "video">("all")
  const fileInput = useRef<HTMLInputElement>(null)

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/media")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBlobs(data.blobs || [])
    } catch (e: any) {
      setMsg({ type: "err", text: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleUpload(file: File) {
    setUploading(true)
    setProgress(0)
    setMsg(null)
    try {
      // 1. 前端先做大小/类型校验，避免无谓的请求
      const IMG_TYPES = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ]
      const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
      const isImg = IMG_TYPES.includes(file.type)
      const isVid = VID_TYPES.includes(file.type)
      if (!isImg && !isVid) {
        throw new Error(`不支持的文件类型: ${file.type || "未知"}`)
      }
      const IMG_MAX = 10 * 1024 * 1024
      const VID_MAX = 150 * 1024 * 1024
      if (isImg && file.size > IMG_MAX) {
        throw new Error(
          `图片不能超过 ${IMG_MAX / 1024 / 1024}MB（当前 ${(file.size / 1024 / 1024).toFixed(2)}MB）`
        )
      }
      if (isVid && file.size > VID_MAX) {
        throw new Error(
          `视频不能超过 ${VID_MAX / 1024 / 1024}MB（当前 ${(file.size / 1024 / 1024).toFixed(2)}MB）`
        )
      }

      // 2. 构造 pathname：images/ 或 videos/ + 时间戳 + 安全文件名
      const ts = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const folder = isImg ? "images" : "videos"
      const pathname = `${folder}/${ts}_${safeName}`

      // 3. 用 @vercel/blob/client 直传到 Blob CDN，绕过 Vercel Serverless 4.5MB 请求体限制
      //    onUploadProgress 提供真实上传进度
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type,
        clientPayload: JSON.stringify({ type: file.type, size: file.size }),
        onUploadProgress: (e) => {
          setProgress(Math.round(e.percentage))
        },
      })

      setMsg({
        type: "ok",
        text: `✅ 上传成功！URL：${blob.url}`,
      })
      await refresh()
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "上传失败" })
    } finally {
      setUploading(false)
      setProgress(0)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  async function handleDelete(url: string) {
    if (!confirm(`确定删除这个文件吗？删除后引用它的位置会失效。\n\n${url}`))
      return
    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg({ type: "ok", text: "✅ 已删除" })
      await refresh()
    } catch (e: any) {
      setMsg({ type: "err", text: e.message })
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setMsg({ type: "ok", text: `📋 已复制：${url}` })
  }

  const filtered = blobs.filter((b) => {
    if (filter === "all") return true
    if (filter === "image") return IMG_RE.test(b.pathname)
    if (filter === "video") return VID_RE.test(b.pathname)
    return true
  })

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">媒体管理</h1>
            <p className="text-sm text-gray-500 mt-1">
              上传到 Vercel Blob CDN。图片 ≤10MB，视频 ≤150MB。复制 URL
              后到「文本编辑」粘贴到对应字段
            </p>
          </div>
          <button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
          >
            {uploading ? `上传中 ${progress}%` : "📤 上传新文件"}
          </button>
          <input
            ref={fileInput}
            type="file"
            hidden
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleUpload(f)
            }}
          />
        </div>

        {uploading && (
          <div className="mb-4 bg-white rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-2">
              正在上传… {progress}%
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {msg && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg text-sm break-all ${
              msg.type === "ok"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm transition ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "全部" : f === "image" ? "🖼️ 图片" : "📹 视频"}
            </button>
          ))}
          <span className="text-sm text-gray-500 self-center ml-auto">
            共 {filtered.length} 个文件
          </span>
        </div>

        {loading ? (
          <div className="text-gray-500">加载中…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 border-2 border-dashed border-gray-200">
            还没有文件。点上方「上传新文件」试试 👆
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((b) => {
              const isImg = IMG_RE.test(b.pathname)
              const isVid = VID_RE.test(b.pathname)
              return (
                <div
                  key={b.url}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {isImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.url}
                        alt={b.pathname}
                        className="w-full h-full object-cover"
                      />
                    ) : isVid ? (
                      <video
                        src={b.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <span className="text-gray-300 text-3xl">📄</span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div
                      className="text-xs font-mono text-gray-700 truncate"
                      title={b.pathname}
                    >
                      {b.pathname}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {fmtSize(b.size)} ·{" "}
                      {new Date(b.uploadedAt).toLocaleDateString("zh-CN")}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => copyUrl(b.url)}
                        className="flex-1 px-2 py-1.5 text-xs bg-gray-900 text-white rounded hover:bg-gray-700"
                      >
                        复制 URL
                      </button>
                      <button
                        onClick={() => handleDelete(b.url)}
                        className="px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
