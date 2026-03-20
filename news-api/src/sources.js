// China Monitor — English News Sources Configuration
// Reliable English news sources for China-related news

export const newsSources = [
  // SCMP (South China Morning Post)
  {
    id: 'scmp-china',
    name: 'SCMP - China',
    rss: 'https://www.scmp.com/rss/317388/feed',
    category: 'general',
    region: 'China',
    priority: 1
  },
  {
    id: 'scmp-hk',
    name: 'SCMP - Hong Kong',
    rss: 'https://www.scmp.com/rss/91/feed',
    category: 'regional',
    region: 'Hong Kong',
    priority: 1
  },
  
  // TechNode (Tech in English)
  {
    id: 'technode',
    name: 'TechNode',
    rss: 'https://technode.com/feed/',
    category: 'technology',
    region: 'China',
    priority: 2
  },
  
  // BBC China (English)
  {
    id: 'bbc-china',
    name: 'BBC - China',
    rss: 'https://feeds.bbci.co.uk/news/world/asia/china/rss.xml',
    category: 'general',
    region: 'China',
    priority: 1
  },
  
  // Google News Search (English, 2 days)
  {
    id: 'google-china-en',
    name: 'Google News - China (EN)',
    rss: 'https://news.google.com/rss/search?q=china+news&hl=en-US&gl=US&when:2d&ceid=US:en',
    category: 'general',
    region: 'China',
    priority: 1
  }
]

// Categories for filtering
export const categories = [
  { id: 'general', name: 'General' },
  { id: 'regional', name: 'Regional' },
  { id: 'technology', name: 'Technology' }
]

// Default categories for each source
export const sourceCategories = {}
