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

interface UploadItem {
  id: string
  file: File
  status: "pending" | "uploading" | "ok" | "err"
  progress: number
  url?: string
  error?: string
}

const IMG_RE = /\.(png|jpg|jpeg|webp|gif|svg)$/i
const VID_RE = /\.(mp4|webm|mov)$/i

const IMG_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]
const VID_TYPES = ["video/mp4", "video/webm", "video/quicktime"]
const IMG_MAX = 10 * 1024 * 1024
const VID_MAX = 150 * 1024 * 1024

function fmtSize(b: number): string {
  if (b < 1024) return b + " B"
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB"
  return (b / 1024 / 1024).toFixed(2) + " MB"
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export default function MediaPage() {
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [loading, setLoading] = useState(true)
  const [queue, setQueue] = useState<UploadItem[]>([])
  const [uploading, setUploading] = useState(false)
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

  // 单文件直传，使用 @vercel/blob/client.upload，绕开 4.5MB Serverless body 限制
  async function uploadOne(
    file: File,
    onProgress: (p: number) => void
  ): Promise<{ url: string }> {
    const isImg = IMG_TYPES.includes(file.type)
    const isVid = VID_TYPES.includes(file.type)
    if (!isImg && !isVid) {
      throw new Error(`不支持的文件类型: ${file.type || "未知"}`)
    }
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
    const ts = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const folder = isImg ? "images" : "videos"
    const pathname = `${folder}/${ts}_${safeName}`
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      contentType: file.type,
      clientPayload: JSON.stringify({ type: file.type, size: file.size }),
      onUploadProgress: (e) => {
        onProgress(Math.round(e.percentage))
      },
    })
    return { url: blob.url }
  }

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files)
    if (arr.length === 0) return
    setMsg(null)
    const items: UploadItem[] = arr.map((f) => ({
      id: uid(),
      file: f,
      status: "pending",
      progress: 0,
    }))
    setQueue((q) => [...q, ...items])
    setUploading(true)

    let okCount = 0
    let errCount = 0

    // 顺序上传，避免并发把后端冲爆
    for (const item of items) {
      setQueue((q) =>
        q.map((it) => (it.id === item.id ? { ...it, status: "uploading" } : it))
      )
      try {
        const result = await uploadOne(item.file, (p) => {
          setQueue((q) =>
            q.map((it) => (it.id === item.id ? { ...it, progress: p } : it))
          )
        })
        setQueue((q) =>
          q.map((it) =>
            it.id === item.id
              ? { ...it, status: "ok", progress: 100, url: result.url }
              : it
          )
        )
        okCount++
      } catch (e: any) {
        setQueue((q) =>
          q.map((it) =>
            it.id === item.id
              ? { ...it, status: "err", error: e?.message || "失败" }
              : it
          )
        )
        errCount++
      }
    }

    setUploading(false)
    setMsg({
      type: errCount === 0 ? "ok" : "err",
      text:
        errCount === 0
          ? `✅ ${okCount} 个文件全部上传成功`
          : `⚠️ 完成：成功 ${okCount} · 失败 ${errCount}`,
    })
    await refresh()
    if (fileInput.current) fileInput.current.value = ""
  }

  function clearQueue() {
    setQueue([])
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

  const queueDoneCount = queue.filter((q) => q.status === "ok" || q.status === "err").length
  const queueTotal = queue.length

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">媒体管理</h1>
            <p className="text-sm text-gray-500 mt-1">
              上传到 Vercel Blob CDN（客户端直传，绕过 4.5MB 网关限制）。图片 ≤10MB，视频 ≤150MB。支持一次选多张文件。
              复制 URL 后到「文本编辑」粘贴到对应字段
            </p>
          </div>
          <button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
          >
            {uploading
              ? `上传中 ${queueDoneCount}/${queueTotal}`
              : "📤 上传文件（可多选）"}
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              const f = e.target.files
              if (f && f.length > 0) handleFiles(f)
            }}
          />
        </div>

        {/* 上传队列 */}
        {queue.length > 0 && (
          <div className="mb-4 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">
                上传队列：{queueDoneCount}/{queueTotal}
                {uploading && <span className="text-gray-400 ml-2">（顺序上传中…）</span>}
              </div>
              {!uploading && (
                <button
                  onClick={clearQueue}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  清空记录
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {queue.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 text-xs border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="w-6 text-center">
                    {it.status === "pending" && <span className="text-gray-300">⌛</span>}
                    {it.status === "uploading" && <span className="text-blue-500">⏳</span>}
                    {it.status === "ok" && <span className="text-green-600">✅</span>}
                    {it.status === "err" && <span className="text-red-500">❌</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono truncate text-gray-700">
                        {it.file.name}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        {fmtSize(it.file.size)}
                      </span>
                    </div>
                    {it.status === "uploading" && (
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${it.progress}%` }}
                        />
                      </div>
                    )}
                    {it.status === "err" && (
                      <div className="text-red-500 mt-0.5">{it.error}</div>
                    )}
                    {it.status === "ok" && it.url && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-400 truncate">{it.url}</span>
                        <button
                          onClick={() => copyUrl(it.url!)}
                          className="text-blue-600 hover:underline shrink-0"
                        >
                          复制
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 shrink-0 w-10 text-right">
                    {it.status === "uploading" ? `${it.progress}%` : ""}
                  </div>
                </div>
              ))}
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
            还没有文件。点上方「上传文件」试试 👆
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
