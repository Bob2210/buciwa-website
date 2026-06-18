"use client"
import { useEffect, useState } from "react"
import AdminNav from "../_components/AdminNav"

type SiteData = Record<string, Record<string, string>>

type SectionMeta = { key: string; title: string; desc?: string }
const SECTION_META: SectionMeta[] = [
  { key: "hero", title: "首屏 Hero", desc: "网站最顶部的主标语区" },
  { key: "product", title: "产品介绍", desc: "4 个核心功能（每个功能 2 张手机截图）" },
  { key: "overview", title: "产品总览视频", desc: "产品介绍后的整体演示视频" },
  { key: "featureVideos", title: "分功能演示视频", desc: "4 个分功能视频（AI 生成 / 学习 / 复习 / 随身听）" },
  { key: "metrics", title: "数据指标", desc: "内测板块顶部 6 大数据卡片" },
  { key: "endorsement", title: "媒体背书 / 引用" },
  { key: "cta", title: "底部联系我们", desc: "投资 / 合作 / 内测 三卡" },
  { key: "footer", title: "Footer 页脚" },
  {
    key: "media",
    title: "🖼️ 媒体资源（图片 / 视频）",
    desc: "网站所有图片视频的入口。请先去『媒体管理』上传文件复制 URL，再粘到这里对应字段",
  },
]

const LONG_KEYS = /Content$|Desc$|note$|intro$|tagline$|copyright$|Suffix$|Prefix$/

type MediaInfo = {
  label: string
  location: string
  anchor: string
  group: string
  pair?: string
}
const MEDIA_INFO: Record<string, MediaInfo> = {
  logo: {
    label: "网站 Logo",
    location: "导航栏左上角 + 浏览器标签 favicon",
    anchor: "/",
    group: "🏷️ 品牌 & 首屏",
  },
  heroImage: {
    label: "首屏吉祥物",
    location: "首屏 Hero 中心 battle window 内的青蛙形象",
    anchor: "/#hero",
    group: "🏷️ 品牌 & 首屏",
  },
  productImg1a: {
    label: "功能①「AI 视觉化生成」- 左侧手机框",
    location: "产品介绍区 → 第 1 个卡片 → 左边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg1b",
  },
  productImg1b: {
    label: "功能①「AI 视觉化生成」- 右侧手机框",
    location: "产品介绍区 → 第 1 个卡片 → 右边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg1a",
  },
  productImg2a: {
    label: "功能②「结构化学习路径」- 左侧手机框",
    location: "产品介绍区 → 第 2 个卡片 → 左边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg2b",
  },
  productImg2b: {
    label: "功能②「结构化学习路径」- 右侧手机框",
    location: "产品介绍区 → 第 2 个卡片 → 右边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg2a",
  },
  productImg3a: {
    label: "功能③「自适应复习引擎」- 左侧手机框",
    location: "产品介绍区 → 第 3 个卡片 → 左边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg3b",
  },
  productImg3b: {
    label: "功能③「自适应复习引擎」- 右侧手机框",
    location: "产品介绍区 → 第 3 个卡片 → 右边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg3a",
  },
  productImg4a: {
    label: "功能④「随身听沉浸输入」- 左侧手机框",
    location: "产品介绍区 → 第 4 个卡片 → 左边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg4b",
  },
  productImg4b: {
    label: "功能④「随身听沉浸输入」- 右侧手机框",
    location: "产品介绍区 → 第 4 个卡片 → 右边那张手机截图",
    anchor: "/#product",
    group: "📱 产品介绍区（8 张手机截图）",
    pair: "productImg4a",
  },
  overviewVideo: {
    label: "产品总览视频",
    location: "产品介绍下方，整页中心的 16:9 大视频框",
    anchor: "/#overview-video",
    group: "🎬 视频",
  },
  featureVideo1: {
    label: "分功能演示① — AI 视觉化生成",
    location: "分功能视频区 → 左上格",
    anchor: "/#feature-videos",
    group: "🎬 视频",
  },
  featureVideo2: {
    label: "分功能演示② — 结构化学习",
    location: "分功能视频区 → 右上格",
    anchor: "/#feature-videos",
    group: "🎬 视频",
  },
  featureVideo3: {
    label: "分功能演示③ — 自适应复习",
    location: "分功能视频区 → 左下格",
    anchor: "/#feature-videos",
    group: "🎬 视频",
  },
  featureVideo4: {
    label: "分功能演示④ — 随身听",
    location: "分功能视频区 → 右下格",
    anchor: "/#feature-videos",
    group: "🎬 视频",
  },
}

const MEDIA_GROUP_ORDER = [
  "🏷️ 品牌 & 首屏",
  "📱 产品介绍区（8 张手机截图）",
  "🎬 视频",
]

const IMG_RE = /\.(png|jpg|jpeg|webp|gif|svg)$/i
const VID_RE = /\.(mp4|webm|mov)$/i

function fieldLabel(k: string): string {
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
      setSha("")
      setMsg({
        type: "ok",
        text: `✅ 已提交！commit ${out.commitSha?.slice(0, 7)} → Vercel 自动部署中（约 1-2 分钟生效）`,
      })
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

  const knownKeys = SECTION_META.map((s) => s.key)
  const extraKeys = Object.keys(data).filter((k) => !knownKeys.includes(k))
  const allSections: SectionMeta[] = [
    ...SECTION_META,
    ...extraKeys.map((k) => ({ key: k, title: k })),
  ]

  function renderMediaField(k: string, v: string) {
    const info = MEDIA_INFO[k]
    const isImg = v && IMG_RE.test(v)
    const isVid = v && VID_RE.test(v)
    return (
      <div
        key={k}
        className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-stretch hover:border-green-400 transition"
      >
        <div className="w-28 flex-shrink-0">
          <div
            className={
              k.startsWith("productImg")
                ? "w-full aspect-[9/16] rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center"
                : "w-full aspect-square rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center"
            }
          >
            {isImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v} alt="" className="w-full h-full object-cover" />
            ) : isVid ? (
              <video
                src={v}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
            ) : (
              <span className="text-gray-300 text-xs text-center px-2">
                未上传
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-sm text-gray-900">
              {info?.label || fieldLabel(k)}
            </div>
            {info?.anchor && (
              <a
                href={`https://www.buciwa.com${info.anchor}`}
                target="_blank"
                rel="noopener"
                className="flex-shrink-0 text-[11px] text-blue-600 hover:underline whitespace-nowrap"
              >
                ↗ 看效果
              </a>
            )}
          </div>
          {info?.location && (
            <div className="text-[11px] text-gray-500 leading-relaxed">
              📍 {info.location}
            </div>
          )}
          <div className="text-[10px] font-mono text-gray-400">
            字段：media.{k}
          </div>
          <input
            type="text"
            value={v as string}
            onChange={(e) => update("media", k, e.target.value)}
            placeholder="粘贴图片或视频 URL（先去『媒体管理』上传后复制）"
            className="mt-auto w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:border-green-500 focus:outline-none"
          />
        </div>
      </div>
    )
  }

  function renderMediaSection(sectionData: Record<string, string>) {
    const allKeys = Object.keys(sectionData)
    const groups: Record<string, string[]> = {}
    const ungrouped: string[] = []
    for (const k of allKeys) {
      const info = MEDIA_INFO[k]
      if (info) {
        if (!groups[info.group]) groups[info.group] = []
        groups[info.group].push(k)
      } else {
        ungrouped.push(k)
      }
    }
    return (
      <div className="px-5 pb-5 space-y-6">
        {MEDIA_GROUP_ORDER.map((groupName) => {
          const keys = groups[groupName]
          if (!keys || keys.length === 0) return null
          const isProductGroup = groupName.includes("产品介绍区")
          if (isProductGroup) {
            const pairs: string[][] = []
            const used = new Set<string>()
            for (const k of keys) {
              if (used.has(k)) continue
              const pair = MEDIA_INFO[k]?.pair
              if (pair && keys.includes(pair)) {
                pairs.push([k, pair])
                used.add(k)
                used.add(pair)
              } else {
                pairs.push([k])
                used.add(k)
              }
            }
            return (
              <div key={groupName}>
                <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  {groupName}
                  <span className="text-xs font-normal text-gray-400">
                    ({keys.length} 张)
                  </span>
                </div>
                <div className="space-y-3">
                  {pairs.map((pair, i) => {
                    const cardName =
                      MEDIA_INFO[pair[0]]?.label
                        .split("「")[1]
                        ?.split("」")[0] || ""
                    return (
                      <div
                        key={i}
                        className="bg-gray-50/50 rounded-xl p-3 border border-gray-100"
                      >
                        <div className="text-xs font-semibold text-gray-500 mb-2 px-1">
                          卡片 {i + 1}：{cardName}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pair.map((k) =>
                            renderMediaField(k, sectionData[k] || "")
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
          return (
            <div key={groupName}>
              <div className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                {groupName}
                <span className="text-xs font-normal text-gray-400">
                  ({keys.length} 项)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keys.map((k) => renderMediaField(k, sectionData[k] || ""))}
              </div>
            </div>
          )
        })}
        {ungrouped.length > 0 && (
          <div>
            <div className="text-sm font-bold text-gray-700 mb-3">
              其他媒体字段
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ungrouped.map((k) => renderMediaField(k, sectionData[k] || ""))}
            </div>
          </div>
        )}
      </div>
    )
  }

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
            const isMediaSec = sec.key === "media"
            return (
              <details
                key={sec.key}
                open={i === 0 || isMediaSec}
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
                {isMediaSec ? (
                  renderMediaSection(sectionData)
                ) : (
                  <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map(([k, v]) => {
                      const isLong =
                        LONG_KEYS.test(k) || (v && v.length > 60)
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
                        </div>
                      )
                    })}
                  </div>
                )}
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
