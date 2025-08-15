// 驗證工具

// 檢查喝水量合不合理
export function isValidWaterAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         amount > 0 && 
         amount <= 5000; // 最大 5 公升
}

/**
 * 驗證體重是否有效
 */
export function isValidWeight(weight: number): boolean {
  return typeof weight === 'number' && 
         !isNaN(weight) && 
         weight >= 20 && 
         weight <= 300; // 20-300 公斤
}

/**
 * 驗證每日目標是否有效
 */
export function isValidDailyGoal(goal: number): boolean {
  return typeof goal === 'number' && 
         !isNaN(goal) && 
         goal >= 500 && 
         goal <= 8000; // 500ml - 8000ml
}

/**
 * 驗證提醒間隔是否有效
 */
export function isValidReminderInterval(interval: number): boolean {
  return typeof interval === 'number' && 
         !isNaN(interval) && 
         interval >= 15 && 
         interval <= 480; // 15分鐘 - 8小時
}

/**
 * 驗證時間格式是否有效 (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return timePattern.test(time);
}

/**
 * 驗證工作時間設定是否有效
 */
export function isValidWorkingHours(startTime: string, endTime: string): boolean {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return false;
  }
  
  // 檢查結束時間是否晚於開始時間
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  return endMinutes > startMinutes;
}

/**
 * 驗證活動量等級是否有效
 */
export function isValidActivityLevel(level: string): boolean {
  const validLevels = ['low', 'moderate', 'high'];
  return validLevels.includes(level);
}

/**
 * 驗證日期是否有效
 */
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 驗證字串是否為有效的 UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

/**
 * 清理和格式化飲水量輸入
 */
export function sanitizeWaterAmount(input: string | number): number | null {
  let amount: number;
  
  if (typeof input === 'string') {
    // 移除非數字字符 (除了小數點)
    const cleaned = input.replace(/[^\d.]/g, '');
    amount = parseFloat(cleaned);
  } else {
    amount = input;
  }
  
  if (isNaN(amount)) {
    return null;
  }
  
  // 四捨五入到整數
  amount = Math.round(amount);
  
  return isValidWaterAmount(amount) ? amount : null;
}

/**
 * 清理和格式化體重輸入
 */
export function sanitizeWeight(input: string | number): number | null {
  let weight: number;
  
  if (typeof input === 'string') {
    const cleaned = input.replace(/[^\d.]/g, '');
    weight = parseFloat(cleaned);
  } else {
    weight = input;
  }
  
  if (isNaN(weight)) {
    return null;
  }
  
  // 保留一位小數
  weight = Math.round(weight * 10) / 10;
  
  return isValidWeight(weight) ? weight : null;
}

/**
 * 清理和格式化時間輸入
 */
export function sanitizeTimeInput(input: string): string | null {
  // 移除所有非數字和冒號的字符
  const cleaned = input.replace(/[^\d:]/g, '');
  
  // 嘗試自動格式化
  const numbers = cleaned.replace(/:/g, '');
  
  if (numbers.length === 0) {
    return null;
  }
  
  let formatted: string;
  
  if (numbers.length <= 2) {
    // 只有小時
    const hour = parseInt(numbers, 10);
    formatted = `${hour.toString().padStart(2, '0')}:00`;
  } else if (numbers.length <= 4) {
    // 小時和分鐘
    const hour = parseInt(numbers.substring(0, 2), 10);
    const minute = parseInt(numbers.substring(2), 10);
    formatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  } else {
    // 太長，取前4位
    const hour = parseInt(numbers.substring(0, 2), 10);
    const minute = parseInt(numbers.substring(2, 4), 10);
    formatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  return isValidTimeFormat(formatted) ? formatted : null;
}

/**
 * 驗證錯誤訊息生成器
 */
export const ValidationMessages = {
  waterAmount: '請輸入有效的飲水量 (1-5000ml)',
  weight: '請輸入有效的體重 (20-300kg)',
  dailyGoal: '請輸入有效的每日目標 (500-8000ml)',
  reminderInterval: '請輸入有效的提醒間隔 (15-480分鐘)',
  timeFormat: '請輸入有效的時間格式 (HH:mm)',
  workingHours: '結束時間必須晚於開始時間',
  activityLevel: '請選擇有效的活動量等級',
  required: '此欄位為必填',
  invalidDate: '請輸入有效的日期',
  invalidUUID: '無效的記錄ID'
} as const;