// China Monitor — Stock Ticker Display

import { A_SHARES, H_SHARES, T_SHARES } from '../data/stocks';

export class StockTicker {
  private containerA: HTMLElement | null = null;
  private containerH: HTMLElement | null = null;
  private containerT: HTMLElement | null = null;

  constructor() {
    this.containerA = document.getElementById('stock-ticker-a');
    this.containerH = document.getElementById('stock-ticker-h');
    this.containerT = document.getElementById('stock-ticker-t');
  }

  async init(): Promise<void> {
    if (!this.containerA || !this.containerH || !this.containerT) {
      console.error('Stock ticker containers not found');
      return;
    }
    this.renderTradingViewWidget('A', A_SHARES);
    this.renderTradingViewWidget('H', H_SHARES);
    this.renderTradingViewWidget('T', T_SHARES);
    this.setupThemeListener();
  }

  private setupThemeListener(): void {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      console.log(`Theme changed to ${theme}, re-rendering stock widgets...`);
      this.renderTradingViewWidget('A', A_SHARES);
      this.renderTradingViewWidget('H', H_SHARES);
      this.renderTradingViewWidget('T', T_SHARES);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  private renderTradingViewWidget(type: string, stocks: Array<{ symbol: string; name: string }>): void {
    const container = type === 'A' ? this.containerA : 
                      type === 'H' ? this.containerH : this.containerT;
    if (!container) return;

    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const colorTheme = theme === 'light' ? 'light' : 'dark';

    container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbols: stocks.map(s => ({ proName: s.symbol, title: s.name })),
      showSymbolLogo: true,
      colorTheme: colorTheme,
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en'
    });

    widgetDiv.appendChild(script);
  }

  async refresh(): Promise<void> {}

  destroy(): void {
    if (this.containerA) this.containerA.innerHTML = '';
    if (this.containerH) this.containerH.innerHTML = '';
    if (this.containerT) this.containerT.innerHTML = '';
  }
}
