import fs from "fs"
import path from "path"
import Script from "next/script"
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
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: rendered }} />
      {/* 兜底：DOM 挂载后立即隐藏所有有效 src 的 video 旁占位 div，
          应对部分浏览器（mobile Safari、流量节省模式）不主动 preload metadata
          导致 onloadedmetadata 永不触发的场景 */}
      <Script id="video-placeholder-fix" strategy="afterInteractive">
        {`
          (function(){
            try {
              document.querySelectorAll('video').forEach(function(v){
                var src = v.getAttribute('src') || '';
                if (src && src.indexOf('http') === 0 && v.nextElementSibling) {
                  v.nextElementSibling.style.display = 'none';
                }
              });
            } catch (e) {}
          })();
        `}
      </Script>
    </>
  )
}
