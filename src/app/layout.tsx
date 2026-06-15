import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "捕词蛙 — 记单词，先记画面",
  description: "捕词蛙把单词串成有故事的画面，从 0 帮你构建记忆。清华团队打造，用 AI 把单词变成图像。",
  openGraph: {
    title: "捕词蛙 — 记单词，先记画面",
    description: "用 AI 把单词变成图像，从 0 帮你构建记忆",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
