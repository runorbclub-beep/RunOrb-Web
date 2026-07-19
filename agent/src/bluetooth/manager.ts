// 蓝牙设备管理器
import noble from '@abandonware/noble'
import type { BluetoothDevice, RunData } from '../types'

export class BluetoothManager {
  private devices: Map<string, BluetoothDevice> = new Map()
  private connectedDevice: BluetoothDevice | null = null
  private isScanning = false
  private dataCallback: ((data: Partial<RunData>) => void) | null = null

  constructor() {
    this.setupNoble()
  }

  private setupNoble() {
    noble.on('stateChange', (state) => {
      console.log('蓝牙状态:', state)
      if (state === 'poweredOn') {
        console.log('✅ 蓝牙已启用')
      } else {
        console.log('⚠️ 蓝牙未启用')
      }
    })

    noble.on('discover', (peripheral) => {
      this.handleDeviceDiscovered(peripheral)
    })
  }

  private handleDeviceDiscovered(peripheral: any) {
    const name = peripheral.advertisement.localName || ''
    const id = peripheral.id

    // 只识别摇跑球设备
    if (!name.includes('Run') && !name.includes('WLQ')) {
      return
    }

    const device: BluetoothDevice = {
      id,
      name,
      mac: this.extractMacAddress(peripheral),
      connected: false,
      peripheral,
    }

    this.devices.set(id, device)
    console.log('🔍 发现设备:', name)
  }

  private extractMacAddress(peripheral: any): string {
    // 从设备名称或广告数据中提取 MAC 地址
    const name = peripheral.advertisement.localName || ''
    if (name.length >= 16) {
      return name.substring(4, 16)
    }
    return id
  }

  async startScanning(): Promise<BluetoothDevice[]> {
    if (this.isScanning) {
      return Array.from(this.devices.values())
    }

    this.devices.clear()
    this.isScanning = true

    try {
      await noble.startScanningAsync([], false)
      console.log('🔍 开始扫描...')

      // 10秒后停止扫描
      setTimeout(() => {
        this.stopScanning()
      }, 10000)

      return Array.from(this.devices.values())
    } catch (error) {
      console.error('扫描失败:', error)
      this.isScanning = false
      throw error
    }
  }

  async stopScanning() {
    if (this.isScanning) {
      await noble.stopScanningAsync()
      this.isScanning = false
      console.log('⏹️ 停止扫描')
    }
  }

  async connectDevice(deviceId: string): Promise<BluetoothDevice> {
    const device = this.devices.get(deviceId)
    if (!device) {
      throw new Error('设备不存在')
    }

    if (this.connectedDevice) {
      await this.disconnect()
    }

    try {
      await device.peripheral.connectAsync()
      device.connected = true
      this.connectedDevice = device

      console.log('✅ 已连接到设备:', device.name)

      // 发现服务和特征
      const services = await device.peripheral.discoverServicesAsync([])
      console.log('发现服务:', services.length)

      for (const service of services) {
        const characteristics = await service.discoverCharacteristicsAsync([])
        for (const characteristic of characteristics) {
          // 订阅数据通知
          if (this.canNotify(characteristic)) {
            await characteristic.subscribeAsync()
            characteristic.on('data', (data: Buffer) => {
              this.handleDataReceived(data)
            })
          }
        }
      }

      return device
    } catch (error) {
      console.error('连接失败:', error)
      device.connected = false
      throw error
    }
  }

  private canNotify(characteristic: any): boolean {
    const properties = characteristic.properties || []
    return properties.includes('notify') || properties.includes('notify')
  }

  private handleDataReceived(data: Buffer) {
    console.log('📦 收到数据:', data.toString('hex'))

    try {
      const parsed = this.parseData(data)
      if (this.dataCallback) {
        this.dataCallback(parsed)
      }
    } catch (error) {
      console.error('解析数据失败:', error)
    }
  }

  private parseData(data: Buffer): Partial<RunData> {
    // 根据实际设备协议解析数据
    // 这是一个示例格式，需要根据实际设备调整
    if (data.length < 6) {
      return {}
    }

    const rpm = data.readUInt16BE(0)
    const circleCount = data.readUInt32BE(2)
    const distance = circleCount * 0.001 // 转换为公里
    const calories = circleCount * 0.05 // 估算卡路里

    return {
      rpm,
      circle_count: circleCount,
      distance,
      calories,
    }
  }

  async disconnect() {
    if (this.connectedDevice) {
      const device = this.connectedDevice
      await device.peripheral.disconnectAsync()
      device.connected = false
      this.connectedDevice = null
      console.log('🔌 已断开连接')
    }
  }

  onData(callback: (data: Partial<RunData>) => void) {
    this.dataCallback = callback
  }

  isConnected(): boolean {
    return this.connectedDevice !== null && this.connectedDevice.connected
  }

  getConnectedDevice(): BluetoothDevice | null {
    return this.connectedDevice
  }
}
