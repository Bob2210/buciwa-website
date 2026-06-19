// GET  /api/admin/site  - 读取最新 site.json（优先 Blob）
// POST /api/admin/site  - 写入 site.json 到 Blob，并 revalidate 主页缓存（不再 git commit / 不再触发 Vercel 部署）
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { loadSite, saveSite } from "@/lib/site-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { data, sha, source } = await loadSite({ noStore: true })
    return NextResponse.json({ data, sha, source })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "read failed" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, sha } = body as {
      data: any
      sha: string
      message?: string
    }
    if (!data) {
      return NextResponse.json({ error: "data 必填" }, { status: 400 })
    }
    // 乐观锁：如果客户端传了 sha，校验是否跟当前一致
    if (sha) {
      try {
        const current = await loadSite({ noStore: true })
        if (current.source === "blob" && current.sha !== sha) {
          return NextResponse.json(
            {
              error: "site.json 已被其他人修改，请先刷新页面再保存",
              currentSha: current.sha,
            },
            { status: 409 }
          )
        }
      } catch {
        // 读不到当前快照不阻塞写入
      }
    }
    const result = await saveSite(data)
    // 关键：写完立即让主页缓存失效，下一次访问主页就拉新数据
    try {
      revalidatePath("/")
    } catch (e) {
      console.warn("[admin/site] revalidatePath failed", e)
    }
    return NextResponse.json({
      ok: true,
      sha: result.sha,
      url: result.url,
      // 兼容旧客户端字段
      commitSha: "blob",
      htmlUrl: result.url,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "write failed" },
      { status: 500 }
    )
  }
}
