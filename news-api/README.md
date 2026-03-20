# China Monitor — News API

This directory contains the news aggregation server that fetches, caches, and serves China-related news.

## Features

- Fetches news from official/authoritative free sources
- Local caching with Redis or file-based storage
- REST API for frontend consumption
- News filtering by category/region

## Sources

- Xinhua News Agency (新华社)
- China Daily (中国日报)
- People's Daily (人民日报)
- CGTN (中国国际电视台)
- Ximalaya News (喜马拉雅新闻)
- Tencent News (腾讯新闻) - public RSS
- Sina News (新浪新闻) - public RSS

## API Endpoints

- `GET /api/news` — Get latest news
- `GET /api/news/:id` — Get news by ID
- `GET /api/news/category/:category` — Filter by category
- `GET /api/news/region/:region` — Filter by region (Taiwan, HK, Xinjiang, Tibet, SCS)
- `GET /api/cache/stats` — Cache statistics
- `POST /api/cache/flush` — Clear cache

## Running

```bash
npm install
node server.js
```

Server runs on port 3000 by default.
