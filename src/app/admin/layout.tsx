// 后台公共布局：顶部导航 + 内容区
import Link from "next/link"
import { ReactNode } from "react"

export const metadata = {
  title: "捕词蛙官网 · 后台",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {children}
    </div>
  )
}
