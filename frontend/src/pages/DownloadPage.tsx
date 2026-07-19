// Agent下载页面
import { useState } from 'react'

export default function DownloadPage() {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux' | null>(null)

  const downloadAgent = () => {
    // 由于Agent还没有打包，这里提供源码链接
    window.open('https://github.com/runorbclub-beep/RunOrb-Web', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">📥 下载 Agent</h1>
          <a
            href="/"
            className="text-gray-300 hover:text-white"
          >
            ← 返回首页
          </a>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        {/* 说明 */}
        <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700 mb-8">
          <h2 className="text-xl font-semibold mb-3">💡 关于 RunOrb Agent</h2>
          <p className="text-gray-300 mb-4">
            RunOrb Agent 是一个桥接应用，负责连接蓝牙摇跑球设备。
            通过 WebSocket 与网页通信，让网页能够控制蓝牙设备。
          </p>
          <div className="bg-blue-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-300">
              <div className="font-semibold mb-2">🔧 主要功能：</div>
              <ul className="list-disc list-inside space-y-1">
                <li>扫描和连接蓝牙摇跑球设备</li>
                <li>实时接收运动数据（RPM、圈数、距离等）</li>
                <li>通过 WebSocket 与网页通信</li>
                <li>支持 Windows、macOS 和 Linux</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 系统选择 */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">🖥️ 选择你的系统</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <OSCard
              icon="🪟"
              name="Windows"
              version="Windows 10+"
              status="开发中"
              selected={selectedOS === 'windows'}
              onClick={() => setSelectedOS('windows')}
            />
            <OSCard
              icon="🍎"
              name="macOS"
              version="macOS 10.13+"
              status="开发中"
              selected={selectedOS === 'mac'}
              onClick={() => setSelectedOS('mac')}
            />
            <OSCard
              icon="🐧"
              name="Linux"
              version="Ubuntu 18.04+, Fedora 28+"
              status="开发中"
              selected={selectedOS === 'linux'}
              onClick={() => setSelectedOS('linux')}
            />
          </div>
        </div>

        {/* 开发版下载 */}
        <div className="bg-yellow-900/30 rounded-2xl p-6 border border-yellow-700 mb-8">
          <h2 className="text-xl font-semibold mb-3">⚠️ 当前状态</h2>
          <p className="text-gray-300 mb-4">
            Agent 应用正在开发中。你现在可以：
          </p>
          <div className="space-y-3">
            <StepCard
              step="1"
              title="获取源代码"
              description="访问 GitHub 仓库获取完整源代码"
              action="查看源码"
              actionLink="https://github.com/runorbclub-beep/RunOrb-Web"
            />
            <StepCard
              step="2"
              title="安装依赖"
              description="需要 Node.js 18+ 和 npm"
              code="cd /path/to/RunOrb-Web/agent && npm install"
            />
            <StepCard
              step="3"
              title="启动 Agent"
              description="启动 WebSocket 服务器"
              code="cd /path/to/RunOrb-Web/agent && npm run dev"
            />
            <StepCard
              step="4"
              title="访问网页"
              description="确保 Agent 运行后，访问网页即可连接"
              actionLink="http://localhost:5175"
              actionText="打开网页"
            />
          </div>
        </div>

        {/* 系统要求 */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">⚙️ 系统要求</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Windows</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Windows 10 或更高版本</li>
                <li>• 蓝牙 4.0+ 适配器</li>
                <li>• 管理员权限（某些功能）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">macOS</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• macOS 10.13 (High Sierra) 或更高版本</li>
                <li>• 内置蓝牙或支持的蓝牙适配器</li>
                <li>• 允许 Agent 访问蓝牙</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Linux</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Ubuntu 18.04+ / Fedora 28+ 或其他主流发行版</li>
                <li>• BlueZ 5.47+</li>
                <li>• 蓝牙适配器支持</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">摇跑球设备</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• BLE 蓝牙 4.0+</li>
                <li>• 设备已充电并开机</li>
                <li>• 设备名称包含 "Run" 或 "WLQ"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 故障排除 */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">🔧 常见问题</h2>
          <div className="space-y-4">
            <ProblemCard
              question="Agent 无法启动？"
              answer="确保已安装 Node.js 18+，并在 agent 目录下运行 npm install"
            />
            <ProblemCard
              question="找不到蓝牙设备？"
              answer="1. 确认摇跑球已开机\n2. 检查系统蓝牙是否开启\n3. 关闭其他蓝牙应用\n4. Windows 需要管理员权限"
            />
            <ProblemCard
              question="网页显示 Agent 未连接？"
              answer="1. 确认 Agent 正在运行\n2. 检查端口 8081 是否被占用\n3. 查看防火墙设置\n4. 刷新网页重试"
            />
          </div>
        </div>

        {/* 获取帮助 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">需要帮助？</p>
          <a
            href="https://github.com/runorbclub-beep/RunOrb-Web/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
          >
            在 GitHub 提问
          </a>
        </div>
      </main>
    </div>
  )
}

// 系统卡片组件
function OSCard({
  icon,
  name,
  version,
  status,
  selected,
  onClick,
}: {
  icon: string
  name: string
  version: string
  status: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? 'border-orange-500 bg-orange-900/20'
          : 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
      }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{name}</h3>
      <p className="text-sm text-gray-400 mb-2">{version}</p>
      <div
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          status === '开发中'
            ? 'bg-yellow-900/50 text-yellow-400'
            : 'bg-green-900/50 text-green-400'
        }`}
      >
        {status}
      </div>
    </div>
  )
}

// 步骤卡片组件
function StepCard({
  step,
  title,
  description,
  code,
  action,
  actionLink,
  actionText = '执行',
}: {
  step: string
  title: string
  description: string
  code?: string
  action?: string
  actionLink?: string
  actionText?: string
}) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold">
          {step}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-gray-300 mb-2">{description}</p>
          {code && (
            <div className="bg-gray-900 rounded p-2 mb-2">
              <code className="text-xs text-green-400">{code}</code>
            </div>
          )}
          {actionLink && (
            <a
              href={actionLink}
              target={actionLink.startsWith('http') ? '_blank' : undefined}
              rel={actionLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-block px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-colors"
            >
              {actionText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// 问题卡片组件
function ProblemCard({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <span className="text-gray-400">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="px-4 py-3 bg-gray-700/30 text-sm text-gray-300 whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  )
}
