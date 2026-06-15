export function Endorsement() {
  const logos = [
    { name: "中国水利水电出版社", icon: "📚" },
    { name: "清华大学", icon: "🏛️" },
    { name: "豆包 Doubao-Seed", icon: "🧠" },
    { name: "Stable Diffusion", icon: "🎨" },
  ]

  return (
    <section id="endorsement" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-bcw-text-secondary mb-6 font-bold tracking-widest">
          合作伙伴 & 技术支持
        </p>

        <div className="flex flex-wrap justify-center gap-8 items-center mb-12">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 text-bcw-text-secondary bg-gray-50 px-6 py-3 rounded-2xl border border-bcw-border"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="font-bold text-sm">{logo.name}</span>
            </div>
          ))}
        </div>

        <blockquote className="border-l-4 border-bcw-green pl-6 text-left max-w-2xl mx-auto">
          <p className="text-bcw-text-secondary text-lg italic leading-relaxed">
            "首本视觉化考研词书已由中国水利水电出版社签约免费出版，预计 2026 Q3 上市。"
          </p>
        </blockquote>
      </div>
    </section>
  )
}
