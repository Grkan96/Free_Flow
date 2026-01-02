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

const WIRE_COLORS_OCEAN = [
  '#0077be', // Deep Blue
  '#00bfff', // Sky Blue
  '#4dd0e1', // Cyan
  '#26c6da', // Light Cyan
  '#00acc1', // Dark Cyan
  '#0097a7', // Teal
  '#00838f', // Dark Teal
  '#006064', // Very Dark Teal
  '#4fc3f7', // Light Blue
  '#29b6f6', // Medium Blue
  '#03a9f4', // Bright Blue
  '#039be5', // Ocean Blue
  '#0288d1', // Deep Ocean
];

const WIRE_COLORS_SUNSET = [
  '#ff6b35', // Coral Red
  '#f7931e', // Orange
  '#fdc500', // Gold
  '#ff4e50', // Red
  '#fc913a', // Light Orange
  '#ff8c42', // Peach
  '#f95738', // Bright Red
  '#ee964b', // Amber
  '#f4a261', // Sandy
  '#e76f51', // Terracotta
  '#d62828', // Dark Red
  '#f77f00', // Deep Orange
  '#fcbf49', // Yellow
];

const WIRE_COLORS_FOREST = [
  '#2d6a4f', // Forest Green
  '#40916c', // Medium Green
  '#52b788', // Light Green
  '#74c69d', // Mint
  '#95d5b2', // Pale Green
  '#1b4332', // Dark Forest
  '#081c15', // Very Dark
  '#52796f', // Sage
  '#84a98c', // Light Sage
  '#cad2c5', // Pale Sage
  '#6a994e', // Grass
  '#a7c957', // Light Grass
  '#f2e8cf', // Cream
];

const WIRE_COLORS_PURPLE = [
  '#9d4edd', // Purple
  '#7b2cbf', // Deep Purple
  '#5a189a', // Dark Purple
  '#c77dff', // Light Purple
  '#e0aaff', // Pale Purple
  '#10002b', // Very Dark Purple
  '#240046', // Dark Violet
  '#3c096c', // Violet
  '#5a189a', // Royal Purple
  '#7209b7', // Magenta Purple
  '#b5179e', // Pink Purple
  '#f72585', // Hot Pink
  '#4cc9f0', // Cyan Accent
];

const WIRE_COLORS_CHERRY = [
  '#ffb3d9', // Light Pink
  '#ff69b4', // Hot Pink
  '#ffd700', // Gold
  '#98fb98', // Pale Green
  '#ffb6c1', // Light Pink
  '#ff1493', // Deep Pink
  '#ff69b4', // Medium Pink
  '#ffc0cb', // Pink
  '#ffb7c5', // Cherry Blossom
  '#ee82ee', // Violet
  '#da70d6', // Orchid
  '#ba55d3', // Medium Orchid
  '#dda0dd', // Plum
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

  // 4. OCEAN DEPTHS
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    nameKey: 'themes.ocean.name',
    icon: '🌊',
    description: 'Deep blue underwater theme',
    descriptionKey: 'themes.ocean.description',
    unlockLevel: 25,
    price: 0,
    requirementType: 'level',
    colors: {
      background: '#001f3f',
      backgroundSecondary: '#002b4f',
      backgroundTertiary: '#003d5c',
      primary: '#39cccc',
      secondary: '#0074d9',
      text: '#ffffff',
      textSecondary: '#7fdbff',
      border: '#004466',
      overlay: 'rgba(0, 31, 63, 0.95)',
      buttonText: '#001f3f',
      buttonBackground: '#39cccc',
      wireColors: WIRE_COLORS_OCEAN,
      cellEmpty: '#002b4f',
      cellBorder: '#003d5c',
    },
    effects: {
      glow: false,
      shadow: true,
      shadowIntensity: 0.4,
      gradient: true,
      particleEffect: 'bubbles',
    },
  },

  // 5. SUNSET VIBES
  sunset: {
    id: 'sunset',
    name: 'Sunset Vibes',
    nameKey: 'themes.sunset.name',
    icon: '🌅',
    description: 'Warm sunset colors',
    descriptionKey: 'themes.sunset.description',
    unlockLevel: 0,
    price: 1500,
    requirementType: 'coins',
    colors: {
      background: '#2c1810',
      backgroundSecondary: '#3d2415',
      backgroundTertiary: '#4e2f1a',
      primary: '#ff6b35',
      secondary: '#f7931e',
      text: '#fff5e6',
      textSecondary: '#fdc500',
      border: '#4e2f1a',
      overlay: 'rgba(44, 24, 16, 0.95)',
      buttonText: '#2c1810',
      buttonBackground: '#ff6b35',
      wireColors: WIRE_COLORS_SUNSET,
      cellEmpty: '#3d2415',
      cellBorder: '#4e2f1a',
    },
    effects: {
      glow: true,
      glowIntensity: 5,
      glowColor: '#ff6b35',
      shadow: true,
      shadowIntensity: 0.3,
      gradient: true,
      particleEffect: 'none',
    },
  },

  // 6. FOREST
  forest: {
    id: 'forest',
    name: 'Forest',
    nameKey: 'themes.forest.name',
    icon: '🌲',
    description: 'Natural green forest theme',
    descriptionKey: 'themes.forest.description',
    unlockLevel: 50,
    price: 0,
    requirementType: 'level',
    colors: {
      background: '#1a3a1a',
      backgroundSecondary: '#254d25',
      backgroundTertiary: '#306030',
      primary: '#4caf50',
      secondary: '#8bc34a',
      text: '#e8f5e9',
      textSecondary: '#a5d6a7',
      border: '#2e5c2e',
      overlay: 'rgba(26, 58, 26, 0.95)',
      buttonText: '#1a3a1a',
      buttonBackground: '#4caf50',
      wireColors: WIRE_COLORS_FOREST,
      cellEmpty: '#254d25',
      cellBorder: '#306030',
    },
    effects: {
      glow: false,
      shadow: true,
      shadowIntensity: 0.3,
      gradient: false,
      particleEffect: 'none',
    },
  },

  // 7. PURPLE DREAM
  purple: {
    id: 'purple',
    name: 'Purple Dream',
    nameKey: 'themes.purple.name',
    icon: '💜',
    description: 'Mystical purple gradients',
    descriptionKey: 'themes.purple.description',
    unlockLevel: 0,
    price: 2000,
    requirementType: 'coins',
    colors: {
      background: '#1a0033',
      backgroundSecondary: '#2d004d',
      backgroundTertiary: '#3d0066',
      primary: '#9d4edd',
      secondary: '#c77dff',
      text: '#ffffff',
      textSecondary: '#e0aaff',
      border: '#5a189a',
      overlay: 'rgba(26, 0, 51, 0.95)',
      buttonText: '#1a0033',
      buttonBackground: '#9d4edd',
      wireColors: WIRE_COLORS_PURPLE,
      cellEmpty: '#2d004d',
      cellBorder: '#3d0066',
    },
    effects: {
      glow: true,
      glowIntensity: 8,
      glowColor: '#9d4edd',
      shadow: true,
      shadowIntensity: 0.5,
      gradient: true,
      particleEffect: 'sparkle',
    },
  },

  // 8. CHERRY BLOSSOM
  cherry: {
    id: 'cherry',
    name: 'Cherry Blossom',
    nameKey: 'themes.cherry.name',
    icon: '🌸',
    description: 'Soft pink cherry blossom theme',
    descriptionKey: 'themes.cherry.description',
    unlockLevel: 75,
    price: 0,
    requirementType: 'level',
    colors: {
      background: '#fff5f7',
      backgroundSecondary: '#ffe4e9',
      backgroundTertiary: '#ffd4dc',
      primary: '#ff69b4',
      secondary: '#ffb3d9',
      text: '#4a0e2a',
      textSecondary: '#8b4566',
      border: '#ffc0d4',
      overlay: 'rgba(255, 245, 247, 0.95)',
      buttonText: '#ffffff',
      buttonBackground: '#ff69b4',
      wireColors: WIRE_COLORS_CHERRY,
      cellEmpty: '#ffe4e9',
      cellBorder: '#ffd4dc',
    },
    effects: {
      glow: false,
      shadow: true,
      shadowIntensity: 0.2,
      gradient: false,
      particleEffect: 'none',
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
