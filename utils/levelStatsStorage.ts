// Wire Master - Level Stats Storage
// AsyncStorage wrapper for persisting level statistics

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LevelStats } from '../types';

const STORAGE_KEY_PREFIX = '@wire_master_level_stats_';
const STORAGE_KEY_ALL = '@wire_master_all_level_stats';
const STATS_VERSION = '1.0.0';

/**
 * Create default level stats
 */
const createDefaultLevelStats = (levelNumber: number): LevelStats => ({
  levelNumber,
  attempts: 0,
  completions: 0,
  bestTime: null,
  bestMoves: null,
  bestStars: 0,
  lastPlayedAt: null,
  firstCompletedAt: null,
});

/**
 * Load stats for a specific level
 */
export async function loadLevelStats(
  levelNumber: number
): Promise<LevelStats> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${levelNumber}`;
    const data = await AsyncStorage.getItem(key);

    if (data === null) {
      return createDefaultLevelStats(levelNumber);
    }

    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {
    console.error(`Failed to load level ${levelNumber} stats:`, error);
    return createDefaultLevelStats(levelNumber);
  }
}

/**
 * Save stats for a specific level
 */
export async function saveLevelStats(
  levelNumber: number,
  stats: LevelStats
): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${levelNumber}`;
    const data = JSON.stringify(stats);
    await AsyncStorage.setItem(key, data);

    // Update the all stats index
    await updateAllStatsIndex(levelNumber);
  } catch (error) {
    console.error(`Failed to save level ${levelNumber} stats:`, error);
    throw error;
  }
}

/**
 * Update level stats (partial update)
 */
export async function updateLevelStats(
  levelNumber: number,
  updates: Partial<LevelStats>
): Promise<void> {
  try {
    const current = await loadLevelStats(levelNumber);
    const updated: LevelStats = {
      ...current,
      ...updates,
      levelNumber, // Ensure level number doesn't change
    };
    await saveLevelStats(levelNumber, updated);
  } catch (error) {
    console.error(`Failed to update level ${levelNumber} stats:`, error);
    throw error;
  }
}

/**
 * Load all level stats as a Map
 */
export async function loadAllLevelStats(): Promise<Map<number, LevelStats>> {
  try {
    const indexData = await AsyncStorage.getItem(STORAGE_KEY_ALL);

    if (indexData === null) {
      return new Map();
    }

    const levelNumbers: number[] = JSON.parse(indexData);
    const statsMap = new Map<number, LevelStats>();

    // Load stats for each level in parallel
    const promises = levelNumbers.map(async (levelNum) => {
      const stats = await loadLevelStats(levelNum);
      return [levelNum, stats] as [number, LevelStats];
    });

    const results = await Promise.all(promises);
    results.forEach(([levelNum, stats]) => {
      statsMap.set(levelNum, stats);
    });

    return statsMap;
  } catch (error) {
    console.error('Failed to load all level stats:', error);
    return new Map();
  }
}

/**
 * Update the index of all level stats
 * This keeps track of which levels have stats saved
 */
async function updateAllStatsIndex(levelNumber: number): Promise<void> {
  try {
    const indexData = await AsyncStorage.getItem(STORAGE_KEY_ALL);
    let levelNumbers: number[] = [];

    if (indexData) {
      levelNumbers = JSON.parse(indexData);
    }

    if (!levelNumbers.includes(levelNumber)) {
      levelNumbers.push(levelNumber);
      levelNumbers.sort((a, b) => a - b);
      await AsyncStorage.setItem(
        STORAGE_KEY_ALL,
        JSON.stringify(levelNumbers)
      );
    }
  } catch (error) {
    console.error('Failed to update all stats index:', error);
  }
}

/**
 * Clear stats for a specific level
 */
export async function clearLevelStats(levelNumber: number): Promise<void> {
  try {
    const key = `${STORAGE_KEY_PREFIX}${levelNumber}`;
    await AsyncStorage.removeItem(key);

    // Update index
    const indexData = await AsyncStorage.getItem(STORAGE_KEY_ALL);
    if (indexData) {
      let levelNumbers: number[] = JSON.parse(indexData);
      levelNumbers = levelNumbers.filter((num) => num !== levelNumber);
      await AsyncStorage.setItem(
        STORAGE_KEY_ALL,
        JSON.stringify(levelNumbers)
      );
    }
  } catch (error) {
    console.error(`Failed to clear level ${levelNumber} stats:`, error);
    throw error;
  }
}

/**
 * Clear all level stats
 */
export async function clearAllLevelStats(): Promise<void> {
  try {
    const indexData = await AsyncStorage.getItem(STORAGE_KEY_ALL);
    if (indexData) {
      const levelNumbers: number[] = JSON.parse(indexData);
      const keys = levelNumbers.map((num) => `${STORAGE_KEY_PREFIX}${num}`);
      await AsyncStorage.multiRemove([...keys, STORAGE_KEY_ALL]);
    }
  } catch (error) {
    console.error('Failed to clear all level stats:', error);
    throw error;
  }
}
