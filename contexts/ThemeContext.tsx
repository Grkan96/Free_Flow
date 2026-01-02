// Theme Context - Enhanced Theme System with Multiple Themes

import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';
import { THEMES, Theme, getThemeById } from '../constants/themes';

interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary?: string;

  // UI colors
  primary: string;
  secondary?: string;
  border: string;
  shadow?: string;
  overlay: string;

  // Game colors
  gridBackground?: string;
  cellEmpty: string;
  cellEndpoint?: string;
  cellPath?: string;
  cellBorder?: string;

  // Button colors
  buttonBackground: string;
  buttonText: string;
  buttonDisabled?: string;

  // Wire colors
  wireColors?: string[];
}

// Convert new theme format to context format
const convertThemeColors = (theme: Theme): ThemeColors => {
  return {
    ...theme.colors,
    textTertiary: theme.colors.textSecondary,
    gridBackground: theme.colors.background,
    cellEndpoint: theme.colors.primary,
    cellPath: theme.colors.primary,
    shadow: 'rgba(0, 0, 0, 0.5)',
    buttonDisabled: theme.colors.backgroundTertiary,
  };
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  currentTheme: Theme;
  themeId: string;
}

const defaultTheme = THEMES.classic;

const ThemeContext = createContext<ThemeContextType>({
  colors: convertThemeColors(defaultTheme),
  isDark: true,
  currentTheme: defaultTheme,
  themeId: 'classic',
});

interface ThemeProviderProps {
  children: ReactNode;
  settings: AppSettings;
  themeId?: string; // Optional theme ID override
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  settings,
  themeId
}) => {
  // Use themeId if provided, otherwise fall back to settings.theme
  let activeThemeId = themeId || 'classic';

  // Map old dark/light to new theme IDs
  if (!themeId) {
    if (settings.theme === 'light') {
      activeThemeId = 'light';
    } else {
      activeThemeId = 'classic';
    }
  }

  const currentTheme = getThemeById(activeThemeId);
  const colors = convertThemeColors(currentTheme);
  const isDark = activeThemeId !== 'light';

  return (
    <ThemeContext.Provider value={{ colors, isDark, currentTheme, themeId: activeThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
