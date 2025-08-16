/**
 * Goal setting service for daily water intake targets
 */

export class GoalSetting {
  private readonly GOAL_KEY = 'daily-goal';
  private dailyGoal: number = 2000; // Default 2000ml

  constructor() {
    this.loadGoal();
  }

  /**
   * Set daily water intake goal
   */
  setDailyGoal(goal: number): void {
    // 驗證目標值
    if (goal <= 0) {
      throw new Error('飲水目標必須大於0');
    }
    if (goal > 10000) {
      throw new Error('飲水目標不能超過10000ml');
    }
    
    this.dailyGoal = goal;
    this.saveGoal();
  }

  /**
   * Get current daily water intake goal
   */
  getDailyGoal(): number {
    return this.dailyGoal;
  }

  /**
   * Save goal to localStorage
   */
  private saveGoal(): void {
    try {
      localStorage.setItem(this.GOAL_KEY, this.dailyGoal.toString());
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  }

  /**
   * Load goal from localStorage
   */
  private loadGoal(): void {
    try {
      const savedGoal = localStorage.getItem(this.GOAL_KEY);
      if (savedGoal) {
        this.dailyGoal = parseInt(savedGoal, 10);
      }
    } catch (error) {
      console.error('Failed to load goal:', error);
    }
  }

  /**
   * Calculate recommended daily water intake based on weight
   * Formula: weight (kg) * 35ml
   */
  calculateRecommendedAmount(weight: number): number {
    return weight * 35;
  }
}