import { motion } from 'framer-motion'
import { useMemeStore } from '@/stores/memeStore'
import { 
  Smile, 
  Zap, 
  Moon, 
  Sun, 
  Github
} from 'lucide-react'
import { MemeGenerator } from './components/MemeGenerator'

export default function App() {
  const { isDarkMode, toggleDarkMode } = useMemeStore()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary p-2.5 rounded-2xl shadow-lg shadow-brand-primary/30">
              <Smile className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">
              Meme<span className="text-brand-primary">Lab</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a 
              href="https://github.com/mk-knight23/36-Meme-Generator-Web"
              className="hidden sm:flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-all"
            >
              <Github size={20} />
            </a>
          </div>
        </header>

        {/* Hero */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3 fill-current" /> Professional Meme Maker
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-brand-primary to-brand-accent dark:from-white dark:via-brand-primary dark:to-brand-accent">
              Create Memes that Go Viral
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              The ultimate workspace for digital creators. Customize thousands of templates or upload your own.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <main>
          <MemeGenerator />
        </main>

        {/* Footer */}
        <footer className="mt-24 py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
              <Smile size={20} />
              <span className="font-display font-bold">MemeLab v2.0</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">API</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Templates</a>
            </div>
            <p className="text-slate-400 text-sm">
              &copy; 2026 MK-STUDIOS
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
