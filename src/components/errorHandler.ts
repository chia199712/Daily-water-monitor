/**
 * Error handler component for displaying user-friendly error messages
 */

export type ErrorType = 'validation' | 'network' | 'storage' | 'general';

export class ErrorHandler {
  private container: HTMLElement;
  private errorElement: HTMLElement | null = null;
  private currentError: string = '';
  private isVisible: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupErrorElement();
  }

  /**
   * Setup error display element
   */
  private setupErrorElement(): void {
    this.errorElement = this.container.querySelector('.error-message');
    if (!this.errorElement) {
      this.errorElement = document.createElement('div');
      this.errorElement.className = 'error-message';
      this.errorElement.style.display = 'none';
      this.container.appendChild(this.errorElement);
    }
  }

  /**
   * Show error message with user-friendly text
   */
  showError(message: string, type: ErrorType = 'general'): void {
    const friendlyMessage = this.convertToFriendlyMessage(message, type);
    this.currentError = friendlyMessage;
    this.isVisible = true;

    if (this.errorElement) {
      this.errorElement.textContent = friendlyMessage;
      this.errorElement.style.display = 'block';
      this.errorElement.className = `error-message error-${type}`;
    }
  }

  /**
   * Convert technical error to user-friendly message
   */
  private convertToFriendlyMessage(message: string, type: ErrorType): string {
    switch (type) {
      case 'validation':
        if (message.includes('飲水量必須') || message.includes('正數')) {
          return '請輸入正確的飲水量（大於0ml）';
        }
        if (message.includes('體重')) {
          return '請輸入有效的體重（1-250kg）';
        }
        return '請檢查輸入的資料是否正確';

      case 'network':
        if (message.includes('網路') || message.includes('連線')) {
          return '網路連線問題，請檢查您的網路狀態';
        }
        return '連線失敗，請稍後再試';

      case 'storage':
        return '資料儲存失敗，請確認瀏覽器設定允許本地儲存';

      default:
        return '發生錯誤，請稍後再試';
    }
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.currentError = '';
    this.isVisible = false;

    if (this.errorElement) {
      this.errorElement.style.display = 'none';
      this.errorElement.textContent = '';
    }
  }

  /**
   * Get currently displayed error message
   */
  getDisplayedError(): string {
    return this.currentError;
  }

  /**
   * Check if error is currently visible
   */
  isErrorVisible(): boolean {
    return this.isVisible;
  }
}