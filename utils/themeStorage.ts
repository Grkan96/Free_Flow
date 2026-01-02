// Wire Master - Theme Storage
// Manages theme preferences and purchases

import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@wire_master_theme';
const PURCHASED_THEMES_KEY = '@wire_master_purchased_themes';

export interface ThemePreferences {
  currentTheme: string;
  purchasedThemes: string[];
}

// Default theme preferences
const DEFAULT_THEME_PREFERENCES: ThemePreferences = {
  currentTheme: 'classic',
  purchasedThemes: ['classic'], // Classic is free by default
};

/**
 * Load theme preferences from storage
 */
export const loadThemePreferences = async (): Promise<ThemePreferences> => {
  try {
    const data = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (data) {
      const preferences = JSON.parse(data);
      return {
        ...DEFAULT_THEME_PREFERENCES,
        ...preferences,
      };
    }
    return DEFAULT_THEME_PREFERENCES;
  } catch (error) {
    console.error('Failed to load theme preferences:', error);
    return DEFAULT_THEME_PREFERENCES;
  }
};

/**
 * Save theme preferences to storage
 */
export const saveThemePreferences = async (
  preferences: ThemePreferences
): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save theme preferences:', error);
    throw error;
  }
};

/**
 * Set current active theme
 */
export const setCurrentTheme = async (themeId: string): Promise<void> => {
  try {
    const preferences = await loadThemePreferences();
    preferences.currentTheme = themeId;
    await saveThemePreferences(preferences);
  } catch (error) {
    console.error('Failed to set current theme:', error);
    throw error;
  }
};

/**
 * Purchase a theme (add to purchased list)
 */
export const purchaseTheme = async (themeId: string): Promise<void> => {
  try {
    const preferences = await loadThemePreferences();

    // Check if already purchased
    if (!preferences.purchasedThemes.includes(themeId)) {
      preferences.purchasedThemes.push(themeId);
      await saveThemePreferences(preferences);
    }
  } catch (error) {
    console.error('Failed to purchase theme:', error);
    throw error;
  }
};

/**
 * Check if a theme is purchased
 */
export const isThemePurchased = async (themeId: string): Promise<boolean> => {
  try {
    const preferences = await loadThemePreferences();
    return preferences.purchasedThemes.includes(themeId);
  } catch (error) {
    console.error('Failed to check theme purchase status:', error);
    return false;
  }
};

/**
 * Get list of purchased themes
 */
export const getPurchasedThemes = async (): Promise<string[]> => {
  try {
    const preferences = await loadThemePreferences();
    return preferences.purchasedThemes;
  } catch (error) {
    console.error('Failed to get purchased themes:', error);
    return ['classic'];
  }
};

/**
 * Reset theme preferences to default
 */
export const resetThemePreferences = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset theme preferences:', error);
    throw error;
  }
};
