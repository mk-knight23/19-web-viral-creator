import type { MemeTemplate } from '@/types/meme'

export interface SearchMeme {
  id: string
  name: string
  url: string
  width: number
  height: number
  source: string
  sourceUrl?: string
  thumbnail: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  cached?: boolean
  sources?: string[]
  error?: string
}

const BASE = '/api'

async function fetchApi<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${BASE}${path}`)
    const json: ApiResponse<T[]> = await res.json()
    if (!json.success) throw new Error(json.error || 'API error')
    return json.data
  } catch (err) {
    console.error(`API error (${path}):`, err)
    return []
  }
}

export async function getTemplates(): Promise<MemeTemplate[]> {
  return fetchApi<MemeTemplate>('/memes/templates')
}

export async function searchMemes(query: string, source = 'all'): Promise<SearchMeme[]> {
  return fetchApi<SearchMeme>(`/memes/search?q=${encodeURIComponent(query)}&source=${source}`)
}

export async function getTrendingMemes(): Promise<SearchMeme[]> {
  return fetchApi<SearchMeme>('/memes/trending')
}

export async function getCategoryMemes(category: string, page = 1): Promise<SearchMeme[]> {
  return fetchApi<SearchMeme>(`/memes/category/${encodeURIComponent(category)}?page=${page}`)
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  return fetchApi<{ id: string; name: string }>('/categories')
}

export async function getActiveSources(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/sources`)
    const json: ApiResponse<string[]> = await res.json()
    return json.success ? json.data : []
  } catch {
    return []
  }
}
