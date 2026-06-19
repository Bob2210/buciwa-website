// site.json 的存储抽象：优先从 Vercel Blob 读取最新版本，fallback 到 build 时打包的 src/content/site.json
// 写入只走 Blob，不再触发 git commit / Vercel 部署，避免吃光部署配额
import { put, list, del } from "@vercel/blob"
import fs from "fs"
import path from "path"
import crypto from "crypto"

const BLOB_PATH = "data/site.json"
// 公共 Blob URL 前缀（store: store_dQ3Gpm4hYoiVnhBP）
const BLOB_PUBLIC_BASE =
  "https://dq3gpm4hyoivnhbp.public.blob.vercel-storage.com"

export interface SiteSnapshot {
  data: any
  sha: string // 内容哈希，用于 admin 端乐观锁
  source: "blob" | "fallback"
}

function hashContent(content: string): string {
  return crypto.createHash("sha1").update(content).digest("hex")
}

/** 从 build 时打包的 site.json 读，作为 Blob 不可用时的兜底 */
function loadFromFs(): SiteSnapshot {
  const p = path.join(process.cwd(), "src/content/site.json")
  const content = fs.readFileSync(p, "utf-8")
  return {
    data: JSON.parse(content),
    sha: hashContent(content),
    source: "fallback",
  }
}

/**
 * 读 site.json：优先 Blob（带时间戳防 CDN 缓存），失败 fallback 到 fs
 * 注意：传 noStore=true 时必须保证调用方在 force-dynamic / revalidate 路径下，否则可能被 Next 静态化
 */
export async function loadSite(opts?: {
  noStore?: boolean
}): Promise<SiteSnapshot> {
  const noStore = opts?.noStore ?? false
  const url = `${BLOB_PUBLIC_BASE}/${BLOB_PATH}${noStore ? `?t=${Date.now()}` : ""}`
  try {
    const res = await fetch(url, {
      // SSR 渲染端：用 next.revalidate 控制；admin GET 端：用 cache:no-store
      ...(noStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: 30 } }),
    })
    if (res.ok) {
      const text = await res.text()
      return {
        data: JSON.parse(text),
        sha: hashContent(text),
        source: "blob",
      }
    }
    // 404/410 表示 Blob 还没初始化，用 fs 兜底
    if (res.status === 404 || res.status === 410) {
      return loadFromFs()
    }
    // 其他错误也兜底，避免线上挂掉
    console.warn(`[site-store] blob fetch failed ${res.status}, fallback to fs`)
    return loadFromFs()
  } catch (e) {
    console.warn("[site-store] blob fetch error, fallback to fs", e)
    return loadFromFs()
  }
}

/**
 * 写 site.json 到 Blob（覆盖同 path）
 * - addRandomSuffix:false 保证 URL 固定为 .../data/site.json
 * - cacheControlMaxAge:0 让 CDN 不缓存（admin 写完立即可见）
 * - 老版本 @vercel/blob (0.27) 没有 allowOverwrite 字段，重复 put 会失败
 *   所以先 del 旧 blob（不存在也不会报错），再 put
 */
export async function saveSite(data: any): Promise<{ sha: string; url: string }> {
  const content = JSON.stringify(data, null, 2) + "\n"
  const fullUrl = `${BLOB_PUBLIC_BASE}/${BLOB_PATH}`
  // 兜底：先尝试删除旧 blob，存在/不存在都不影响后续 put
  try {
    await del(fullUrl)
  } catch (e) {
    // 不存在或其他错误都忽略，put 会处理
  }
  const blob = await put(BLOB_PATH, content, {
    access: "public",
    contentType: "application/json; charset=utf-8",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  })
  return { sha: hashContent(content), url: blob.url }
}
