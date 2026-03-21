// China Monitor — Live News Display

import { apiClient } from '../api/client';

export class LiveNews {
  private container: HTMLElement | null = null;
  private newsItems: any[] = [];
  private readonly maxDisplay = 6;  // 每次显示 6 个新闻
  private scrollInterval: NodeJS.Timeout | null = null;
  private batchIndex = 0;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
  }

  async init(): Promise<void> {
    if (!this.container) {
      console.error('Live news container not found');
      return;
    }
    await this.loadNews();
    this.startScrolling();
    setInterval(() => this.nextBatch(), 30 * 1000);  // 30 秒换一组
  }

  private async loadNews(): Promise<void> {
    try {
      const response = await apiClient.get('/api/news?limit=100');
      this.newsItems = response.news || [];
      this.render();
    } catch (error) {
      console.error('Failed to load live news:', error);
      this.container!.innerHTML = '<div class="error">Failed to load news</div>';
    }
  }

  private render(): void {
    if (!this.container) return;
    
    if (this.newsItems.length === 0) {
      this.container.innerHTML = '<div class="no-news">No news available</div>';
      return;
    }

    const start = this.batchIndex;
    const end = Math.min(start + this.maxDisplay, this.newsItems.length);
    const displayItems = this.newsItems.slice(start, end);

    this.container.innerHTML = `
      ${displayItems.map((item, index) => `
        <div class="news-item" style="animation-delay: ${index * 100}ms">
          <a href="${this.escapeHtml(item.link)}" target="_blank" rel="noopener">
            <div class="news-title">${this.escapeHtml(item.title)}</div>
            <div class="news-meta">
              <span class="news-source">${this.escapeHtml(item.source)}</span>
              <span class="news-time">${this.formatTime(item.published)}</span>
            </div>
          </a>
        </div>
      `).join('')}
    `;
  }

  private formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  }

  private startScrolling(): void {
    this.render();
  }

  private nextBatch(): void {
    if (this.newsItems.length <= this.maxDisplay) return;
    
    if (this.container) {
      this.container.classList.add('slide-out');
    }
    
    setTimeout(() => {
      this.batchIndex = (this.batchIndex + 1) * this.maxDisplay;
      if (this.batchIndex >= this.newsItems.length) {
        this.batchIndex = 0;
      }
      this.render();
      
      if (this.container) {
        this.container.classList.remove('slide-out');
        this.container.classList.add('slide-in');
        setTimeout(() => {
          this.container?.classList.remove('slide-in');
        }, 500);
      }
    }, 300);
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  async refresh(): Promise<void> {
    await this.loadNews();
  }

  destroy(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
}
