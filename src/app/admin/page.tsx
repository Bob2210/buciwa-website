// /admin 默认页：直接重定向到文本编辑
import { redirect } from "next/navigation"

export default function AdminIndex() {
  redirect("/admin/text")
}
