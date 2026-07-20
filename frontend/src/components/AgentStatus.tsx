// Agent 连接状态指示器
import { useEffect, useState } from 'react'
import { agentClient } from '../lib/agent'
import { Link } from 'react-router-dom'

export function AgentStatus() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      setConnected(agentClient.isConnected())
    }

    checkConnection()

    // 定期检查连接状态
    const interval = setInterval(checkConnection, 2000)

    // 尝试连接
    if (!connected) {
      agentClient.connect().catch(() => {
        // Agent 可能未启动，这是正常情况
      })
    }

    return () => clearInterval(interval)
  }, [connected])

  if (connected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-green-400">Agent 已连接</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 rounded-full">
      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      <span className="text-sm text-yellow-400">
        Agent 未连接 - <Link to="/download" className="underline hover:text-white">点击下载</Link>
      </span>
    </div>
  )
}
