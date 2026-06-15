import Link from "next/link"
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

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bcw-purple-light to-white">
      {/* Nav */}
      <nav className="border-b border-bcw-border/50 bg-white/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-bcw-text-primary">
            🐸 捕词蛙
          </Link>
          <Link href="/" className="text-sm text-bcw-text-secondary hover:text-bcw-green">
            ← 返回首页
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header stats */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mb-4">
            全部用户反馈
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <span className="bg-bcw-green-light px-4 py-2 rounded-full font-bold">63 用户</span>
            <span className="bg-bcw-purple-light px-4 py-2 rounded-full font-bold">107 反馈</span>
            <span className="bg-bcw-green-light px-4 py-2 rounded-full font-bold">90.9% 好评</span>
            <span className="bg-bcw-purple-light px-4 py-2 rounded-full font-bold">50% 五星</span>
            <span className="bg-bcw-green-light px-4 py-2 rounded-full font-bold">86.4% 优于同类</span>
          </div>
        </div>

        {/* Feedback grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-3xl p-6 border border-bcw-border/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-bcw-purple/20 flex items-center justify-center text-lg font-bold text-bcw-purple">
                    {fb.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-bcw-text-primary text-sm">{fb.name}</div>
                    <div className="text-xs text-bcw-text-secondary">{fb.identity}</div>
                  </div>
                </div>
                <StarRating rating={fb.rating} />
              </div>
              <p className="text-sm text-bcw-text-secondary leading-relaxed">
                "{fb.content}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-bcw-text-secondary">
            反馈实时更新中 · 更多反馈内容等你提供
          </p>
        </div>
      </div>
    </div>
  )
}
