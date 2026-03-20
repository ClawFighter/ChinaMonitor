// China Monitor — China Weather Fetcher
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import sqlite3 from 'better-sqlite3'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROVINCES = [
  // 4 直辖市
  { code: 'beijing', name: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { code: 'shanghai', name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
  { code: 'tianjin', name: 'Tianjin', lat: 39.3434, lon: 117.3616 },
  { code: 'chongqing', name: 'Chongqing', lat: 29.4316, lon: 106.9123 },
  // 5 自治区
  { code: 'neimenggu', name: 'Inner Mongolia', lat: 40.8414, lon: 111.7519 },
  { code: 'guangxi', name: 'Guangxi', lat: 22.8170, lon: 108.3665 },
  { code: 'xizang', name: 'Tibet', lat: 29.6500, lon: 91.1409 },
  { code: 'ningxia', name: 'Ningxia', lat: 38.4872, lon: 106.2309 },
  { code: 'xinjiang', name: 'Xinjiang', lat: 43.8256, lon: 87.6168 },
  // 23 省
  { code: 'hebei', name: 'Hebei', lat: 38.0428, lon: 114.5149 },
  { code: 'shanxi', name: 'Shanxi', lat: 37.5777, lon: 112.2922 },
  { code: 'liaoning', name: 'Liaoning', lat: 41.2956, lon: 122.6085 },
  { code: 'jilin', name: 'Jilin', lat: 43.6661, lon: 126.1923 },
  { code: 'heilongjiang', name: 'Heilongjiang', lat: 45.8038, lon: 126.5340 },
  { code: 'jiangsu', name: 'Jiangsu', lat: 32.0617, lon: 118.7778 },
  { code: 'zhejiang', name: 'Zhejiang', lat: 30.2741, lon: 120.1551 },
  { code: 'anhui', name: 'Anhui', lat: 31.8206, lon: 117.2272 },
  { code: 'fujian', name: 'Fujian', lat: 26.0745, lon: 119.2965 },
  { code: 'jiangxi', name: 'Jiangxi', lat: 28.6820, lon: 115.8581 },
  { code: 'shandong', name: 'Shandong', lat: 36.6512, lon: 117.1209 },
  { code: 'henan', name: 'Henan', lat: 34.7466, lon: 113.6253 },
  { code: 'hubei', name: 'Hubei', lat: 30.5928, lon: 114.3055 },
  { code: 'hunan', name: 'Hunan', lat: 28.2282, lon: 112.9388 },
  { code: 'guangdong', name: 'Guangdong', lat: 23.1291, lon: 113.2644 },
  { code: 'hainan', name: 'Hainan', lat: 20.0444, lon: 110.1999 },
  { code: 'sichuan', name: 'Sichuan', lat: 30.5728, lon: 104.0668 },
  { code: 'guizhou', name: 'Guizhou', lat: 26.8154, lon: 106.8748 },
  { code: 'yunnan', name: 'Yunnan', lat: 25.0406, lon: 102.7125 },
  { code: 'shaanxi', name: 'Shaanxi', lat: 34.3416, lon: 108.9398 },
  { code: 'gansu', name: 'Gansu', lat: 36.0611, lon: 103.8343 },
  { code: 'qinghai', name: 'Qinghai', lat: 36.6171, lon: 101.7782 },
  // 2 特别行政区
  { code: 'xianggang', name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
  { code: 'aomen', name: 'Macau', lat: 22.1987, lon: 113.5439 },
  // 台湾
  { code: 'taiwan', name: 'Taiwan', lat: 25.0330, lon: 121.5654 },
]

const DB_PATH = join(__dirname, '../db/china-monitor.db')
let db = null

function initDatabase() {
  if (!db) {
    db = sqlite3(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        province_code TEXT NOT NULL,
        province_name TEXT NOT NULL,
        city TEXT NOT NULL,
        weather_code INTEGER,
        weather_desc TEXT,
        temp_low INTEGER NOT NULL,
        temp_high INTEGER NOT NULL,
        forecast_date TEXT NOT NULL,
        fetched_at TEXT NOT NULL
      )
    `)
    console.log('Weather database initialized')
  }
  return db
}

export async function fetchWeatherData() {
  const db = initDatabase()
  const now = new Date().toISOString()
  
  for (const province of PROVINCES) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${province.lat}&longitude=${province.lon}&daily=weathercode,temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=3`
      )
      const data = await response.json()
      
      for (let i = 0; i < data.daily.time.length; i++) {
        db.prepare(`
          INSERT INTO weather (province_code, province_name, city, weather_code, temp_low, temp_high, forecast_date, fetched_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(province.code, province.name, province.name, data.daily.weathercode[i], 
               Math.round(data.daily.temperature_2m_min[i]), Math.round(data.daily.temperature_2m_max[i]),
               data.daily.time[i], now)
      }
      console.log(`Fetched 3 forecasts from ${province.name}`)
    } catch (error) {
      console.error(`Failed to fetch ${province.name}:`, error.message)
    }
  }
  
  console.log('Weather fetch complete')
  db.close()
}

// Only run if executed directly (not imported)
if (process.argv[1] && process.argv[1].includes('fetcher.js')) {
  fetchWeatherData()
}
