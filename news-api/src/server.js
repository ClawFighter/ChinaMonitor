// China Monitor — News Aggregator Server

import express from 'express'
import { newsSources, sourceCategories } from './sources.js'
import { fetchNews, getCacheStats, flushCache, loadCache, saveCache } from './cache.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cron from 'cron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3100

// Middleware
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Helper to get news from multiple sources
async function getNewsFromSources(sourceIds = null) {
  const sources = sourceIds 
    ? newsSources.filter(s => sourceIds.includes(s.id))
    : newsSources
  
  const allNews = []
  for (const source of sources) {
    const news = await fetchNews(source)
    allNews.push(...news)
  }
  
  // Sort by published date (newest first)
  allNews.sort((a, b) => new Date(b.published) - new Date(a.published))
  
  return allNews
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get local weather by IP (proxy to wttr.in to avoid CORS)
app.get('/api/weather/local', async (req, res) => {
  try {
    // Use client IP from request headers (if behind proxy) or direct connection
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.ip || 
                     req.connection.remoteAddress;
    
    // Fetch from wttr.in with specific IP or let wttr.in detect from request
    const response = await fetch('https://wttr.in/?format=3', {
      headers: {
        'User-Agent': 'ChinaMonitor/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`wttr.in error: ${response.status}`);
    }
    
    const text = await response.text();
    res.json({ raw: text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather', details: error.message });
  }
})

// Get latest news (optional filters)
app.get('/api/news', async (req, res) => {
  const { category, region, source, limit = 50 } = req.query
  
  let news = await getNewsFromSources(source ? [source] : null)
  
  if (category) {
    news = news.filter(n => n.category.toLowerCase() === category.toLowerCase())
  }
  
  if (region) {
    news = news.filter(n => n.region.toLowerCase() === region.toLowerCase())
  }
  
  if (limit) {
    news = news.slice(0, parseInt(limit))
  }
  
  res.json({ news, total: news.length })
})

// Get news by ID
app.get('/api/news/:id', async (req, res) => {
  const { id } = req.params
  const news = await getNewsFromSources()
  const item = news.find(n => n.id === id)
  
  if (!item) {
    return res.status(404).json({ error: 'News not found' })
  }
  
  res.json(item)
})

// Get news by category
app.get('/api/news/category/:category', async (req, res) => {
  const { category } = req.params
  const { limit = 20 } = req.query
  
  let news = await getNewsFromSources()
  news = news.filter(n => n.category.toLowerCase() === category.toLowerCase())
  
  res.json({ news, total: news.length })
})

// Get news by region
app.get('/api/news/region/:region', async (req, res) => {
  const { region } = req.params
  const { limit = 20 } = req.query
  
  let news = await getNewsFromSources()
  news = news.filter(n => n.region.toLowerCase() === region.toLowerCase())
  
  res.json({ news, total: news.length })
})

// Get available sources
app.get('/api/sources', (req, res) => {
  res.json(newsSources.map(s => ({ id: s.id, name: s.name, region: s.region, category: s.category })))
})

// Get available categories
app.get('/api/categories', (req, res) => {
  res.json(Object.keys(sourceCategories).reduce((acc, key) => {
    acc[key] = sourceCategories[key]
    return acc
  }, {}))
})

// Cache statistics
app.get('/api/cache/stats', (req, res) => {
  res.json(getCacheStats())
})

// Flush cache
app.post('/api/cache/flush', (req, res) => {
  flushCache()
  res.json({ success: true, message: 'Cache flushed' })
})

// Get region summary (aggregated news by region)
app.get('/api/summary/region', async (req, res) => {
  const regions = [...new Set(newsSources.map(s => s.region))]
  const summary = []
  
  for (const region of regions) {
    const news = await getNewsFromSources()
    const regionNews = news.filter(n => n.region === region).slice(0, 5)
    summary.push({ region, count: regionNews.length, latest: regionNews })
  }
  
  res.json(summary)
})

// Get China overview (all news)
app.get('/api/overview', async (req, res) => {
  const news = await getNewsFromSources()
  res.json({
    total: news.length,
    timestamp: new Date().toISOString(),
    sourcesCount: newsSources.length,
    regions: [...new Set(news.map(n => n.region))],
    categories: [...new Set(news.map(n => n.category))],
    latest: news.slice(0, 10)
  })
})

// Start server
loadCache()

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`China Monitor News API running on port ${PORT} (localhost only)`)
  console.log(`Health check: http://127.0.0.1:${PORT}/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...')
  server.close(() => {
    saveCache()
    process.exit(0)
  })
})

// Auto-refresh cache every 30 minutes
const feedCron = new cron.CronJob('0 */30 * * * *', async () => {
  console.log('Auto-refreshing news cache...')
  for (const source of newsSources) {
    await fetchNews(source)
  }
  console.log('Cache refresh complete')
})

feedCron.start()
console.log('Auto-refresh cron job started (every 30 minutes)')
