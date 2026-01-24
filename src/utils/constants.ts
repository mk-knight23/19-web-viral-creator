export const STORAGE_KEYS = {
  SETTINGS: 'memelab-settings',
  STATS: 'memelab-stats',
  FAVORITES: 'memelab-favorites',
} as const

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + D', action: 'Download Meme' },
  { key: 'Ctrl + R', action: 'Random Template' },
  { key: 'Ctrl + S', action: 'Save to Favorites' },
  { key: 'Escape', action: 'Close Settings' },
  { key: 'H', action: 'Toggle Help' },
  { key: '?', action: 'Show Shortcuts' },
] as const

export const DEFAULT_TEMPLATES = [
  { id: '1', name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg', width: 1200, height: 1200, box_count: 2 },
  { id: '2', name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', width: 1200, height: 800, box_count: 3 },
  { id: '3', name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', width: 600, height: 908, box_count: 3 },
  { id: '4', name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg', width: 482, height: 361, box_count: 1 },
  { id: '5', name: 'Left Exit 12 Off Ramp', url: 'https://i.imgflip.com/22bdq6.jpg', width: 804, height: 767, box_count: 3 },
]
