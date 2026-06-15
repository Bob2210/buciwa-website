// GET  /api/admin/site  - 读 GitHub 上最新 site.json
// POST /api/admin/site  - body=新 site.json，写回 GitHub 触发部署
import { NextResponse } from "next/server"
import { readFile, writeFile } from "@/lib/github-cms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SITE_JSON_PATH = "src/content/site.json"

export async function GET() {
  try {
    const { content, sha } = await readFile(SITE_JSON_PATH)
    const data = JSON.parse(content)
    return NextResponse.json({ data, sha })
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
    const { data, sha, message } = body as {
      data: any
      sha: string
      message?: string
    }
    if (!data || !sha) {
      return NextResponse.json(
        { error: "data 和 sha 必填" },
        { status: 400 }
      )
    }
    const newContent = JSON.stringify(data, null, 2) + "\n"
    const commitMessage =
      message || `chore(cms): update site.json via admin`
    const result = await writeFile(
      SITE_JSON_PATH,
      newContent,
      commitMessage,
      sha
    )
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "write failed" },
      { status: 500 }
    )
  }
}
