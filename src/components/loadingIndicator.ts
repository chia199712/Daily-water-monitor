/**
 * Loading indicator component for showing loading states
 */

export class LoadingIndicator {
  private container: HTMLElement;
  private loadingElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private progressElement: HTMLElement | null = null;
  private isLoadingVisible: boolean = false;
  private currentMessage: string = '';
  private currentProgress: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupLoadingElement();
  }

  /**
   * Setup loading indicator element
   */
  private setupLoadingElement(): void {
    this.loadingElement = this.container.querySelector('.loading-indicator');
    if (!this.loadingElement) {
      this.loadingElement = document.createElement('div');
      this.loadingElement.className = 'loading-indicator';
      this.loadingElement.style.display = 'none';
      
      // Create message element
      this.messageElement = document.createElement('div');
      this.messageElement.className = 'loading-message';
      this.loadingElement.appendChild(this.messageElement);
      
      // Create progress element
      this.progressElement = document.createElement('div');
      this.progressElement.className = 'loading-progress';
      this.progressElement.style.display = 'none';
      this.loadingElement.appendChild(this.progressElement);
      
      this.container.appendChild(this.loadingElement);
    } else {
      this.messageElement = this.loadingElement.querySelector('.loading-message');
      this.progressElement = this.loadingElement.querySelector('.loading-progress');
    }
  }

  /**
   * Show loading indicator with message
   */
  show(message: string = '載入中...'): void {
    this.currentMessage = message;
    this.isLoadingVisible = true;

    if (this.loadingElement && this.messageElement) {
      this.messageElement.textContent = message;
      this.loadingElement.style.display = 'block';
      
      if (this.progressElement) {
        this.progressElement.style.display = 'none';
      }
    }
  }

  /**
   * Show loading indicator with progress
   */
  showWithProgress(message: string, progress: number): void {
    this.currentMessage = message;
    this.currentProgress = progress;
    this.isLoadingVisible = true;

    if (this.loadingElement && this.messageElement && this.progressElement) {
      this.messageElement.textContent = message;
      this.progressElement.style.display = 'block';
      this.progressElement.style.width = `${progress}%`;
      this.loadingElement.style.display = 'block';
    }
  }

  /**
   * Update loading message
   */
  updateMessage(message: string): void {
    this.currentMessage = message;
    if (this.messageElement) {
      this.messageElement.textContent = message;
    }
  }

  /**
   * Update progress
   */
  updateProgress(progress: number): void {
    this.currentProgress = progress;
    if (this.progressElement) {
      this.progressElement.style.width = `${progress}%`;
    }
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.isLoadingVisible = false;
    this.currentMessage = '';
    this.currentProgress = 0;

    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
  }

  /**
   * Check if loading indicator is visible
   */
  isVisible(): boolean {
    return this.isLoadingVisible;
  }

  /**
   * Get current loading message
   */
  getMessage(): string {
    return this.currentMessage;
  }

  /**
   * Get current progress
   */
  getProgress(): number {
    return this.currentProgress;
  }
}