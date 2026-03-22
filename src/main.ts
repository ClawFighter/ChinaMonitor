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
  // 1. Service Worker (非阻塞)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  // 2. 立即初始化 UI 组件（不阻塞）
  const themeManager = new ThemeManager()
  themeManager.init()

  const mobileWarning = new MobileWarning()
  mobileWarning.init()

  const clock = new ClockDisplay()
  clock.init()

  const youtubePlayer = new YouTubePlayer()
  youtubePlayer.init()

  const crossRates = new CrossRates()
  crossRates.init()

  // 3. 显示 loading 遮罩，但只等关键 UI 渲染
  setTimeout(() => hideLoadingOverlay(), 500);

  // 4. 并行加载数据（不阻塞页面显示）
  const dataPromises = [];

  const headerWeather = new HeaderWeather()
  dataPromises.push(headerWeather.init());

  const liveNews = new LiveNews('live-news-content')
  dataPromises.push(liveNews.init());

  const weatherForecast = new WeatherForecast('weather-content')
  dataPromises.push(weatherForecast.init());

  const stockTicker = new StockTicker()
  dataPromises.push(stockTicker.init());

  const footer = new Footer()
  dataPromises.push(footer.init());

  const viewCounter = new ViewCounter()
  dataPromises.push(viewCounter.init());

  // 5. 后台等待所有数据加载（不影响用户交互）
  Promise.allSettled(dataPromises).then(() => {
    console.log('All data loaded');
  });

  // 6. BJT 时钟
  updateBJTTime();
  setInterval(updateBJTTime, 1000);
})
