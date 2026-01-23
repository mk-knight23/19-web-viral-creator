import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MemeTemplate, FavoriteMeme } from '@/types/meme'

interface MemeStore {
  templates: MemeTemplate[]
  favorites: FavoriteMeme[]
  isDarkMode: boolean
  
  // Actions
  setTemplates: (templates: MemeTemplate[]) => void
  addFavorite: (favorite: FavoriteMeme) => void
  removeFavorite: (id: string) => void
  toggleDarkMode: () => void
}

export const useMemeStore = create<MemeStore>()(
  persist(
    (set) => ({
      templates: [],
      favorites: [],
      isDarkMode: true,
      
      setTemplates: (templates) => set({ templates }),
      addFavorite: (favorite) => set((state) => ({ 
        favorites: [favorite, ...state.favorites] 
      })),
      removeFavorite: (id) => set((state) => ({ 
        favorites: state.favorites.filter(f => f.id !== id) 
      })),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'memelab-storage',
    }
  )
)
