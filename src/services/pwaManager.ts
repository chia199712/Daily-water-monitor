/**
 * PWA Manager for handling Progressive Web App features
 */

export class PWAManager {
  private isInstalled: boolean = false;
  private deferredPrompt: any = null;

  constructor() {
    this.setupPWAFeatures();
  }

  /**
   * Setup PWA-related features
   */
  private setupPWAFeatures(): void {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    // Check if app is installed
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        this.isInstalled = true;
      }
    } catch (error) {
      // matchMedia not available in test environment
      this.isInstalled = false;
    }
  }

  /**
   * Check if PWA can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Trigger PWA installation prompt
   */
  async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.isInstalled = true;
      this.deferredPrompt = null;
      return true;
    }
    
    return false;
  }

  /**
   * Check if PWA is installed
   */
  isAppInstalled(): boolean {
    return this.isInstalled;
  }
}