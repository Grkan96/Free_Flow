// Wire Master - Settings Storage
// AsyncStorage wrapper for persisting user preferences

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEY = '@wire_master_settings';
const SETTINGS_VERSION = '1.0.0';

/**
 * Load settings from AsyncStorage
 * Returns DEFAULT_SETTINGS if no saved settings or on error
 */
export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);

    if (data === null) {
      // First time user - return defaults
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(data);

    // Validate settings structure
    if (
      typeof parsed.hapticFeedback !== 'boolean' ||
      typeof parsed.soundEffects !== 'boolean' ||
      typeof parsed.autoAdvance !== 'boolean'
    ) {
      console.warn('Invalid settings structure, using defaults');
      return DEFAULT_SETTINGS;
    }

    // Migration: Add theme if missing
    if (!parsed.theme || (parsed.theme !== 'dark' && parsed.theme !== 'light')) {
      parsed.theme = 'dark';
    }

    // Migration: Add language if missing
    if (!parsed.language || (parsed.language !== 'en' && parsed.language !== 'tr')) {
      parsed.language = 'tr';
    }

    // Check version and migrate if needed
    if (parsed.version !== SETTINGS_VERSION) {
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        version: SETTINGS_VERSION,
      };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to AsyncStorage
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    // Validate before saving
    if (
      typeof settings.hapticFeedback !== 'boolean' ||
      typeof settings.soundEffects !== 'boolean' ||
      typeof settings.autoAdvance !== 'boolean' ||
      (settings.theme !== 'dark' && settings.theme !== 'light') ||
      (settings.language !== 'en' && settings.language !== 'tr')
    ) {
      throw new Error('Invalid settings structure');
    }

    const data = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Update a single setting value
 * Loads current settings, updates the key, and saves back
 */
export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): Promise<void> {
  try {
    const current = await loadSettings();
    const updated = { ...current, [key]: value };
    await saveSettings(updated);
  } catch (error) {
    console.error(`Failed to update setting ${String(key)}:`, error);
    throw error;
  }
}

/**
 * Clear all settings (reset to defaults)
 */
export async function clearSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear settings:', error);
    throw error;
  }
}
