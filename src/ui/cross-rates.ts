// China Monitor — Exchange Rate Widget

export class CrossRates {
  private container: HTMLElement | null = null;
  private batchIndex = 0;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isMobile = false;
  private readonly BATCH_SIZE = 3;
  
  // Currency pairs (CNY base) - 12 currencies, 4 batches
  private currencyPairs = [
    { symbol: 'FX_IDC:CNYUSD', name: 'USD' },
    { symbol: 'FX_IDC:CNYEUR', name: 'EUR' },
    { symbol: 'FX_IDC:CNYGBP', name: 'GBP' },
    { symbol: 'FX_IDC:CNYJPY', name: 'JPY' },
    { symbol: 'FX_IDC:CNYHKD', name: 'HKD' },
    { symbol: 'FX_IDC:CNYTWD', name: 'TWD' },
    { symbol: 'FX_IDC:CNYCAD', name: 'CAD' },
    { symbol: 'FX_IDC:CNYAUD', name: 'AUD' },
    { symbol: 'FX_IDC:CNYRUB', name: 'RUB' },
    { symbol: 'FX_IDC:CNYINR', name: 'INR' },
    { symbol: 'FX_IDC:CNYBRL', name: 'BRL' },
    { symbol: 'FX_IDC:CNYZAR', name: 'ZAR' }
  ];

  constructor() {
    this.container = document.getElementById('cross-rates-widget');
    this.checkMobile();
  }

  init(): void {
    if (!this.container) {
      console.error('Cross rates container not found');
      return;
    }

    if (this.isMobile) {
      this.renderMobileWidget();
      this.startRotation();
    } else {
      this.renderWidget();
    }
    
    this.setupThemeListener();
    this.setupResizeListener();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768 || 
                    window.matchMedia('(orientation: portrait)').matches;
  }

  private getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'dark';
  }

  private renderMobileWidget(): void {
    if (!this.container) return;

    // Get current batch of 3 currencies
    const start = this.batchIndex * this.BATCH_SIZE;
    const end = start + this.BATCH_SIZE;
    const batch = this.currencyPairs.slice(start, end);

    this.container.innerHTML = `
      <div class="rates-batch-container" style="
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        padding: 0.3rem;
        height: 100%;
        overflow: hidden;
      ">
        ${batch.map((pair, index) => `
          <div class="rate-item-wrapper" style="
            flex: 1;
            display: flex;
            align-items: center;
            background: ${this.getCurrentTheme() === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
            border-radius: 3px;
            animation: slideIn 0.3s ease-out ${index * 0.1}s both;
            overflow: hidden;
          ">
            <div class="tradingview-widget-container" style="width:100%;height:100%;">
              <div class="tradingview-widget-container__widget" data-symbol="${pair.symbol}" data-name="${pair.name}"></div>
            </div>
          </div>
        `).join('')}
      </div>
      <style>
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      </style>
    `;

    // Load TradingView widgets for current batch
    batch.forEach((pair, index) => {
      this.renderSingleQuoteWidget(pair, index);
    });
  }

  private renderSingleQuoteWidget(pair: { symbol: string; name: string }, _index: number): void {
    const widgetDiv = document.querySelector(`.tradingview-widget-container__widget[data-symbol="${pair.symbol}"]`);
    if (!widgetDiv) return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    script.async = true;
    script.textContent = JSON.stringify({
      symbol: pair.symbol,
      colorTheme: this.getCurrentTheme(),
      isTransparent: true,
      locale: 'en',
      width: '100%',
      height: '100%'
    });

    widgetDiv.appendChild(script);
  }

  private startRotation(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    
    // Rotate every 10 seconds (4 batches = 40 seconds for full cycle)
    this.refreshTimer = setInterval(() => {
      this.batchIndex = (this.batchIndex + 1) % 4;
      this.renderMobileWidget();
    }, 10000);
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
          if (this.isMobile) {
            this.renderMobileWidget();
          } else {
            this.renderWidget();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.checkMobile();
      
      if (wasMobile !== this.isMobile) {
        if (this.refreshTimer) {
          clearInterval(this.refreshTimer);
        }
        
        if (this.isMobile) {
          this.renderMobileWidget();
          this.startRotation();
        } else {
          this.renderWidget();
        }
      }
    });
  }
}
