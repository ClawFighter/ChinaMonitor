// China Monitor — RSS Parser & Cache Manager

import Parser from 'rss-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import nodeCache from 'node-cache'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cache = new nodeCache({
  stdTTL: 1800, // 30 minutes
  checkperiod: 300 // Check for expired keys every 5 minutes
})

// Preload cached items from file if exists
const cacheFile = join(__dirname, '../../data/cache.json')
let loaded = false

export function loadCache() {
  try {
    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
      Object.entries(data).forEach(([key, value]) => {
        cache.set(key, value)
      })
      loaded = true
      console.log(`Cache loaded: ${Object.keys(data).length} items`)
    }
  } catch (err) {
    console.error('Failed to load cache:', err.message)
  }
}

export function saveCache() {
  try {
    const keys = cache.keys()
    const data = {}
    for (const key of keys) {
      data[key] = cache.get(key)
    }
    if (!fs.existsSync(join(__dirname, '../../data'))) {
      fs.mkdirSync(join(__dirname, '../../data'), { recursive: true })
    }
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Failed to save cache:', err.message)
  }
}

export const parser = new Parser({
  customFields: {
    item: ['media:thumbnail', 'media:content', 'dc:creator']
  },
  headers: {
    'User-Agent': 'ChinaMonitor/1.0 (News Aggregator)'
  },
  timeout: 10000
})

export async function fetchNews(source) {
  const cacheKey = `news:${source.id}`
  const cached = cache.get(cacheKey)
  
  if (cached) {
    return cached
  }

  try {
    const feed = await parser.parseURL(source.rss)
    
    const news = feed.items?.map(item => ({
      id: item.guid || item.link || Math.random().toString(36).slice(2),
      title: item.title || 'No title',
      link: item.link || '#',
      published: item.pubDate || new Date().toISOString(),
      source: source.name,
      sourceId: source.id,
      category: item.categories?.[0] || 'general',
      region: source.region,
      description: item.content || item.summary || '',
      thumbnail: item['media:thumbnail']?.url || item['media:content']?.url || ''
    })) || []

    cache.set(cacheKey, news)
    saveCache()
    
    return news
  } catch (err) {
    console.error(`Failed to fetch from ${source.id}:`, err.message)
    return []
  }
}

export function getCacheStats() {
  return {
    keys: cache.keys().length,
    maxKeys: cache.options.maxKeys,
    ttl: cache.options.stdTTL
  }
}

export function flushCache() {
  cache.flushAll()
  saveCache()
  console.log('Cache flushed')
}
