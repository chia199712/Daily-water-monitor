/**
 * Offline handler for managing offline functionality
 */

export interface OfflineAction {
  id: string;
  action: string;
  data: any;
  timestamp: Date;
}

export type ActionType = 'add_record' | 'view_stats' | 'sync_data' | 'update_settings';

export class OfflineHandler {
  private readonly OFFLINE_ACTIONS_KEY = 'offline-actions';
  private offlineActions: OfflineAction[] = [];

  constructor() {
    this.loadOfflineActions();
  }

  /**
   * Check if an action can be performed offline
   */
  canPerformAction(actionType: ActionType): boolean {
    const onlineRequiredActions: ActionType[] = ['sync_data'];
    
    if (navigator.onLine) {
      return true; // All actions available when online
    }
    
    // When offline, check if action requires internet
    return !onlineRequiredActions.includes(actionType);
  }

  /**
   * Store an action to be performed when back online
   */
  storeOfflineAction(actionType: string, data: any): void {
    const action: OfflineAction = {
      id: this.generateActionId(),
      action: actionType,
      data,
      timestamp: new Date()
    };

    this.offlineActions.push(action);
    this.saveOfflineActions();
  }

  /**
   * Get all stored offline actions
   */
  getOfflineActions(): OfflineAction[] {
    return [...this.offlineActions];
  }

  /**
   * Clear offline actions (typically after sync)
   */
  clearOfflineActions(): void {
    this.offlineActions = [];
    this.saveOfflineActions();
  }

  /**
   * Load offline actions from storage
   */
  private loadOfflineActions(): void {
    try {
      const stored = localStorage.getItem(this.OFFLINE_ACTIONS_KEY);
      if (stored) {
        const actions = JSON.parse(stored);
        this.offlineActions = actions.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
  }

  /**
   * Save offline actions to storage
   */
  private saveOfflineActions(): void {
    try {
      localStorage.setItem(this.OFFLINE_ACTIONS_KEY, JSON.stringify(this.offlineActions));
    } catch (error) {
      console.error('Failed to save offline actions:', error);
    }
  }

  /**
   * Generate unique action ID
   */
  private generateActionId(): string {
    return 'action_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Check if device is currently online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }
}