# 🐸 捕词蛙官网

捕词蛙——用 AI 把单词变成图像，从 0 帮你构建记忆。

## 技术栈

- **框架:** Next.js 14 (App Router)
- **语言:** TypeScript
- **样式:** Tailwind CSS
- **动效:** Framer Motion
- **图标:** Lucide React
- **部署:** Vercel

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 本地开发
npm run dev

# 3. 浏览器打开 http://localhost:3000
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx           # 首页（9 个 section）
│   ├── product/page.tsx   # 产品详情页
│   ├── feedback/page.tsx  # 完整反馈展示页
│   └── about/page.tsx     # 关于我们
├── components/
│   ├── ui/                # Button, Card, Mascot
│   └── sections/          # Hero, Features, DataStats...
├── content/               # JSON 数据文件
└── lib/                   # 工具函数
```

## 可编辑内容

所有文案和数据都在 `src/content/` 目录下：
- `stats.json` — 内测数据（63人/107反馈/留存率...）
- `feedbacks.json` — 用户反馈精选
- `videos.json` — 视频配置

吉祥物图片在 `public/mascot/` 目录下。

## 部署

1. 在 GitHub 创建仓库 `Bob2210/buciwa-website`
2. 把本项目文件上传到仓库
3. 在 [vercel.com](https://vercel.com) 导入该仓库
4. 绑定域名 `www.buciwa.com`
