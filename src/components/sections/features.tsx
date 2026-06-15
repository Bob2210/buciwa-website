"use client"

import { Mascot } from "@/components/ui/mascot"
import { cn } from "@/lib/utils"

const features = [
  {
    id: "visual",
    num: "01",
    title: "数个词，一个故事，一张图",
    desc: "把单词串联在有故事的画面中，让单词在大脑里不再是散落的孤岛，而是绑在一起的「一张网」。下次随便触发其中一个词，整张画面、整组单词都会被激活。",
    badge: "🆕 预习功能 · 真正从 0 开始构建记忆",
    mascot: "front" as const,
    bg: "bg-white",
  },
  {
    id: "scenario",
    num: "02",
    title: "光学不练，等于白学",
    desc: "捕词蛙设计了多种场景化视觉复习题型——完形填空、单词语音、场景听力……让你在语境中把词「用」出来。",
    badge: "",
    mascot: "side-a" as const,
    bg: "bg-bcw-green-light/30",
  },
  {
    id: "ai",
    num: "03",
    title: "你的专属私教",
    desc: "根据你的水平和目标生成定制化学习内容，根据你的学习反馈动态调整难度，让你始终在「有点挑战但跟得上」的节奏里。",
    badge: "",
    mascot: "side-b" as const,
    bg: "bg-white",
  },
  {
    id: "more",
    num: "04",
    title: "不止背单词",
    desc: "更多实用功能，让英语融入你的日常生活。",
    badge: "",
    mascot: "front" as const,
    bg: "bg-bcw-purple-light/30",
    subCards: [
      { icon: "🎧", label: "随身听", desc: "通勤路上磨耳朵" },
      { icon: "🔄", label: "智能复习", desc: "刚好在你快忘的时候出现" },
      { icon: "📈", label: "学习数据曲线", desc: "看得见的进步轨迹" },
    ],
  },
]

export function Features() {
  return (
    <section id="features" className="relative">
      {features.map((f, i) => (
        <div key={f.id} className={cn("py-20 px-6", f.bg)}>
          <div className={cn(
            "max-w-5xl mx-auto grid gap-10 items-center",
            i % 2 === 0 ? "md:grid-cols-[3fr_2fr]" : "md:grid-cols-[2fr_3fr]"
          )}>
            {/* Content side */}
            <div className={cn(i % 2 === 0 ? "md:order-1" : "md:order-2")}>
              {/* Section number */}
              <div className="text-bcw-purple font-bold text-sm tracking-widest mb-4">
                {f.num} / 04
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mb-6">
                {f.title}
              </h3>

              <p className="text-bcw-text-secondary text-lg leading-relaxed mb-6">
                {f.desc}
              </p>

              {f.badge && (
                <div className="inline-flex items-center gap-2 bg-bcw-green-light text-bcw-green-dark text-sm font-bold px-4 py-2 rounded-full">
                  {f.badge}
                </div>
              )}

              {/* Sub-cards for feature 04 */}
              {f.subCards && (
                <div className="grid sm:grid-cols-3 gap-4 mt-8">
                  {f.subCards.map((sc) => (
                    <div key={sc.label} className="bg-white rounded-2xl p-5 shadow-sm border border-bcw-border">
                      <div className="text-3xl mb-3">{sc.icon}</div>
                      <div className="font-bold text-bcw-text-primary">{sc.label}</div>
                      <div className="text-sm text-bcw-text-secondary mt-1">{sc.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {f.id === "more" && (
                <p className="mt-6 text-bcw-purple font-bold text-sm">
                  更多功能欢迎体验 <a href="/product" className="underline">→</a>
                </p>
              )}
            </div>

            {/* Mascot side */}
            <div className={cn(
              "flex items-center justify-center",
              i % 2 === 0 ? "md:order-2" : "md:order-1"
            )}>
              <div className="bg-white rounded-full border-2 border-bcw-green p-2 shadow-sm">
                <Mascot type={f.mascot} size="lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
