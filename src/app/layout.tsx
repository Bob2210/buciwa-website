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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        {/* 进入页面默认回到顶部（除非 URL 自带 anchor hash），同时禁用浏览器的自动滚动恢复 */}
        <Script id="scroll-to-top" strategy="beforeInteractive">{`
          (function(){
            try {
              if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              var goTop = function(){
                if (!window.location.hash) {
                  window.scrollTo(0, 0);
                }
              };
              goTop();
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', goTop);
              }
              window.addEventListener('load', goTop);
            } catch(e) {}
          })();
        `}</Script>
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
