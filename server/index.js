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
  if (cache.size > 200) {
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
  if (!apiKey) throw new Error('SERPER_API_KEY not configured')

  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query + ' meme',
      num,
      gl: 'us',
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Serper API error: ${response.status} - ${text}`)
  }

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
  if (!apiKey) throw new Error('TAVILY_API_KEY not configured')

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

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Tavily API error: ${response.status} - ${text}`)
  }

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

    if (source === 'serper' || source === 'all') {
      try {
        const serperResults = await searchSerper(q, parseInt(num))
        results.push(...serperResults)
      } catch (e) {
        console.error('Serper error:', e.message)
      }
    }

    if (source === 'tavily' || source === 'all') {
      try {
        const tavilyResults = await searchTavily(q, parseInt(num))
        results.push(...tavilyResults)
      } catch (e) {
        console.error('Tavily error:', e.message)
      }
    }

    if (source === 'imgflip' || source === 'all') {
      try {
        const templates = await getImgflipTemplates()
        const filtered = templates.filter((t) =>
          t.name.toLowerCase().includes(q.toLowerCase())
        )
        results.push(...filtered.slice(0, parseInt(num)))
      } catch (e) {
        console.error('Imgflip error:', e.message)
      }
    }

    const unique = []
    const seen = new Set()
    for (const r of results) {
      if (!seen.has(r.url)) {
        seen.add(r.url)
        unique.push(r)
      }
    }

    setCache(cacheKey, unique)
    res.json({ success: true, data: unique })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/memes/trending', async (req, res) => {
  try {
    const cacheKey = 'trending-memes'
    const cached = getCached(cacheKey)
    if (cached) return res.json({ success: true, data: cached, cached: true })

    let results = []

    try {
      const serperResults = await searchSerper('trending memes 2025 viral', 20)
      results.push(...serperResults)
    } catch (e) {
      console.error('Serper trending error:', e.message)
    }

    try {
      const tavilyResults = await searchTavily('trending viral memes today', 10)
      results.push(...tavilyResults)
    } catch (e) {
      console.error('Tavily trending error:', e.message)
    }

    const unique = []
    const seen = new Set()
    for (const r of results) {
      if (!seen.has(r.url)) {
        seen.add(r.url)
        unique.push(r)
      }
    }

    setCache(cacheKey, unique)
    res.json({ success: true, data: unique })
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

    let results = []

    try {
      const serperResults = await searchSerper(query, parseInt(num))
      results.push(...serperResults)
    } catch (e) {
      console.error(`Serper category ${category} error:`, e.message)
    }

    if (results.length < 10) {
      try {
        const tavilyResults = await searchTavily(query, parseInt(num))
        results.push(...tavilyResults)
      } catch (e) {
        console.error(`Tavily category ${category} error:`, e.message)
      }
    }

    const unique = []
    const seen = new Set()
    for (const r of results) {
      if (!seen.has(r.url)) {
        seen.add(r.url)
        unique.push(r)
      }
    }

    setCache(cacheKey, unique)
    res.json({ success: true, data: unique })
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Meme API server running on port ${PORT}`)
})
