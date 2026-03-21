// China Monitor — Main Entry Point

import './unregister-sw.ts'
import './styles.css'

// 移除 loading 遮罩层
function hideLoadingOverlay(): void {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 300);
  }
}
import { ThemeManager } from './ui/theme'
import { ClockDisplay } from './ui/clock'
import { LiveNews } from './ui/live-news'
import { WeatherForecast } from './ui/weather-forecast'
import { CrossRates } from './ui/cross-rates'
import { StockTicker } from './ui/stock-ticker'
import { Footer } from './ui/footer'
import { HeaderWeather } from './ui/header-weather'
import { YouTubePlayer } from './ui/youtube-player'
import { MobileWarning } from './ui/mobile-warning'
import { performHealthCheck } from './api/health-check'
import { ViewCounter } from './ui/view-counter'

function updateBJTTime(): void {
  const bjtElement = document.getElementById('bjt-time');
  if (!bjtElement) return;
  
  const now = new Date();
  const bjtTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[bjtTime.getUTCDay()];
  const month = String(bjtTime.getUTCMonth() + 1).padStart(2, '0');
  const date = String(bjtTime.getUTCDate()).padStart(2, '0');
  const year = bjtTime.getUTCFullYear();
  const hours = String(bjtTime.getUTCHours()).padStart(2, '0');
  const minutes = String(bjtTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(bjtTime.getUTCSeconds()).padStart(2, '0');
  
  bjtElement.textContent = `BJT ${day} ${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch((err) => console.error('SW registration failed:', err));
  }

  const isHealthy = await performHealthCheck();
  if (!isHealthy) {
    return;
  }

  const themeManager = new ThemeManager()
  themeManager.init()

  // Initialize mobile/portrait warning
  const mobileWarning = new MobileWarning()
  mobileWarning.init()

  const clock = new ClockDisplay()
  clock.init()

  const headerWeather = new HeaderWeather()
  await headerWeather.init()

  // Initialize cross rates widget
  const crossRates = new CrossRates()
  crossRates.init()

  const liveNews = new LiveNews('live-news-content')
  await liveNews.init()

  const weatherForecast = new WeatherForecast('weather-content')
  await weatherForecast.init()

  const stockTicker = new StockTicker()
  await stockTicker.init()

  const youtubePlayer = new YouTubePlayer()
  youtubePlayer.init()

  const footer = new Footer()
  await footer.init()

  const viewCounter = new ViewCounter()
  await viewCounter.init()

  updateBJTTime();
  setInterval(updateBJTTime, 1000);

  // 隐藏 loading 遮罩层
  hideLoadingOverlay();

  console.log('China Monitor initialized')
})
