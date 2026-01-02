// Wire Master - Theme System
// Customizable visual themes for the game

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // UI Colors
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  overlay: string;

  // Button Colors
  buttonText: string;
  buttonBackground: string;

  // Wire Colors (for game grid)
  wireColors: string[];

  // Cell Colors
  cellEmpty: string;
  cellBorder: string;
}

export interface ThemeEffects {
  glow?: boolean;
  glowIntensity?: number;
  glowColor?: string;
  shadow?: boolean;
  shadowIntensity?: number;
  gradient?: boolean;
  particleEffect?: 'none' | 'sparkle' | 'bubbles' | 'neon';
}

export interface Theme {
  id: string;
  name: string;
  nameKey: string; // Translation key
  icon: string;
  description: string;
  descriptionKey: string; // Translation key

  // Unlock requirements
  unlockLevel: number; // 0 = available from start
  price: number; // 0 = free
  requirementType: 'level' | 'coins' | 'achievement' | 'free';

  // Visual properties
  colors: ThemeColors;
  effects?: ThemeEffects;

  // Preview (for theme selection screen)
  previewImage?: string;
}

// Default wire colors for different themes
const WIRE_COLORS_CLASSIC = [
  '#ff6b6b', // Red
  '#4ecdc4', // Teal
  '#ffe66d', // Yellow
  '#a8e6cf', // Mint
  '#ff8b94', // Pink
  '#c7ceea', // Lavender
  '#ffd3b6', // Peach
  '#ffaaa5', // Salmon
  '#95e1d3', // Aqua
  '#f38181', // Coral
  '#aa96da', // Purple
  '#fcbad3', // Rose
  '#a8d8ea', // Sky Blue
];

const WIRE_COLORS_LIGHT = [
  '#e74c3c', // Darker Red
  '#16a085', // Darker Teal
  '#f39c12', // Darker Yellow
  '#27ae60', // Green
  '#9b59b6', // Purple
  '#2980b9', // Blue
  '#e67e22', // Orange
  '#1abc9c', // Turquoise
  '#34495e', // Dark Gray
  '#c0392b', // Dark Red
  '#8e44ad', // Dark Purple
  '#2c3e50', // Navy
  '#d35400', // Dark Orange
];

const WIRE_COLORS_NEON = [
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#ff0080', // Pink
  '#0080ff', // Blue
  '#ff8000', // Orange
  '#80ff00', // Lime
  '#ff0040', // Red-Pink
  '#40ff00', // Green-Yellow
  '#0040ff', // Blue-Purple
  '#ff4000', // Orange-Red
  '#00ff80', // Aqua
];

export const THEMES: Record<string, Theme> = {
  // 1. CLASSIC DARK (Default - Current theme)
  classic: {
    id: 'classic',
    name: 'Classic Dark',
    nameKey: 'themes.classic.name',
    icon: '🎮',
    description: 'The original dark theme',
    descriptionKey: 'themes.classic.description',
    unlockLevel: 1,
    price: 0,
    requirementType: 'free',
    colors: {
      background: '#0f1419',
      backgroundSecondary: '#1a2332',
      backgroundTertiary: '#1a2b3a',
      primary: '#8b9bff',
      secondary: '#6366f1',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      border: '#2a3b4a',
      overlay: 'rgba(15, 20, 25, 0.95)',
      buttonText: '#0f1419',
      buttonBackground: '#8b9bff',
      wireColors: WIRE_COLORS_CLASSIC,
      cellEmpty: '#1a2332',
      cellBorder: '#2a3342',
    },
    effects: {
      glow: false,
      shadow: true,
      shadowIntensity: 0.3,
      gradient: false,
      particleEffect: 'none',
    },
  },

  // 2. LIGHT MODE
  light: {
    id: 'light',
    name: 'Light Mode',
    nameKey: 'themes.light.name',
    icon: '☀️',
    description: 'Bright and clean theme',
    descriptionKey: 'themes.light.description',
    unlockLevel: 10,
    price: 0,
    requirementType: 'level',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f8f9fa',
      backgroundTertiary: '#e9ecef',
      primary: '#6366f1',
      secondary: '#8b9bff',
      text: '#1a202c',
      textSecondary: '#4a5568',
      border: '#cbd5e0',
      overlay: 'rgba(255, 255, 255, 0.95)',
      buttonText: '#ffffff',
      buttonBackground: '#6366f1',
      wireColors: WIRE_COLORS_LIGHT,
      cellEmpty: '#f8f9fa',
      cellBorder: '#e2e8f0',
    },
    effects: {
      glow: false,
      shadow: true,
      shadowIntensity: 0.1,
      gradient: false,
      particleEffect: 'none',
    },
  },

  // 3. NEON GLOW
  neon: {
    id: 'neon',
    name: 'Neon Glow',
    nameKey: 'themes.neon.name',
    icon: '⚡',
    description: 'Vibrant neon with glow effects',
    descriptionKey: 'themes.neon.description',
    unlockLevel: 0,
    price: 1000,
    requirementType: 'coins',
    colors: {
      background: '#000000',
      backgroundSecondary: '#0a0a0a',
      backgroundTertiary: '#141414',
      primary: '#00ff88',
      secondary: '#ff00ff',
      text: '#ffffff',
      textSecondary: '#a0a0a0',
      border: '#00ff88',
      overlay: 'rgba(0, 0, 0, 0.95)',
      buttonText: '#000000',
      buttonBackground: '#00ff88',
      wireColors: WIRE_COLORS_NEON,
      cellEmpty: '#0a0a0a',
      cellBorder: '#1a1a1a',
    },
    effects: {
      glow: true,
      glowIntensity: 10,
      glowColor: '#00ff88',
      shadow: true,
      shadowIntensity: 0.5,
      gradient: false,
      particleEffect: 'sparkle',
    },
  },
};

// Helper function to get theme by ID
export const getThemeById = (id: string): Theme => {
  return THEMES[id] || THEMES.classic;
};

// Helper function to check if theme is unlocked
export const isThemeUnlocked = (
  theme: Theme,
  userLevel: number,
  userCoins: number,
  purchasedThemes: string[]
): boolean => {
  // Free themes are always unlocked
  if (theme.requirementType === 'free') {
    return true;
  }

  // Level-based unlock
  if (theme.requirementType === 'level') {
    return userLevel >= theme.unlockLevel;
  }

  // Coin-based unlock (check if purchased)
  if (theme.requirementType === 'coins') {
    return purchasedThemes.includes(theme.id);
  }

  // Achievement-based (to be implemented later)
  if (theme.requirementType === 'achievement') {
    return purchasedThemes.includes(theme.id);
  }

  return false;
};

// Helper function to get all available themes
export const getAvailableThemes = (): Theme[] => {
  return Object.values(THEMES);
};

// Helper function to get unlock status text
export const getThemeUnlockText = (
  theme: Theme,
  userLevel: number,
  userCoins: number,
  purchasedThemes: string[]
): string => {
  if (isThemeUnlocked(theme, userLevel, userCoins, purchasedThemes)) {
    return 'Unlocked';
  }

  if (theme.requirementType === 'level') {
    return `Level ${theme.unlockLevel}`;
  }

  if (theme.requirementType === 'coins') {
    return `${theme.price} 💰`;
  }

  if (theme.requirementType === 'achievement') {
    return '🏆 Achievement';
  }

  return 'Locked';
};
