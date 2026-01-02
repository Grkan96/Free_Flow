// Wire Master - Theme Selection Modal
// Allows users to browse and purchase themes

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import {
  THEMES,
  Theme,
  isThemeUnlocked,
  getThemeUnlockText,
  getAvailableThemes,
} from '../constants/themes';
import { UserProfile } from '../types';

const { width } = Dimensions.get('window');

interface ThemeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  currentThemeId: string;
  purchasedThemes: string[];
  onThemeSelect: (themeId: string) => void;
  onThemePurchase: (themeId: string, price: number) => void;
}

const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({
  visible,
  onClose,
  userProfile,
  currentThemeId,
  purchasedThemes,
  onThemeSelect,
  onThemePurchase,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedPreview, setSelectedPreview] = useState<string>(currentThemeId);

  const themes = getAvailableThemes();
  const userLevel = userProfile?.currentLevel || 1;
  const userCoins = userProfile?.coins || 0;

  // Reset preview when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedPreview(currentThemeId);
    }
  }, [visible, currentThemeId]);

  const handleThemePress = (theme: Theme) => {
    const unlocked = isThemeUnlocked(theme, userLevel, userCoins, purchasedThemes);

    if (unlocked) {
      // If already unlocked, activate it
      onThemeSelect(theme.id);
      onClose();
    } else if (theme.requirementType === 'coins' && userCoins >= theme.price) {
      // If enough coins, purchase it
      onThemePurchase(theme.id, theme.price);
    } else {
      // Just show preview
      setSelectedPreview(theme.id);
    }
  };

  const renderThemeCard = (theme: Theme) => {
    const unlocked = isThemeUnlocked(theme, userLevel, userCoins, purchasedThemes);
    const isActive = currentThemeId === theme.id;
    const isPreviewing = selectedPreview === theme.id;
    const unlockText = getThemeUnlockText(theme, userLevel, userCoins, purchasedThemes);
    const canPurchase = theme.requirementType === 'coins' && userCoins >= theme.price;

    return (
      <TouchableOpacity
        key={theme.id}
        style={[
          styles.themeCard,
          { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
          isActive && { borderColor: colors.primary, borderWidth: 3 },
          isPreviewing && !isActive && { borderColor: colors.secondary, borderWidth: 2 },
        ]}
        onPress={() => handleThemePress(theme)}
        activeOpacity={0.8}
      >
        {/* Theme Icon */}
        <View style={styles.themeIconContainer}>
          <Text style={styles.themeIcon}>{theme.icon}</Text>
        </View>

        {/* Theme Info */}
        <View style={styles.themeInfo}>
          <Text style={[styles.themeName, { color: colors.text }]}>{theme.name}</Text>
          <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
            {theme.description}
          </Text>
        </View>

        {/* Status Badge */}
        <View style={styles.themeBadge}>
          {isActive ? (
            <View style={[styles.badge, styles.badgeActive, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.buttonText }]}>✓ Active</Text>
            </View>
          ) : unlocked ? (
            <View style={[styles.badge, styles.badgeUnlocked, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>Tap to Use</Text>
            </View>
          ) : theme.requirementType === 'coins' ? (
            <View
              style={[
                styles.badge,
                styles.badgeLocked,
                { backgroundColor: canPurchase ? colors.primary : colors.backgroundTertiary },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: canPurchase ? colors.buttonText : colors.textSecondary },
                ]}
              >
                {canPurchase ? `Buy ${theme.price}💰` : `${theme.price}💰`}
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeLocked, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{unlockText}</Text>
            </View>
          )}
        </View>

        {/* Color Preview */}
        <View style={styles.colorPreview}>
          {theme.colors.wireColors.slice(0, 5).map((color, index) => (
            <View
              key={index}
              style={[
                styles.colorDot,
                { backgroundColor: color },
                theme.effects?.glow && { shadowColor: color, shadowRadius: 4, shadowOpacity: 0.8 },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>🎨 Choose Theme</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={[styles.userInfo, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{userLevel}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Coins</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{userCoins} 💰</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Themes</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {purchasedThemes.length}/{themes.length}
              </Text>
            </View>
          </View>

          {/* Themes List */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.themesContainer}>{themes.map(renderThemeCard)}</View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              💡 Earn coins by completing levels
            </Text>
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
  modalContainer: {
    width: width * 0.9,
    maxWidth: 500,
    maxHeight: '85%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  scrollView: {
    flex: 1,
  },
  themesContainer: {
    padding: 16,
    gap: 12,
  },
  themeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  themeIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  themeIcon: {
    fontSize: 32,
  },
  themeInfo: {
    marginBottom: 12,
    paddingRight: 50,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 13,
    fontWeight: '500',
  },
  themeBadge: {
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeActive: {},
  badgeUnlocked: {},
  badgeLocked: {},
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ThemeSelectionModal;
