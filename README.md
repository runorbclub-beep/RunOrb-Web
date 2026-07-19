# RunOrb-Base Web 版本

将 RunOrb-Base iOS App 完整迁移到 Web 平台

## 核心功能

### 1. 随手摇 (Free Style)
- 通过 Agent 连接摇跑球设备
- 实时显示 RPM、圈数、距离、卡路里
- 自动上传运动数据
- 支持所有平台（Windows/Mac/iOS/Android）

### 2. 摇跑打榜 (Compete)
- 浏览赛事并报名
- 实时查看排行榜
- 完成后自动排名
- 赛事时间提醒

### 3. 摇跑PK (Real-time PK)
- 创建/加入 PK 房间
- 实时对战数据同步
- 双人/群组 PK
- PK 历史记录

### 4. 个人数据中心
- 运动记录列表
- 数据统计分析
- 成就和徽章系统
- 设备管理

### 5. 排行榜系统
- 今日最高转速榜
- 今日累计距离榜
- 赛事个人榜
- 赛事团队榜

## 技术架构

### 前端
- React 19 + TypeScript
- Tailwind CSS 4
- Vite 6
- WebSocket (实时通信)
- PWA (渐进式Web应用)

### 后端
- Cloudflare Workers (API)
- Cloudflare D1 (数据库)
- Cloudflare R2 (文件存储)
- WebSocket Server (实时通信)

### Agent (蓝牙桥接)
- **Windows/Mac**: Electron 应用
- **iOS/Android**: 可选的原生应用
- 本地 WebSocket 服务器 (ws://localhost:8081)
- 蓝牙设备管理
- 数据转发

## 数据流

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Web UI     │◄───────►│   Agent      │◄───────►│ 蓝牙设备     │
│  (React)    │  WS     │  (Electron)  │ BT     │  (摇跑球)    │
└─────────────┘         └──────────────┘         └─────────────┘
       │                        │
       │                        │
       ▼                        ▼
┌─────────────┐         ┌──────────────┐
│  API Server │         │  Local DB    │
│  (CF Workers)│        │  (可选)       │
└─────────────┘         └──────────────┘
```

## 项目结构

```
runorb-web/
├── frontend/                 # Web 前端
│   ├── src/
│   │   ├── pages/           # 页面
│   │   ├── components/      # 组件
│   │   ├── lib/             # 工具库
│   │   └── types/           # 类型定义
│   ├── package.json
│   └── vite.config.ts
├── agent/                    # Agent 应用
│   ├── src/
│   │   ├── bluetooth/       # 蓝牙模块
│   │   ├── server/          # WebSocket 服务器
│   │   └── main/            # 主程序
│   └── package.json
└── api/                      # 后端 API
    ├── src/
    │   ├── handlers/        # 请求处理器
    │   ├── db/              # 数据库
    │   └── websocket/       # WebSocket 服务器
    └── wrangler.toml
```

## 安装和使用

### 开发环境

1. **启动后端 API**
```bash
cd api
npm install
npm run dev
```

2. **启动 Agent**
```bash
cd agent
npm install
npm run dev
```

3. **启动前端**
```bash
cd frontend
npm install
npm run dev
```

### 生产部署

1. **部署 API** (Cloudflare Workers)
```bash
cd api
npm run deploy
```

2. **构建 Agent**
```bash
cd agent
npm run build
npm run package
```

3. **部署前端** (Cloudflare Pages)
```bash
cd frontend
npm run build
npm run deploy
```

## 协议

- 前端 ↔ Agent: WebSocket (ws://localhost:8081)
- 前端 ↔ API: HTTPS (REST API + WebSocket)
- Agent ↔ 设备: 蓝牙 (BLE)

## 兼容性

| 平台 | 蓝牙 | 随手摇 | 打榜 | PK | 排行榜 |
|------|------|--------|------|----|----|
| Windows | ✅ Agent | ✅ | ✅ | ✅ | ✅ |
| Mac | ✅ Agent | ✅ | ✅ | ✅ | ✅ |
| Android | ✅ Agent | ✅ | ✅ | ✅ | ✅ |
| iOS | ⚠️ 需Agent | ⚠️ Agent | ✅ | ✅ | ✅ |

## License

MIT
