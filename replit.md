# MemeLab - Ultimate Meme Generator

## Overview
A professional meme generator built with React, TypeScript, and Vite. Users can create, customize, and share memes using templates or their own images.

## Project Architecture
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + PostCSS
- **State Management**: Zustand
- **UI**: Framer Motion for animations, Lucide React for icons
- **Testing**: Vitest + React Testing Library

## Project Structure
```
src/
├── components/       # React components (MemeGenerator, SettingsPanel)
├── hooks/            # Custom hooks (useAudio, useKeyboardControls)
├── stores/           # Zustand stores (memeStore, settings, stats)
├── types/            # TypeScript type definitions
├── utils/            # Constants and utilities
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Development
- **Dev server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview`

## Deployment
- Static site deployment
- Build command: `npm run build`
- Public directory: `dist`
