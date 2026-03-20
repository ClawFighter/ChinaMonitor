// China Monitor — Cross Rates Widget (G7 & BRICS)

export class CrossRates {
  private container: HTMLElement | null = null;

  constructor() {
    this.container = document.getElementById('cross-rates-widget');
  }

  init(): void {
    if (!this.container) {
      console.error('Cross rates container not found');
      return;
    }

    this.renderWidget();
    this.setupThemeListener();
  }

  private getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
  }

  private renderWidget(): void {
    if (!this.container) return;

    this.container.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.width = '100%';
    widgetContainer.style.height = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';

    widgetContainer.appendChild(widgetDiv);
    this.container.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.async = true;
    script.textContent = JSON.stringify({
      width: '100%',
      height: '100%',
      currencies: [
        'CNY',
        'HKD',
        'TWD',
        'USD',
        'EUR',
        'GBP',
        'JPY',
        'CAD',
        'RUB',
        'INR'
      ],
      colorTheme: this.getCurrentTheme(),
      isTransparent: true,
      backgroundColor: 'rgba(0, 0, 0, 0)'
    });

    widgetDiv.appendChild(script);
  }

  private setupThemeListener(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.renderWidget();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }
}
