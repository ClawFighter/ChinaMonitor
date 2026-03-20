// China Monitor — Mobile/Portrait Warning Display

export class MobileWarning {
  private warningEl: HTMLElement | null = null;

  constructor() {
    this.warningEl = document.getElementById('mobile-warning');
  }

  init(): void {
    if (!this.warningEl) {
      console.error('Mobile warning element not found');
      return;
    }

    this.checkOrientation();
    
    // Listen for orientation changes
    window.addEventListener('resize', () => this.checkOrientation());
    window.addEventListener('orientationchange', () => this.checkOrientation());
  }

  private checkOrientation(): void {
    if (!this.warningEl) return;
    
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isMobile = window.innerWidth <= 768;
    
    if (isPortrait || isMobile) {
      this.warningEl.classList.add('show');
    } else {
      this.warningEl.classList.remove('show');
    }
  }
}
