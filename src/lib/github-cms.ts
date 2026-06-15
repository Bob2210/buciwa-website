// GitHub Contents API 封装：读取/写入 site.json
// 写入会触发 Vercel 自动部署（约 1-2 分钟生效）

const API = "https://api.github.com"

function authHeaders() {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error("GITHUB_TOKEN not set")
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
}

function repoPath(filePath: string) {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  if (!owner || !repo)
    throw new Error("GITHUB_OWNER / GITHUB_REPO not set")
  return `/repos/${owner}/${repo}/contents/${filePath}`
}

export interface FileMeta {
  content: string // base64 解码后的文本
  sha: string
}

/** 读 GitHub 上某个文件的最新内容 + sha */
export async function readFile(filePath: string): Promise<FileMeta> {
  const res = await fetch(`${API}${repoPath(filePath)}`, {
    headers: authHeaders(),
    cache: "no-store",
  })
  if (!res.ok)
    throw new Error(
      `GitHub readFile ${filePath} failed: ${res.status} ${await res.text()}`
    )
  const data = await res.json()
  // GitHub 返回的 content 是 base64（带换行）
  const content = Buffer.from(data.content, "base64").toString("utf-8")
  return { content, sha: data.sha }
}

/** 写 GitHub 上的文件（PUT，会自动 commit 到 main 分支） */
export async function writeFile(
  filePath: string,
  newContent: string,
  commitMessage: string,
  sha: string
): Promise<{ commitSha: string; htmlUrl: string }> {
  const body = {
    message: commitMessage,
    content: Buffer.from(newContent, "utf-8").toString("base64"),
    sha,
    committer: {
      name: "BCW Admin Bot",
      email: "admin@buciwa.com",
    },
  }
  const res = await fetch(`${API}${repoPath(filePath)}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok)
    throw new Error(
      `GitHub writeFile ${filePath} failed: ${res.status} ${await res.text()}`
    )
  const data = await res.json()
  return {
    commitSha: data.commit?.sha || "",
    htmlUrl: data.commit?.html_url || "",
  }
}
