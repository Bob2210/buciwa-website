import fs from "fs"
import path from "path"
import { renderTemplate, type SiteContent } from "@/lib/template"
import { loadSite } from "@/lib/site-store"

// 主页改为 ISR：每 30 秒回源拉一次最新 site.json（admin 保存后会主动 revalidate，所以通常远低于 30s 生效）
export const revalidate = 30

export default async function Home() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content/home.html"),
    "utf-8"
  )
  const { data: site } = await loadSite()
  const rendered = renderTemplate(html, site as SiteContent)
  return <div dangerouslySetInnerHTML={{ __html: rendered }} />
}
