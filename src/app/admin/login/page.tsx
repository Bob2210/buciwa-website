"use client"
import { useState, FormEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get("from") || "/admin/text"

  const [pw, setPw] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErr(data.error || "登录失败")
        setLoading(false)
        return
      }
      router.push(from)
      router.refresh()
    } catch (e: any) {
      setErr(e?.message || "登录失败")
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border-2 border-green-100"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🐸</span>
        <h1 className="text-2xl font-bold text-gray-900">
          捕词蛙官网 · 后台
        </h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        仅站长可访问。请输入后台密码登录。
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        后台密码
      </label>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="••••••••"
        autoFocus
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
      />

      {err && (
        <div className="mt-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {err}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !pw}
        className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition"
      >
        {loading ? "登录中…" : "登录"}
      </button>

      <a
        href="/"
        className="block mt-6 text-center text-sm text-gray-500 hover:text-gray-700"
      >
        ← 返回官网
      </a>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-purple-50 px-4">
      <Suspense fallback={<div className="text-gray-400">加载中…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
