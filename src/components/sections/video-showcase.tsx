"use client"

import { useState } from "react"

const tabs = [
  { id: "concept", label: "产品概念" },
  { id: "demo", label: "功能演示" },
  { id: "student", label: "真实学员" },
  { id: "founder", label: "创始人 1 分钟" },
]

export function VideoShowcase() {
  const [active, setActive] = useState("concept")

  return (
    <section id="demo-video" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mb-4">
          30 秒看懂捕词蛙
        </h2>
        <p className="text-bcw-text-secondary mb-12">
          一个视频，说清楚我们在做什么、为什么做、做到哪了
        </p>

        {/* Video tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                active === tab.id
                  ? "bg-bcw-green text-white shadow-bcw"
                  : "bg-gray-100 text-bcw-text-secondary hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video placeholder */}
        <div className="relative bg-gray-100 rounded-3xl overflow-hidden aspect-video border-2 border-bcw-border shadow-[0_6px_0_#E8EAE7]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-bcw-text-secondary gap-4">
            <div className="w-20 h-20 rounded-full bg-bcw-green flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-bcw">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-sm">演示视频 — 待上传</p>
            <p className="text-xs text-bcw-text-secondary/60">
              B 站 / 腾讯视频嵌入，你把链接给我就能挂上
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
