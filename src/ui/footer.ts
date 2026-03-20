// China Monitor — Footer

export class Footer {
  private lastUpdateEl: HTMLElement | null = null;

  constructor() {
    this.lastUpdateEl = document.getElementById('last-update');
  }

  async init(): Promise<void> {
    await this.loadLastUpdate();
  }

  private async loadLastUpdate(): Promise<void> {
    this.updateLastUpdate(new Date());
  }

  private updateLastUpdate(date: Date): void {
    if (this.lastUpdateEl) {
      this.lastUpdateEl.textContent = date.toLocaleString();
    }
  }

  destroy(): void {}
}
