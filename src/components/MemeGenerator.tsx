import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Heart,
  RefreshCw,
  Type,
  Trash2,
  Search,
  Upload,
  Undo2,
  Redo2,
  Copy,
  ChevronDown,
  ImageIcon,
  Palette,
  Move,
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { useMemeStore } from '@/stores/memeStore'
import { useStatsStore } from '@/stores/stats'
import { useToastStore } from '@/stores/toastStore'
import type { MemeState } from '@/types/meme'

const CATEGORIES = ['All', 'Classic', 'Trending', 'Reaction', 'Animals'] as const

export function MemeGenerator() {
  const { templates, setTemplates, addFavorite, favorites, removeFavorite } = useMemeStore()
  const stats = useStatsStore()
  const { addToast } = useToastStore()
  const [meme, setMeme] = useState<MemeState>({
    topText: '',
    bottomText: '',
    fontSize: 40,
    textColor: '#ffffff',
    topOffset: 10,
    bottomOffset: 10,
    template: null,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const historyRef = useRef<MemeState[]>([])
  const historyIndexRef = useRef(-1)
  const [historyLen, setHistoryLen] = useState(0)
  const [currentHistoryIdx, setCurrentHistoryIdx] = useState(-1)
  const [showTemplates, setShowTemplates] = useState(true)
  const [activeTab, setActiveTab] = useState<'customize' | 'templates'>('customize')
  const memeRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      stats.addTimeSpent(1)
    }, 1000)
    return () => clearInterval(interval)
  }, [stats])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      const key = e.key.toLowerCase()
      if (key === 'd') { e.preventDefault(); handleDownload() }
      else if (key === 'r') { e.preventDefault(); handleRandom() }
      else if (key === 's') { e.preventDefault(); handleFavorite() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes')
        const data = await response.json()
        const memes = data.data.memes
        setTemplates(memes)
        const initialMeme: MemeState = { topText: '', bottomText: '', fontSize: 40, textColor: '#ffffff', topOffset: 10, bottomOffset: 10, template: memes[0] }
        setMeme(initialMeme)
        historyRef.current = [initialMeme]
        historyIndexRef.current = 0
        setHistoryLen(1)
        setCurrentHistoryIdx(0)
        setLoading(false)
      } catch {
        setLoading(false)
        addToast('Failed to load templates', 'error')
      }
    }
    fetchTemplates()
  }, [setTemplates])

  const commitToHistory = useCallback((newMeme: MemeState) => {
    const trimmed = historyRef.current.slice(0, historyIndexRef.current + 1)
    trimmed.push(newMeme)
    if (trimmed.length > 50) trimmed.shift()
    historyRef.current = trimmed
    historyIndexRef.current = trimmed.length - 1
    setHistoryLen(trimmed.length)
    setCurrentHistoryIdx(historyIndexRef.current)
  }, [])

  const updateMeme = useCallback((updates: Partial<MemeState>) => {
    setMeme((prev) => {
      const next = { ...prev, ...updates }
      if (commitTimerRef.current) clearTimeout(commitTimerRef.current)
      commitTimerRef.current = setTimeout(() => commitToHistory(next), 300)
      return next
    })
  }, [commitToHistory])

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1
      setCurrentHistoryIdx(historyIndexRef.current)
      setMeme(historyRef.current[historyIndexRef.current])
    }
  }

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1
      setCurrentHistoryIdx(historyIndexRef.current)
      setMeme(historyRef.current[historyIndexRef.current])
    }
  }

  const handleRandom = () => {
    if (templates.length === 0) return
    const random = templates[Math.floor(Math.random() * templates.length)]
    updateMeme({ template: random })
    stats.recordMemeCreated()
    addToast('Random template loaded!', 'success')
  }

  const handleDownload = async () => {
    if (!memeRef.current) return
    try {
      const canvas = await html2canvas(memeRef.current, { useCORS: true, scale: 2 })
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `memelab-${Date.now()}.png`)
          stats.recordDownload()
          addToast('Meme downloaded successfully!', 'success')
        }
      })
    } catch {
      addToast('Download failed. Try again.', 'error')
    }
  }

  const handleFavorite = () => {
    if (!meme.template) return
    addFavorite({
      id: Math.random().toString(36).substring(2, 9),
      image: meme.template.url,
      topText: meme.topText,
      bottomText: meme.bottomText,
      date: new Date().toISOString(),
    })
    stats.addFavorite()
    addToast('Saved to favorites!', 'success')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const url = event.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        updateMeme({
          template: {
            id: `custom-${Date.now()}`,
            name: file.name,
            url,
            width: img.width,
            height: img.height,
            box_count: 2,
          },
        })
        addToast('Image uploaded!', 'success')
        stats.recordMemeCreated()
      }
      img.src = url
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCopyToClipboard = async () => {
    if (!memeRef.current) return
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      addToast('Clipboard not supported in this browser. Use download instead.', 'info')
      return
    }
    try {
      const canvas = await html2canvas(memeRef.current, { useCORS: true, scale: 2 })
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ])
          addToast('Copied to clipboard!', 'success')
        }
      })
    } catch {
      addToast('Copy failed. Try downloading instead.', 'error')
    }
  }

  const getCategoryTemplates = () => {
    let filtered = templates
    if (activeCategory !== 'All') {
      const categoryMap: Record<string, number[]> = {
        Classic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        Trending: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        Reaction: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
        Animals: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
      }
      const indices = categoryMap[activeCategory] || []
      filtered = indices.map((i) => templates[i]).filter(Boolean)
    }
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered.slice(0, 20)
  }

  const quickColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-primary" />
        <p className="text-text-muted text-sm">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-4">
        <div className="flex bg-surface-secondary rounded-xl p-1 border border-border">
          {(['customize', 'templates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-surface-elevated text-brand-primary shadow-sm border border-border'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab === 'customize' ? (
                <span className="flex items-center justify-center gap-2"><Palette className="w-4 h-4" /> Customize</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><ImageIcon className="w-4 h-4" /> Templates</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'customize' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-elevated p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Type className="w-5 h-5 text-brand-primary" /> Text
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={undo}
                  disabled={currentHistoryIdx <= 0}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={currentHistoryIdx >= historyLen - 1}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Redo"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Top Text</label>
                <input
                  type="text"
                  value={meme.topText}
                  onChange={(e) => updateMeme({ topText: e.target.value })}
                  className="w-full bg-surface-secondary border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary outline-none transition-all text-sm"
                  placeholder="Enter top text..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Bottom Text</label>
                <input
                  type="text"
                  value={meme.bottomText}
                  onChange={(e) => updateMeme({ bottomText: e.target.value })}
                  className="w-full bg-surface-secondary border border-border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary outline-none transition-all text-sm"
                  placeholder="Enter bottom text..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                  Font Size: {meme.fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={meme.fontSize}
                  onChange={(e) => updateMeme({ fontSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5">Text Color</label>
                <div className="flex items-center gap-2">
                  {quickColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateMeme({ textColor: color })}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        meme.textColor === color ? 'border-brand-primary scale-110' : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set color to ${color}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={meme.textColor}
                    onChange={(e) => updateMeme({ textColor: e.target.value })}
                    className="w-7 h-7 rounded-full cursor-pointer border-0 bg-transparent"
                    aria-label="Custom color picker"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Move className="w-3.5 h-3.5" /> Text Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-text-muted">Top offset: {meme.topOffset}%</span>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={meme.topOffset}
                      onChange={(e) => updateMeme({ topOffset: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted">Bottom offset: {meme.bottomOffset}%</span>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={meme.bottomOffset}
                      onChange={(e) => updateMeme({ bottomOffset: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleRandom}
                className="bg-surface-secondary hover:bg-border text-text-secondary p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Random
              </button>
              <button
                onClick={handleFavorite}
                className="bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-950/50 p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer active:scale-95"
              >
                <Heart className="w-4 h-4" /> Save
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="bg-brand-primary hover:bg-brand-accent text-white font-bold p-3.5 rounded-xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="bg-surface-secondary border border-border hover:border-brand-primary/30 text-text-secondary p-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm font-semibold"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border hover:border-brand-primary/40 p-4 rounded-xl text-text-muted hover:text-brand-primary transition-all flex items-center justify-center gap-2 text-sm font-medium cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Upload Your Own Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-elevated p-5 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-surface-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface-secondary text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              {getCategoryTemplates().map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    updateMeme({ template: t })
                    setActiveTab('customize')
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    meme.template?.id === t.id
                      ? 'border-brand-primary ring-2 ring-brand-primary/20'
                      : 'border-transparent hover:border-border-hover'
                  }`}
                >
                  <img src={t.url} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                    <span className="text-white text-[10px] font-semibold leading-tight line-clamp-2">{t.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="lg:col-span-8 flex flex-col items-center gap-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-text-secondary">Preview</h3>
            {meme.template && (
              <span className="text-xs text-text-muted bg-surface-secondary px-3 py-1.5 rounded-lg">
                {meme.template.name}
              </span>
            )}
          </div>

          <div
            ref={memeRef}
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto"
            style={{ width: 'fit-content', maxWidth: '100%' }}
          >
            {meme.template && (
              <>
                <img
                  src={meme.template.url}
                  alt="Meme preview"
                  className="max-h-[65vh] w-auto object-contain block"
                  crossOrigin="anonymous"
                />
                {meme.topText && (
                  <h2
                    className="meme-text"
                    style={{
                      fontSize: `${meme.fontSize}px`,
                      color: meme.textColor,
                      top: `${meme.topOffset}%`,
                    }}
                  >
                    {meme.topText}
                  </h2>
                )}
                {meme.bottomText && (
                  <h2
                    className="meme-text"
                    style={{
                      fontSize: `${meme.fontSize}px`,
                      color: meme.textColor,
                      bottom: `${meme.bottomOffset}%`,
                    }}
                  >
                    {meme.bottomText}
                  </h2>
                )}
              </>
            )}
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="w-full space-y-4">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <h3 className="font-display font-bold text-lg">My Favorites</h3>
              <span className="text-xs text-text-muted bg-surface-secondary px-2 py-1 rounded-md">{favorites.length}</span>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {favorites.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group relative card-elevated p-2 cursor-pointer"
                      >
                        <img src={f.image} alt="Favorite meme" className="w-full aspect-square object-cover rounded-xl" loading="lazy" />
                        {(f.topText || f.bottomText) && (
                          <div className="mt-2 px-1">
                            <p className="text-xs text-text-muted truncate">{f.topText || f.bottomText}</p>
                          </div>
                        )}
                        <div className="absolute inset-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <button
                            onClick={() => {
                              removeFavorite(f.id)
                              addToast('Removed from favorites', 'info')
                            }}
                            className="bg-white/20 hover:bg-red-500/80 p-2.5 rounded-full text-white transition-colors cursor-pointer"
                            aria-label="Remove from favorites"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
