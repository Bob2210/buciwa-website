"use client"

import { Mascot } from "@/components/ui/mascot"
import { Card } from "@/components/ui/card"
import feedbacks from "@/content/feedbacks.json"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-bcw-yellow" : "text-gray-200"}>
          ★
        </span>
      ))}
    </div>
  )
}

export function FeedbackShow() {
  return (
    <section id="feedback-show" className="py-24 px-6 bg-gradient-to-b from-bcw-purple-light to-white">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 text-bcw-purple font-bold mb-4">
            <span className="h-px w-8 bg-bcw-purple" />
            用户反馈展示
            <span className="h-px w-8 bg-bcw-purple" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-bcw-text-primary">
            我们与 63 位共创伙伴
          </h2>
        </div>

        {/* 01 - We collected many feedbacks */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-bcw-purple font-bold text-sm tracking-widest">01</span>
            <h3 className="text-xl font-bold text-bcw-text-primary">我们收集了很多反馈</h3>
            <span className="text-sm text-bcw-text-secondary">107 条反馈 · 精选 9 条</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.map((fb) => (
              <Card key={fb.id} variant="purple" className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-bcw-purple/20 flex items-center justify-center text-sm font-bold text-bcw-purple">
                      {fb.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-bcw-text-primary">{fb.name}</div>
                      <div className="text-xs text-bcw-text-secondary">{fb.identity}</div>
                    </div>
                  </div>
                  <StarRating rating={fb.rating} />
                </div>
                <p className="text-sm text-bcw-text-secondary leading-relaxed">
                  "{fb.content}"
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <a href="/feedback" className="text-bcw-purple font-bold text-sm hover:underline">
              查看全部反馈 →
            </a>
          </div>
        </div>

        {/* 02 - We got help */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-bcw-purple font-bold text-sm tracking-widest">02</span>
            <h3 className="text-xl font-bold text-bcw-text-primary">我们得到了很多帮助</h3>
            <span className="text-sm text-bcw-text-secondary">12 处细节优化</span>
          </div>

          <Card className="p-10 text-center border-2 border-dashed border-bcw-border">
            <div className="text-4xl mb-4">🔧</div>
            <p className="text-bcw-text-secondary">
              Before / After 对比图 — 等你提供截图，我贴上
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {["UI 交互优化", "题型新增", "复习算法", "性能提速", "...更多"].map((item) => (
                <span key={item} className="bg-bcw-purple-light text-bcw-purple-dark text-sm px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* 03 - Praise */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-bcw-purple font-bold text-sm tracking-widest">03</span>
            <h3 className="text-xl font-bold text-bcw-text-primary">我们收获了很多好评</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Card variant="purple" className="p-8 text-center">
              <div className="text-4xl font-extrabold text-bcw-purple">90.9%</div>
              <div className="text-sm text-bcw-text-secondary mt-2">用户好评率</div>
            </Card>
            <Card variant="green" className="p-8 text-center">
              <div className="text-4xl font-extrabold text-bcw-green">50%</div>
              <div className="text-sm text-bcw-text-secondary mt-2">五星好评</div>
            </Card>
            <Card variant="purple" className="p-8 text-center">
              <div className="text-4xl font-extrabold text-bcw-purple">86.4%</div>
              <div className="text-sm text-bcw-text-secondary mt-2">认为优于同类产品</div>
            </Card>
          </div>
        </div>

        {/* 04 - Friends */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-bcw-purple font-bold text-sm tracking-widest">04</span>
            <h3 className="text-xl font-bold text-bcw-text-primary">我们交到了很多朋友</h3>
          </div>

          <Card className="p-10 text-center border-2 border-dashed border-bcw-border">
            <div className="flex justify-center mb-6">
              <Mascot type="front" size="md" />
            </div>
            <p className="text-bcw-text-secondary italic">
              "感谢各位内测伙伴，和捕词蛙一起，迈出了它最重要的第一步。"
            </p>
            <p className="text-sm text-bcw-text-secondary mt-4">
              63 位共创伙伴的头像墙 — 等你提供名单，我贴上来
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
