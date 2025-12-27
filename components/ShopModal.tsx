// Wire Master - Shop Modal Component
// Future: Theme and avatar purchases

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

interface ShopModalProps {
  visible: boolean;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
            {/* Coming Soon Section */}
            <View style={styles.comingSoonSection}>
              <Text style={styles.comingSoonIcon}>🛍️</Text>
              <Text style={[styles.comingSoonTitle, { color: colors.text }]}>{t.shop.comingSoon}</Text>
              <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
                {t.shop.comingSoonDesc}
              </Text>
            </View>

            {/* Preview Items */}
            <View style={styles.previewSection}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.shop.previewItems}</Text>

              {/* Theme Pack */}
              <View style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={[styles.itemIcon, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={styles.itemIconText}>🎨</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{t.shop.premiumThemes}</Text>
                  <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                    {t.shop.premiumThemesDesc}
                  </Text>
                </View>
                <View style={[styles.itemPrice, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>$2.99</Text>
                </View>
              </View>

              {/* Avatar Pack */}
              <View style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={[styles.itemIcon, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={styles.itemIconText}>👾</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{t.shop.avatarPack}</Text>
                  <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                    {t.shop.avatarPackDesc}
                  </Text>
                </View>
                <View style={[styles.itemPrice, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>$1.99</Text>
                </View>
              </View>

              {/* Power-ups */}
              <View style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <View style={[styles.itemIcon, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={styles.itemIconText}>⚡</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{t.shop.powerups}</Text>
                  <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>
                    {t.shop.powerupsDesc}
                  </Text>
                </View>
                <View style={[styles.itemPrice, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>$4.99</Text>
                </View>
              </View>
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
  comingSoonSection: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 20,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  previewSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b9bff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemPrice: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b9bff',
  },
});

export default ShopModal;
