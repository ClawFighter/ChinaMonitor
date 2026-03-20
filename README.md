# China Monitor

Real-time China-focused intelligence dashboard — aggregating news, weather forecasts, and stock market data in a unified interface.

![China Monitor Dashboard](https://via.placeholder.com/1200x600.png?text=China+Monitor+Dashboard)

## 🌟 Features

- **Live News Aggregation** - Curated China-related news from Google News + SCMP (6 items per batch, rotates every 30s)
- **Weather Forecasts** - 3-day forecasts for 34 Chinese provinces (9 cities per batch, rotates every 30s)
- **Real-time Stock Prices** - A-Shares, H-Shares, and T-Shares via TradingView widgets
- **Cross Rates** - G7 & BRICS currency exchange rates (CNY, HKD, TWD, USD focus)
- **Beijing Time Display** - Current time in China (UTC+8)
- **Dark/Light Theme** - Auto-switch based on local time (7:00-19:00) or manual toggle
- **Responsive Design** - Desktop-optimized with mobile warnings

## 🖥️ Live Demo

Visit [chinamonitor.app](https://chinamonitor.app)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vanilla TypeScript + Vite
- **Fonts**: DSEG7/DSEG14/DSEG Weather (digital tube style)
- **Icons**: Font Awesome 6.5.0
- **Build Tool**: Vite 6.4.1

### Backend APIs
- **Runtime**: Node.js
- **News API**: Express + RSS Parser (Port 3100)
- **Weather API**: Express + better-sqlite3 (Port 3101)
- **Database**: SQLite

### Data Sources
- **News**: Google News + SCMP (South China Morning Post)
- **Weather**: wttr.in + NMC (National Meteorological Center of China)
- **Stocks & Forex**: TradingView Widgets
- **Live Video**: YouTube Embedded Player

## 📁 Project Structure

```
china-monitor/
├── src/
│   ├── main.ts                 # Main entry point
│   ├── styles.css              # Global styles
│   ├── api/
│   │   ├── client.ts           # API client
│   │   └── health-check.ts     # Health check
│   ├── ui/
│   │   ├── clock.ts            # Clock display
│   │   ├── theme.ts            # Theme switching
│   │   ├── live-news.ts        # News list
│   │   ├── weather-forecast.ts # Weather forecast (batch rotation)
│   │   ├── header-weather.ts   # Header weather (IP-based)
│   │   ├── stock-ticker.ts     # Stock ticker
│   │   ├── cross-rates.ts      # Forex cross rates
│   │   ├── youtube-player.ts   # YouTube player
│   │   ├── footer.ts           # Footer
│   │   ├── view-counter.ts     # View counter
│   │   └── mobile-warning.ts   # Mobile warning
│   └── utils/
│       └── images.ts           # Image utilities
├── news-api/
│   ├── src/
│   │   ├── server.js           # News API server
│   │   └── cache.js            # RSS cache
│   └── hourly-fetch.sh         # Hourly fetch cron
├── weather-nmc/
│   ├── src/
│   │   ├── api-server.js       # Weather API server
│   │   └── fetcher.js          # Weather fetcher
│   └── fetch-weather.sh        # Weather fetch cron
├── public/
│   ├── index.html              # Main page
│   ├── about.html              # About page
│   ├── maintenance.html        # Maintenance page
│   ├── robots.txt              # SEO robots
│   ├── sitemap.xml             # SEO sitemap
│   └── fonts/                  # DSEG fonts
├── dist/                       # Build output
├── db/                         # SQLite database
├── start.sh                    # Start services
├── stop.sh                     # Stop services
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ClawFighter/ChinaMonitor.git
cd china-monitor

# Install dependencies
npm install

# Download DSEG fonts (required for digital display)
bash download-fonts.sh
```

### Development

```bash
# Start development server (Vite)
npm run dev

# In separate terminals, start backend APIs:
cd news-api && node src/server.js
cd ../weather-nmc && node src/api-server.js
```

Open [http://localhost:7890](http://localhost:7890)

### Production Build

```bash
# Build for production
npm run build

# Serve production build
npm run preview
```

### Service Management

```bash
# Start all services (production)
bash start.sh

# Stop all services
bash stop.sh
```

## ⚙️ Configuration

### Cron Jobs

```bash
# News: Fetch every hour
0 * * * * /path/to/china-monitor/news-api/hourly-fetch.sh

# Weather: Fetch every 6 hours (0:00, 6:00, 12:00, 18:00)
0 */6 * * * /path/to/china-monitor/weather-nmc/fetch-weather.sh
```

### Theme Switching

- **Auto**: 7:00-19:00 local time → Light theme, otherwise Dark theme
- **Manual**: Click theme toggle button in header

### Weather Batch Rotation

Weather forecasts rotate every 30 seconds (9 cities per batch):
- Batch 1: Cities 1-9
- Batch 2: Cities 10-18
- Batch 3: Cities 19-27
- Batch 4: Cities 28-34
- Then loops back to Batch 1

## 📊 API Endpoints

### News API (Port 3100)

```
GET /api/news?limit=50
GET /api/news/category/:category
GET /api/news/region/:region
GET /health
```

### Weather API (Port 3101)

```
GET /api/weather?limit=100
GET /health
```

## 🎨 Typography

This project uses **DSEG Fonts** by keshikan.net:
- **DSEG7**: Numeric displays (clock, temperature)
- **DSEG14**: Titles and headers
- **DSEG Weather**: Weather icons (numeric codes 1-9)

Download from: [https://www.keshikan.net/fonts-e.html](https://www.keshikan.net/fonts-e.html)

## 📄 License

AGPL-3.0 — see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by [World Monitor](https://worldmonitor.app)
- Weather data from [wttr.in](https://github.com/chubin/wttr.in)
- Stock data from [TradingView](https://www.tradingview.com)
- DSEG Fonts by [keshikan.net](https://www.keshikan.net)

## 📧 Contact

For questions or feedback: bizcwen@gmail.com

---

_Built with ❤️ for real-time China monitoring_
