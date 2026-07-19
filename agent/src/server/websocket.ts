// WebSocket 服务器
import WebSocket, { WebSocketServer } from 'ws'
import { BluetoothManager } from '../bluetooth/manager'
import type { ClientMessage, AgentMessage, RunData } from '../types'

export class AgentServer {
  private wss: WebSocketServer
  private btManager: BluetoothManager
  private runData: Partial<RunData> = {}
  private isRunning = false
  private runStartTime: number = 0

  constructor(port: number = 8081) {
    this.wss = new WebSocketServer({ port })
    this.btManager = new BluetoothManager()

    this.setupServer()
    this.setupBluetooth()
  }

  private setupServer() {
    console.log(`🚀 WebSocket 服务器启动在端口 ${this.wss.options.port}`)

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('✅ 客户端已连接')

      ws.on('message', (data: string) => {
        try {
          const message: ClientMessage = JSON.parse(data)
          this.handleMessage(message, ws)
        } catch (error) {
          console.error('解析消息失败:', error)
          this.sendError(ws, '无效的消息格式')
        }
      })

      ws.on('close', () => {
        console.log('🔌 客户端已断开')
      })

      ws.on('error', (error) => {
        console.error('WebSocket 错误:', error)
      })
    })
  }

  private setupBluetooth() {
    this.btManager.onData((data) => {
      this.runData = { ...this.runData, ...data }

      if (this.isRunning) {
        this.broadcast({
          type: 'data',
          data: this.runData,
        })
      }
    })
  }

  private async handleMessage(message: ClientMessage, ws: WebSocket) {
    switch (message.type) {
      case 'scan_start':
        await this.handleScanStart(ws)
        break

      case 'connect':
        await this.handleConnect(message.deviceId, ws)
        break

      case 'disconnect':
        await this.handleDisconnect(ws)
        break

      case 'start_run':
        this.handleStartRun(ws)
        break

      case 'stop_run':
        await this.handleStopRun(ws)
        break

      default:
        this.sendError(ws, '未知的消息类型')
    }
  }

  private async handleScanStart(ws: WebSocket) {
    try {
      const devices = await this.btManager.startScanning()
      this.send(ws, {
        type: 'scan_result',
        devices,
      })
    } catch (error: any) {
      this.sendError(ws, error.message)
    }
  }

  private async handleConnect(deviceId: string, ws: WebSocket) {
    try {
      const device = await this.btManager.connectDevice(deviceId)
      this.send(ws, {
        type: 'connect_success',
        device,
      })
    } catch (error: any) {
      this.send(ws, {
        type: 'connect_failed',
        deviceId,
        error: error.message,
      })
    }
  }

  private async handleDisconnect(ws: WebSocket) {
    await this.btManager.disconnect()
    this.send(ws, {
      type: 'disconnect',
      deviceId: this.btManager.getConnectedDevice()?.id || '',
    })
  }

  private handleStartRun(ws: WebSocket) {
    if (!this.btManager.isConnected()) {
      this.sendError(ws, '请先连接设备')
      return
    }

    this.isRunning = true
    this.runStartTime = Date.now()
    this.runData = {
      rpm: 0,
      circle_count: 0,
      distance: 0,
      duration: 0,
      calories: 0,
    }

    this.send(ws, {
      type: 'start_run',
      data: {
        start_time: this.runStartTime,
      },
    })

    console.log('🏃 开始摇跑')
  }

  private async handleStopRun(ws: WebSocket) {
    if (!this.isRunning) {
      this.sendError(ws, '没有正在进行的摇跑')
      return
    }

    this.isRunning = false

    const finalData: RunData = {
      rpm: this.runData.rpm || 0,
      circle_count: this.runData.circle_count || 0,
      distance: this.runData.distance || 0,
      duration: Math.floor((Date.now() - this.runStartTime) / 1000),
      calories: this.runData.calories || 0,
      start_time: this.runStartTime,
      stop_time: Date.now(),
    }

    this.send(ws, {
      type: 'stop_run',
      data: finalData,
    })

    console.log('⏹️ 停止摇跑:', finalData)
  }

  private send(ws: WebSocket, message: AgentMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  private broadcast(message: AgentMessage) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, {
      type: 'error',
      error,
    })
  }

  close() {
    this.wss.close()
    this.btManager.disconnect()
  }
}
