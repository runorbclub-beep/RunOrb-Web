# RunOrb-Base Web 版本 - 部署指南

## 项目概述

RunOrb-Base Web 版本将 iOS App 的完整功能迁移到 Web 平台，通过 Agent 桥接应用解决蓝牙连接问题。

## 系统架构

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

## 部署步骤

### 1. 前端部署 (Cloudflare Pages)

#### 构建
```bash
cd frontend
npm install
npm run build
```

#### 部署选项

**选项 A: 通过 Cloudflare Pages 部署**
```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npm run deploy
```

**选项 B: 通过 GitHub 集成自动部署**
1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 设置构建命令: `npm run build`
4. 设置输出目录: `dist`
5. 每次推送到主分支自动部署

#### 环境变量
在 Cloudflare Pages 设置中添加：
- `VITE_API_BASE`: API 服务器地址

### 2. Agent 应用部署

#### 开发版本
```bash
cd agent
npm install
npm run dev
```

#### 生产构建

**Windows**
```bash
npm run build:win
# 输出: release/RunOrb-Agent Setup.exe
```

**macOS**
```bash
npm run build:mac
# 输出: release/RunOrb-Agent.dmg
```

**Linux**
```bash
npm run build:linux
# 输出: release/runorb-agent-appimage.deb
```

#### 分发
1. 将构建好的安装包上传到服务器
2. 在 Web 端提供下载链接
3. 用户下载安装后，Agent 会自动在后台启动 WebSocket 服务器

### 3. API 后端部署 (Cloudflare Workers)

#### 开发
```bash
cd api
npm install
npm run dev
```

#### 部署
```bash
npm run deploy
```

#### 环境变量设置
在 Cloudflare Workers 中设置：
- `DASHSCOPE_API_KEY`: AI 服务 API Key
- `XF_API_KEY`: 讯飞 API Key（可选）
- `XF_API_SECRET`: 讯飞 API Secret（可选）
- `JWT_SECRET`: JWT 密钥

### 4. 数据库初始化 (Cloudflare D1)

#### 创建数据库
```bash
wrangler d1 create runorb-db
```

#### 执行迁移
```bash
wrangler d1 execute runorb-db --file=./schema.sql
```

## 用户使用流程

### 首次使用

1. **下载并安装 Agent**
   - 访问网站
   - 点击"下载 Agent"按钮
   - 下载对应平台的安装包
   - 安装并启动 Agent

2. **连接蓝牙设备**
   - 打开摇跑球设备
   - 在"随手摇"页面点击"扫描设备"
   - 选择设备并连接

3. **开始运动**
   - 点击"开始摇跑"
   - 实时查看运动数据
   - 完成后自动保存

### 功能使用

#### 随手摇
- 自由摇跑，记录运动数据
- 支持实时 RPM、圈数、距离、卡路里显示

#### 摇跑打榜
- 浏览赛事并报名
- 查看实时排行榜
- 与其他跑友竞争排名

#### 摇跑PK
- 创建或加入 PK 房间
- 实时对战数据同步
- 查看历史 PK 记录

#### 我的数据
- 查看运动记录
- 成就和徽章展示
- 数据统计分析

#### 排行榜
- 今日/本周最高转速榜
- 今日/本周累计距离榜
- 实时更新排名

## 系统要求

### Web 端
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
- WebSocket 支持
- JavaScript 启用

### Agent 应用
- **Windows**: Windows 10+
- **macOS**: macOS 10.13+
- **Linux**: Ubuntu 18.04+, Fedora 28+
- 蓝牙 4.0+ 适配器
- 管理员权限（某些系统）

### 蓝牙设备
- 摇跑球（BLE 设备）
- 已充电并开机

## 故障排除

### Agent 连接失败

**问题**: Agent 状态显示"未连接"

**解决方案**:
1. 检查 Agent 应用是否正在运行
2. 检查防火墙设置
3. 确认 WebSocket 端口 8081 未被占用
4. 重启 Agent 应用

### 蓝牙设备扫描不到

**问题**: 扫描设备列表为空

**解决方案**:
1. 确认摇跑球已开机
2. 检查系统蓝牙是否开启
3. 关闭其他蓝牙应用
4. **Windows**: 以管理员身份运行 Agent
5. **macOS**: 在系统设置中允许 Agent 访问蓝牙
6. **Linux**: 运行 `sudo service bluetooth start`

### 数据上传失败

**问题**: 运动结束后提示"上传数据失败"

**解决方案**:
1. 检查网络连接
2. 确认 API 服务器正常运行
3. 重新登录账户
4. 查看浏览器控制台错误信息

### PK 功能异常

**问题**: PK 房间连接断开

**解决方案**:
1. 检查 Agent 连接状态
2. 确认 WebSocket 连接正常
3. 刷新页面重新加入房间
4. 检查网络延迟

## 性能优化

### 前端
- 使用 Cloudflare CDN 全球加速
- 启用 Service Worker 缓存静态资源
- 代码分割和懒加载
- 图片压缩和优化

### Agent
- 最小化 CPU 使用
- 优化蓝牙扫描频率
- 数据本地缓存

### API
- Cloudflare Workers 边缘计算
- D1 数据库查询优化
- 启用缓存层

## 安全考虑

1. **数据传输**
   - WebSocket 加密 (WSS)
   - HTTPS 强制加密
   - API 密钥保护

2. **用户数据**
   - 密码哈希存储
   - JWT 认证
   - 敏感数据加密

3. **Agent 安全**
   - 本地 WebSocket 服务器不对外暴露
   - 蓝牙数据不存储在本地
   - 定期安全更新

## 更新和维护

### 前端更新
- Cloudflare Pages 自动部署
- 用户刷新页面即可获取更新
- 支持版本回滚

### Agent 更新
- 自动更新检查
- 增量更新下载
- 用户确认后安装

### API 更新
- Cloudflare Workers 零停机部署
- 向后兼容性保证
- API 版本管理

## 监控和日志

### 前端监控
- 错误日志收集
- 性能监控
- 用户行为分析

### Agent 日志
- 本地日志文件
- 错误上报
- 使用统计

### API 监控
- Cloudflare Analytics
- 请求日志
- 错误率监控

## 联系支持

- GitHub Issues: https://github.com/runorbclub-beep/RunOrb-Web/issues
- Email: support@runorb.us

## License

MIT
