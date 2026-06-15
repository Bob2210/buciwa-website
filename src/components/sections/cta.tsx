import { Button } from "@/components/ui/button"

const cards = [
  {
    title: "投资 / 媒体咨询",
    desc: "想了解捕词蛙的商业模式和发展规划？",
    cta: "邮件联系",
    href: "mailto:yangjl20@mails.tsinghua.edu.cn",
    variant: "purple" as const,
  },
  {
    title: "商务合作",
    desc: "出版社 / 教育机构 / 内容合作，欢迎来聊",
    cta: "提交合作意向",
    href: "#",
    variant: "primary" as const,
  },
  {
    title: "内测申请",
    desc: "想第一时间体验捕词蛙？加入内测名单",
    cta: "申请内测",
    href: "#",
    variant: "secondary" as const,
  },
]

export function CTA() {
  return (
    <section id="cta" className="py-24 px-6 bg-gradient-to-b from-white to-bcw-green-light/30">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-bcw-text-primary mb-4">
          想和我们聊聊？
        </h2>
        <p className="text-bcw-text-secondary mb-16 max-w-xl mx-auto">
          不管你是投资人、合作方还是未来的内测用户，我们都欢迎
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl p-8 bg-white border-2 border-bcw-border shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-bcw-text-primary mb-3">{card.title}</h3>
                <p className="text-sm text-bcw-text-secondary mb-8">{card.desc}</p>
              </div>
              <a href={card.href}>
                <Button variant={card.variant} className="w-full">
                  {card.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
