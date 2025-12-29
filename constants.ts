// Wire Master - Constants

import { WireColor, Difficulty, GeneratorConfig, DifficultyClass, ClassInfo } from './types';
import { Dimensions } from 'react-native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Responsive cell size calculation with optimization for large grids
export const calculateCellSize = (gridSize: number): number => {
  // Padding configuration based on grid size
  let padding: number;

  if (gridSize >= 8) {
    // Very large grids: minimal padding
    padding = 40; // 20px on each side
  } else if (gridSize >= 6) {
    // Medium-large grids: balanced padding
    padding = 48; // 24px on each side
  } else {
    // Small grids: normal padding
    padding = 64; // 32px on each side
  }

  const availableWidth = SCREEN_WIDTH - padding;

  // Calculate cell size based on grid width
  // All cells are perfect squares
  const cellSize = availableWidth / gridSize;

  // Gap between cells (smaller for larger grids)
  const gap = gridSize >= 8 ? 0.5 : (gridSize >= 6 ? 1 : 1.5);

  // Return cell size minus gap (cell size is ALWAYS square)
  return Math.floor(cellSize - gap);
};

// Animation durations
export const ANIMATION_DURATION_MS = 200;
export const PATH_DRAW_DURATION = 150;
export const COMPLETION_PULSE_DURATION = 300;

// Wire colors with neon/tech hex values (20 easily distinguishable colors)
export const WIRE_COLORS: Record<WireColor, string> = {
  red: '#ff1744',       // Neon red
  blue: '#00e5ff',      // Neon cyan-blue
  green: '#00ff41',     // Matrix green
  yellow: '#ffea00',    // Bright yellow
  orange: '#ff6d00',    // Neon orange
  purple: '#d500f9',    // Neon purple
  pink: '#ff1493',      // Hot pink
  cyan: '#00ffff',      // Pure cyan
  lime: '#c6ff00',      // Neon lime
  brown: '#8b4513',     // SaddleBrown (for variety)
  magenta: '#ff00ff',   // Neon magenta
  teal: '#00cec9',      // Bright teal
  indigo: '#3d5afe',    // Bright indigo
  violet: '#9c27b0',    // Deep violet
  coral: '#ff6f61',     // Bright coral
  turquoise: '#1de9b6', // Neon turquoise
  gold: '#ffd700',      // Bright gold
  crimson: '#dc143c',   // Deep crimson
  navy: '#4169e1',      // Royal blue (bright navy)
  salmon: '#ff9e80',    // Bright salmon
};

// Grid sizes by difficulty
export const GRID_SIZES = {
  easy: 5,
  medium: 6,
  hard: 7,
  expert: 8,
};

// ============================================
// LEVEL GENERATOR CONFIGURATION
// ============================================

// ============================================
// CLASS & CHAPTER SYSTEM
// ============================================

// Total levels: 300 (3 classes × 100 chapters each)
export const TOTAL_LEVELS = 300;
export const CHAPTERS_PER_CLASS = 100;

// Class unlock costs (in coins)
export const CLASS_UNLOCK_COSTS = {
  basic: 0,    // Free (başlangıç)
  medium: 0,   // Free - only requires perfect completion of Basic
  hard: 0,     // Free - only requires perfect completion of Medium
};

// Class definitions
export const CLASSES: Record<DifficultyClass, ClassInfo> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    description: 'Learn the fundamentals',
    color: '#00ff41', // Matrix green
    icon: '🌱',
    chapterRange: { start: 1, end: 100 },
    totalChapters: 100,
    unlockCost: CLASS_UNLOCK_COSTS.basic,
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Challenge your skills',
    color: '#ffea00', // Bright yellow
    icon: '⚡',
    chapterRange: { start: 101, end: 200 },
    totalChapters: 100,
    unlockCost: CLASS_UNLOCK_COSTS.medium,
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    description: 'Master the grid',
    color: '#ff1744', // Neon red
    icon: '🔥',
    chapterRange: { start: 201, end: 300 },
    totalChapters: 100,
    unlockCost: CLASS_UNLOCK_COSTS.hard,
  },
};

// Helper: Convert level number to class and chapter
export const levelToClassChapter = (level: number): { class: DifficultyClass; chapter: number } => {
  if (level <= 100) return { class: 'basic', chapter: level };
  if (level <= 200) return { class: 'medium', chapter: level - 100 };
  return { class: 'hard', chapter: level - 200 };
};

// Helper: Convert class and chapter to level number
export const classChapterToLevel = (classId: DifficultyClass, chapter: number): number => {
  const classInfo = CLASSES[classId];
  return classInfo.chapterRange.start + chapter - 1;
};

// Difficulty progression (which difficulty for each level)
export const getDifficultyForLevel = (level: number): Difficulty => {
  // Basic class (1-100): easy to medium progression
  if (level <= 100) {
    if (level <= 30) return 'easy';
    if (level <= 70) return 'medium';
    return 'hard'; // 71-100
  }
  // Medium class (101-200): medium to hard progression
  if (level <= 200) {
    if (level <= 150) return 'medium';
    return 'hard'; // 151-200
  }
  // Hard class (201-300): hard to expert progression
  if (level <= 250) return 'hard';
  return 'expert'; // 251-300
};

// Generator configurations by difficulty (base values - actual values are dynamic)
export const GENERATOR_CONFIGS: Record<Difficulty, GeneratorConfig> = {
  easy: {
    gridSize: 2,  // Dynamic: 2x2 to 5x5
    wireCount: 1,  // Dynamic: 1 to 5 wires
    difficulty: 'easy',
    minPathLength: 2,
    regionSeparation: 3,
    pathCurviness: 0.3,
  },
  medium: {
    gridSize: 5,  // Dynamic: 5x5 to 8x8
    wireCount: 3,  // Dynamic: 3 to 10 wires
    difficulty: 'medium',
    minPathLength: 4,
    regionSeparation: 2,
    pathCurviness: 0.5,
  },
  hard: {
    gridSize: 8,  // Dynamic: 8x8 to 10x10
    wireCount: 6,  // Dynamic: 6 to 15 wires
    difficulty: 'hard',
    minPathLength: 6,
    regionSeparation: 1,
    pathCurviness: 0.7,
  },
  expert: {
    gridSize: 10,  // Dynamic: 10x10 to 12x12
    wireCount: 10,  // Dynamic: 10 to 28 wires
    difficulty: 'expert',
    minPathLength: 8,
    regionSeparation: 0,
    pathCurviness: 0.9,
  },
};

// Level cache configuration
export const LEVEL_CACHE_SIZE = 5; // Pre-generate 5 levels per difficulty
export const MAX_GENERATION_RETRIES = 10;
export const GENERATION_TIMEOUT_MS = 2000;

// ============================================
// COIN SYSTEM
// ============================================

// Coin rewards based on stars (1-5 stars)
export const COIN_REWARDS: Record<number, number> = {
  1: 3,     // 1 star = 3 coins
  2: 5,     // 2 stars = 5 coins
  3: 8,     // 3 stars = 8 coins
  4: 12,    // 4 stars = 12 coins
  5: 20,    // 5 stars (perfect - 100% grid) = 20 coins
};

// Bonus coins for first completion
export const FIRST_COMPLETION_BONUS = 10;

// Helper: Calculate coin reward for level completion
export const calculateCoinReward = (stars: number, isFirstCompletion: boolean): number => {
  const baseReward = COIN_REWARDS[stars] || 3;
  const bonus = isFirstCompletion ? FIRST_COMPLETION_BONUS : 0;
  return baseReward + bonus;
};

// Helper: Get generator config for a specific level
// Progressively increases BOTH grid size and wire count as levels advance
export const getGeneratorConfig = (level: number): GeneratorConfig => {
  const difficulty = getDifficultyForLevel(level);
  const baseConfig = GENERATOR_CONFIGS[difficulty];


  // ============================================
  // GRID SIZE PROGRESSION - EXPONENTIAL GROWTH
  // ============================================
  // Grid grows based on level ranges with exponential spacing
  // All square grids from 2x2 to 9x9
  //
  // Level 1-2:     2x2    (2 levels)   - Tutorial
  // Level 3-6:     3x3    (4 levels)   - Easy
  // Level 7-14:    4x4    (8 levels)   - Learning
  // Level 15-30:   5x5    (16 levels)  - Getting comfortable
  // Level 31-62:   6x6    (32 levels)  - Medium challenge
  // Level 63-126:  7x7    (64 levels)  - Getting harder
  // Level 127-254: 8x8    (128 levels) - Hard
  // Level 255-300: 9x9    (46 levels)  - Expert

  let gridSize: number;

  if (level <= 2) {
    gridSize = 2;
  } else if (level <= 6) {
    gridSize = 3;
  } else if (level <= 14) {
    gridSize = 4;
  } else if (level <= 30) {
    gridSize = 5;
  } else if (level <= 62) {
    gridSize = 6;
  } else if (level <= 126) {
    gridSize = 7;
  } else if (level <= 254) {
    gridSize = 8;
  } else {
    gridSize = 9;
  }

  // ============================================
  // WIRE COUNT PROGRESSION - GRID-BASED FORMULA
  // ============================================
  // Wire count (port pairs) scales with grid size
  // Formula: wireCount = ceil(gridSize / 2)
  // This ensures balanced difficulty and solvable puzzles
  //
  // 2x2 grid   -> 1 wire pair (2 ports)
  // 3x3 grid   -> 2 wire pairs (4 ports)
  // 4x4 grid   -> 2 wire pairs (4 ports)
  // 5x5 grid   -> 3 wire pairs (6 ports)
  // 6x6 grid   -> 3 wire pairs (6 ports)
  // 7x7 grid   -> 4 wire pairs (8 ports)
  // 8x8 grid   -> 4 wire pairs (8 ports)
  // 9x9 grid   -> 5 wire pairs (10 ports)

  const wireCount = Math.ceil(gridSize / 2);

  return {
    ...baseConfig,
    gridSize,
    wireCount,
  };
};

// Helper: Get level info (legacy compatibility - not used with random generation)
export const getLevel = (_levelId: number) => {
  // Returns null - we generate levels dynamically now
  return null;
};

// ============================================
// AVATAR SYSTEM
// ============================================

export interface Avatar {
  id: number;
  icon: string;
  color: string;
}

export const AVATARS: Avatar[] = [
  { id: 0, icon: '🎮', color: '#ff1744' }, // Neon red
  { id: 1, icon: '🎯', color: '#00e5ff' }, // Neon cyan-blue
  { id: 2, icon: '⚡', color: '#00ff41' }, // Matrix green
  { id: 3, icon: '🌟', color: '#ffea00' }, // Bright yellow
  { id: 4, icon: '🔥', color: '#ff6d00' }, // Neon orange
  { id: 5, icon: '💎', color: '#d500f9' }, // Neon purple
  { id: 6, icon: '🚀', color: '#ff1493' }, // Hot pink
  { id: 7, icon: '🎨', color: '#00ffff' }, // Pure cyan
  { id: 8, icon: '🏆', color: '#c6ff00' }, // Neon lime
  { id: 9, icon: '👾', color: '#00cec9' }, // Bright teal
];
