# MemeLab - Ultimate Meme Generator

A professional web application for creating, customizing, and sharing memes. Built with React 18, TypeScript, and Tailwind CSS.

## Features

- **100+ Meme Templates** - Integrated with Imgflip API for the latest and most popular templates.
- **Real-time Customization** - Dynamic text overlays with adjustable font size, color, and positioning.
- **Save to Favorites** - Keep your best creations in a personal collection (persisted in localStorage).
- **Template Search** - Quickly find the perfect template with the built-in search engine.
- **High-Quality Export** - Download your memes as PNG files with crisp text rendering.
- **Dark/Light Mode** - Comfortable editing experience in any lighting.
- **Mobile Responsive** - Create memes on the go with a touch-friendly interface.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Robust type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Modern styling and layout
- **Zustand** - State management with persistence
- **Framer Motion** - Smooth UI transitions and animations
- **html2canvas** - Client-side image generation
- **Lucide React** - Beautiful, consistent iconography

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/36-Meme-Generator-Web.git

# Navigate to project
cd 36-Meme-Generator-Web

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
36-Meme-Generator-Web/
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

## Deployment

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Enable GitHub Pages in repository settings.
2. Set source to "GitHub Actions".
3. Push to the `main` branch to trigger deployment.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Live Demo:** [https://mk-knight23.github.io/36-Meme-Generator-Web/](https://mk-knight23.github.io/36-Meme-Generator-Web/)
