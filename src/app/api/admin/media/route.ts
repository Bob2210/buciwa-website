// GET    /api/admin/media       - 列出 Blob 内所有文件
// DELETE /api/admin/media       - body={url} 删除某文件
import { NextResponse } from "next/server"
import { list, del } from "@vercel/blob"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const out: Array<{
      url: string
      pathname: string
      size: number
      uploadedAt: string
    }> = []
    let cursor: string | undefined
    do {
      const r: any = await list({ cursor, limit: 1000 })
      for (const b of r.blobs) {
        out.push({
          url: b.url,
          pathname: b.pathname,
          size: b.size,
          uploadedAt: b.uploadedAt,
        })
      }
      cursor = r.cursor
    } while (cursor)
    // 按上传时间倒序
    out.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() -
        new Date(a.uploadedAt).getTime()
    )
    return NextResponse.json({ blobs: out, total: out.length })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "list failed" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json()
    if (!url)
      return NextResponse.json({ error: "url 必填" }, { status: 400 })
    await del(url)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "delete failed" },
      { status: 500 }
    )
  }
}
