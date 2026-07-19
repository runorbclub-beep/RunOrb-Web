// RunOrb 类型定义

// ============ 蓝牙设备相关 ============
export interface BluetoothDevice {
  id: string
  name: string
  mac: string
  connected: boolean
  lastSeen: number
}

// ============ 运动数据相关 ============
export interface RunData {
  user_play_id?: string
  rpm: number
  circle_count: number
  distance: number        // km
  duration: number        // seconds
  calories: number
  start_time: number      // Unix timestamp
  stop_time?: number      // Unix timestamp
  speed_max?: number
  source?: 'agent' | 'manual'
}

export interface RunRecord extends RunData {
  id: string
  user_id: string
  created_at: number
  circle_count_format?: string
  speed_max_format?: string
  distance_format?: string
  duration_format?: string
  compare_last?: -1 | 0 | 1  // 相比上次提升
}

// ============ PK 相关 ============
export interface PKRoom {
  room_id: string
  room_number: string
  creator_id: string
  creator_name: string
  status: 'waiting' | 'playing' | 'finished'
  player_count: number
  max_players: number
  created_at: number
  pk_type: 'double' | 'group'
}

export interface PKPlayer {
  user_id: string
  username: string
  avatar?: string
  rpm: number
  circle_count: number
  distance: number
  status: 'ready' | 'playing' | 'finished'
}

export interface PKProgress {
  room_id: string
  players: PKPlayer[]
  start_time?: number
  duration?: number
}

// ============ 赛事相关 ============
export interface Match {
  match_id: string
  title: string
  description: string
  match_type: string
  start_time: number
  end_time: number
  status: 'upcoming' | 'ongoing' | 'finished'
  sign_up_count: number
  banner_url?: string
}

export interface MatchSignUp {
  match_id: string
  user_id: string
  sign_up_time: number
  best_score?: number
  ranking?: number
}

// ============ 排行榜相关 ============
export interface RankingItem {
  rank: number
  user_id: string
  username: string
  avatar?: string
  value: number
  value_format: string
  unit: string
}

export interface Ranking {
  ranking_id: string
  title: string
  type: 'today_highest_speed' | 'today_distance' | 'match_personal' | 'match_team'
  items: RankingItem[]
  last_update: number
}

// ============ 用户相关 ============
export interface UserInfo {
  user_id: string
  username: string
  avatar?: string
  level: number
  points: number
  created_at: number
}

export interface Achievement {
  achievement_id: string
  title: string
  description: string
  icon_url?: string
  unlocked: boolean
  unlocked_time?: number
}

export interface Medal {
  medal_id: string
  title: string
  description: string
  icon_url?: string
  obtained: boolean
  obtained_time?: number
}

// ============ Agent WebSocket 协议 ============
export type AgentMessage =
  | { type: 'scan_start' }
  | { type: 'scan_result'; devices: BluetoothDevice[] }
  | { type: 'connect'; deviceId: string }
  | { type: 'connect_success'; device: BluetoothDevice }
  | { type: 'connect_failed'; deviceId: string; error: string }
  | { type: 'disconnect'; deviceId: string }
  | { type: 'data'; data: Partial<RunData> }
  | { type: 'start_run'; data: Partial<RunData> }
  | { type: 'stop_run'; data: RunData }
  | { type: 'error'; error: string }

// ============ API 响应 ============
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  page_size: number
}
