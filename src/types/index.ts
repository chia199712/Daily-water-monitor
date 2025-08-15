// 喝水記錄
export interface WaterRecord {
  id: string;
  amount: number; // ml
  timestamp: number; // 時間
  note?: string; // 備註
}

// 用戶設定類型
export interface UserSettings {
  weight: number; // 體重 (公斤)
  activityLevel: ActivityLevel; // 活動量
  dailyGoal: number; // 每日目標 (毫升)
  reminderInterval: number; // 提醒間隔 (分鐘)
  workingHours: WorkingHours; // 工作時間
  reminderEnabled: boolean; // 是否啟用提醒
  notificationPermission: boolean; // 通知權限
}

// 活動量等級
export enum ActivityLevel {
  LOW = 'low', // 低度活動
  MODERATE = 'moderate', // 中度活動
  HIGH = 'high' // 高度活動
}

// 工作時間設定
export interface WorkingHours {
  start: string; // 開始時間 "HH:mm"
  end: string; // 結束時間 "HH:mm"
  enabled: boolean; // 是否啟用工作時間限制
}

// 統計數據類型
export interface WaterStats {
  todayTotal: number; // 今日總量
  todayProgress: number; // 今日進度百分比
  weeklyAverage: number; // 週平均
  consecutiveDays: number; // 連續達標天數
  weeklyTrend: DailyStats[]; // 週趨勢
}

// 每日統計
export interface DailyStats {
  date: string; // YYYY-MM-DD
  total: number; // 總量
  goal: number; // 目標
  progress: number; // 進度百分比
  records: WaterRecord[]; // 當日記錄
}

// 通知類型
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

// 應用狀態類型
export interface AppState {
  isOnline: boolean; // 網路狀態
  isLoading: boolean; // 載入狀態
  lastSync: number; // 最後同步時間
  version: string; // 應用版本
}

// 錯誤類型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// 本地存儲鍵值
export enum StorageKeys {
  USER_SETTINGS = 'waterReminder_userSettings',
  WATER_RECORDS = 'waterReminder_waterRecords',
  APP_STATE = 'waterReminder_appState',
  BACKUP_DATA = 'waterReminder_backup',
  ERROR_LOGS = 'waterReminder_errorLogs'
}

// 事件類型
export enum EventType {
  WATER_RECORDED = 'water_recorded',
  GOAL_UPDATED = 'goal_updated',
  REMINDER_TRIGGERED = 'reminder_triggered',
  SETTINGS_CHANGED = 'settings_changed',
  DATA_BACKUP = 'data_backup',
  ERROR_OCCURRED = 'error_occurred'
}

// 應用事件
export interface AppEvent {
  type: EventType;
  timestamp: number;
  data?: any;
}