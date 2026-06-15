/**
 * 简单模板渲染器：把 home.html 中的 {{section.key}} 占位符替换为 site.json 中的对应值。
 * - 不做任何 HTML 转义；如果用户在 admin 输入 HTML 标签，会原样渲染（与现有架构一致：
 *   home.html 本身就是通过 dangerouslySetInnerHTML 渲染的）。
 * - 找不到 key 时保留原占位符，便于发现遗漏。
 */
export type SiteContent = Record<string, Record<string, string>>

export function renderTemplate(template: string, site: SiteContent): string {
  return template.replace(/\{\{\s*([\w-]+)\.([\w-]+)\s*\}\}/g, (full, sec: string, key: string) => {
    const v = site?.[sec]?.[key]
    return v === undefined || v === null ? full : String(v)
  })
}

/** 收集模板里所有占位符 key（去重，方便管理面板自动渲染表单） */
export function listPlaceholders(template: string): { section: string; key: string }[] {
  const seen = new Set<string>()
  const out: { section: string; key: string }[] = []
  const re = /\{\{\s*([\w-]+)\.([\w-]+)\s*\}\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(template))) {
    const id = `${m[1]}.${m[2]}`
    if (!seen.has(id)) {
      seen.add(id)
      out.push({ section: m[1], key: m[2] })
    }
  }
  return out
}
