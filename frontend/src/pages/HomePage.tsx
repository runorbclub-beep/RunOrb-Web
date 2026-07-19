// 首页
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">🏃 RunOrb</h1>
          <div className="flex gap-4">
            <Link to="/mydata" className="text-gray-300 hover:text-white">
              我的数据
            </Link>
            <Link to="/ranking" className="text-gray-300 hover:text-white">
              排行榜
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Hero 区域 */}
        <div className="text-center py-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            摇跑球，摇出健康
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            连接蓝牙设备，开始你的摇跑之旅
          </p>
          <Link
            to="/freestyle"
            className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold text-lg transition-colors"
          >
            立即开始 →
          </Link>
        </div>

        {/* 功能入口 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard
            title="随手摇"
            description="自由摇跑，记录每一次运动"
            icon="🏃"
            to="/freestyle"
            color="orange"
          />
          <FeatureCard
            title="摇跑打榜"
            description="参与赛事，与跑友一较高下"
            icon="🏆"
            to="/compete"
            color="yellow"
          />
          <FeatureCard
            title="摇跑PK"
            description="实时对战，看谁转速更快"
            icon="⚔️"
            to="/pk"
            color="purple"
          />
          <FeatureCard
            title="我的数据"
            description="查看运动记录，追踪进步"
            icon="📊"
            to="/mydata"
            color="blue"
          />
        </div>

        {/* 今日榜单 */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">📅 今日榜单</h3>
            <Link to="/ranking" className="text-orange-500 hover:text-orange-400 text-sm">
              查看全部 →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">今日最高转速</div>
              <div className="text-2xl font-bold text-orange-400">8,500 RPM</div>
              <div className="text-sm text-gray-300 mt-1">by 张三</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">今日累计距离</div>
              <div className="text-2xl font-bold text-blue-400">12.5 km</div>
              <div className="text-sm text-gray-300 mt-1">by 李四</div>
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700">
          <h3 className="font-semibold mb-3">💡 快速开始</h3>
          <ol className="text-sm text-gray-300 space-y-2">
            <li>1. 下载并安装 RunOrb Agent 应用</li>
            <li>2. 启动 Agent 应用，确保蓝牙已开启</li>
            <li>3. 打开摇跑球设备</li>
            <li>4. 在"随手摇"页面扫描并连接设备</li>
            <li>5. 开始摇跑，数据会自动记录</li>
          </ol>
          <div className="mt-4">
            <a
              href="https://github.com/runorbclub-beep/RunOrb-Web#agent-下载"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
            >
              📥 下载 Agent
            </a>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>© 2024 RunOrb. All rights reserved.</p>
          <p className="mt-2">
            将 RunOrb-Base iOS App 完整迁移到 Web 平台
          </p>
        </div>
      </footer>
    </div>
  )
}

// 功能卡片组件
function FeatureCard({
  title,
  description,
  icon,
  to,
  color,
}: {
  title: string
  description: string
  icon: string
  to: string
  color: 'orange' | 'yellow' | 'purple' | 'blue'
}) {
  const colorClasses = {
    orange: 'hover:border-orange-500',
    yellow: 'hover:border-yellow-500',
    purple: 'hover:border-purple-500',
    blue: 'hover:border-blue-500',
  }

  return (
    <Link
      to={to}
      className={`block bg-gray-800 rounded-2xl p-6 border border-gray-700 transition-all ${colorClasses[color]} hover:scale-105`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  )
}
