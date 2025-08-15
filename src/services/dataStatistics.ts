import { WaterRecord } from './waterRecord';
import { GoalSetting } from './goalSetting';

/**
 * Data statistics service for water intake analysis
 */
export class DataStatistics {
  constructor(
    private waterRecord: WaterRecord,
    private goalSetting: GoalSetting
  ) {}

  /**
   * Calculate today's progress percentage
   */
  getTodayProgressPercentage(): number {
    const todayTotal = this.waterRecord.getTodayTotal();
    const dailyGoal = this.goalSetting.getDailyGoal();
    
    if (dailyGoal === 0) {
      return 0;
    }
    
    const percentage = (todayTotal / dailyGoal) * 100;
    return Math.round(percentage);
  }

  /**
   * Get weekly water intake trend (last 7 days)
   */
  getWeeklyTrend(): number[] {
    const trend: number[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dailyTotal = this.waterRecord.getDailyTotal(date);
      trend.push(dailyTotal);
    }
    
    return trend;
  }

  /**
   * Get consecutive days that met the daily goal (counting backwards from today)
   */
  getConsecutiveGoalDays(): number {
    const dailyGoal = this.goalSetting.getDailyGoal();
    const today = new Date();
    let consecutiveDays = 0;
    
    for (let i = 0; i < 365; i++) { // Check up to a year back
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dailyTotal = this.waterRecord.getDailyTotal(date);
      
      if (dailyTotal >= dailyGoal) {
        consecutiveDays++;
      } else {
        break; // Stop counting when we hit a day that didn't meet the goal
      }
    }
    
    return consecutiveDays;
  }

  /**
   * Calculate average daily water intake for specified number of days
   */
  getAverageDailyIntake(days: number): number {
    const today = new Date();
    let totalIntake = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dailyTotal = this.waterRecord.getDailyTotal(date);
      totalIntake += dailyTotal;
    }
    
    return days > 0 ? Math.round(totalIntake / days) : 0;
  }
}