import fs from "fs"
import path from "path"
import { renderTemplate, type SiteContent } from "@/lib/template"

export const dynamic = "force-static"

export default function Home() {
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/content/home.html"),
    "utf-8"
  )
  const siteRaw = fs.readFileSync(
    path.join(process.cwd(), "src/content/site.json"),
    "utf-8"
  )
  const site = JSON.parse(siteRaw) as SiteContent
  const rendered = renderTemplate(html, site)
  return <div dangerouslySetInnerHTML={{ __html: rendered }} />
}
