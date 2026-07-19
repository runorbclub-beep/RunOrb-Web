// 随手摇页面
import { useState, useEffect } from 'react'
import { agentClient } from '../lib/agent'
import { runApi } from '../lib/api'
import type { RunData, BluetoothDevice } from '../types/runorb'
import { AgentStatus } from '../components/AgentStatus'

export default function FreeStylePage() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([])
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [runData, setRunData] = useState<RunData>({
    rpm: 0,
    circle_count: 0,
    distance: 0,
    duration: 0,
    calories: 0,
    start_time: Date.now(),
  })

  useEffect(() => {
    // 监听设备扫描结果
    const unsubscribe = agentClient.on('scan_result', (message) => {
      setDevices(message.devices)
    })

    // 监听连接成功
    agentClient.on('connect_success', (message) => {
      setConnectedDevice(message.device)
    })

    // 监听连接失败
    agentClient.on('connect_failed', (message) => {
      alert(`连接失败: ${message.error}`)
    })

    // 监听实时数据
    agentClient.on('data', (message) => {
      if (message.data) {
        setRunData(prev => ({
          ...prev,
          ...message.data,
        }))
      }
    })

    // 监听断开连接
    agentClient.on('disconnect', () => {
      setConnectedDevice(null)
      setIsRunning(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleScanDevices = () => {
    setDevices([])
    agentClient.scanDevices()
  }

  const handleConnectDevice = (deviceId: string) => {
    agentClient.connectDevice(deviceId)
  }

  const handleDisconnectDevice = () => {
    if (connectedDevice) {
      agentClient.disconnectDevice(connectedDevice.id)
    }
  }

  const handleStartRun = () => {
    if (!connectedDevice) {
      alert('请先连接设备')
      return
    }

    setIsRunning(true)
    setRunData({
      rpm: 0,
      circle_count: 0,
      distance: 0,
      duration: 0,
      calories: 0,
      start_time: Date.now(),
    })

    agentClient.startRun()

    // 启动计时器
    const timer = setInterval(() => {
      setRunData(prev => ({
        ...prev,
        duration: prev.duration + 1,
      }))
    }, 1000)

    // 清理计时器
    return () => clearInterval(timer)
  }

  const handleStopRun = async () => {
    if (!isRunning) return

    setIsRunning(false)

    const finalData = {
      ...runData,
      stop_time: Date.now(),
      source: 'agent' as const,
    }

    // 停止 Agent 记录
    agentClient.stopRun()

    // 上传数据到服务器
    try {
      await runApi.uploadRunData(finalData as any)
      alert('✅ 运动数据已保存！')
    } catch (error) {
      console.error('上传数据失败:', error)
      alert('❌ 上传数据失败，请重试')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">🏃 随手摇</h1>
          <AgentStatus />
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* 设备连接区域 */}
        {!connectedDevice && (
          <div className="mb-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📱 连接设备</h2>

            {devices.length === 0 ? (
              <button
                onClick={handleScanDevices}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-xl font-semibold transition-colors"
              >
                🔍 扫描设备
              </button>
            ) : (
              <div className="space-y-3">
                {devices.map(device => (
                  <div
                    key={device.id}
                    className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                  >
                    <div>
                      <div className="font-semibold">{device.name}</div>
                      <div className="text-sm text-gray-400">MAC: {device.mac}</div>
                    </div>
                    <button
                      onClick={() => handleConnectDevice(device.id)}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                    >
                      连接
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleScanDevices}
                  className="w-full py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors"
                >
                  🔄 重新扫描
                </button>
              </div>
            )}
          </div>
        )}

        {/* 已连接设备信息 */}
        {connectedDevice && (
          <div className="mb-8 bg-green-900/30 rounded-2xl p-6 border border-green-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">✅ 已连接</h2>
                <p className="text-gray-300">{connectedDevice.name}</p>
              </div>
              <button
                onClick={handleDisconnectDevice}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                断开连接
              </button>
            </div>
          </div>
        )}

        {/* 运动控制区域 */}
        <div className="mb-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex gap-4 mb-6">
            {!isRunning ? (
              <button
                onClick={handleStartRun}
                disabled={!connectedDevice}
                className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
              >
                🚀 开始摇跑
              </button>
            ) : (
              <button
                onClick={handleStopRun}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg transition-colors"
              >
                ⏹️ 停止摇跑
              </button>
            )}
          </div>

          {/* 实时数据展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">
                {formatNumber(runData.rpm)}
              </div>
              <div className="text-sm text-gray-400 mt-1">RPM</div>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {formatNumber(runData.circle_count)}
              </div>
              <div className="text-sm text-gray-400 mt-1">圈数</div>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">
                {runData.distance.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400 mt-1">公里</div>
            </div>

            <div className="bg-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">
                {formatTime(runData.duration)}
              </div>
              <div className="text-sm text-gray-400 mt-1">时长</div>
            </div>
          </div>

          {/* 卡路里 */}
          <div className="mt-4 bg-gray-700 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-red-400">
              {formatNumber(Math.floor(runData.calories))}
            </div>
            <div className="text-sm text-gray-400 mt-1">卡路里</div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="bg-blue-900/30 rounded-2xl p-6 border border-blue-700">
          <h3 className="font-semibold mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• 确保已安装并启动 RunOrb Agent 应用</li>
            <li>• 打开设备蓝牙，确保摇跑球已充电</li>
            <li>• 点击"扫描设备"查找附近的摇跑球</li>
            <li>• 连接成功后即可开始摇跑</li>
            <li>• 数据会自动保存到您的账户</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
