"use client";

import { useState } from "react";

export default function PartnershipPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const orgName = data.get("orgName") as string;
    const contact = data.get("contact") as string;
    const phone = data.get("phone") as string;
    const direction = data.get("direction") as string;
    const note = data.get("note") as string;

    const subject = `[合作意向] ${orgName}`;
    const body = [
      `合作机构 / 单位：${orgName}`,
      `联系人：${contact}`,
      `联系方式：${phone}`,
      `合作方向：${direction}`,
      `补充说明：`,
      note || "（无）",
    ].join("\n");

    const mailto = `mailto:partnership@buciwa.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bcw-cream py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 返回首页 */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-bcw-ink-soft hover:text-bcw-ink mb-8 text-sm font-medium"
        >
          ← 返回首页
        </a>

        {/* 头部 */}
        <div className="bg-white rounded-3xl p-10 shadow-[0_6px_0_rgba(0,0,0,0.04)] border-2 border-bcw-line">
          <div className="flex items-center gap-3 mb-3">
            <img src="/buciwa-logo.png" alt="捕词蛙" className="h-12 w-auto" />
            <span className="text-2xl font-black text-bcw-ink">捕词蛙</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-3 text-bcw-ink">
            🤝 合作意向登记
          </h1>
          <p className="text-bcw-ink-soft mb-8 leading-relaxed">
            出版社 / 教育机构 / K12 学校 / 高校均可，我们将在 24 小时内邮件回复。
          </p>

          {submitted ? (
            <div className="bg-bcw-green-soft border-2 border-bcw-green rounded-2xl p-8 text-center">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-black text-bcw-ink mb-2">已为你打开邮件客户端</h2>
              <p className="text-bcw-ink-soft text-sm leading-relaxed">
                如果没有自动弹出，请直接发邮件至{" "}
                <a
                  href="mailto:partnership@buciwa.com"
                  className="text-bcw-green-deep font-bold underline"
                >
                  partnership@buciwa.com
                </a>
              </p>
              <a
                href="/"
                className="inline-block mt-6 text-bcw-green-deep font-bold hover:underline"
              >
                ← 返回首页
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="合作机构 / 单位 *" name="orgName" required />
              <Field label="联系人 *" name="contact" required />
              <Field label="联系方式（手机 / 微信 / 邮箱）*" name="phone" required />
              <Field
                label="合作方向 *"
                name="direction"
                required
                placeholder="如：教材输出 / 校园合作 / 内容共建 / 渠道分销"
              />
              <FieldArea
                label="补充说明（可选）"
                name="note"
                placeholder="可简述合作场景、目标用户量、期望节奏等"
              />

              <button
                type="submit"
                className="w-full bg-bcw-green text-white font-bold py-4 rounded-2xl shadow-[0_4px_0_#46A302] hover:shadow-[0_2px_0_#46A302] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition text-lg"
              >
                📤 提交合作意向
              </button>

              <p className="text-xs text-bcw-ink-soft text-center mt-3 leading-relaxed">
                提交后会自动用你的邮箱客户端发送至 partnership@buciwa.com<br />
                也可以直接邮件联系我们
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-bcw-ink mb-2">{label}</label>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-bcw-line focus:border-bcw-green focus:outline-none text-bcw-ink"
      />
    </div>
  );
}

function FieldArea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-bcw-ink mb-2">{label}</label>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border-2 border-bcw-line focus:border-bcw-green focus:outline-none text-bcw-ink resize-none"
      />
    </div>
  );
}
