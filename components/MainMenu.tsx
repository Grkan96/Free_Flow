import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Play, Settings } from './Icons';
import { TOTAL_LEVELS, AVATARS, CLASSES } from '../constants';
import { UserProfile } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface MainMenuProps {
  onStart: () => void;
  onSettings: () => void;
  userProfile?: UserProfile | null;
  currentLevel?: number;
  onShowProfile?: () => void;
  onShowStats?: () => void;
  onShowShop?: () => void;
  onShowMessages?: () => void;
}

const { width } = Dimensions.get('window');

const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onSettings,
  userProfile,
  currentLevel = 1,
  onShowProfile,
  onShowStats,
  onShowShop,
  onShowMessages,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const avatar = userProfile ? AVATARS.find(a => a.id === userProfile.avatarId) : null;
  const currentClass = userProfile?.currentClass || 'basic';
  const currentChapter = userProfile?.currentChapter || 1;
  const classInfo = CLASSES[currentClass];

  // Get translated class name
  const getClassName = () => {
    switch (currentClass) {
      case 'basic':
        return t.classes.basic;
      case 'medium':
        return t.classes.medium;
      case 'hard':
        return t.classes.hard;
      default:
        return t.classes.basic;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Progress Bar */}
      <View style={[styles.progressBarTop, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={[styles.progressFill, { width: `${(currentLevel / TOTAL_LEVELS) * 100}%`, backgroundColor: colors.primary }]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Simple Header with Coin */}
        <View style={styles.headerContainer}>
          {/* Coin Display - Top Right */}
          <View style={[styles.coinContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.coinAmount}>{userProfile?.coins || 0}</Text>
          </View>

          {/* Title - Centered */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>WIRE</Text>
            <Text style={styles.titleAccent}>MASTER</Text>
            <Text style={[styles.levelInfo, { color: colors.textSecondary }]}>
              {t.mainMenu.level} {currentLevel} • {getClassName()} {currentChapter}
            </Text>
          </View>
        </View>

        {/* Play Buttons */}
        <View style={styles.playButtonsRow}>
          <TouchableOpacity onPress={onStart} style={[styles.playButton, { backgroundColor: colors.primary }]} activeOpacity={0.8}>
            <Text style={[styles.playIcon, { color: colors.buttonText }]}>▶</Text>
            <Text style={[styles.playText, { color: colors.buttonText }]}>{t.mainMenu.continue.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={onShowShop}
          >
            <Text style={styles.navIcon}>🏪</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={onShowStats}
          >
            <Text style={styles.navIcon}>📊</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButtonCenter, { backgroundColor: colors.background, borderColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={onShowProfile}
          >
            <View style={[styles.navButtonCenterInner, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={styles.navIconCenter}>
                {avatar ? avatar.icon : '👤'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={onShowMessages}
          >
            <Text style={styles.navIcon}>📨</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={onSettings}
          >
            <Text style={styles.navIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBarTop: {
    width: '100%',
    height: 4,
    position: 'absolute',
    top: 0,
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  coinContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
  },
  coinIcon: {
    fontSize: 20,
  },
  coinAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffea00',
  },
  title: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: 4,
  },
  titleAccent: {
    fontSize: 56,
    fontWeight: '800',
    color: '#8b9bff',
    letterSpacing: 4,
    marginTop: -12,
  },
  levelInfo: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    letterSpacing: 2,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a2b3a',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a3b4a',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
  },
  challengeCard: {
    width: '100%',
    backgroundColor: '#1a2332',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2a3342',
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8b9bff',
    letterSpacing: 1,
    marginBottom: 6,
  },
  challengeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  challengeArrow: {
    fontSize: 32,
    color: '#8b9bff',
    fontWeight: '300',
  },
  playButtonsRow: {
    width: '100%',
    marginBottom: 32,
  },
  playButton: {
    width: '100%',
    backgroundColor: '#8b9bff',
    paddingVertical: 20,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#8b9bff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  playIcon: {
    fontSize: 20,
    color: '#0f1419',
    fontWeight: '900',
  },
  playText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f1419',
    letterSpacing: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#1a2b3a',
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2a3b4a',
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
  },
  navButtonCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0f1419',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
    marginTop: -28,
  },
  navButtonCenterInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a2332',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconCenter: {
    fontSize: 24,
    color: '#8b9bff',
  },
});

export default MainMenu;
