/**
 * UI Responsive component for handling responsive layouts
 */

export type LayoutType = 'mobile' | 'tablet' | 'desktop';

export class UIResponsive {
  private container: HTMLElement;
  private currentLayout: LayoutType = 'desktop';

  constructor(container: HTMLElement) {
    this.container = container;
    this.adjustLayout();
  }

  /**
   * Adjust layout based on screen size
   */
  adjustLayout(): void {
    const width = window.innerWidth;
    
    // Remove all layout classes
    this.container.classList.remove('mobile-layout', 'tablet-layout', 'desktop-layout');
    
    if (width < 600) {
      this.currentLayout = 'mobile';
      this.container.classList.add('mobile-layout');
    } else if (width < 900) {
      this.currentLayout = 'tablet';
      this.container.classList.add('tablet-layout');
    } else {
      this.currentLayout = 'desktop';
      this.container.classList.add('desktop-layout');
    }
  }

  /**
   * Get current layout type
   */
  getCurrentLayout(): LayoutType {
    return this.currentLayout;
  }
}