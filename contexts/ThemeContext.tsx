// Theme Context - Light/Dark Mode Support

import React, { createContext, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';

interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // UI colors
  primary: string;
  border: string;
  shadow: string;
  overlay: string;

  // Game colors
  gridBackground: string;
  cellEmpty: string;
  cellEndpoint: string;
  cellPath: string;

  // Button colors
  buttonBackground: string;
  buttonText: string;
  buttonDisabled: string;
}

const darkTheme: ThemeColors = {
  background: '#0a0a0a',
  backgroundSecondary: '#1a1a1a',
  backgroundTertiary: '#2a2a2a',

  text: '#ffffff',
  textSecondary: '#808080',
  textTertiary: '#6b7280',

  primary: '#10b981',
  border: '#2a2a2a',
  shadow: 'rgba(0, 0, 0, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.92)',

  gridBackground: '#1a1a1a',
  cellEmpty: '#2a2a2a',
  cellEndpoint: '#10b981',
  cellPath: '#00ff41',

  buttonBackground: '#0a0a0a',
  buttonText: '#ffffff',
  buttonDisabled: '#3a3a3a',
};

const lightTheme: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f5f5f5',
  backgroundTertiary: '#e5e5e5',

  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',

  primary: '#10b981',
  border: '#d1d5db',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',

  gridBackground: '#f5f5f5',
  cellEmpty: '#e5e5e5',
  cellEndpoint: '#10b981',
  cellPath: '#00cc33',

  buttonBackground: '#ffffff',
  buttonText: '#000000',
  buttonDisabled: '#d1d5db',
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: darkTheme,
  isDark: true,
});

interface ThemeProviderProps {
  children: ReactNode;
  settings: AppSettings;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, settings }) => {
  const isDark = settings.theme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
