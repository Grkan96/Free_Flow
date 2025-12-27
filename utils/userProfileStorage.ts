// Wire Master - User Profile Storage
// AsyncStorage wrapper for persisting user profile

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';
import { generateUUID, getTodayString } from './formatters';

const STORAGE_KEY = '@wire_master_user_profile';
const PROFILE_VERSION = '1.0.0';

/**
 * Load user profile from AsyncStorage
 * Returns null if no profile exists
 */
export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data === null) {
      return null;
    }

    const parsed = JSON.parse(data);

    // Validate profile structure
    if (
      typeof parsed.userId !== 'string' ||
      typeof parsed.username !== 'string' ||
      typeof parsed.avatarId !== 'number' ||
      typeof parsed.createdAt !== 'number' ||
      typeof parsed.lastPlayedAt !== 'number' ||
      typeof parsed.currentLevel !== 'number' ||
      typeof parsed.totalPlayTime !== 'number'
    ) {
      console.warn('Invalid profile structure');
      return null;
    }

    // Migration: Add coins field if missing
    if (parsed.coins === undefined) {
      parsed.coins = 0;
    }

    // Migration: Add unlockedClasses if missing
    if (!parsed.unlockedClasses || !Array.isArray(parsed.unlockedClasses)) {
      parsed.unlockedClasses = ['basic']; // Default: basic unlocked
    }

    // Version migration
    if (parsed.version !== PROFILE_VERSION) {
      return {
        ...parsed,
        version: PROFILE_VERSION,
      };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
}

/**
 * Save user profile to AsyncStorage
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    // Validate profile
    if (
      !profile.userId ||
      !profile.username ||
      profile.username.length < 3 ||
      profile.username.length > 20
    ) {
      throw new Error('Invalid profile structure');
    }

    const data = JSON.stringify(profile);
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save user profile:', error);
    throw error;
  }
}

/**
 * Create a new user profile
 */
export async function createNewProfile(
  username: string,
  avatarId: number
): Promise<UserProfile> {
  if (username.length < 3 || username.length > 20) {
    throw new Error('Username must be between 3 and 20 characters');
  }

  if (avatarId < 0 || avatarId > 9) {
    throw new Error('Avatar ID must be between 0 and 9');
  }

  const now = Date.now();
  const profile: UserProfile = {
    userId: generateUUID(),
    username: username.trim(),
    avatarId,
    createdAt: now,
    lastPlayedAt: now,
    currentLevel: 1,
    currentClass: 'basic',
    currentChapter: 1,
    totalPlayTime: 0,
    coins: 0, // Başlangıç coin
    unlockedClasses: ['basic'], // Basic başlangıçta açık
    version: PROFILE_VERSION,
  };

  await saveUserProfile(profile);
  return profile;
}

/**
 * Add coins to user profile
 */
export async function addCoins(amount: number): Promise<void> {
  if (amount <= 0) {
    throw new Error('Coin amount must be positive');
  }

  const profile = await loadUserProfile();
  if (!profile) {
    throw new Error('No profile found');
  }

  await updateProfile({
    coins: profile.coins + amount,
  });
}

/**
 * Spend coins from user profile
 */
export async function spendCoins(amount: number): Promise<boolean> {
  if (amount <= 0) {
    throw new Error('Coin amount must be positive');
  }

  const profile = await loadUserProfile();
  if (!profile) {
    throw new Error('No profile found');
  }

  if (profile.coins < amount) {
    return false; // Not enough coins
  }

  await updateProfile({
    coins: profile.coins - amount,
  });

  return true; // Successfully spent
}

/**
 * Unlock a class (no coin cost - only requires perfect completion of previous class)
 */
export async function unlockClass(classId: string): Promise<{ success: boolean; message: string }> {
  const profile = await loadUserProfile();
  if (!profile) {
    return { success: false, message: 'No profile found' };
  }

  // Check if already unlocked
  if (profile.unlockedClasses.includes(classId as any)) {
    return { success: false, message: 'Class already unlocked' };
  }

  // Get class info
  const { CLASSES } = await import('../constants');
  const classInfo = CLASSES[classId as keyof typeof CLASSES];
  if (!classInfo) {
    return { success: false, message: 'Invalid class' };
  }

  // Unlock class (no coin deduction)
  await updateProfile({
    unlockedClasses: [...profile.unlockedClasses, classId as any],
  });

  return { success: true, message: `${classInfo.name} class unlocked!` };
}

/**
 * Check if all chapters in a class have 5 stars (perfect completion)
 */
export async function hasClassPerfectCompletion(classId: string): Promise<boolean> {
  try {
    const { CLASSES } = await import('../constants');
    const { loadLevelStats } = await import('./levelStatsStorage');

    const classInfo = CLASSES[classId as keyof typeof CLASSES];
    if (!classInfo) {
      return false;
    }

    // Check each level in the class
    for (let level = classInfo.chapterRange.start; level <= classInfo.chapterRange.end; level++) {
      const stats = await loadLevelStats(level);

      // If level hasn't been completed with 5 stars, return false
      if (!stats || stats.bestStars < 5) {
        return false;
      }
    }

    // All levels have 5 stars
    return true;
  } catch (error) {
    console.error('Failed to check class perfect completion:', error);
    return false;
  }
}

/**
 * Update user profile (partial update)
 */
export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const current = await loadUserProfile();
    if (!current) {
      throw new Error('No profile exists to update');
    }

    const updated: UserProfile = {
      ...current,
      ...updates,
      version: PROFILE_VERSION,
    };

    await saveUserProfile(updated);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
}

/**
 * Delete user profile
 */
export async function deleteProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to delete profile:', error);
    throw error;
  }
}

/**
 * Check if a profile exists
 */
export async function hasProfile(): Promise<boolean> {
  const profile = await loadUserProfile();
  return profile !== null;
}
