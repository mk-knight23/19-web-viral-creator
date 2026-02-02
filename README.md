# Web Viral Creator

A professional web application for creating, customizing, and sharing memes. Built with React 19, TypeScript, and Tailwind CSS v4.

## Features

- **100+ Meme Templates** - Integrated with Imgflip API for the latest and most popular templates.
- **Real-time Customization** - Dynamic text overlays with adjustable font size, color, and positioning.
- **Save to Favorites** - Keep your best creations in a personal collection (persisted in localStorage).
- **Template Search** - Quickly find the perfect template with the built-in search engine.
- **High-Quality Export** - Download your memes as PNG files with crisp text rendering.
- **Dark/Light Mode** - Comfortable editing experience in any lighting.
- **Mobile Responsive** - Create memes on the go with a touch-friendly interface.

## Tech Stack

- **React 19.2.3** - Latest UI framework
- **TypeScript 5.9.3** - Robust type safety
- **Vite 6.4.1** - Lightning-fast build tool
- **Tailwind CSS v4** - Modern styling and layout
- **Zustand 5.0.2** - State management with persistence
- **Framer Motion 12.29.2** - Smooth UI transitions and animations
- **html2canvas** - Client-side image generation
- **Lucide React** - Beautiful, consistent iconography

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/19-web-viral-creator.git

# Navigate to project
cd 19-web-viral-creator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
19-web-viral-creator/
├── public/
│   └── favicon.svg      # App icon
├── src/
│   ├── components/
│   │   └── MemeGenerator.tsx # Core generator logic
│   ├── stores/
│   │   └── memeStore.ts      # Global state & favorites
│   ├── types/
│   │   └── meme.ts           # TS interfaces
│   ├── App.tsx          # Main layout & header
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles & custom classes
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built by [Kazi Musharraf](https://github.com/mkazi-)*
Status: 🟢 Active
Last Updated: 2026-02-02
