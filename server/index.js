import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const cache = new Map()
const CACHE_TTL = 10 * 60 * 1000

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
  if (cache.size > 300) {
    const oldest = cache.keys().next().value
    cache.delete(oldest)
  }
}

const CATEGORY_QUERIES = {
  trending: 'trending memes 2025',
  funny: 'funny memes viral',
  indian: 'indian memes desi memes bollywood',
  american: 'american memes usa memes',
  movies: 'movie memes film memes',
  series: 'tv series memes netflix memes',
  politics: 'political memes 2025',
  'dark-humor': 'dark humor memes edgy memes',
  animals: 'animal memes cat dog memes',
  classic: 'classic memes viral memes all time',
  reaction: 'reaction memes face memes',
  sports: 'sports memes football basketball',
  gaming: 'gaming memes gamer memes',
  ai: 'ai generated memes artificial intelligence memes',
}

async function searchSerper(query, num = 20) {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return []

  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query + ' meme', num, gl: 'us' }),
  })

  if (!response.ok) throw new Error(`Serper: ${response.status}`)

  const data = await response.json()
  return (data.images || []).map((img, i) => ({
    id: `serper-${Date.now()}-${i}`,
    name: img.title || 'Meme',
    url: img.imageUrl,
    width: img.imageWidth || 500,
    height: img.imageHeight || 500,
    source: 'serper',
    sourceUrl: img.link,
    thumbnail: img.thumbnailUrl || img.imageUrl,
  }))
}

async function searchTavily(query, num = 20) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return []

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query: query + ' meme images',
      search_depth: 'basic',
      include_images: true,
      max_results: num,
    }),
  })

  if (!response.ok) throw new Error(`Tavily: ${response.status}`)

  const data = await response.json()
  return (data.images || []).map((url, i) => ({
    id: `tavily-${Date.now()}-${i}`,
    name: `Meme ${i + 1}`,
    url: typeof url === 'string' ? url : url.url,
    width: 500,
    height: 500,
    source: 'tavily',
    sourceUrl: '',
    thumbnail: typeof url === 'string' ? url : url.url,
  }))
}

async function searchBrave(query, num = 20) {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    q: query + ' meme',
    count: String(Math.min(num, 100)),
    safesearch: 'off',
  })

  const response = await fetch(`https://api.search.brave.com/res/v1/images/search?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  })

  if (!response.ok) throw new Error(`Brave: ${response.status}`)

  const data = await response.json()
  return (data.results || []).map((img, i) => ({
    id: `brave-${Date.now()}-${i}`,
    name: img.title || 'Meme',
    url: img.properties?.url || img.thumbnail?.src || '',
    width: img.properties?.width || 500,
    height: img.properties?.height || 500,
    source: 'brave',
    sourceUrl: img.url || '',
    thumbnail: img.thumbnail?.src || img.properties?.url || '',
  }))
}

async function searchSerpApi(query, num = 20) {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    engine: 'google_images',
    q: query + ' meme',
    api_key: apiKey,
    ijn: '0',
    safe: 'off',
  })

  const response = await fetch(`https://serpapi.com/search?${params}`)
  if (!response.ok) throw new Error(`SerpAPI: ${response.status}`)

  const data = await response.json()
  return (data.images_results || []).slice(0, num).map((img, i) => ({
    id: `serpapi-${Date.now()}-${i}`,
    name: img.title || 'Meme',
    url: img.original || img.thumbnail || '',
    width: img.original_width || 500,
    height: img.original_height || 500,
    source: 'serpapi',
    sourceUrl: img.link || '',
    thumbnail: img.thumbnail || img.original || '',
  }))
}

async function searchSearchApi(query, num = 20) {
  const apiKey = process.env.SEARCHAPI_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    engine: 'google_images',
    q: query + ' meme',
    api_key: apiKey,
  })

  const response = await fetch(`https://www.searchapi.io/api/v1/search?${params}`)
  if (!response.ok) throw new Error(`SearchAPI: ${response.status}`)

  const data = await response.json()
  const images = data.images || data.images_results || []
  return images.slice(0, num).map((img, i) => {
    const imgUrl = typeof img.original === 'string' ? img.original : (img.original?.link || '')
    const thumbUrl = typeof img.thumbnail === 'string' ? img.thumbnail : (img.thumbnail?.link || '')
    const srcUrl = typeof img.link === 'string' ? img.link : (typeof img.source === 'string' ? img.source : '')
    return {
      id: `searchapi-${Date.now()}-${i}`,
      name: img.title || 'Meme',
      url: imgUrl || thumbUrl || img.image || '',
      width: img.original_width || img.original?.width || 500,
      height: img.original_height || img.original?.height || 500,
      source: 'searchapi',
      sourceUrl: srcUrl,
      thumbnail: thumbUrl || imgUrl || img.image || '',
    }
  })
}

async function searchExa(query, num = 10) {
  const apiKey = process.env.EXA_API_KEY
  if (!apiKey) return []

  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: query + ' meme',
      numResults: num,
      contents: { text: false },
    }),
  })

  if (!response.ok) throw new Error(`Exa: ${response.status}`)

  const data = await response.json()
  return (data.results || [])
    .filter(r => r.image || r.url)
    .map((r, i) => ({
      id: `exa-${Date.now()}-${i}`,
      name: r.title || 'Meme',
      url: r.image || r.url || '',
      width: 500,
      height: 500,
      source: 'exa',
      sourceUrl: r.url || '',
      thumbnail: r.image || r.favicon || '',
    }))
}

async function searchScrapingDog(query, num = 10) {
  const apiKey = process.env.SCRAPINGDOG_API_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    api_key: apiKey,
    query: query + ' meme',
    results: String(num),
    country: 'us',
  })

  const response = await fetch(`https://api.scrapingdog.com/google_images?${params}`)
  if (!response.ok) throw new Error(`ScrapingDog: ${response.status}`)

  const data = await response.json()
  const results = Array.isArray(data) ? data : (data.images_results || data.results || [])
  return results.slice(0, num).map((img, i) => ({
    id: `scrapingdog-${Date.now()}-${i}`,
    name: img.title || 'Meme',
    url: img.original || img.image || '',
    width: img.original_width || 500,
    height: img.original_height || 500,
    source: 'scrapingdog',
    sourceUrl: img.link || '',
    thumbnail: img.image || img.original || '',
  }))
}

async function searchApify(query, num = 10) {
  const apiKey = process.env.APIFY_API_KEY
  if (!apiKey) return []

  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/hooli~google-images-scraper/run-sync-get-dataset-items?token=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: [query + ' meme'],
          maxResultsPerQuery: num,
        }),
        signal: AbortSignal.timeout(45000),
      }
    )

    if (!response.ok) throw new Error(`Apify: ${response.status}`)

    const data = await response.json()
    return (Array.isArray(data) ? data : []).slice(0, num).map((img, i) => ({
      id: `apify-${Date.now()}-${i}`,
      name: img.title || img.alt || 'Meme',
      url: img.url || img.imageUrl || img.originalUrl || '',
      width: img.width || 500,
      height: img.height || 500,
      source: 'apify',
      sourceUrl: img.sourceUrl || img.link || '',
      thumbnail: img.thumbnailUrl || img.url || '',
    }))
  } catch (e) {
    throw new Error(`Apify: ${e.message}`)
  }
}

async function getImgflipTemplates() {
  const cacheKey = 'imgflip-templates'
  const cached = getCached(cacheKey)
  if (cached) return cached

  const response = await fetch('https://api.imgflip.com/get_memes')
  const data = await response.json()
  const memes = (data.data?.memes || []).map((m) => ({
    ...m,
    source: 'imgflip',
    thumbnail: m.url,
  }))

  setCache(cacheKey, memes)
  return memes
}

const SOURCE_MAP = {
  serper: searchSerper,
  tavily: searchTavily,
  brave: searchBrave,
  serpapi: searchSerpApi,
  searchapi: searchSearchApi,
  exa: searchExa,
  scrapingdog: searchScrapingDog,
  apify: searchApify,
}

const PRIMARY_SOURCES = ['serper', 'brave', 'serpapi']
const SECONDARY_SOURCES = ['tavily', 'searchapi', 'scrapingdog']
const TERTIARY_SOURCES = ['exa', 'apify']

function deduplicateResults(results) {
  const unique = []
  const seen = new Set()
  for (const r of results) {
    if (r.url && !seen.has(r.url)) {
      seen.add(r.url)
      unique.push(r)
    }
  }
  return unique
}

async function multiSourceSearch(query, num = 20, sources = null) {
  const selectedSources = sources || [...PRIMARY_SOURCES, ...SECONDARY_SOURCES, ...TERTIARY_SOURCES]
  const sourceStatus = {}
  const promises = selectedSources.map(async (src) => {
    const fn = SOURCE_MAP[src]
    if (!fn) { sourceStatus[src] = 'unavailable'; return [] }
    try {
      const perSource = Math.ceil(num / selectedSources.length)
      const results = await fn(query, perSource)
      sourceStatus[src] = results.length > 0 ? 'success' : 'empty'
      return results
    } catch (e) {
      console.error(`${src} error:`, e.message)
      sourceStatus[src] = 'error'
      return []
    }
  })

  const allResults = await Promise.allSettled(promises)
  const combined = allResults
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)

  return { results: deduplicateResults(combined), sourceStatus }
}

app.get('/api/memes/templates', async (req, res) => {
  try {
    const templates = await getImgflipTemplates()
    res.json({ success: true, data: templates })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/memes/search', async (req, res) => {
  try {
    const { q, source = 'all', num = 20 } = req.query
    if (!q) return res.status(400).json({ success: false, error: 'Query required' })

    const cacheKey = `search-${q}-${source}-${num}`
    const cached = getCached(cacheKey)
    if (cached) return res.json({ success: true, data: cached, cached: true })

    let results = []

    if (source === 'all') {
      const { results: searchResults, sourceStatus } = await multiSourceSearch(q, parseInt(num))
      results = searchResults

      if (q.length > 0) {
        try {
          const templates = await getImgflipTemplates()
          const filtered = templates.filter((t) =>
            t.name.toLowerCase().includes(q.toLowerCase())
          )
          results.push(...filtered.slice(0, 5))
          sourceStatus['imgflip'] = 'success'
        } catch (e) {
          console.error('Imgflip error:', e.message)
          sourceStatus['imgflip'] = 'error'
        }
      }

      results = deduplicateResults(results)
      setCache(cacheKey, results)
      return res.json({ success: true, data: results, sources: getActiveSources(), sourceStatus })
    } else if (SOURCE_MAP[source]) {
      try {
        results = await SOURCE_MAP[source](q, parseInt(num))
      } catch (e) {
        console.error(`${source} error:`, e.message)
      }
    } else if (source === 'imgflip') {
      try {
        const templates = await getImgflipTemplates()
        results = templates.filter((t) =>
          t.name.toLowerCase().includes(q.toLowerCase())
        ).slice(0, parseInt(num))
      } catch (e) {
        console.error('Imgflip error:', e.message)
      }
    }

    setCache(cacheKey, results)
    res.json({ success: true, data: results, sources: getActiveSources() })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/memes/trending', async (req, res) => {
  try {
    const cacheKey = 'trending-memes'
    const cached = getCached(cacheKey)
    if (cached) return res.json({ success: true, data: cached, cached: true })

    const { results, sourceStatus } = await multiSourceSearch('trending memes 2025 viral', 30)

    setCache(cacheKey, results)
    res.json({ success: true, data: results, sources: getActiveSources(), sourceStatus })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/memes/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    const { page = 1, num = 20 } = req.query
    const query = CATEGORY_QUERIES[category]

    if (!query) {
      return res.status(400).json({ success: false, error: 'Invalid category' })
    }

    const cacheKey = `category-${category}-${page}`
    const cached = getCached(cacheKey)
    if (cached) return res.json({ success: true, data: cached, cached: true })

    const { results, sourceStatus } = await multiSourceSearch(query, parseInt(num))

    setCache(cacheKey, results)
    res.json({ success: true, data: results, sources: getActiveSources(), sourceStatus })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/categories', (req, res) => {
  const categories = Object.keys(CATEGORY_QUERIES).map((key) => ({
    id: key,
    name: key.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    query: CATEGORY_QUERIES[key],
  }))
  res.json({ success: true, data: categories })
})

function getActiveSources() {
  const sources = []
  if (process.env.SERPER_API_KEY) sources.push('serper')
  if (process.env.TAVILY_API_KEY) sources.push('tavily')
  if (process.env.BRAVE_SEARCH_API_KEY) sources.push('brave')
  if (process.env.SERPAPI_API_KEY) sources.push('serpapi')
  if (process.env.SEARCHAPI_API_KEY) sources.push('searchapi')
  if (process.env.EXA_API_KEY) sources.push('exa')
  if (process.env.SCRAPINGDOG_API_KEY) sources.push('scrapingdog')
  if (process.env.APIFY_API_KEY) sources.push('apify')
  sources.push('imgflip')
  return sources
}

app.get('/api/sources', (req, res) => {
  res.json({ success: true, data: getActiveSources() })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    activeSources: getActiveSources(),
    totalSources: getActiveSources().length,
  })
})

app.listen(PORT, '0.0.0.0', () => {
  const sources = getActiveSources()
  console.log(`Meme API server running on port ${PORT}`)
  console.log(`Active search sources (${sources.length}): ${sources.join(', ')}`)
})
