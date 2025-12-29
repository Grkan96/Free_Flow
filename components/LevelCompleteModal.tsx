// Wire Master - Level Complete Modal
// Shows level completion stats and rewards

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { AdBanner } from './AdBanner';

interface LevelCompleteModalProps {
  visible: boolean;
  level: number;
  stars: number;
  moves: number;
  time: number;
  coinsEarned: number;
  isFirstCompletion: boolean;
  onContinue: () => void;
  onReplay: () => void;
  onMainMenu: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  level,
  stars,
  moves,
  time,
  coinsEarned,
  isFirstCompletion,
  onContinue,
  onReplay,
  onMainMenu,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim, backgroundColor: colors.overlay }]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>{t.win.levelComplete}</Text>
            <Text style={[styles.levelNumber, { color: colors.textSecondary }]}>{t.game.level} {level}</Text>
          </View>

          {/* Stars */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Text
                key={star}
                style={[
                  styles.star,
                  star <= stars && styles.starActive,
                ]}
              >
                ⭐
              </Text>
            ))}
          </View>

          {/* Stats */}
          <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
            {/* Moves */}
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.win.moves}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{moves}</Text>
            </View>

            {/* Time */}
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.win.time}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(time)}</Text>
            </View>

            {/* Coins Earned */}
            <View style={[styles.statRow, styles.coinRow, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.win.coins}</Text>
              <Text style={styles.coinValue}>+{coinsEarned}</Text>
            </View>

            {/* First Completion Bonus */}
            {isFirstCompletion && (
              <View style={[styles.bonusRow, { borderTopColor: colors.border }]}>
                <Text style={styles.bonusIcon}>🎉</Text>
                <Text style={[styles.bonusText, { color: colors.primary }]}>
                  {t.language === 'tr' ? 'İlk Tamamlama Bonusu!' : 'First Time Bonus!'}
                </Text>
              </View>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: colors.primary }]}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>{t.win.nextLevel}</Text>
              <Text style={[styles.continueButtonIcon, { color: colors.buttonText }]}>▶</Text>
            </TouchableOpacity>

            {/* Secondary Buttons */}
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}
                onPress={onReplay}
                activeOpacity={0.7}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>{t.win.retry}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}
                onPress={onMainMenu}
                activeOpacity={0.7}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>{t.win.menu}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AdMob Banner */}
          <AdBanner position="bottom" />
        </Animated.View>
      </Animated.View>
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
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  star: {
    fontSize: 36,
    opacity: 0.2,
  },
  starActive: {
    opacity: 1,
  },
  statsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  coinRow: {
    marginHorizontal: -12,
    marginBottom: -12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  coinValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffea00',
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  bonusIcon: {
    fontSize: 18,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonsContainer: {
    gap: 12,
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  continueButtonIcon: {
    fontSize: 16,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LevelCompleteModal;
