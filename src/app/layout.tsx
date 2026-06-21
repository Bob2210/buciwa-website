import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "捕词蛙｜从看懂英语，到看见世界",
  description: "捕词蛙把单词串成有故事的画面，从 0 帮你构建记忆。清华团队打造，用 AI 把单词变成图像。",
  openGraph: {
    title: "捕词蛙｜从看懂英语，到看见世界",
    description: "用 AI 把单词变成图像，从 0 帮你构建记忆",
    type: "website",
  },
}

// 进入页面同步执行：禁用浏览器自动滚动恢复 + 抹掉 URL 残留 hash + 强制回顶部
// 用原生 <script> 而不是 Next <Script>，确保在浏览器默认 anchor 滚动之前同步执行
const SCROLL_TO_TOP_JS = `(function(){
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  } catch(e){}
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 必须放在 <head> 最顶，同步执行，确保比页面任何渲染/滚动都早 */}
        <script dangerouslySetInnerHTML={{ __html: SCROLL_TO_TOP_JS }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind CDN: 兼容原型的任意 utility class（dangerouslySetInnerHTML 渲染） */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script id="tailwind-config" strategy="beforeInteractive">{`
          if (typeof tailwind !== 'undefined') {
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'bcw-green':       '#58CC02',
                    'bcw-green-deep':  '#46A302',
                    'bcw-green-soft':  '#E5F8D5',
                    'bcw-purple':      '#A98BE0',
                    'bcw-purple-deep': '#7C5BC9',
                    'bcw-purple-soft': '#F4EEFC',
                    'bcw-yellow':      '#FFB800',
                    'bcw-cream':       '#FFFFFF',
                    'bcw-ink':         '#1A1F1A',
                    'bcw-ink-soft':    '#5C6360',
                    'bcw-line':        '#E8EAE7',
                  },
                  borderRadius: { 'btn': '14px', 'card': '24px' },
                  fontFamily: {
                    sans: ['"Noto Sans SC"', 'Inter', 'system-ui', 'sans-serif'],
                    num:  ['Inter', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
                  },
                },
              },
            };
          }
        `}</Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
