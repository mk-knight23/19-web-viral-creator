import type { MemeTemplate } from './meme';

export const PROJECT_SCHEMA_VERSION = 1;

/** A single positioned text layer on the artboard. */
export interface TextLayer {
  id: string;
  text: string;
  /** Horizontal center position as a percentage of artboard width (0-100). */
  x: number;
  /** Vertical center position as a percentage of artboard height (0-100). */
  y: number;
  fontFamily: string;
  /** Font size in artboard pixels (rendered scaled in preview, true size on export). */
  fontSize: number;
  fontWeight: number;
  color: string;
  strokeColor: string;
  /** Stroke width in artboard pixels. */
  strokeWidth: number;
  shadowEnabled: boolean;
  /** 0 (transparent) to 1 (opaque). */
  opacity: number;
  /** Rotation in degrees. */
  rotation: number;
  hidden: boolean;
  locked: boolean;
}

export interface Artboard {
  presetId: string;
  width: number;
  height: number;
}

export interface Project {
  schemaVersion: number;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  artboard: Artboard;
  template: MemeTemplate | null;
  layers: TextLayer[];
}

/** Lightweight listing entry for the recent-projects UI. */
export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: string;
  layerCount: number;
}

export interface ArtboardPreset {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const ARTBOARD_PRESETS: readonly ArtboardPreset[] = [
  { id: 'ig-square', name: 'Instagram Square (1080×1080)', width: 1080, height: 1080 },
  { id: 'ig-portrait', name: 'Instagram Portrait (1080×1350)', width: 1080, height: 1350 },
  { id: 'ig-story', name: 'Instagram Story (1080×1920)', width: 1080, height: 1920 },
  { id: 'yt-thumb', name: 'YouTube Thumbnail (1280×720)', width: 1280, height: 720 },
  { id: 'x-post', name: 'X Post (1600×900)', width: 1600, height: 900 },
  { id: 'li-post', name: 'LinkedIn Post (1200×627)', width: 1200, height: 627 },
  { id: 'fb-post', name: 'Facebook Post (1200×630)', width: 1200, height: 630 },
  { id: 'pinterest-pin', name: 'Pinterest Pin (1000×1500)', width: 1000, height: 1500 },
] as const;

export const CUSTOM_PRESET_ID = 'custom';
export const DEFAULT_PRESET_ID = 'ig-square';
export const MIN_ARTBOARD_SIZE = 16;
export const MAX_ARTBOARD_SIZE = 4096;
export const MAX_LAYERS = 30;
export const DEFAULT_FONT_FAMILY = "'Impact', 'Arial Black', sans-serif";

export type ExportFormat = 'png' | 'jpeg' | 'webp';

export interface ExportOptions {
  format: ExportFormat;
  /** 0.1-1, only used for lossy formats. */
  quality: number;
  /** Resolution multiplier applied to the artboard dimensions. */
  multiplier: 1 | 2;
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTextLayer(overrides: Partial<TextLayer> = {}): TextLayer {
  return {
    id: generateId('layer'),
    text: '',
    x: 50,
    y: 50,
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 80,
    fontWeight: 900,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 4,
    shadowEnabled: true,
    opacity: 1,
    rotation: 0,
    hidden: false,
    locked: false,
    ...overrides,
  };
}

/** The classic meme layout: a top-text layer and a bottom-text layer. */
export function createDefaultLayers(): TextLayer[] {
  return [createTextLayer({ y: 10 }), createTextLayer({ y: 90 })];
}

export function getArtboardPreset(presetId: string): ArtboardPreset | undefined {
  return ARTBOARD_PRESETS.find(p => p.id === presetId);
}

export function createProject(overrides: Partial<Project> = {}): Project {
  const now = new Date().toISOString();
  const defaultPreset = getArtboardPreset(DEFAULT_PRESET_ID) ?? ARTBOARD_PRESETS[0];
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: generateId('proj'),
    name: 'Untitled project',
    createdAt: now,
    updatedAt: now,
    artboard: {
      presetId: defaultPreset.id,
      width: defaultPreset.width,
      height: defaultPreset.height,
    },
    template: null,
    layers: createDefaultLayers(),
    ...overrides,
  };
}
