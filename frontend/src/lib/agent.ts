// Agent WebSocket 通信管理
import type { AgentMessage, BluetoothDevice, RunData } from '../types/runorb'

export class AgentClient {
  private ws: WebSocket | null = null
  private reconnectTimer: number | null = null
  private messageHandlers: Map<string, Array<(data: any) => void>> = new Map()
  private readonly AGENT_URL = 'ws://localhost:8081'

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.AGENT_URL)

        this.ws.onopen = () => {
          console.log('✅ Agent 已连接')
          this.clearReconnect()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: AgentMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('解析 Agent 消息失败:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('🔌 Agent 连接断开')
          this.scheduleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('❌ Agent 连接错误:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect() {
    this.clearReconnect()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return
    this.reconnectTimer = window.setTimeout(() => {
      console.log('🔄 尝试重连 Agent...')
      this.connect().catch(() => {
        // 重连失败，继续尝试
      })
    }, 3000)
  }

  private clearReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private handleMessage(message: AgentMessage) {
    const handlers = this.messageHandlers.get(message.type)
    if (handlers) {
      handlers.forEach(handler => handler(message))
    }
  }

  on<T extends AgentMessage>(
    type: T['type'],
    handler: (message: T) => void
  ): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler as any)

    // 返回取消监听函数
    return () => {
      const handlers = this.messageHandlers.get(type)
      if (handlers) {
        const index = handlers.indexOf(handler as any)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  send(message: AgentMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('Agent 未连接，无法发送消息')
    }
  }

  // 便捷方法
  scanDevices() {
    this.send({ type: 'scan_start' })
  }

  connectDevice(deviceId: string) {
    this.send({ type: 'connect', deviceId })
  }

  disconnectDevice(deviceId: string) {
    this.send({ type: 'disconnect', deviceId })
  }

  startRun() {
    this.send({ type: 'start_run', data: {} })
  }

  stopRun() {
    this.send({ type: 'stop_run', data: {} })
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// 全局单例
export const agentClient = new AgentClient()
