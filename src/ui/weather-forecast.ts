// China Monitor — Weather Forecast Display

import { apiClient } from '../api/client';

export class WeatherForecast {
  private container: HTMLElement | null = null;
  private allWeatherItems: any[] = [];  // All 34 cities
  private displayItems: any[] = [];     // Current 9 items to display
  private refreshTimer: NodeJS.Timeout | null = null;
  private batchTimer: NodeJS.Timeout | null = null;
  private weatherList: HTMLElement | null = null;
  private currentBatch: number = 0;     // Current batch index
  private readonly BATCH_SIZE = 9;
  private readonly BATCH_INTERVAL = 30 * 1000;  // 30 seconds

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
  }

  async init(): Promise<void> {
    if (!this.container) {
      console.error('Weather forecast container not found');
      return;
    }
    await this.loadWeather();
    // Refresh weather data every 30 minutes
    this.refreshTimer = setInterval(() => this.loadWeather(), 30 * 60 * 1000);
    // Switch to next batch every 30 seconds
    this.startBatchRotation();
  }

  private async loadWeather(): Promise<void> {
    try {
      const response = await apiClient.get('/api/weather?limit=100');
      const allWeather = response.weather || [];
      
      // Filter to only today's forecasts and remove duplicates
      const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD
      const todayWeather = allWeather.filter((item: any) => {
        return item.forecast_date && item.forecast_date.startsWith(today);
      });
      
      // Remove duplicates - keep only first occurrence of each city
      const uniqueCities = new Set();
      this.allWeatherItems = todayWeather.filter((item: any) => {
        const cityName = item.city_en || item.city;
        if (uniqueCities.has(cityName)) {
          return false;
        }
        uniqueCities.add(cityName);
        return true;
      });
      
      // Reset to first batch
      this.currentBatch = 0;
      this.updateDisplayItems();
      
      this.render();
    } catch (error) {
      console.error('Failed to load weather forecast:', error);
      this.container!.innerHTML = '<div class="error">Failed to load weather</div>';
    }
  }

  private getOrCreateWeatherList(): HTMLElement | null {
    if (!this.container) return null;
    
    const existingHeader = this.container.querySelector('.weather-header');
    if (!existingHeader) {
      const header = document.createElement('div');
      header.className = 'weather-header';
      header.innerHTML = `
        <div class="weather-header-item">City</div>
        <div class="weather-header-item"> </div>
        <div class="weather-header-item">Low Temp.</div>
        <div class="weather-header-item">High Temp.</div>
      `;
      this.container.appendChild(header);
    }
    
    if (!this.weatherList) {
      this.weatherList = document.createElement('div');
      this.weatherList.className = 'weather-list';
      const header = this.container?.querySelector('.weather-header');
      if (header) {
        this.container?.insertBefore(this.weatherList, header.nextSibling);
      } else {
        this.container?.appendChild(this.weatherList);
      }
    }
    
    return this.weatherList;
  }

  private updateDisplayItems(): void {
    const start = this.currentBatch * this.BATCH_SIZE;
    const end = start + this.BATCH_SIZE;
    this.displayItems = this.allWeatherItems.slice(start, end);
  }

  private startBatchRotation(): void {
    this.batchTimer = setInterval(() => {
      const totalBatches = Math.ceil(this.allWeatherItems.length / this.BATCH_SIZE);
      this.currentBatch = (this.currentBatch + 1) % totalBatches;
      this.updateDisplayItems();
      this.render();
    }, this.BATCH_INTERVAL);
  }

  private render(): void {
    const weatherList = this.getOrCreateWeatherList();
    if (!weatherList) return;

    weatherList.innerHTML = `
      ${this.displayItems.map((item, index) => {
        const delay = index * 50;
        const lowF = Math.round(item.temp_low * 9/5 + 32);
        const highF = Math.round(item.temp_high * 9/5 + 32);
        
        return `
          <div class="weather-item" style="animation-delay: ${delay}ms">
            <div class="weather-city-cell">${this.escapeHtml(item.city_en || item.city)}</div>
            <div class="weather-icon-cell">${item.weather_code || '1'}</div>
            <div class="weather-temp-cell">${item.temp_low}°C/${lowF}°F</div>
            <div class="weather-temp-cell">${item.temp_high}°C/${highF}°F</div>
          </div>
        `;
      }).join('')}
    `;
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
    await this.loadWeather();
  }

  destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
  }
}
