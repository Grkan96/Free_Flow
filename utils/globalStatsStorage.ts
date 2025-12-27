// Wire Master - Global Stats Storage
// AsyncStorage wrapper for persisting global game statistics

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStats } from '../types';
import { getTodayString, calculateStreak } from './formatters';

const STORAGE_KEY = '@wire_master_global_stats';
const STATS_VERSION = '1.0.0';

/**
 * Create default global stats
 */
export const createDefaultGlobalStats = (): GlobalStats => ({
  totalLevelsCompleted: 0,
  totalLevelsAttempted: 0,
  totalPlayTime: 0,
  totalMoves: 0,
  totalHintsUsed: 0,
  totalStars: 0,
  perfectLevels: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: getTodayString(),
  version: STATS_VERSION,
});

/**
 * Load global stats from AsyncStorage
 */
export async function loadGlobalStats(): Promise<GlobalStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data === null) {
      return createDefaultGlobalStats();
    }

    const parsed = JSON.parse(data);

    // Validate stats structure
    if (
      typeof parsed.totalLevelsCompleted !== 'number' ||
      typeof parsed.totalLevelsAttempted !== 'number' ||
      typeof parsed.totalPlayTime !== 'number' ||
      typeof parsed.totalMoves !== 'number' ||
      typeof parsed.totalStars !== 'number'
    ) {
      console.warn('Invalid global stats structure, using defaults');
      return createDefaultGlobalStats();
    }

    // Version migration
    if (parsed.version !== STATS_VERSION) {
      return {
        ...createDefaultGlobalStats(),
        ...parsed,
        version: STATS_VERSION,
      };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load global stats:', error);
    return createDefaultGlobalStats();
  }
}

/**
 * Save global stats to AsyncStorage
 */
export async function saveGlobalStats(stats: GlobalStats): Promise<void> {
  try {
    const data = JSON.stringify(stats);
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save global stats:', error);
    throw error;
  }
}

/**
 * Increment global stats (add values to existing stats)
 */
export async function incrementStats(
  increments: Partial<GlobalStats>
): Promise<void> {
  try {
    const current = await loadGlobalStats();

    const updated: GlobalStats = {
      totalLevelsCompleted:
        current.totalLevelsCompleted + (increments.totalLevelsCompleted || 0),
      totalLevelsAttempted:
        current.totalLevelsAttempted + (increments.totalLevelsAttempted || 0),
      totalPlayTime: current.totalPlayTime + (increments.totalPlayTime || 0),
      totalMoves: current.totalMoves + (increments.totalMoves || 0),
      totalHintsUsed:
        current.totalHintsUsed + (increments.totalHintsUsed || 0),
      totalStars: current.totalStars + (increments.totalStars || 0),
      perfectLevels: current.perfectLevels + (increments.perfectLevels || 0),
      currentStreak: current.currentStreak,
      longestStreak: current.longestStreak,
      lastPlayDate: current.lastPlayDate,
      version: STATS_VERSION,
    };

    await saveGlobalStats(updated);
  } catch (error) {
    console.error('Failed to increment stats:', error);
    throw error;
  }
}

/**
 * Update daily streak
 * Call this when the user opens the app or completes a level
 */
export async function updateStreak(): Promise<void> {
  try {
    const current = await loadGlobalStats();
    const today = getTodayString();

    // Already updated today
    if (current.lastPlayDate === today) {
      return;
    }

    const newStreak = calculateStreak(current.lastPlayDate, current.currentStreak);

    const updated: GlobalStats = {
      ...current,
      currentStreak: newStreak,
      longestStreak: Math.max(current.longestStreak, newStreak),
      lastPlayDate: today,
    };

    await saveGlobalStats(updated);
  } catch (error) {
    console.error('Failed to update streak:', error);
    throw error;
  }
}

/**
 * Reset all global stats (for account deletion or reset)
 */
export async function resetStats(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset global stats:', error);
    throw error;
  }
}

/**
 * Update a partial set of global stats
 */
export async function updateGlobalStats(
  updates: Partial<GlobalStats>
): Promise<void> {
  try {
    const current = await loadGlobalStats();
    const updated: GlobalStats = {
      ...current,
      ...updates,
      version: STATS_VERSION,
    };
    await saveGlobalStats(updated);
  } catch (error) {
    console.error('Failed to update global stats:', error);
    throw error;
  }
}
