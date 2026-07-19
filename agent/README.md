# RunOrb Agent

RunOrb Agent 是一个桥接应用，负责与蓝牙设备通信，并通过 WebSocket 与 Web 端交互。

## 功能

- 扫描并连接蓝牙摇跑球设备
- 接收设备实时数据
- 通过 WebSocket 与 Web 端通信
- 跨平台支持（Windows, macOS, Linux）

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **noble**: Node.js 蓝牙库（BLE）
- **ws**: WebSocket 服务器
- **TypeScript**: 类型安全

## 安装

```bash
cd agent
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## WebSocket 协议

### 服务端 → 客户端

```typescript
// 扫描结果
{
  type: 'scan_result',
  devices: Array<{
    id: string
    name: string
    mac: string
    connected: boolean
  }>
}

// 连接成功
{
  type: 'connect_success',
  device: {
    id: string
    name: string
    mac: string
  }
}

// 连接失败
{
  type: 'connect_failed',
  deviceId: string,
  error: string
}

// 实时数据
{
  type: 'data',
  data: {
    rpm: number
    circle_count: number
    distance: number
    calories: number
  }
}

// 开始摇跑确认
{
  type: 'start_run',
  data: {
    start_time: number
  }
}

// 停止摇跑结果
{
  type: 'stop_run',
  data: {
    rpm: number
    circle_count: number
    distance: number
    duration: number
    calories: number
  }
}
```

### 客户端 → 服务端

```typescript
// 开始扫描
{ type: 'scan_start' }

// 连接设备
{
  type: 'connect',
  deviceId: string
}

// 断开设备
{
  type: 'disconnect',
  deviceId: string
}

// 开始摇跑
{
  type: 'start_run',
  data: {}
}

// 停止摇跑
{
  type: 'stop_run',
  data: {}
}
```

## 蓝牙设备协议

摇跑球设备使用标准的 BLE GATT 协议：

- **Service UUID**: `0000FFE0-0000-1000-8000-00805F9B34FB`
- **Characteristic UUID**: `0000FFE1-0000-1000-8000-00805F9B34FB`

数据包格式（示例）：
```
[0-1]: RPM (uint16)
[2-5]: 圈数 (uint32)
[6-9]: 距离 (uint32, 单位: 米)
[10-13]: 卡路里 (uint32)
```

## 系统要求

- Windows 10+
- macOS 10.13+
- Linux（BlueZ 5.47+）
- 蓝牙 4.0+ 适配器

## 常见问题

### Windows 提示权限不足

需要以管理员身份运行 Agent。

### macOS 提示蓝牙权限

在"系统偏好设置 > 安全性与隐私 > 隐私 > 蓝牙"中允许 Agent 访问。

### Linux 找不到蓝牙设备

运行 `sudo service bluetooth start` 启动蓝牙服务。

## License

MIT
