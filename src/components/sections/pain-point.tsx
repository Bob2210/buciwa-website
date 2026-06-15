"use client"

import { Mascot } from "@/components/ui/mascot"

export function PainPoint() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-bcw-text-primary text-center mb-16">
          你以为你在记单词，
          <br />
          其实你在记<span className="text-bcw-purple">"乱码"</span>
        </h2>

        <div className="grid md:grid-cols-5 gap-8 items-center">
          {/* Left: messy word cards */}
          <div className="md:col-span-2 relative">
            <div className="space-y-3">
              {["abandon", "absence", "absorb", "abstract", "access"].map((word, i) => (
                <div
                  key={word}
                  className="bg-gray-100 rounded-2xl px-5 py-3 text-center font-mono text-bcw-text-secondary/50 line-through"
                  style={{
                    transform: `rotate(${-3 + i * 1.5}deg)`,
                    marginLeft: `${i * 8}px`,
                    opacity: 0.7 - i * 0.08,
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-4 right-4 text-sm text-bcw-text-secondary bg-white px-3 py-1 rounded-full shadow-sm">
              ❌ 一周后全忘
            </div>
          </div>

          {/* Center arrow / transition */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-2xl gap-3 py-8">
            <span className="text-bcw-green text-3xl">→</span>
            <span className="text-sm font-bold text-bcw-green bg-bcw-green-light px-3 py-1 rounded-full">蜕变</span>
          </div>

          {/* Right: vivid image */}
          <div className="md:col-span-2 bg-gradient-to-br from-bcw-green-light to-bcw-purple-light rounded-3xl p-8 text-center">
            <div className="text-4xl mb-4">🖼️</div>
            <p className="text-lg font-bold text-bcw-text-primary">
              "一把斧头劈开了冰山的一角"
            </p>
            <p className="text-sm text-bcw-text-secondary mt-2">
              chop · chip · fracture · splinter · iceberg
            </p>
            <div className="flex justify-center mt-4">
              <Mascot type="front" size="sm" />
            </div>
          </div>
        </div>

        {/* Punchline */}
        <div className="text-center mt-16">
          <p className="text-xl md:text-2xl font-bold text-bcw-purple">
            <span className="text-4xl">"</span>
            问题不在你，在方法
            <span className="text-4xl">"</span>
          </p>
          <p className="text-bcw-text-secondary mt-4">
            每天打卡 Day 23，朋友圈截图张张满分，但一周后一测，正确率不到 40%。
            <br />
            你需要的不是更努力，而是用对方法——用画面记忆代替死记硬背。
          </p>
        </div>
      </div>
    </section>
  )
}
