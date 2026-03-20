// China Monitor — NMC Weather API Server
import express from 'express'
import sqlite3 from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fetchWeatherData } from './fetcher.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DB_PATH = join(__dirname, '../db/china-monitor.db')

const app = express()
const PORT = process.env.WEATHER_PORT || 3101

let db = null
function getDatabase() {
  if (!db) {
    db = sqlite3(DB_PATH, { readonly: true })
  }
  return db
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/weather', (req, res) => {
  try {
    const database = getDatabase()
    const { limit = 50 } = req.query
    const rows = database.prepare(`
      SELECT DISTINCT city, province_name as province, weather_code, temp_low, temp_high, forecast_date
      FROM weather 
      WHERE forecast_date >= date('now')
      ORDER BY forecast_date ASC, city ASC
      LIMIT ?
    `).all(parseInt(limit))
    res.json({ weather: rows, total: rows.length })
  } catch (error) {
    console.error('Weather API error:', error.message)
    res.json({ weather: [], total: 0 })
  }
})

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`NMC Weather API running on port ${PORT} (localhost only)`)
  console.log(`Health: http://127.0.0.1:${PORT}/health`)
  
  // Start auto-refresh timer
  setInterval(async () => {
    console.log('Auto-refreshing weather data...')
    try {
      await fetchWeatherData()
      console.log('Weather refresh complete')
    } catch (error) {
      console.error('Weather refresh failed:', error.message)
    }
  }, 6 * 60 * 60 * 1000) // 6 hours
})
