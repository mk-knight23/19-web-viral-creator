# MemeLab - Ultimate Meme Generator

## Overview
A professional meme generator built with React, TypeScript, and Vite. Users can create, customize, and share memes using templates or their own uploaded images. Features undo/redo, toast notifications, template categories, and a polished dark/light mode design.

## Project Architecture
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + PostCSS with CSS custom properties design system
- **State Management**: Zustand (persisted to localStorage)
- **UI**: Framer Motion for animations, Lucide React for SVG icons
- **Export**: html2canvas + file-saver for meme download

## Project Structure
```
src/
├── components/
│   ├── MemeGenerator.tsx    # Main meme editor with tabs, upload, undo/redo
│   ├── SettingsPanel.tsx    # Settings modal (theme, audio, stats, shortcuts)
│   └── Toast.tsx            # Toast notification system
├── hooks/
│   ├── useAudio.ts          # Web Audio API sound effects
│   └── useKeyboardControls.ts  # Keyboard shortcut handler
├── stores/
│   ├── memeStore.ts         # Templates & favorites (persisted)
│   ├── settings.ts          # Theme, audio, preferences (persisted)
│   ├── stats.ts             # Usage statistics (persisted)
│   └── toastStore.ts        # Toast notification state
├── types/
│   └── meme.ts              # TypeScript interfaces
├── utils/
│   └── constants.ts         # Keyboard shortcuts, default templates
├── App.tsx                  # Root layout with navbar, hero, features, footer
├── ErrorBoundary.tsx        # Error boundary wrapper
├── main.tsx                 # Entry point
└── index.css                # Design system tokens, utilities, animations
```

## Design System
- Colors use CSS custom properties that swap between light/dark mode
- Glass morphism panels with backdrop blur
- Consistent border-radius (rounded-xl/2xl)
- All interactive elements have cursor-pointer and hover feedback
- Smooth 200ms transitions on interactive state changes

## Development
- **Dev server**: `npm run dev` (port 5000, all hosts allowed)
- **Build**: `npm run build` (outputs to `dist/`)

## Deployment
- Static site deployment
- Build: `npm run build`
- Public directory: `dist`

## Recent Changes
- 2026-02-21: Full restructuring - removed unused deployment configs (Firebase, Amplify, Render, Vercel), redesigned CSS, added toast notifications, image upload, undo/redo, template categories, copy-to-clipboard, and improved accessibility
