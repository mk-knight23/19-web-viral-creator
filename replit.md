# MemeLab - Ultimate Meme Generator

## Overview
A professional meme generator with multi-source meme search powered by Serper and Tavily APIs. Users can browse trending memes across 15+ categories (Indian, American, Movies, Dark Humor, Gaming, etc.), customize text with advanced styling, and export/share memes.

## Project Architecture
- **Frontend**: React 19 + TypeScript + Vite 6
- **Backend**: Express.js API proxy server (port 3001)
- **Styling**: Tailwind CSS 4 + CSS custom properties design system
- **State Management**: Zustand (persisted to localStorage)
- **UI**: Framer Motion animations, Lucide React icons
- **Export**: html2canvas + file-saver for downloads
- **Search APIs**: Serper (Google Images), Tavily (AI search), Imgflip (templates)

## Project Structure
```
├── server/
│   └── index.js              # Express API server with search proxy, caching
├── src/
│   ├── components/
│   │   ├── MemeGenerator.tsx  # Main editor with browse/customize tabs
│   │   ├── SettingsPanel.tsx  # Settings modal (theme, audio, stats)
│   │   └── Toast.tsx          # Toast notification system
│   ├── hooks/
│   │   ├── useAudio.ts       # Web Audio API sound effects
│   │   └── useKeyboardControls.ts
│   ├── stores/
│   │   ├── memeStore.ts      # Templates & favorites (persisted)
│   │   ├── settings.ts       # Theme, audio, preferences (persisted)
│   │   ├── stats.ts          # Usage statistics (persisted)
│   │   └── toastStore.ts     # Toast notification state
│   ├── types/meme.ts         # TypeScript interfaces
│   ├── utils/
│   │   ├── api.ts            # Frontend API client
│   │   └── constants.ts      # Keyboard shortcuts, defaults
│   ├── App.tsx               # Root layout with navbar, hero, features
│   ├── ErrorBoundary.tsx     # Error boundary wrapper
│   ├── main.tsx              # Entry point
│   └── index.css             # Design system tokens
├── vite.config.ts            # Vite config with /api proxy to backend
└── package.json              # Scripts: dev runs both frontend + backend
```

## API Keys (stored as secrets) - All 8 actively used
- SERPER_API_KEY - Google image search (primary source)
- BRAVE_SEARCH_API_KEY - Brave image search (primary source)
- SERPAPI_API_KEY - SerpAPI Google Images (primary source)
- TAVILY_API_KEY - AI-powered meme search (secondary source)
- SEARCHAPI_API_KEY - SearchAPI Google Images (secondary source)
- SCRAPINGDOG_API_KEY - ScrapingDog image search (secondary source)
- EXA_API_KEY - Exa AI semantic search (tertiary source)
- APIFY_API_KEY - Apify web scraper (tertiary/fallback source)

## Meme Categories
Trending, Funny, Indian, American, Movies, Series, Politics, Dark Humor, Animals, Sports, Gaming, AI Memes, Classic, Reaction

## Features
- Multi-source meme search (8 APIs: Serper, Brave, SerpAPI, Tavily, SearchAPI, ScrapingDog, Exa, Apify + Imgflip)
- Smart search with primary/secondary/tertiary source tiering and fallbacks
- 15 meme categories with web search
- Color-coded source badges on search results
- Text styling (font family, stroke, shadow, color, position)
- Image upload, undo/redo, copy to clipboard
- Social sharing (Twitter, Facebook, Reddit, WhatsApp)
- Toast notifications, keyboard shortcuts
- Dark/light mode, sound effects, usage stats

## Development
- `npm run dev` - Runs Vite (port 5000) + Express (port 3001) concurrently
- Vite proxies /api/* requests to Express backend

## Deployment
- Autoscale deployment
- Build: `npm run build`
- Run: Express server + serve dist on port 5000

## Recent Changes
- 2026-02-21: Added Express backend with Serper/Tavily search APIs, 15 meme categories, text styling (fonts, stroke, shadow), social sharing, copy to clipboard, undo/redo
- 2026-02-21: Integrated all 8 search APIs (Serper, Brave, SerpAPI, Tavily, SearchAPI, ScrapingDog, Exa, Apify) with tiered search strategy and color-coded source badges
