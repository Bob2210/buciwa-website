import Link from "next/link"
import { Mascot } from "@/components/ui/mascot"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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
        <div className="flex items-center gap-4 mb-8">
          <Mascot type="front" size="md" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-bcw-text-primary">产品详情</h1>
            <p className="text-bcw-text-secondary mt-2">用 AI 把单词变成图像，从 0 帮你构建记忆</p>
          </div>
        </div>

        {/* Product sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">产品理念</h2>
            <p className="text-bcw-text-secondary leading-relaxed">
              捕词蛙是一款基于视觉记忆理论的 AI 英语学习软件。我们认为，人类大脑天生对图像的记忆远强于对抽象符号的记忆——
              这就是为什么你记得住一张电影海报的每个细节，却记不住背了三天的单词。
            </p>
            <p className="text-bcw-text-secondary leading-relaxed mt-4">
              捕词蛙的核心创新在于：用 AI 把单词编成有故事的画面，让每个单词都不是孤立的抽象符号，
              而是嵌入在一张视觉化故事中的「记忆锚点」。当你看到画面，整组单词自然被激活。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">视觉化原理</h2>
            <p className="text-bcw-text-secondary leading-relaxed">
              基于 VLE（Visual Language Engine）技术架构，捕词蛙能够将语义相关的单词自动组合成带有叙事性的视觉画面。
              每个画面包含 3-8 个单词，通过场景、角色和道具的关联，构建多维度记忆网络。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">题型与场景化</h2>
            <p className="text-bcw-text-secondary leading-relaxed">
              光学不练等于白学。捕词蛙设计了多种场景化视觉复习题型——完形填空、单词语音配对、场景听力理解……
              让你在语境中真正「用」出单词，而非机械回忆。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">AI 自适应学习</h2>
            <p className="text-bcw-text-secondary leading-relaxed">
              每位用户的学习轨迹都被 AI 记录和分析。系统会根据你的掌握程度动态调整学习内容难度和复习频率，
              让你始终处于「有点挑战但跟得上」的最佳学习区间。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bcw-text-primary mb-4">适用人群</h2>
            <ul className="space-y-3 text-bcw-text-secondary">
              {["考研 / 四级 / 六级 / 雅思备考者", "希望提升英语词汇量的职场人士", "对传统背单词方式感到厌倦的学习者", "相信「视觉记忆比死记硬背更有效」的你"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-bcw-green">✓</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-bcw-green-light rounded-3xl p-8 text-center">
            <p className="text-lg font-bold text-bcw-text-primary">
              更多内容即将上线
            </p>
            <p className="text-sm text-bcw-text-secondary mt-2">
              产品截图、定价和 FAQ 正在准备中
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
