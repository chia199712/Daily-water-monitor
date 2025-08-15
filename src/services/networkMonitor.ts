/**
 * Network monitor for detecting network status changes
 */

export type ConnectionQuality = 'fast' | 'slow' | 'offline';

export class NetworkMonitor {
  private onlineCallbacks: Function[] = [];
  private offlineCallbacks: Function[] = [];
  private currentConnectionQuality: ConnectionQuality = 'fast';

  constructor() {
    this.setupNetworkListeners();
    this.updateConnectionQuality();
  }

  /**
   * Setup network event listeners
   */
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.updateConnectionQuality();
    this.onlineCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in online callback:', error);
      }
    });
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.currentConnectionQuality = 'offline';
    this.offlineCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in offline callback:', error);
      }
    });
  }

  /**
   * Register callback for online event
   */
  onOnline(callback: Function): void {
    this.onlineCallbacks.push(callback);
  }

  /**
   * Register callback for offline event
   */
  onOffline(callback: Function): void {
    this.offlineCallbacks.push(callback);
  }

  /**
   * Remove online callback
   */
  removeOnlineCallback(callback: Function): void {
    const index = this.onlineCallbacks.indexOf(callback);
    if (index > -1) {
      this.onlineCallbacks.splice(index, 1);
    }
  }

  /**
   * Remove offline callback
   */
  removeOfflineCallback(callback: Function): void {
    const index = this.offlineCallbacks.indexOf(callback);
    if (index > -1) {
      this.offlineCallbacks.splice(index, 1);
    }
  }

  /**
   * Check if currently online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Get estimated connection quality
   */
  getConnectionQuality(): ConnectionQuality {
    if (!this.isOnline()) {
      return 'offline';
    }
    
    return this.currentConnectionQuality;
  }

  /**
   * Update connection quality estimation
   */
  private updateConnectionQuality(): void {
    if (!this.isOnline()) {
      this.currentConnectionQuality = 'offline';
      return;
    }

    // Try to estimate connection quality
    // In a real implementation, this might use Connection API or timing tests
    try {
      // Check if Connection API is available
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        // Use effective connection type if available
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g' || effectiveType === '3g') {
          this.currentConnectionQuality = 'fast';
        } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          this.currentConnectionQuality = 'slow';
        } else {
          this.currentConnectionQuality = 'fast'; // Default to fast for unknown types
        }
      } else {
        // Fallback to default fast connection
        this.currentConnectionQuality = 'fast';
      }
    } catch (error) {
      // If connection detection fails, assume fast connection
      this.currentConnectionQuality = 'fast';
    }
  }

  /**
   * Perform a simple connectivity test
   */
  async testConnectivity(): Promise<boolean> {
    try {
      if (!this.isOnline()) {
        return false;
      }

      // Try to fetch a small resource to test connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}