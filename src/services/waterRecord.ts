/**
 * Simple water record service for TDD implementation
 */

export interface WaterRecordData {
  id: string;
  amount: number;
  timestamp: Date;
  note?: string;
}

export class WaterRecord {
  private records: WaterRecordData[] = [];

  /**
   * Add a new water record
   */
  addRecord(amount: number, timestamp: Date, note?: string): string {
    // 驗證飲水量
    if (amount <= 0) {
      throw new Error('飲水量必須大於0');
    }
    if (amount > 5000) {
      throw new Error('飲水量不能超過5000ml');
    }

    const id = this.generateId();
    const record: WaterRecordData = {
      id,
      amount,
      timestamp,
      note
    };
    
    this.records.push(record);
    return id;
  }

  /**
   * Get all water records
   */
  getRecords(): WaterRecordData[] {
    return [...this.records];
  }

  /**
   * Get records for a specific date
   */
  getRecordsByDate(date: Date): WaterRecordData[] {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return this.records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= targetDate && recordDate < nextDay;
    });
  }

  /**
   * Update a record's amount by ID
   */
  updateRecord(id: string, newAmount: number): boolean {
    const record = this.records.find(record => record.id === id);
    if (record) {
      record.amount = newAmount;
      return true;
    }
    return false;
  }

  /**
   * Delete a record by ID
   */
  deleteRecord(id: string): boolean {
    const index = this.records.findIndex(record => record.id === id);
    if (index !== -1) {
      this.records.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Get total amount for a specific date
   */
  getDailyTotal(date: Date): number {
    const dayRecords = this.getRecordsByDate(date);
    return dayRecords.reduce((total, record) => total + record.amount, 0);
  }

  /**
   * Get today's total water intake
   */
  getTodayTotal(): number {
    const today = new Date();
    return this.getDailyTotal(today);
  }

  /**
   * Clear all records
   */
  clearRecords(): void {
    this.records = [];
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return 'record_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
}