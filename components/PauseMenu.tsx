// Wire Master - Pause Menu Component

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface PauseMenuProps {
  visible: boolean;
  level: number;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  visible,
  level,
  onResume,
  onRestart,
  onSettings,
  onMainMenu,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onResume}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.menuContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t.game.pause.toUpperCase()}</Text>
            <Text style={[styles.levelText, { color: colors.textSecondary }]}>{t.game.level} {level}</Text>
          </View>

          {/* Menu Buttons */}
          <View style={styles.menuButtons}>
            {/* Resume Button */}
            <TouchableOpacity
              style={[styles.menuButton, styles.resumeButton, { backgroundColor: colors.primary }]}
              onPress={onResume}
              activeOpacity={0.8}
            >
              <Text style={[styles.resumeIcon, { color: colors.buttonText }]}>▶</Text>
              <Text style={[styles.resumeButtonText, { color: colors.buttonText }]}>
                {t.language === 'tr' ? 'Devam Et' : 'Resume'}
              </Text>
            </TouchableOpacity>

            {/* Restart Button */}
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={onRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonIcon}>🔄</Text>
              <Text style={[styles.menuButtonText, { color: colors.text }]}>
                {t.language === 'tr' ? 'Yeniden Başlat' : 'Restart Level'}
              </Text>
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity
              style={[styles.menuButton, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={onSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonIcon}>⚙️</Text>
              <Text style={[styles.menuButtonText, { color: colors.text }]}>{t.settings.title}</Text>
            </TouchableOpacity>

            {/* Main Menu Button */}
            <TouchableOpacity
              style={[styles.menuButton, styles.mainMenuButton, { backgroundColor: colors.background }]}
              onPress={onMainMenu}
              activeOpacity={0.8}
            >
              <Text style={styles.menuButtonIcon}>🏠</Text>
              <Text style={styles.mainMenuButtonText}>
                {t.language === 'tr' ? 'Ana Menü' : 'Main Menu'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuButtons: {
    gap: 12,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  resumeButton: {
    borderWidth: 0,
  },
  resumeIcon: {
    fontSize: 18,
    fontWeight: '900',
  },
  resumeButtonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  menuButtonIcon: {
    fontSize: 20,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  mainMenuButton: {
    borderColor: '#ff1744',
  },
  mainMenuButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff1744',
  },
});

export default PauseMenu;
