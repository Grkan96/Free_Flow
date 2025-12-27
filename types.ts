// Wire Master - Type Definitions

// Grid shape types
export type GridShape = 'square' | 'hexagon';

// Cell states
export enum CellState {
  EMPTY = 'empty',
  ENDPOINT = 'endpoint',
  PATH = 'path',
  OBSTACLE = 'obstacle'
}

// Wire colors (20 distinct colors for electronic circuits)
export type WireColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'lime'
  | 'brown'
  | 'magenta'
  | 'teal'
  | 'indigo'
  | 'violet'
  | 'coral'
  | 'turquoise'
  | 'gold'
  | 'crimson'
  | 'navy'
  | 'salmon';

// Cell data structure
export interface CellData {
  row: number;
  col: number;
  state: CellState;
  color: WireColor | null;
  wireId: string | null; // Which wire this cell belongs to
  isPort: boolean; // Endpoint/connector
  isObstacle?: boolean; // Obstacle cell (cannot pass through)
  connectedTo?: { row: number; col: number }; // For path tracking
  allowedWireIds?: string[]; // Which wires are allowed to pass through this cell (for 100% fill enforcement)
}

export type Grid = (CellData | null)[][];

// Coordinate interface
export interface Coordinate {
  row: number;
  col: number;
}

// Wire (pair of ports with path)
export interface Wire {
  id: string;
  color: WireColor;
  start: Coordinate;
  end: Coordinate;
  path: Coordinate[]; // Complete path from start to end
  isComplete: boolean;
  requiredPathLength?: number; // Required path length for 100% fill (from Hamiltonian solution)
}

// Game status
export type GameStatus = 'menu' | 'playing' | 'won' | 'generating';

// Game state
export interface GameState {
  level: number;
  grid: Grid;
  gridSize: number;
  gridShape: GridShape; // NEW: Shape of the grid
  wires: Wire[];
  status: GameStatus;
  moves: number;
  gridFilled: number; // 0-100 (percentage of grid filled)
  isPerfect: boolean; // Achieved perfect solution (minimum moves)
  hintsUsed: number;
  bestMoves?: number; // Best score for this level
  stars?: number; // 1-5 stars based on performance
  solution?: Coordinate[][]; // Solution paths for hints (100% fill guarantee)
  // Timer fields
  levelStartTime?: number; // Level başlangıç zamanı (timestamp)
  levelPausedAt?: number; // Pause zamanı (timestamp)
  elapsedTime: number; // Geçen süre (ms)
  isPaused: boolean; // Pause durumu
}

// Level configuration
export interface LevelConfig {
  size: number;
  wireCount: number;
  gridShape: GridShape; // NEW: Grid shape
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  optimalMoves: number; // Minimum moves needed for perfect bonus
}

// Level data for generated levels
export interface LevelData {
  id: number;
  config: LevelConfig;
  wires: {
    color: WireColor;
    start: Coordinate;
    end: Coordinate;
  }[];
  obstacles?: Coordinate[]; // Optional: Obstacle positions (level 15+)
  solution?: Coordinate[][]; // Optional: Pre-computed solution for hints
}

// Generator configuration
export interface GeneratorConfig {
  gridSize: number;
  wireCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  minPathLength?: number;
  regionSeparation?: number;
  pathCurviness?: number;
}

// Difficulty type
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// App Settings
export interface AppSettings {
  hapticFeedback: boolean;
  soundEffects: boolean;
  autoAdvance: boolean;
  theme: 'dark' | 'light';
  language: 'en' | 'tr';
  version: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  hapticFeedback: true,
  soundEffects: true,
  autoAdvance: true,
  theme: 'dark',
  language: 'tr',
  version: '1.0.0'
};

// Class (Difficulty Level)
export type DifficultyClass = 'basic' | 'medium' | 'hard';

export interface ClassInfo {
  id: DifficultyClass;
  name: string;
  description: string;
  color: string;
  icon: string;
  chapterRange: { start: number; end: number };
  totalChapters: number;
  unlockCost: number; // Coin cost to unlock (0 = free)
}

// User Profile
export interface UserProfile {
  userId: string; // UUID
  username: string; // 3-20 karakter
  avatarId: number; // 0-9 (10 avatar seçeneği)
  createdAt: number; // Timestamp
  lastPlayedAt: number; // Timestamp
  currentLevel: number; // En son oynanan level (1-300)
  currentClass: DifficultyClass; // En son oynanan class
  currentChapter: number; // En son oynanan chapter (class içinde 1-100)
  totalPlayTime: number; // Toplam oyun süresi (ms)
  coins: number; // Coin bakiyesi
  unlockedClasses: DifficultyClass[]; // Açılmış classlar
  version: string; // '1.0.0'
}

// Level İstatistikleri
export interface LevelStats {
  levelNumber: number;
  attempts: number; // Deneme sayısı
  completions: number; // Tamamlama sayısı
  bestTime: number | null; // En iyi süre (ms)
  bestMoves: number | null; // En az hamle
  bestStars: number; // En yüksek yıldız (1-5)
  lastPlayedAt: number | null; // Son oynanma
  firstCompletedAt: number | null; // İlk tamamlama
}

// Global İstatistikler
export interface GlobalStats {
  totalLevelsCompleted: number;
  totalLevelsAttempted: number;
  totalPlayTime: number; // ms
  totalMoves: number;
  totalHintsUsed: number;
  totalStars: number;
  perfectLevels: number; // 5 yıldız sayısı
  currentStreak: number; // Ardışık gün
  longestStreak: number;
  lastPlayDate: string; // YYYY-MM-DD
  version: string;
}
