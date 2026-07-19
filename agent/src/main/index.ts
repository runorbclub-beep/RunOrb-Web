// Agent 主程序
import { AgentServer } from '../server/websocket'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081

async function main() {
  try {
    const server = new AgentServer(PORT)

    console.log(`
╔════════════════════════════════════════╗
║       RunOrb Agent 已启动               ║
║                                        ║
║  WebSocket: ws://localhost:${PORT}     ║
║  版本: 1.0.0                          ║
║                                        ║
║  按 Ctrl+C 停止                        ║
╚════════════════════════════════════════╝
    `)

    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('\n👋 正在关闭 Agent...')
      server.close()
      process.exit(0)
    })
  } catch (error) {
    console.error('❌ 启动失败:', error)
    process.exit(1)
  }
}

main()
