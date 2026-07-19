// 摇跑PK页面
import { useState, useEffect } from 'react'
import { pkApi } from '../lib/api'
import type { PKRoom, PKProgress } from '../types/runorb'

export default function PKPage() {
  const [roomNumber, setRoomNumber] = useState('')
  const [currentRoom, setCurrentRoom] = useState<PKRoom | null>(null)
  const [pkProgress, setPkProgress] = useState<PKProgress | null>(null)
  const [myRoomNumber, setMyRoomNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMyRoomNumber()
  }, [])

  const loadMyRoomNumber = async () => {
    try {
      const response = await pkApi.getRoomNumber()
      if (response.data) {
        setMyRoomNumber((response.data as any).room_number)
      }
    } catch (error) {
      console.error('加载房间号失败:', error)
    }
  }

  const handleCreateRoom = async (pkType: 'double' | 'group') => {
    setLoading(true)
    try {
      const maxPlayers = pkType === 'double' ? 2 : 6
      const response = await pkApi.createRoom(pkType, maxPlayers)
      if (response.data) {
        const room = response.data as PKRoom
        setCurrentRoom(room)
        setMyRoomNumber(room.room_number)
        alert(`✅ 房间创建成功！\n房间号: ${room.room_number}\n请分享给好友`)
      }
    } catch (error) {
      console.error('创建房间失败:', error)
      alert('❌ 创建房间失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!roomNumber.trim()) {
      alert('请输入房间号')
      return
    }

    setLoading(true)
    try {
      const response = await pkApi.joinRoom(roomNumber)
      if (response.data) {
        setCurrentRoom({
          room_id: (response.data as any).room_id,
          room_number,
          creator_id: '',
          creator_name: '',
          status: 'waiting',
          player_count: 0,
          max_players: 2,
          created_at: Date.now(),
          pk_type: 'double',
        })
        alert('✅ 成功加入房间！')
      }
    } catch (error) {
      console.error('加入房间失败:', error)
      alert('❌ 加入房间失败，请检查房间号')
    } finally {
      setLoading(false)
    }
  }

  const handleStartPK = async () => {
    if (!currentRoom) return

    try {
      await pkApi.startPK(currentRoom.room_id)
      alert('✅ PK 已开始！请跳转到随手摇页面开始摇跑')
      // TODO: 跳转到随手摇页面，并在完成后自动上传PK数据
    } catch (error) {
      console.error('开始PK失败:', error)
      alert('❌ 开始PK失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">⚔️ 摇跑PK</h1>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        {!currentRoom ? (
          <div>
            {/* 创建房间 */}
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">创建PK房间</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => handleCreateRoom('double')}
                  disabled={loading}
                  className="py-8 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
                >
                  👥 双人对战
                  <div className="text-sm font-normal text-gray-200 mt-2">
                    1v1 实时PK
                  </div>
                </button>
                <button
                  onClick={() => handleCreateRoom('group')}
                  disabled={loading}
                  className="py-8 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
                >
                  👨‍👩‍👧‍👦 群组对战
                  <div className="text-sm font-normal text-gray-200 mt-2">
                    最多6人同时PK
                  </div>
                </button>
              </div>
            </div>

            {/* 加入房间 */}
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">加入PK房间</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="输入房间号"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
                >
                  {loading ? '加入中...' : '加入房间'}
                </button>
              </div>
            </div>

            {/* 我的房间号 */}
            {myRoomNumber && (
              <div className="bg-green-900/30 rounded-2xl p-6 border border-green-700">
                <h2 className="text-xl font-semibold mb-2">我的房间</h2>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {myRoomNumber}
                  </div>
                  <p className="text-sm text-gray-300 mb-4">分享此房间号邀请好友</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(myRoomNumber)
                      alert('✅ 房间号已复制到剪贴板')
                    }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                  >
                    📋 复制房间号
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* PK 房间详情 */}
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">PK 房间</h2>
                <button
                  onClick={() => {
                    setCurrentRoom(null)
                    setRoomNumber('')
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  退出房间
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-orange-400 mb-2">
                  {currentRoom.room_number}
                </div>
                <div className="text-gray-400">
                  {currentRoom.pk_type === 'double' ? '双人对战' : '群组对战'}
                </div>
              </div>

              {pkProgress && pkProgress.players.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold mb-3">实时对战</h3>
                  {pkProgress.players.map((player) => (
                    <div
                      key={player.user_id}
                      className="flex justify-between items-center bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        {player.avatar && (
                          <img src={player.avatar} alt="" className="w-10 h-10 rounded-full" />
                        )}
                        <div>
                          <div className="font-semibold">{player.username}</div>
                          <div className="text-sm text-gray-400">
                            {player.status === 'playing' ? '摇跑中...' : '准备中'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-400">
                          {player.rpm} RPM
                        </div>
                        <div className="text-sm text-gray-400">
                          {player.circle_count.toLocaleString()} 圈
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  等待其他玩家加入...
                  <div className="text-sm mt-2">
                    当前玩家: {currentRoom.player_count}/{currentRoom.max_players}
                  </div>
                </div>
              )}
            </div>

            {/* 开始PK按钮 */}
            {currentRoom.status === 'waiting' && (
              <button
                onClick={handleStartPK}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold text-lg transition-colors"
              >
                🚀 开始PK
              </button>
            )}

            {currentRoom.status === 'playing' && (
              <div className="text-center py-4 text-green-400">
                PK 进行中，请前往随手摇页面开始摇跑
              </div>
            )}
          </div>
        )}

        {/* PK规则说明 */}
        <div className="mt-8 bg-blue-900/30 rounded-2xl p-6 border border-blue-700">
          <h3 className="font-semibold mb-3">📖 PK规则</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• 双人对战：1v1 实时PK，比拼转速和圈数</li>
            <li>• 群组对战：最多6人同时PK，实时排名</li>
            <li>• PK过程中实时同步双方数据</li>
            <li>• PK结束后自动保存记录到个人数据</li>
            <li>• 可以创建房间邀请好友，或输入房间号加入</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
