"use client"
import { useEffect, useState } from "react"
import AdminNav from "../_components/AdminNav"

type SiteData = Record<string, Record<string, string>>

// 各分组的中文标题与排序
type SectionMeta = { key: string; title: string; desc?: string }
const SECTION_META: SectionMeta[] = [
  { key: "hero", title: "首屏 Hero", desc: "网站最顶部的主标语区" },
  { key: "demoVideo", title: "Demo 视频区", desc: "产品演示视频文案" },
  { key: "metrics", title: "数据指标", desc: "首页 6 大数据卡片" },
  { key: "feedbacks", title: "用户反馈", desc: "6 位用户的真实反馈" },
  { key: "endorsement", title: "背书 / 引用" },
  { key: "cta", title: "底部 CTA", desc: "投资 / 合作 / 内测三卡" },
  { key: "footer", title: "Footer 页脚" },
  { key: "media", title: "媒体资源", desc: "图片 / 视频路径（修改建议先去「媒体管理」上传，再把 URL 粘贴到这里）" },
]

// 长文本字段（用 textarea）
const LONG_KEYS = /Content$|Desc$|note$|intro$|tagline$|copyright$|Suffix$|Prefix$/

function fieldLabel(k: string): string {
  // 简单美化：CamelCase → "Camel Case"，并保留中文
  return k.replace(/([a-z])([A-Z0-9])/g, "$1 $2").replace(/^[a-z]/, (s) =>
    s.toUpperCase()
  )
}

export default function TextEditPage() {
  const [data, setData] = useState<SiteData | null>(null)
  const [sha, setSha] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  )

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d.data)
        setSha(d.sha)
      })
      .catch((e) => setMsg({ type: "err", text: e.message }))
      .finally(() => setLoading(false))
  }, [])

  function update(section: string, key: string, value: string) {
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }
    })
  }

  async function handleSave() {
    if (!data || !sha) return
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          sha,
          message: `chore(cms): update site.json from admin (${new Date().toISOString().slice(0, 16)})`,
        }),
      })
      const out = await res.json()
      if (!res.ok) throw new Error(out.error || "保存失败")
      setSha("") // 强制重新拉取最新 sha
      setMsg({
        type: "ok",
        text: `✅ 已提交！commit ${out.commitSha?.slice(0, 7)} → Vercel 自动部署中（约 1-2 分钟生效）`,
      })
      // 拉取最新 sha
      const fresh = await fetch("/api/admin/site").then((r) => r.json())
      if (fresh.sha) setSha(fresh.sha)
    } catch (e: any) {
      setMsg({ type: "err", text: e.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="max-w-6xl mx-auto px-6 py-12 text-gray-500">
          正在从 GitHub 加载最新内容…
        </div>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <AdminNav />
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            加载失败：{msg?.text || "未知错误"}
          </div>
        </div>
      </>
    )
  }

  // 把 SECTION_META 没列出的 section 也补到末尾（兜底）
  const knownKeys = SECTION_META.map((s) => s.key)
  const extraKeys = Object.keys(data).filter((k) => !knownKeys.includes(k))
  const allSections: SectionMeta[] = [
    ...SECTION_META,
    ...extraKeys.map((k) => ({ key: k, title: k })),
  ]

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">文本编辑</h1>
            <p className="text-sm text-gray-500 mt-1">
              修改后点【保存并发布】，约 1-2 分钟后官网 www.buciwa.com 自动更新
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !sha}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
          >
            {saving ? "提交中…" : "💾 保存并发布"}
          </button>
        </div>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm ${
              msg.type === "ok"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="space-y-3">
          {allSections.map((sec, i) => {
            const sectionData = data[sec.key]
            if (!sectionData) return null
            const fields = Object.entries(sectionData)
            return (
              <details
                key={sec.key}
                open={i === 0}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 font-semibold flex items-center justify-between">
                  <span>
                    {sec.title}{" "}
                    <span className="text-xs text-gray-400 font-normal ml-2">
                      ({fields.length} 字段)
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">{sec.key}</span>
                </summary>
                {sec.desc && (
                  <p className="px-5 -mt-1 mb-2 text-xs text-gray-500">
                    {sec.desc}
                  </p>
                )}
                <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(([k, v]) => {
                    const isLong = LONG_KEYS.test(k) || (v && v.length > 60)
                    const isMedia =
                      sec.key === "media" &&
                      typeof v === "string" &&
                      (v.startsWith("http") || v.startsWith("/"))
                    return (
                      <div
                        key={k}
                        className={isLong ? "md:col-span-2" : ""}
                      >
                        <label className="block text-xs font-mono text-gray-500 mb-1">
                          {sec.key}.{k}
                        </label>
                        {isLong ? (
                          <textarea
                            value={v as string}
                            onChange={(e) =>
                              update(sec.key, k, e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 focus:outline-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={v as string}
                            onChange={(e) =>
                              update(sec.key, k, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-green-500 focus:outline-none"
                          />
                        )}
                        {isMedia && v && (
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            {/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(v) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={v}
                                alt=""
                                className="h-10 w-10 object-cover rounded border border-gray-200"
                              />
                            ) : (
                              <span className="text-gray-400">📹 视频</span>
                            )}
                            <a
                              href={v}
                              target="_blank"
                              rel="noopener"
                              className="text-blue-600 hover:underline truncate"
                            >
                              预览
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </details>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            disabled={saving || !sha}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
          >
            {saving ? "提交中…" : "💾 保存并发布"}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            每次保存会向 GitHub 提交一次 commit，自动触发 Vercel 部署
          </p>
        </div>
      </div>
    </>
  )
}
