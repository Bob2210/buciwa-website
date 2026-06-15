export function Footer() {
  return (
    <footer className="bg-white border-t border-bcw-border pt-16 pb-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-extrabold text-bcw-text-primary mb-2">
              🐸 捕词蛙
            </div>
            <p className="text-sm text-bcw-text-secondary">
              记单词，先记画面
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-bcw-text-primary mb-4 text-sm">产品</h4>
            <ul className="space-y-2 text-sm text-bcw-text-secondary">
              <li><a href="/#features" className="hover:text-bcw-green">功能</a></li>
              <li><a href="/#demo-video" className="hover:text-bcw-green">视频演示</a></li>
              <li><a href="#" className="hover:text-bcw-green">内测申请</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-bcw-text-primary mb-4 text-sm">公司</h4>
            <ul className="space-y-2 text-sm text-bcw-text-secondary">
              <li><a href="/about" className="hover:text-bcw-green">关于我们</a></li>
              <li><a href="mailto:yangjl20@mails.tsinghua.edu.cn" className="hover:text-bcw-green">联系我们</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-bcw-text-primary mb-4 text-sm">法律</h4>
            <ul className="space-y-2 text-sm text-bcw-text-secondary">
              <li><a href="/privacy" className="hover:text-bcw-green">隐私政策</a></li>
              <li><a href="/terms" className="hover:text-bcw-green">服务条款</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-bcw-border pt-8 text-center text-sm text-bcw-text-secondary">
          © 2026 言启教育科技（东莞）有限责任公司
        </div>
      </div>
    </footer>
  )
}
