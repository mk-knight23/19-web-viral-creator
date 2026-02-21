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

## API Keys (stored as secrets)
- SERPER_API_KEY - Google image search for memes
- TAVILY_API_KEY - AI-powered meme search
- APIFY_API_KEY, BRAVE_SEARCH_API_KEY, EXA_API_KEY, SCRAPINGDOG_API_KEY, SEARCHAPI_API_KEY, SERPAPI_API_KEY - Available for future use

## Meme Categories
Trending, Funny, Indian, American, Movies, Series, Politics, Dark Humor, Animals, Sports, Gaming, AI Memes, Classic, Reaction

## Features
- Multi-source meme search (Serper + Tavily + Imgflip)
- 15 meme categories with web search
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
