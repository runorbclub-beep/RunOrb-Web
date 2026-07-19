// Agent 类型定义

export interface BluetoothDevice {
  id: string
  name: string
  mac: string
  connected: boolean
  peripheral?: any // noble peripheral 对象
}

export interface RunData {
  rpm: number
  circle_count: number
  distance: number
  duration: number
  calories: number
  start_time?: number
  stop_time?: number
}

export type AgentMessage =
  | { type: 'scan_result'; devices: BluetoothDevice[] }
  | { type: 'connect_success'; device: BluetoothDevice }
  | { type: 'connect_failed'; deviceId: string; error: string }
  | { type: 'data'; data: Partial<RunData> }
  | { type: 'start_run'; data: { start_time: number } }
  | { type: 'stop_run'; data: RunData }
  | { type: 'error'; error: string }

export type ClientMessage =
  | { type: 'scan_start' }
  | { type: 'connect'; deviceId: string }
  | { type: 'disconnect'; deviceId: string }
  | { type: 'start_run'; data: {} }
  | { type: 'stop_run'; data: {} }
