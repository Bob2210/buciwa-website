"use client"

import { Button } from "@/components/ui/button"
import { Mascot } from "@/components/ui/mascot"

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden px-6">
      {/* Floating word cards - decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["abandon", "brilliant", "cherish", "dazzle", "embrace", "fragile", "glacier", "horizon"].map((word, i) => (
          <span
            key={word}
            className="absolute text-bcw-border text-sm font-bold animate-drift opacity-40"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top: `${15 + (i * 9) % 70}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${7 + i * 0.8}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 pt-20 pb-16">
        {/* Left */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-sm text-bcw-text-secondary bg-bcw-green-light px-4 py-2 rounded-full">
            <span>🐸</span>
            <span>清华团队 · 用 AI 把单词变成图像</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-bcw-text-primary leading-tight">
            记单词，
            <br />
            <span className="text-bcw-green">先记画面</span>
          </h1>

          <p className="text-lg md:text-xl text-bcw-text-secondary leading-relaxed max-w-lg">
            捕词蛙把单词串成有故事的画面，从 0 帮你构建记忆
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 text-sm text-bcw-text-secondary">
            <span>📚 中国水利水电出版社签约</span>
            <span>🔬 清华团队</span>
            <span>📈 10日留存 48.72%</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={() => scrollTo("demo-video")}>
              观看 60 秒演示
            </Button>
            <Button variant="secondary" size="lg" onClick={() => scrollTo("feedback-show")}>
              查看用户反馈
            </Button>
          </div>
        </div>

        {/* Right - Mascot Hero */}
        <div className="flex items-center justify-center">
          <Mascot type="hero" size="xl" animate />
        </div>
      </div>
    </section>
  )
}
