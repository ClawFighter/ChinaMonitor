// China Monitor — News Aggregator

interface NewsItem {
  id: string
  title: string
  source: string
  publishedAt: string
  category: string
  url: string
  summary?: string
}

export class NewsAggregator {
  private feedUrl = 'https://newsapi.org/v2/everything'
  private apiKey = '' // TODO: Add NewsAPI key
  private q = 'China OR Chinese OR Taiwan OR Hong Kong OR Xinjiang OR Tibet'
  private domains = 'southchinamorningpost.com,chinadaily.com.cn,xinhuanet.com,people.com.cn'

  async init(): Promise<void> {
    console.log('NewsAggregator initialized')
    await this.fetchNews()
  }

  async fetchNews(): Promise<NewsItem[]> {
    if (!this.apiKey) {
      console.warn('NewsAPI key not configured. Using mock data.')
      return this.getMockNews()
    }

    try {
      const url = new URL(this.feedUrl)
      url.searchParams.set('q', this.q)
      url.searchParams.set('domains', this.domains)
      url.searchParams.set('sortBy', 'publishedAt')
      url.searchParams.set('apiKey', this.apiKey)

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()
      return data.articles?.map((a: any) => this.normalizeNews(a)) || []
    } catch (err) {
      console.error('Failed to fetch news:', err)
      return this.getMockNews()
    }
  }

  private normalizeNews(article: any): NewsItem {
    return {
      id: article.url || Math.random().toString(36).slice(2),
      title: article.title || 'No title',
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt || new Date().toISOString(),
      category: article.category || 'General',
      url: article.url || '#',
      summary: article.description,
    }
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'China Reports Economic Growth for Q1 2026',
        source: 'Xinhua',
        publishedAt: new Date().toISOString(),
        category: 'Economy',
        url: '#',
        summary: 'China\'s GDP grew by 5.2% year-on-year in the first quarter...',
      },
      {
        id: '2',
        title: 'Taiwan Strait Developments',
        source: 'SCMP',
        publishedAt: new Date().toISOString(),
        category: 'Geopolitics',
        url: '#',
        summary: 'Regional tensions continue to evolve with recent naval exercises...',
      },
      {
        id: '3',
        title: 'New AI Regulations in China',
        source: 'China Daily',
        publishedAt: new Date().toISOString(),
        category: 'Tech',
        url: '#',
        summary: 'Beijing announces new guidelines for generative AI development...',
      },
    ]
  }
}
