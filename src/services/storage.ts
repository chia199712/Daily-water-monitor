import { StorageKeys } from '@/types';

/**
 * 本地存儲服務
 * 提供統一的數據存儲和讀取介面
 */
export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * 保存數據到本地存儲
   */
  public set<T>(key: StorageKeys, value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      throw new Error(`Failed to save data for key: ${key}`);
    }
  }

  /**
   * 從本地存儲讀取數據
   */
  public get<T>(key: StorageKeys): T | null {
    try {
      const jsonValue = localStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      }
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error('Failed to read data from localStorage:', error);
      return null;
    }
  }

  /**
   * 刪除指定鍵的數據
   */
  public remove(key: StorageKeys): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data from localStorage:', error);
    }
  }

  /**
   * 清除所有應用相關數據
   */
  public clearAll(): void {
    try {
      Object.values(StorageKeys).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * 檢查是否支援本地存儲
   */
  public isSupported(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 獲取存儲使用量 (概估)
   */
  public getUsage(): number {
    let totalSize = 0;
    try {
      Object.values(StorageKeys).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      });
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
    }
    return totalSize;
  }
}