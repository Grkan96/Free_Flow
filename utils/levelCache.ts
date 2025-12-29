// Wire Master - Level Cache System

import { LevelData, Difficulty } from '../types';
import { generateLevel } from './levelGenerator';
import { GENERATOR_CONFIGS, LEVEL_CACHE_SIZE, getDifficultyForLevel, getGeneratorConfig } from '../constants';

/**
 * Level Cache Class
 * Caches generated levels to prevent excessive regeneration
 */
class LevelCache {
  private cache: Map<Difficulty, LevelData[]> = new Map();
  private levelMap: Map<string, LevelData> = new Map(); // Key: "difficulty-levelNumber"
  private isWarmedUp: boolean = false;

  /**
   * Warmup: Pre-generate levels for all difficulties
   * DISABLED for performance - using on-demand generation only
   */
  async warmup(): Promise<void> {
    if (this.isWarmedUp) return;

    console.log('🔥 Level cache warmup skipped - using on-demand generation');

    // Mark as warmed up immediately (no actual warmup needed)
    this.isWarmedUp = true;
    console.log('✅ Level cache ready!');
  }

  /**
   * Get a level for specified difficulty
   * Uses seeded random generation for consistent but varied levels
   * Implements simple memoization to prevent excessive regeneration
   * PERFORMANCE: Pre-generates next levels in background
   */
  async getLevel(difficulty: Difficulty, levelNumber: number = 1): Promise<LevelData> {
    // CACHE VERSION: Increment this to invalidate old cache when generation logic changes
    const CACHE_VERSION = 'v43'; // v43: Vertical rectangular grids (10 rows × 7/8 cols)
    const cacheKey = `${CACHE_VERSION}-${difficulty}-${levelNumber}`;

    // Check if level is already cached
    if (this.levelMap.has(cacheKey)) {
      // Pre-generate next 2 levels in background (non-blocking)
      this.preGenerateNextLevels(levelNumber);
      return this.levelMap.get(cacheKey)!;
    }

    // CRITICAL: Use dynamic config based on level number
    // This ensures grid size and wire count scale properly
    const config = getGeneratorConfig(levelNumber);

    // Generate level with seeded random for this specific level number
    // Same level number always generates same puzzle (consistency)
    // Different level numbers generate different puzzles (variety)
    const level = generateLevel(config, levelNumber);

    // Cache the generated level
    this.levelMap.set(cacheKey, level);

    // Limit cache size to prevent memory issues (keep last 50 levels)
    if (this.levelMap.size > 50) {
      const firstKey = this.levelMap.keys().next().value;
      if (firstKey) {
        this.levelMap.delete(firstKey);
      }
    }

    // Pre-generate next 2 levels in background (non-blocking)
    this.preGenerateNextLevels(levelNumber);

    return level;
  }

  /**
   * Pre-generate next levels in background to improve performance
   * Non-blocking - runs asynchronously without waiting
   */
  private preGenerateNextLevels(currentLevel: number): void {
    // Don't await - run in background
    setTimeout(() => {
      const CACHE_VERSION = 'v43'; // Must match getLevel version
      for (let i = 1; i <= 2; i++) {
        const nextLevel = currentLevel + i;
        if (nextLevel <= 300) {
          const nextDifficulty = getDifficultyForLevel(nextLevel);
          const cacheKey = `${CACHE_VERSION}-${nextDifficulty}-${nextLevel}`;

          // Only generate if not already cached
          if (!this.levelMap.has(cacheKey)) {
            // CRITICAL: Use dynamic config for proper grid size
            const config = getGeneratorConfig(nextLevel);
            const level = generateLevel(config, nextLevel);
            this.levelMap.set(cacheKey, level);
          }
        }
      }
    }, 100); // Small delay to not block current operation
  }


  /**
   * Clear cache (for testing)
   */
  clear(): void {
    this.cache.clear();
    this.levelMap.clear();
    this.isWarmedUp = false;
  }

  /**
   * Get cache stats (for debugging)
   */
  getStats(): Record<Difficulty, number> {
    return {
      easy: this.cache.get('easy')?.length || 0,
      medium: this.cache.get('medium')?.length || 0,
      hard: this.cache.get('hard')?.length || 0,
      expert: this.cache.get('expert')?.length || 0,
    };
  }
}

// Export singleton instance
export const levelCache = new LevelCache();
