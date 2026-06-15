import Link from "next/link"
import { Mascot } from "@/components/ui/mascot"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-bcw-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-bcw-text-primary">
            🐸 捕词蛙
          </Link>
          <Link href="/" className="text-sm text-bcw-text-secondary hover:text-bcw-green">
            ← 返回首页
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Mascot type="hero" size="lg" animate />
          <h1 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mt-6 mb-4">
            关于捕词蛙
          </h1>
          <p className="text-bcw-text-secondary max-w-xl mx-auto">
            一款由清华团队打造的、用 AI 把单词变成图像的英语学习软件
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">公司介绍</h2>
            <p className="text-bcw-text-secondary leading-relaxed">
              言启教育科技（东莞）有限责任公司成立于 2025 年，致力于用 AI 技术革新语言学习方式。
              首款产品「捕词蛙」聚焦于视觉化英语词汇学习，通过独创的 VLE（Visual Language Engine）
              技术引擎，为学习者提供从 0 构建记忆的全新体验。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">团队</h2>
            <p className="text-bcw-text-secondary mb-8">
              我们是一支由清华美院、软件学院等院系同学组成的跨学科创业团队，
              兼具 AI 技术研发能力和设计创意基因。
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { role: "CEO", desc: "产品方向 · 视觉设计" },
                { role: "COO", desc: "运营 · 市场 · 内容" },
                { role: "CTO", desc: "技术架构 · AI 引擎" },
                { role: "产品视觉", desc: "UI/UX · 吉祥物设计" },
              ].map((member) => (
                <div key={member.role} className="bg-gray-50 rounded-3xl p-6 border border-bcw-border">
                  <div className="w-12 h-12 rounded-full bg-bcw-green-light flex items-center justify-center text-lg font-bold text-bcw-green mb-3">
                    {member.role[0]}
                  </div>
                  <div className="font-bold text-bcw-text-primary">{member.role}</div>
                  <div className="text-sm text-bcw-text-secondary mt-1">{member.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-bcw-green-light rounded-3xl p-8 text-center">
            <p className="text-lg font-bold text-bcw-text-primary mb-2">联系我们</p>
            <a href="mailto:yangjl20@mails.tsinghua.edu.cn" className="text-bcw-green-dark underline">
              yangjl20@mails.tsinghua.edu.cn
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
