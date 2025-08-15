import { WaterRecordData } from './waterRecord';

/**
 * Data storage service for persisting data to localStorage
 */
export class DataStorage {
  private readonly WATER_RECORDS_KEY = 'water-records';
  private readonly USER_SETTINGS_KEY = 'user-settings';

  /**
   * Save water records to localStorage
   */
  saveWaterRecords(records: WaterRecordData[]): void {
    try {
      const serializedData = JSON.stringify(records);
      localStorage.setItem(this.WATER_RECORDS_KEY, serializedData);
    } catch (error) {
      console.error('Failed to save water records:', error);
    }
  }

  /**
   * Load water records from localStorage
   */
  loadWaterRecords(): WaterRecordData[] {
    try {
      const serializedData = localStorage.getItem(this.WATER_RECORDS_KEY);
      if (serializedData === null) {
        return [];
      }
      
      const records = JSON.parse(serializedData);
      return records.map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load water records:', error);
      return [];
    }
  }

  /**
   * Clear all data from localStorage
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.WATER_RECORDS_KEY);
      localStorage.removeItem(this.USER_SETTINGS_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Export all data as JSON string
   */
  exportData(): string {
    try {
      const waterRecords = this.loadWaterRecords();
      const userSettingsData = localStorage.getItem(this.USER_SETTINGS_KEY);
      const userSettings = userSettingsData ? JSON.parse(userSettingsData) : {};
      
      const exportData = {
        waterRecords,
        userSettings,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '{}';
    }
  }
}