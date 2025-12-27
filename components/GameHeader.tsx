import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { formatTime } from '../utils/formatters';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface GameHeaderProps {
  level: number;
  moves: number;
  flowPercentage: number;
  elapsedTime?: number;
  isPaused?: boolean;
  onPause?: () => void;
  coins?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  moves,
  flowPercentage,
  elapsedTime = 0,
  isPaused = false,
  onPause,
  coins = 0,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Animate progress bar
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: flowPercentage,
      useNativeDriver: false, // width animation requires layout
      friction: 8,
      tension: 40,
    }).start();
  }, [flowPercentage, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Top Row: Level + Coins + Pause */}
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <Text style={[styles.levelText, { color: colors.text }]}>
            {t.game.level} {level}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {/* COIN DISPLAY */}
          <View style={[styles.coinDisplay, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Text style={styles.coinIcon}>💰</Text>
            <Text style={styles.coinValue}>{coins}</Text>
          </View>

          {/* PAUSE BUTTON */}
          {onPause && (
            <TouchableOpacity
              style={[styles.pauseButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={onPause}
              activeOpacity={0.7}
            >
              <Text style={styles.pauseIcon}>⏸</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats Row: Time, Moves, Flow */}
      <View style={[styles.statsRow, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.game.moves}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{moves}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.game.filled}</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{flowPercentage}%</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.language === 'tr' ? 'SÜRE' : 'TIME'}</Text>
          <Text style={[styles.statValue, { color: colors.text }, isPaused && styles.statValuePaused]}>
            {formatTime(elapsedTime)}
          </Text>
        </View>
      </View>

      {/* Progress Bar with Animation */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
        <Animated.View style={[styles.progressBar, { width: progressWidth, backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 448,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 12,
    zIndex: 10,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  coinIcon: {
    fontSize: 16,
  },
  coinValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffea00',
  },
  pauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  pauseIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#2a2a2a',
  },
  statLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statValuePaused: {
    color: '#ff6d00',
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default GameHeader;
