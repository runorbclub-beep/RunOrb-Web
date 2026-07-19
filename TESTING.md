# RunOrb-Web 测试指南

## 🧪 测试准备

### 1. 前端测试

#### 启动开发服务器
```bash
cd /Users/xiaoningli/RunOrb-Web/frontend
npm install
npm run dev
```

#### 测试URL
- 首页: http://localhost:5173
- 随手摇: http://localhost:5173/freestyle
- 摇跑打榜: http://localhost:5173/compete
- 摇跑PK: http://localhost:5173/pk
- 我的数据: http://localhost:5173/mydata
- 排行榜: http://localhost:5173/ranking

### 2. Agent测试

#### 启动Agent（需要先安装依赖）
```bash
cd /Users/xiaoningli/RunOrb-Web/agent
npm install
npm run dev
```

#### 验证Agent连接
打开浏览器控制台，执行：
```javascript
const ws = new WebSocket('ws://localhost:8081')
ws.onopen = () => console.log('✅ Agent连接成功')
ws.onerror = () => console.log('❌ Agent连接失败')
```

### 3. API测试（Mock模式）

由于后端API还未部署，我们先使用Mock数据测试前端UI。

#### 启用Mock模式
在前端项目中运行：
```bash
cd frontend
npm run dev
```

访问任何页面，前端会使用内置的Mock数据显示UI。

## 📋 功能测试清单

### 基础功能测试

#### ✅ 页面导航
- [ ] 首页加载正常
- [ ] 所有页面路由可访问
- [ ] 导航链接正常工作
- [ ] 页面返回按钮正常

#### ✅ 随手摇页面（`/freestyle`）
- [ ] Agent状态显示正确
- [ ] 扫描设备按钮可点击
- [ ] 设备列表显示（需要Agent运行）
- [ ] 连接设备功能（需要实际蓝牙设备）
- [ ] 实时数据显示（需要Agent运行）
- [ ] 开始/停止按钮正常
- [ ] 数据格式化显示正确

#### ✅ 摇跑打榜页面（`/compete`）
- [ ] 赛事列表显示（使用Mock数据）
- [ ] Tab切换功能
- [ ] 赛事详情查看
- [ ] 报名按钮显示
- [ ] 排行榜数据显示
- [ ] 返回按钮正常

#### ✅ 摇跑PK页面（`/pk`）
- [ ] 创建房间按钮
- [ ] 加入房间功能
- [ ] 房间号显示
- [ ] 复制房间号功能
- [ ] 开始PK按钮
- [ ] 退出房间功能

#### ✅ 我的数据页面（`/mydata`）
- [ ] 统计卡片显示
- [ ] 运动记录列表
- [ ] 成就徽章展示
- [ ] 分页功能
- [ ] 数据格式化正确

#### ✅ 排行榜页面（`/ranking`）
- [ ] 排行榜类型切换
- [ ] 排行榜数据显示
- [ ] 排名样式正确（金银铜）
- [ ] 更新时间显示

### Agent连接测试

#### ✅ WebSocket连接
1. 启动Agent:
```bash
cd agent
npm run dev
```

2. 在前端页面检查Agent状态：
   - 应显示"Agent 已连接"（绿色）
   - 如果显示"未连接"（黄色），检查：
     - Agent是否正在运行
     - 端口8081是否被占用
     - 防火墙设置

#### ✅ 蓝牙功能测试（需要实际设备）
1. 确保摇跑球已开机
2. 点击"扫描设备"
3. 检查设备列表是否显示
4. 点击"连接"测试连接功能

### UI/UX测试

#### ✅ 响应式设计
- [ ] 移动端显示正常（手机浏览器）
- [ ] 平板端显示正常
- [ ] 桌面端显示正常

#### ✅ 交互体验
- [ ] 按钮点击反馈
- [ ] 加载状态显示
- [ ] 错误提示清晰
- [ ] 动画流畅

#### ✅ 可访问性
- [ ] 大字体适合55+用户
- [ ] 对比度足够
- [ ] 按钮尺寸适中

## 🔧 测试命令

### 前端测试
```bash
# 安装依赖
cd /Users/xiaoningli/RunOrb-Web/frontend
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Agent测试
```bash
# 安装依赖
cd /Users/xiaoningli/RunOrb-Web/agent
npm install

# 启动开发模式
npm run dev

# 构建
npm run build

# 启动生产版本
npm start
```

### 类型检查
```bash
# 前端类型检查
cd frontend
npx tsc --noEmit

# Agent类型检查
cd agent
npx tsc --noEmit
```

## 🐛 常见问题排查

### 问题1: Agent连接失败
**症状**: Agent状态一直显示"未连接"

**解决方案**:
1. 确认Agent正在运行: `ps aux | grep agent`
2. 检查端口: `lsof -i :8081`
3. 重启Agent
4. 检查防火墙设置

### 问题2: 页面空白
**症状**: 访问页面时显示空白

**解决方案**:
1. 检查浏览器控制台错误
2. 清除浏览器缓存
3. 确认依赖已安装: `npm install`
4. 重启开发服务器

### 问题3: 样式异常
**症状**: 页面布局错乱

**解决方案**:
1. 确认Tailwind CSS配置正确
2. 检查index.css是否正确导入
3. 清除浏览器缓存

### 问题4: TypeScript错误
**症状**: 编辑器显示类型错误

**解决方案**:
1. 确认所有依赖已安装
2. 运行类型检查: `npx tsc --noEmit`
3. 重启TypeScript服务器（VSCode中按Cmd+Shift+P -> "Restart TypeScript Server"）

## 📊 测试报告模板

测试完成后，填写以下报告：

```markdown
## 测试报告

**测试日期**: YYYY-MM-DD
**测试环境**:
- 操作系统:
- 浏览器:
- Node版本:

### 功能测试结果
- [x] 首页
- [x] 随手摇
- [x] 摇跑打榜
- [x] 摇跑PK
- [x] 我的数据
- [x] 排行榜

### Agent测试结果
- [x] WebSocket连接
- [ ] 蓝牙扫描（需要设备）
- [ ] 设备连接（需要设备）
- [ ] 数据接收（需要设备）

### 发现的问题
1. 问题描述
2. 问题描述

### 测试结论
通过/不通过
```

## 🚀 下一步

测试通过后：
1. 修复发现的问题
2. 准备生产部署
3. 打包Agent应用
4. 推送到GitHub
