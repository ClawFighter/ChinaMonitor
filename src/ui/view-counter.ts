// China Monitor — View Counter

const VIEW_API_URL = 'https://chinamonitorview.lukewen2012.workers.dev/';

export class ViewCounter {
  private element: HTMLElement | null = null;

  constructor() {
    this.element = document.getElementById('view-count');
  }

  async init(): Promise<void> {
    if (!this.element) {
      console.error('View counter element not found');
      return;
    }

    await this.fetchViewCount();
  }

  private async fetchViewCount(): Promise<void> {
    try {
      const response = await fetch(VIEW_API_URL);
      const count = await response.text();
      const num = parseInt(count.trim(), 10);
      
      let formatted: string;
      if (num < 100000000) {
        formatted = String(num).padStart(8, '0');
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        formatted = num.toLocaleString('en-US');
      }
      
      this.element!.textContent = formatted;
    } catch (error) {
      console.error('Failed to fetch view count:', error);
      this.element!.textContent = '00,000,000';
    }
  }
}
