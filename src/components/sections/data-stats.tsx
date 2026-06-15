"use client"

import { stats } from "@/lib/stats"
import { cn } from "@/lib/utils"
import CountUp from "react-countup"

export function DataStats() {
  return (
    <section id="data" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mb-4">
          不画饼，直接看 63 人内测真实数据
        </h2>
        <p className="text-bcw-text-secondary mb-16">
          5月12日开启首轮内测，5月27日两周时点收官
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={cn(
                "rounded-3xl p-8 text-center border-2 transition-transform hover:-translate-y-1",
                s.color === "green"
                  ? "bg-bcw-green-light border-bcw-green"
                  : "bg-bcw-purple-light border-bcw-purple",
                s.highlight && "ring-2 ring-bcw-yellow ring-offset-2"
              )}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-bcw-text-primary mb-3 font-display">
                <CountUp end={parseFloat(s.value)} decimals={s.value.includes(".") ? 2 : 0} duration={2.5} />
                {s.suffix}
              </div>
              <div className="text-bcw-text-secondary text-sm">{s.label}</div>
              {s.highlight && (
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-bcw-yellow bg-white px-3 py-1 rounded-full">
                  ⭐ 远超行业基准
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-bcw-text-secondary mt-8">
          已完成 12 处细节优化 · 仍在持续迭代
        </p>
      </div>
    </section>
  )
}
