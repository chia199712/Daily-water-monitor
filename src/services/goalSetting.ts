/**
 * Goal setting service for daily water intake targets
 */

export class GoalSetting {
  private dailyGoal: number = 2000; // Default 2000ml

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
  }

  /**
   * Get current daily water intake goal
   */
  getDailyGoal(): number {
    return this.dailyGoal;
  }

  /**
   * Calculate recommended daily water intake based on weight
   * Formula: weight (kg) * 35ml
   */
  calculateRecommendedAmount(weight: number): number {
    return weight * 35;
  }
}