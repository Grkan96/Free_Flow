// Wire Master - Shop Modal Component
// Theme purchases

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { getAvailableThemes, isThemeUnlocked, Theme } from '../constants/themes';
import { UserProfile } from '../types';

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  purchasedThemes: string[];
  onThemePurchase: (themeId: string, price: number) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({
  visible,
  onClose,
  userProfile,
  purchasedThemes,
  onThemePurchase,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const allThemes = getAvailableThemes();
  const userLevel = userProfile?.currentLevel || 1;
  const userCoins = userProfile?.coins || 0;

  // Filter themes: only show coin-based themes (not free 'classic')
  const shopThemes = allThemes.filter(theme => theme.requirementType === 'coins');

  const handlePurchaseTheme = (theme: Theme) => {
    const unlocked = isThemeUnlocked(theme, userLevel, userCoins, purchasedThemes);

    if (unlocked) {
      // Already purchased/unlocked
      return;
    }

    if (userCoins >= theme.price) {
      onThemePurchase(theme.id, theme.price);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{t.shop.title}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* User Coins */}
            <View style={[styles.coinsSection, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.coinsLabel, { color: colors.textSecondary }]}>Your Coins</Text>
              <Text style={[styles.coinsValue, { color: colors.primary }]}>{userCoins} 💰</Text>
            </View>

            {/* Themes Section */}
            <View style={styles.themesSection}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>🎨 Premium Themes</Text>

              {shopThemes.map(theme => {
                const isUnlocked = isThemeUnlocked(theme, userLevel, userCoins, purchasedThemes);
                const canAfford = userCoins >= theme.price;

                return (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themeCard,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      isUnlocked && { borderColor: colors.primary, borderWidth: 2 },
                    ]}
                    onPress={() => handlePurchaseTheme(theme)}
                    activeOpacity={0.7}
                    disabled={isUnlocked}
                  >
                    {/* Theme Icon */}
                    <View style={[styles.themeIcon, { backgroundColor: colors.backgroundTertiary }]}>
                      <Text style={styles.themeIconText}>{theme.icon}</Text>
                    </View>

                    {/* Theme Info */}
                    <View style={styles.themeInfo}>
                      <Text style={[styles.themeName, { color: colors.text }]}>{theme.name}</Text>
                      <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                        {theme.description}
                      </Text>

                      {/* Color Preview */}
                      <View style={styles.colorPreview}>
                        {theme.colors.wireColors.slice(0, 5).map((color, index) => (
                          <View
                            key={index}
                            style={[
                              styles.colorDot,
                              { backgroundColor: color },
                            ]}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Price/Status */}
                    <View style={styles.themeRight}>
                      {isUnlocked ? (
                        <View style={[styles.purchasedBadge, { backgroundColor: colors.primary }]}>
                          <Text style={[styles.purchasedText, { color: colors.buttonText }]}>✓ Owned</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.buyButton,
                            { backgroundColor: canAfford ? colors.primary : colors.backgroundTertiary },
                          ]}
                          onPress={() => handlePurchaseTheme(theme)}
                          activeOpacity={0.7}
                          disabled={!canAfford}
                        >
                          <Text
                            style={[
                              styles.buyButtonText,
                              { color: canAfford ? colors.buttonText : colors.textSecondary },
                            ]}
                          >
                            {theme.price === 0 ? 'FREE' : `${theme.price} 💰`}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer Hint */}
            <View style={styles.footerHint}>
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                💡 Purchased themes can be activated in Settings → Visual Themes
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#9ca3af',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  coinsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  coinsLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  themesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeIconText: {
    fontSize: 28,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 12,
    marginBottom: 8,
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 6,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  purchasedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  purchasedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  buyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerHint: {
    padding: 16,
    marginTop: 10,
  },
  hintText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default ShopModal;
