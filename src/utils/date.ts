/**
 * 日期工具函數
 */

/**
 * 格式化日期為 YYYY-MM-DD 格式
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化時間為 HH:mm 格式
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期時間為可讀格式
 */
export function formatDateTime(date: Date): string {
  const dateStr = formatDate(date);
  const timeStr = formatTime(date);
  return `${dateStr} ${timeStr}`;
}

/**
 * 獲取今天的開始時間 (00:00:00)
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 獲取今天的結束時間 (23:59:59)
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 獲取本週的開始日期 (週一)
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day + (day === 0 ? -6 : 1); // 調整為週一開始
  result.setDate(diff);
  return getStartOfDay(result);
}

/**
 * 獲取本週的結束日期 (週日)
 */
export function getEndOfWeek(date: Date = new Date()): Date {
  const startOfWeek = getStartOfWeek(date);
  const result = new Date(startOfWeek);
  result.setDate(result.getDate() + 6);
  return getEndOfDay(result);
}

/**
 * 檢查兩個日期是否為同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

/**
 * 檢查日期是否為今天
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 獲取兩個日期之間的天數差
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒數
  const firstDate = getStartOfDay(date1);
  const secondDate = getStartOfDay(date2);
  return Math.round((secondDate.getTime() - firstDate.getTime()) / oneDay);
}

/**
 * 獲取指定日期前 N 天的日期
 */
export function getDaysAgo(days: number, from: Date = new Date()): Date {
  const result = new Date(from);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * 獲取指定日期後 N 天的日期
 */
export function getDaysAfter(days: number, from: Date = new Date()): Date {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 解析時間字串 (HH:mm) 為 Date 物件 (使用今天日期)
 */
export function parseTimeString(timeString: string, baseDate: Date = new Date()): Date | null {
  const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  const match = timeString.match(timePattern);
  
  if (!match) {
    return null;
  }
  
  const [, hours, minutes] = match;
  const result = new Date(baseDate);
  result.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  return result;
}

/**
 * 檢查時間是否在指定範圍內
 */
export function isTimeInRange(
  time: Date,
  startTime: string,
  endTime: string
): boolean {
  const timeOfDay = formatTime(time);
  return timeOfDay >= startTime && timeOfDay <= endTime;
}

/**
 * 獲取相對時間描述 (例如: "2小時前", "剛剛")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return '剛剛';
  } else if (diffMins < 60) {
    return `${diffMins}分鐘前`;
  } else if (diffHours < 24) {
    return `${diffHours}小時前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatDate(date);
  }
}