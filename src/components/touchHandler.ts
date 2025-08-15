/**
 * Touch handler component for managing touch interactions
 */

export class TouchHandler {
  private container: HTMLElement;
  private tapHandlers: Map<string, Function> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupTouchListeners();
  }

  /**
   * Setup touch event listeners
   */
  private setupTouchListeners(): void {
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  /**
   * Handle touch start event
   */
  private handleTouchStart(event: TouchEvent): void {
    // Store touch start position for tap detection
    const target = event.target as HTMLElement;
    if (target) {
      target.setAttribute('data-touch-start', Date.now().toString());
    }
  }

  /**
   * Handle touch end event
   */
  private handleTouchEnd(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    if (!target) return;

    const touchStart = target.getAttribute('data-touch-start');
    if (touchStart) {
      const duration = Date.now() - parseInt(touchStart);
      
      // Consider it a tap if touch duration is less than 300ms
      if (duration < 300) {
        this.handleTap(target);
      }
      
      target.removeAttribute('data-touch-start');
    }
  }

  /**
   * Handle tap event
   */
  private handleTap(target: HTMLElement): void {
    // Find matching tap handlers
    for (const [selector, callback] of this.tapHandlers) {
      if (target.matches(selector) || target.closest(selector)) {
        (callback as Function)();
        break;
      }
    }
  }

  /**
   * Register tap handler for specific selector
   */
  onTap(selector: string, callback: Function): void {
    this.tapHandlers.set(selector, callback);
  }

  /**
   * Check if device supports touch
   */
  isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Simulate a tap for testing purposes
   */
  simulateTap(selector: string): void {
    const element = this.container.querySelector(selector) as HTMLElement;
    if (element && this.tapHandlers.has(selector)) {
      const callback = this.tapHandlers.get(selector);
      if (callback) {
        (callback as Function)();
      }
    }
  }
}