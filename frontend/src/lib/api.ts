// API 客户端
import type {
  RunRecord,
  PKRoom,
  PKProgress,
  Match,
  Ranking,
  UserInfo,
  Achievement,
  Medal,
  ApiResponse,
  PaginatedResponse
} from '../types/runorb'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.runorb.us/api'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  // 添加认证 token（如果有）
  const token = localStorage.getItem('runorb_token')
  if (token) {
    (defaultOptions.headers as any)['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API 请求失败:', error)
    throw error
  }
}

// ============ 用户相关 ============
export const userApi = {
  // 获取用户信息
  getUserInfo: (userId: string) =>
    request<UserInfo>(`/user/info?user_id=${userId}`),

  // 用户名登录
  loginByUsername: (username: string, password: string) =>
    request<{ token: string; user_id: string }>('/login/username', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // 用户名注册
  registerByUsername: (username: string, password: string) =>
    request<{ token: string; user_id: string }>('/register/username', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) =>
    request('/user/change_password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    }),
}

// ============ 运动数据相关 ============
export const runApi = {
  // 开始运动
  startRun: (data: Partial<RunRecord>) =>
    request<{ user_play_id: string }>('/start/play', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 运动中上传数据
  updateRun: (userPlayId: string, data: Partial<RunRecord>) =>
    request(`/between/play`, {
      method: 'POST',
      body: JSON.stringify({ user_play_id: userPlayId, ...data }),
    }),

  // 结束运动
  stopRun: (userPlayId: string, data: Partial<RunRecord>) =>
    request(`/stop/play`, {
      method: 'POST',
      body: JSON.stringify({ user_play_id: userPlayId, ...data }),
    }),

  // 上传完整运动数据
  uploadRunData: (data: RunRecord) =>
    request('/v2/match/postUploadLocalPlayV3', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 获取我的运动数据
  getMyRuns: (page: number = 1, pageSize: number = 20) =>
    request<PaginatedResponse<RunRecord>>(
      `/v2/my/play/data?page=${page}&page_size=${pageSize}`
    ),

  // 获取运动详情
  getRunDetail: (userPlayId: string) =>
    request<RunRecord>(`/play/info?user_play_id=${userPlayId}`),
}

// ============ PK 相关 ============
export const pkApi = {
  // 获取/刷新房间号
  getRoomNumber: () =>
    request<{ room_number: string }>('/pk/room/number'),

  // 创建 PK 房间
  createRoom: (pkType: 'double' | 'group', maxPlayers?: number) =>
    request<PKRoom>('/pk/create/room', {
      method: 'POST',
      body: JSON.stringify({ pk_type: pkType, max_players: maxPlayers }),
    }),

  // 加入 PK 房间
  joinRoom: (roomNumber: string) =>
    request<{ room_id: string }>('/pk/join/room', {
      method: 'POST',
      body: JSON.stringify({ room_number: roomNumber }),
    }),

  // 用户点击开始 PK
  startPK: (roomId: string) =>
    request('/pk/user/pk/start', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId }),
    }),

  // 用户完成 PK
  stopPK: (roomId: string, data: Partial<RunRecord>) =>
    request('/pk/user/pk/stop', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId, ...data }),
    }),

  // 取消 PK
  cancelPK: (roomId: string) =>
    request('/pk/user/pk/list/delete', {
      method: 'POST',
      body: JSON.stringify({ room_id: roomId }),
    }),

  // 获取我的 PK 列表
  getMyPKs: (page: number = 1, pageSize: number = 20) =>
    request<PaginatedResponse<any>>(`/v2/my/pk/list?page=${page}&page_size=${pageSize}`),

  // 获取 PK 详情
  getPKDetail: (roomId: string) =>
    request<any>(`/my/pk/list/info?room_id=${roomId}`),
}

// ============ 赛事相关 ============
export const matchApi = {
  // 获取赛事列表
  getMatchList: (page: number = 1, pageSize: number = 20) =>
    request<PaginatedResponse<Match>>(
      `/v2/match/list?page=${page}&page_size=${pageSize}`
    ),

  // 获取赛事详情
  getMatchInfo: (matchId: string) =>
    request<Match>(`/v2/match/info?match_id=${matchId}`),

  // 报名赛事
  signUpMatch: (matchId: string) =>
    request('/v2/match/user/sign', {
      method: 'POST',
      body: JSON.stringify({ match_id: matchId }),
    }),

  // 取消报名
  cancelSignUp: (matchId: string) =>
    request('/v2/match/user/sign/out', {
      method: 'POST',
      body: JSON.stringify({ match_id: matchId }),
    }),

  // 获取我的赛事
  getMyMatches: (page: number = 1, pageSize: number = 20) =>
    request<PaginatedResponse<Match>>(
      `/v2/match/userList?page=${page}&page_size=${pageSize}`
    ),
}

// ============ 排行榜相关 ============
export const rankingApi = {
  // 获取榜单列表
  getRankingList: () =>
    request<Ranking[]>('/my/ranking/v2'),

  // 获取今日最高转速榜
  getTodayHighestSpeed: () =>
    request<Ranking>('/my/ranking/todayHighestSpeed'),

  // 获取今日累计距离榜
  getAccumulatedDistanceToday: () =>
    request<Ranking>('/my/ranking/accumulatedDistanceToday'),

  // 获取赛事个人榜
  getMatchPersonalLeaderboard: (matchId: string) =>
    request<Ranking>(`/v2/match/personal/leaderboard?match_id=${matchId}`),

  // 获取赛事团队榜
  getMatchTeamLeaderboard: (matchId: string) =>
    request<Ranking>(`/v2/match/teamList/leaderboard?match_id=${matchId}`),
}

// ============ 个人中心相关 ============
export const profileApi = {
  // 获取我的成就
  getMyAchievements: () =>
    request<Achievement[]>('/my/achievement'),

  // 获取我的徽章
  getMyMedals: () =>
    request<Medal[]>('/my/medal'),

  // 修改个人信息
  updateProfile: (data: Partial<UserInfo>) =>
    request('/user/change', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return<{ avatar_url: string }>('/user/header/img/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // 让浏览器自动设置 Content-Type
    })
  },
}
