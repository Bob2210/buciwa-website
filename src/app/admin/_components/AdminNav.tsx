"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const TABS = [
  { href: "/admin/text", label: "📝 文本编辑" },
  { href: "/admin/media", label: "🖼️ 媒体管理" },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-gray-900"
        >
          <span className="text-xl">🐸</span>
          <span>捕词蛙后台</span>
        </Link>
        <nav className="flex gap-1 ml-4">
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.href)
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-green-100 text-green-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex-1" />
        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ↗ 查看官网
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600"
        >
          退出登录
        </button>
      </div>
    </header>
  )
}
