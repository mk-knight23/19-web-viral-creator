import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Heart, 
  RefreshCw, 
  Type, 
  Trash2,
  Share2,
  Search
} from 'lucide-react'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { useMemeStore } from '@/stores/memeStore'
import type { MemeState } from '@/types/meme'

export function MemeGenerator() {
  const { templates, setTemplates, addFavorite, favorites, removeFavorite } = useMemeStore()
  const [meme, setMeme] = useState<MemeState>({
    topText: '',
    bottomText: '',
    fontSize: 40,
    textColor: '#ffffff',
    topOffset: 10,
    bottomOffset: 10,
    template: null
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const memeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes')
        const data = await response.json()
        const memes = data.data.memes
        setTemplates(memes)
        setMeme(prev => ({ ...prev, template: memes[0] }))
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [setTemplates])

  const handleRandom = () => {
    const random = templates[Math.floor(Math.random() * templates.length)]
    setMeme(prev => ({ ...prev, template: random }))
  }

  const handleDownload = async () => {
    if (!memeRef.current) return
    const canvas = await html2canvas(memeRef.current, { useCORS: true })
    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `meme-${Date.now()}.png`)
    })
  }

  const handleFavorite = () => {
    if (!meme.template) return
    addFavorite({
      id: Math.random().toString(36).substr(2, 9),
      image: meme.template.url,
      topText: meme.topText,
      bottomText: meme.bottomText,
      date: new Date().toISOString()
    })
  }

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 12)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-8 h-8 animate-spin text-brand-primary" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass p-6 rounded-3xl space-y-4">
          <h3 className="font-display text-xl flex items-center gap-2">
            <Type className="w-5 h-5" /> Customize
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Text</label>
              <input 
                type="text"
                value={meme.topText}
                onChange={e => setMeme(prev => ({ ...prev, topText: e.target.value }))}
                className="w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                placeholder="Enter top text..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bottom Text</label>
              <input 
                type="text"
                value={meme.bottomText}
                onChange={e => setMeme(prev => ({ ...prev, bottomText: e.target.value }))}
                className="w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                placeholder="Enter bottom text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Font Size</label>
                <input 
                  type="range"
                  min="20" max="100"
                  value={meme.fontSize}
                  onChange={e => setMeme(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-primary mt-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Text Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="color"
                    value={meme.textColor}
                    onChange={e => setMeme(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-full h-10 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <button 
              onClick={handleRandom}
              className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Random
            </button>
            <button 
              onClick={handleFavorite}
              className="flex-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 p-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" /> Save
            </button>
          </div>

          <button 
            onClick={handleDownload}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold p-4 rounded-xl shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <Download className="w-5 h-5" /> DOWNLOAD MEME
          </button>
        </div>

        {/* Templates Search */}
        <div className="glass p-6 rounded-3xl space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
            {filteredTemplates.map(t => (
              <button 
                key={t.id}
                onClick={() => setMeme(prev => ({ ...prev, template: t }))}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  meme.template?.id === t.id ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-transparent'
                }`}
              >
                <img src={t.url} alt={t.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="lg:col-span-8 flex flex-col items-center">
        <div 
          ref={memeRef}
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-full"
          style={{ width: 'fit-content' }}
        >
          {meme.template && (
            <>
              <img 
                src={meme.template.url} 
                alt="Preview" 
                className="max-h-[70vh] w-auto object-contain"
                crossOrigin="anonymous"
              />
              <h2 
                className="meme-text top-4"
                style={{ fontSize: `${meme.fontSize}px`, color: meme.textColor }}
              >
                {meme.topText}
              </h2>
              <h2 
                className="meme-text bottom-4"
                style={{ fontSize: `${meme.fontSize}px`, color: meme.textColor }}
              >
                {meme.bottomText}
              </h2>
            </>
          )}
        </div>

        {/* Favorites section */}
        {favorites.length > 0 && (
          <div className="w-full mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-brand-accent fill-current" /> My Favorites
              </h3>
              <span className="text-sm text-slate-500 font-medium">{favorites.length} memes saved</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {favorites.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative glass p-2 rounded-2xl"
                  >
                    <img src={f.image} alt="Favorite" className="w-full aspect-square object-cover rounded-xl" />
                    <div className="absolute inset-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button 
                        onClick={() => removeFavorite(f.id)}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
