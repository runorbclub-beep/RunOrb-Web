// 摇跑打榜页面
import { useState, useEffect } from 'react'
import { matchApi, runApi, rankingApi } from '../lib/api'
import type { Match, Ranking, RunRecord } from '../types/runorb'
import { Link } from 'react-router-dom'

export default function CompetePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [rankings, setRankings] = useState<Ranking | null>(null)
  const [myMatches, setMyMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMatches()
    loadMyMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const response = await matchApi.getMatchList()
      if (response.data) {
        setMatches((response.data as any).list || [])
      }
    } catch (error) {
      console.error('加载赛事列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMyMatches = async () => {
    try {
      const response = await matchApi.getMyMatches()
      if (response.data) {
        setMyMatches((response.data as any).list || [])
      }
    } catch (error) {
      console.error('加载我的赛事失败:', error)
    }
  }

  const handleSelectMatch = async (match: Match) => {
    setSelectedMatch(match)
    loadRankings(match.match_id)
  }

  const loadRankings = async (matchId: string) => {
    try {
      const response = await rankingApi.getMatchPersonalLeaderboard(matchId)
      if (response.data) {
        setRankings(response.data)
      }
    } catch (error) {
      console.error('加载排行榜失败:', error)
    }
  }

  const handleSignUp = async (matchId: string) => {
    try {
      await matchApi.signUpMatch(matchId)
      alert('✅ 报名成功！')
      loadMyMatches()
      loadMatches()
    } catch (error) {
      console.error('报名失败:', error)
      alert('❌ 报名失败，请重试')
    }
  }

  const handleCancelSignUp = async (matchId: string) => {
    try {
      await matchApi.cancelSignUp(matchId)
      alert('✅ 已取消报名')
      loadMyMatches()
      loadMatches()
    } catch (error) {
      console.error('取消报名失败:', error)
      alert('❌ 取消失败，请重试')
    }
  }

  const getMatchStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '即将开始'
      case 'ongoing':
        return '进行中'
      case 'finished':
        return '已结束'
      default:
        return status
    }
  }

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'ongoing':
        return 'bg-green-500/20 text-green-400'
      case 'finished':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">🏆 摇跑打榜</h1>
          <Link to="/" className="text-gray-300 hover:text-white">
            ← 返回首页
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        {/* Tab 切换 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setSelectedMatch(null)
              setRankings(null)
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              !selectedMatch
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            赛事列表
          </button>
          <button
            onClick={() => {
              setSelectedMatch(null)
              setRankings(null)
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              selectedMatch
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            我的赛事 ({myMatches.length})
          </button>
        </div>

        {/* 赛事列表 */}
        {!selectedMatch && (
          <div>
            {!selectedMatch && myMatches.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">我参与的赛事</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myMatches.map((match) => (
                    <MatchCard
                      key={match.match_id}
                      match={match}
                      onSelect={() => handleSelectMatch(match)}
                      onCancel={() => handleCancelSignUp(match.match_id)}
                      isMyMatch
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">
                {!selectedMatch && myMatches.length > 0 ? '全部赛事' : '热门赛事'}
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  暂无赛事
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {matches.map((match) => (
                    <MatchCard
                      key={match.match_id}
                      match={match}
                      onSelect={() => handleSelectMatch(match)}
                      onSignUp={() => handleSignUp(match.match_id)}
                      isMyMatch={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 赛事详情和排行榜 */}
        {selectedMatch && rankings && (
          <div>
            <button
              onClick={() => {
                setSelectedMatch(null)
                setRankings(null)
              }}
              className="mb-4 text-orange-500 hover:text-orange-400"
            >
              ← 返回赛事列表
            </button>

            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-2">{selectedMatch.title}</h2>
              <p className="text-gray-400 mb-4">{selectedMatch.description}</p>
              <div className="flex gap-4 text-sm text-gray-300">
                <span>
                  开始: {new Date(selectedMatch.start_time).toLocaleString('zh-CN')}
                </span>
                <span>
                  结束: {new Date(selectedMatch.end_time).toLocaleString('zh-CN')}
                </span>
                <span>
                  报名: {selectedMatch.sign_up_count} 人
                </span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">🏆 排行榜</h3>
              <div className="space-y-3">
                {rankings.items.map((item, index) => (
                  <div
                    key={item.user_id}
                    className={`flex justify-between items-center bg-gray-700 rounded-lg p-4 ${
                      index === 0 ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? 'bg-yellow-500 text-black'
                            : index === 1
                            ? 'bg-gray-400 text-black'
                            : index === 2
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {item.rank}
                      </div>
                      <div>
                        <div className="font-semibold">{item.username}</div>
                        {item.avatar && (
                          <img src={item.avatar} alt="" className="w-8 h-8 rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-orange-400">
                        {item.value_format}
                      </div>
                      <div className="text-sm text-gray-400">{item.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/freestyle"
                className="inline-block px-8 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold transition-colors"
              >
                🚀 开始比赛
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 赛事卡片组件
function MatchCard({
  match,
  onSelect,
  onSignUp,
  onCancel,
  isMyMatch,
}: {
  match: Match
  onSelect: () => void
  onSignUp?: () => void
  onCancel?: () => void
  isMyMatch: boolean
}) {
  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors">
      {match.banner_url && (
        <img src={match.banner_url} alt="" className="w-full h-40 object-cover" />
      )}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">{match.title}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{match.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${match.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' : match.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
          >
            {match.status === 'upcoming' ? '即将开始' : match.status === 'ongoing' ? '进行中' : '已结束'}
          </span>
          <span className="text-sm text-gray-400">{match.sign_up_count} 人报名</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSelect}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors text-sm"
          >
            查看详情
          </button>
          {isMyMatch && onCancel && match.status === 'upcoming' && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors text-sm"
            >
              取消报名
            </button>
          )}
          {!isMyMatch && onSignUp && match.status === 'upcoming' && (
            <button
              onClick={onSignUp}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors text-sm"
            >
              立即报名
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
