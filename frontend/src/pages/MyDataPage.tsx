// 个人数据中心页面
import { useState, useEffect } from 'react'
import { runApi, profileApi } from '../lib/api'
import type { RunRecord, Achievement, Medal } from '../types/runorb'
import { Link } from 'react-router-dom'

export default function MyDataPage() {
  const [records, setRecords] = useState<RunRecord[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [medals, setMedals] = useState<Medal[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadData()
    loadAchievements()
    loadMedals()
  }, [page])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await runApi.getMyRuns(page, 20)
      if (response.data) {
        setRecords((response.data as any).list || [])
      }
    } catch (error) {
      console.error('加载运动数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAchievements = async () => {
    try {
      const response = await profileApi.getMyAchievements()
      if (response.data) {
        setAchievements(response.data)
      }
    } catch (error) {
      console.error('加载成就失败:', error)
    }
  }

  const loadMedals = async () => {
    try {
      const response = await profileApi.getMyMedals()
      if (response.data) {
        setMedals(response.data)
      }
    } catch (error) {
      console.error('加载徽章失败:', error)
    }
  }

  // 统计数据
  const totalRuns = records.length
  const totalDistance = records.reduce((sum, r) => sum + r.distance, 0)
  const totalCircles = records.reduce((sum, r) => sum + r.circle_count, 0)
  const maxRpm = records.reduce((max, r) => Math.max(max, r.speed_max || 0), 0)
  const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">📊 我的数据</h1>
          <Link to="/" className="text-gray-300 hover:text-white">
            ← 返回首页
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="总运动次数" value={totalRuns} unit="次" color="orange" />
          <StatCard title="总距离" value={totalDistance.toFixed(1)} unit="km" color="blue" />
          <StatCard title="总圈数" value={totalCircles.toLocaleString()} unit="圈" color="green" />
          <StatCard title="最高转速" value={maxRpm} unit="RPM" color="purple" />
        </div>

        {/* 成就和徽章 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🏆 成就 ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h2>
            <div className="grid grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.achievement_id}
                  className={`text-center p-3 rounded-lg ${
                    achievement.unlocked
                      ? 'bg-yellow-900/30 border border-yellow-600'
                      : 'bg-gray-700/50 border border-gray-600 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {achievement.unlocked ? '🏅' : '🔒'}
                  </div>
                  <div className="text-xs font-semibold truncate">{achievement.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🎖️ 徽章 ({medals.filter(m => m.obtained).length}/{medals.length})</h2>
            <div className="grid grid-cols-4 gap-4">
              {medals.map((medal) => (
                <div
                  key={medal.medal_id}
                  className={`text-center p-3 rounded-lg ${
                    medal.obtained
                      ? 'bg-purple-900/30 border border-purple-600'
                      : 'bg-gray-700/50 border border-gray-600 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {medal.obtained ? '🏅' : '🔒'}
                  </div>
                  <div className="text-xs font-semibold truncate">{medal.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 运动记录列表 */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📝 运动记录</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              暂无运动记录
              <Link to="/freestyle" className="block mt-4 text-orange-500 hover:text-orange-400">
                开始第一次摇跑 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          )}

          {/* 分页 */}
          {records.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                上一页
              </button>
              <span className="text-gray-400">第 {page} 页</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={records.length < 20}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// 统计卡片组件
function StatCard({
  title,
  value,
  unit,
  color,
}: {
  title: string
  value: string | number
  unit: string
  color: 'orange' | 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  )
}

// 记录卡片组件
function RecordCard({ record }: { record: RunRecord }) {
  const date = new Date(record.stop_time || record.created_at).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const improvementColor =
    record.compare_last === 1 ? 'text-green-400' : record.compare_last === -1 ? 'text-red-400' : 'text-gray-400'

  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold mb-1">{date}</div>
          {record.compare_last !== 0 && (
            <div className={`text-xs ${improvementColor}`}>
              {record.compare_last === 1 ? '↑ 提升' : record.compare_last === -1 ? '↓ 下降' : '→ 持平'}
            </div>
          )}
        </div>
        <div className="text-right text-sm text-gray-400">
          <div>ID: {record.user_play_id?.slice(0, 8)}...</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-bold text-orange-400">
            {record.speed_max_format || record.speed_max?.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">最高转速</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {record.circle_count_format || record.circle_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">总圈数</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">
            {record.distance_format || record.distance.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">距离</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">
            {record.duration_format || Math.floor(record.duration / 60)}:{(record.duration % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-400">时长</div>
        </div>
      </div>
    </div>
  )
}
