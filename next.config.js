/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 把 Vercel 内置的 commit sha 暴露到客户端，便于在 UI 上显示构建版本
    NEXT_PUBLIC_BUILD_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "dev",
  },
}
module.exports = nextConfig
