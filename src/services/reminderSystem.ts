/**
 * Reminder system service for water intake notifications
 */

export class ReminderSystem {
  private intervalMinutes: number = 60; // Default 60 minutes
  private isEnabled: boolean = true;
  private workingHours: { start: number; end: number } = { start: 9, end: 18 };
  private timerId: NodeJS.Timeout | null = null;

  /**
   * Set reminder interval in minutes
   */
  setReminderInterval(minutes: number): void {
    this.intervalMinutes = minutes;
  }

  /**
   * Get current reminder interval in minutes
   */
  getReminderInterval(): number {
    return this.intervalMinutes;
  }

  /**
   * Enable or disable reminder notifications
   */
  setReminderEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Check if reminder is currently enabled
   */
  isReminderEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Set working hours for reminders
   */
  setWorkingHours(startHour: number, endHour: number): void {
    this.workingHours = { start: startHour, end: endHour };
  }

  /**
   * Get current working hours
   */
  getWorkingHours(): { start: number; end: number } {
    return { ...this.workingHours };
  }

  /**
   * Schedule reminder notifications
   */
  scheduleReminder(callback: () => void): void {
    if (!this.isEnabled) {
      return;
    }

    // Clear existing timer
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    // Set new timer
    this.timerId = setInterval(() => {
      callback();
    }, this.intervalMinutes * 60 * 1000);
  }

  /**
   * Stop reminder notifications
   */
  stopReminder(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}