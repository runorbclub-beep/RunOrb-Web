// 排行榜页面
import { useState, useEffect } from 'react'
import { rankingApi } from '../lib/api'
import type { Ranking } from '../types/runorb'
import { Link } from 'react-router-dom'

export default function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [selectedRanking, setSelectedRanking] = useState<Ranking | null>(null)
  const [loading, setLoading] = useState(false)

  const rankingTypes = [
    { key: 'today_highest_speed', title: '今日最高转速', icon: '🚀' },
    { key: 'today_distance', title: '今日累计距离', icon: '🏃' },
    { key: 'week_highest_speed', title: '本周最高转速', icon: '⚡' },
    { key: 'week_distance', title: '本周累计距离', icon: '📏' },
  ]

  useEffect(() => {
    loadRankings()
  }, [])

  const loadRankings = async () => {
    setLoading(true)
    try {
      const response = await rankingApi.getRankingList()
      if (response.data) {
        setRankings(response.data)
        if (response.data.length > 0) {
          setSelectedRanking(response.data[0])
        }
      }
    } catch (error) {
      console.error('加载排行榜失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRanking = async (type: string) => {
    setLoading(true)
    try {
      let response
      switch (type) {
        case 'today_highest_speed':
          response = await rankingApi.getTodayHighestSpeed()
          break
        case 'today_distance':
          response = await rankingApi.getAccumulatedDistanceToday()
          break
        // 其他类型的排行榜...
        default:
          return
      }

      if (response.data) {
        setSelectedRanking(response.data as Ranking)
      }
    } catch (error) {
      console.error('加载排行榜失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">🏆 排行榜</h1>
          <Link to="/" className="text-gray-300 hover:text-white">
            ← 返回首页
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* 排行榜类型选择 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {rankingTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => handleSelectRanking(type.key)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedRanking?.type === type.key
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.icon} {type.title}
            </button>
          ))}
        </div>

        {/* 排行榜内容 */}
        {selectedRanking && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedRanking.title}</h2>
              <div className="text-sm text-gray-400">
                更新时间: {new Date(selectedRanking.last_update).toLocaleString('zh-CN')}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : selectedRanking.items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">暂无数据</div>
            ) : (
              <div className="space-y-3">
                {selectedRanking.items.map((item, index) => (
                  <RankingItem key={item.user_id} item={item} rank={item.rank} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 排行榜说明 */}
        <div className="mt-8 bg-blue-900/30 rounded-2xl p-6 border border-blue-700">
          <h3 className="font-semibold mb-3">📖 排行榜说明</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• 今日最高转速：当日单次摇跑的最高转速排名</li>
            <li>• 今日累计距离：当日所有摇跑的总距离排名</li>
            <li>• 本周最高转速：本周单次摇跑的最高转速排名</li>
            <li>• 本周累计距离：本周所有摇跑的总距离排名</li>
            <li>• 排行榜每小时更新一次</li>
            <li>• 数据异常的记录不会被计入排行榜</li>
          </ul>
        </div>

        {/* 查看我的排名 */}
        <div className="mt-6 text-center">
          <Link
            to="/mydata"
            className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-colors"
          >
            查看我的数据
          </Link>
        </div>
      </main>
    </div>
  )
}

// 排行榜单项组件
function RankingItem({
  item,
  rank,
}: {
  item: { user_id: string; username: string; avatar?: string; value: number; value_format: string; unit: string }
  rank: number
}) {
  const rankColors = [
    'bg-yellow-500 text-black',
    'bg-gray-400 text-black',
    'bg-orange-600 text-white',
  ]

  const rankIcons = ['🥇', '🥈', '🥉']

  return (
    <div
      className={`flex justify-between items-center bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors ${
        rank === 1 ? 'ring-2 ring-yellow-500' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
            rank <= 3 ? rankColors[rank - 1] : 'bg-gray-600 text-white'
          }`}
        >
          {rank <= 3 ? rankIcons[rank - 1] : rank}
        </div>
        {item.avatar ? (
          <img src={item.avatar} alt="" className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-2xl">
            👤
          </div>
        )}
        <div>
          <div className="font-semibold text-lg">{item.username}</div>
          <div className="text-sm text-gray-400">ID: {item.user_id.slice(0, 8)}...</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-orange-400">{item.value_format}</div>
        <div className="text-sm text-gray-400">{item.unit}</div>
      </div>
    </div>
  )
}
