// Wire Master - Constants

import { WireColor, Difficulty, GeneratorConfig, DifficultyClass, ClassInfo } from './types';
import { Dimensions } from 'react-native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Responsive cell size calculation
export const calculateCellSize = (gridSize: number): number => {
  const availableWidth = SCREEN_WIDTH - 64; // 32px padding on each side
  const availableHeight = SCREEN_HEIGHT * 0.55; // Use 55% of screen for grid
  const size = Math.min(availableWidth, availableHeight) / gridSize;
  return Math.floor(size - 2); // 1px gap between cells
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

  // Calculate progression within difficulty tier
  // Each class gets progressively harder as you advance through chapters
  const { class: classId, chapter } = levelToClassChapter(level);
  const classInfo = CLASSES[classId];
  const progressInClass = chapter / classInfo.totalChapters; // 0.0 to 1.0

  // ============================================
  // GRID SIZE PROGRESSION - FAST START, LONGER ENDGAME
  // ============================================
  // Small grids (2x2-5x5): Short progression (5-10 levels each)
  // Medium grids (6x6-8x8): Medium progression (20-30 levels each)
  // Large grids (9x9-12x12): Long progression (30-40 levels each)
  //
  // Level 1-5:     2x2  (5 levels)   - Tutorial
  // Level 6-15:    3x3  (10 levels)  - Easy
  // Level 16-25:   4x4  (10 levels)  - Learning
  // Level 26-40:   5x5  (15 levels)  - Getting comfortable
  // Level 41-70:   6x6  (30 levels)  - Medium challenge
  // Level 71-100:  7x7  (30 levels)  - Getting harder
  // Level 101-130: 8x8  (30 levels)  - Hard
  // Level 131-165: 9x9  (35 levels)  - Very hard
  // Level 166-205: 10x10 (40 levels) - Expert
  // Level 206-250: 11x11 (45 levels) - Master
  // Level 251-300: 12x12 (50 levels) - Legendary

  let gridSize: number;
  if (level <= 5) gridSize = 2;
  else if (level <= 15) gridSize = 3;
  else if (level <= 25) gridSize = 4;
  else if (level <= 40) gridSize = 5;
  else if (level <= 70) gridSize = 6;
  else if (level <= 100) gridSize = 7;
  else if (level <= 130) gridSize = 8;
  else if (level <= 165) gridSize = 9;
  else if (level <= 205) gridSize = 10;
  else if (level <= 250) gridSize = 11;
  else gridSize = 12;

  // ============================================
  // WIRE COUNT PROGRESSION
  // ============================================
  // Wire count scales with grid size and level
  // Starts very simple, ends very complex

  // Calculate level progress (0.0 to 1.0)
  const levelProgress = (level - 1) / 299;

  // CRITICAL: Wire count scales directly with grid size
  // Larger grids = more wires for proportional difficulty
  let wireCount: number;

  // Base formula: gridSize * progression factor
  // This ensures wire count grows with both grid size and level
  const baseWires = Math.floor(gridSize * 0.4); // 40% of grid size as base
  const progressionBonus = Math.floor(gridSize * levelProgress * 0.6); // Up to 60% more based on level

  wireCount = baseWires + progressionBonus;

  // Grid-specific adjustments
  if (gridSize === 2) {
    wireCount = 1; // 2x2: Always 1 wire (simplest)
  } else if (gridSize === 3) {
    wireCount = 1 + Math.floor(levelProgress * 1); // 3x3: 1-2 wires
  } else if (gridSize === 4) {
    wireCount = 2 + Math.floor(levelProgress * 2); // 4x4: 2-4 wires
  } else if (gridSize === 5) {
    wireCount = 2 + Math.floor(levelProgress * 3); // 5x5: 2-5 wires
  } else if (gridSize === 6) {
    wireCount = 3 + Math.floor(levelProgress * 4); // 6x6: 3-7 wires
  } else if (gridSize === 7) {
    wireCount = 4 + Math.floor(levelProgress * 5); // 7x7: 4-9 wires
  } else if (gridSize === 8) {
    wireCount = 5 + Math.floor(levelProgress * 7); // 8x8: 5-12 wires
  } else if (gridSize === 9) {
    wireCount = 6 + Math.floor(levelProgress * 9); // 9x9: 6-15 wires
  } else if (gridSize === 10) {
    wireCount = 8 + Math.floor(levelProgress * 12); // 10x10: 8-20 wires
  } else if (gridSize === 11) {
    wireCount = 10 + Math.floor(levelProgress * 15); // 11x11: 10-25 wires
  } else {
    wireCount = 12 + Math.floor(levelProgress * 18); // 12x12: 12-30 wires
  }

  // SAFETY: Ensure minimum wire count (at least 1)
  const minWiresForGrid = Math.max(1, Math.floor(gridSize * 0.3));
  wireCount = Math.max(wireCount, minWiresForGrid);

  // CRITICAL: Cap wire count to prevent deadlocks and confusion
  // REDUCED: gridSize² / 10 (very conservative to avoid player confusion)
  // Too many wires = player gets confused and creates deadlocks
  // Fewer wires = easier to visualize and solve
  const maxWiresForGrid = Math.max(2, Math.floor((gridSize * gridSize) / 10));
  wireCount = Math.min(wireCount, maxWiresForGrid);

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
