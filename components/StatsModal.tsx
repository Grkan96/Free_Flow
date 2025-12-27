// Wire Master - Statistics Modal Component
// Display global and per-level statistics

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GlobalStats, LevelStats } from '../types';
import { formatLongTime, formatTime } from '../utils/formatters';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface StatsModalProps {
  visible: boolean;
  globalStats: GlobalStats;
  levelStatsMap: Map<number, LevelStats>;
  onClose: () => void;
}

const StatsModal: React.FC<StatsModalProps> = ({
  visible,
  globalStats,
  levelStatsMap,
  onClose,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Convert map to array and sort by level number
  const levelStatsArray = Array.from(levelStatsMap.values()).sort(
    (a, b) => a.levelNumber - b.levelNumber
  );

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
            <Text style={[styles.title, { color: colors.text }]}>{t.stats.title}</Text>
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
            {/* Global Stats Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.stats.globalStats}</Text>
              <View style={styles.globalStatsGrid}>
                {/* Total Levels Completed */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {globalStats.totalLevelsCompleted}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>
                    {t.stats.levelsCompleted}
                  </Text>
                </View>

                {/* Total Play Time */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {formatLongTime(globalStats.totalPlayTime)}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>{t.stats.totalTime}</Text>
                </View>

                {/* Total Stars */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {globalStats.totalStars}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>{t.stats.totalStars}</Text>
                </View>

                {/* Perfect Levels */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {globalStats.perfectLevels}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>
                    {t.stats.perfectLevels}
                  </Text>
                </View>

                {/* Total Moves */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {globalStats.totalMoves}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>{t.stats.totalMoves}</Text>
                </View>

                {/* Current Streak */}
                <View style={[styles.globalStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.globalStatValue, { color: colors.text }]}>
                    {globalStats.currentStreak}
                  </Text>
                  <Text style={[styles.globalStatLabel, { color: colors.textSecondary }]}>{t.stats.currentStreak}</Text>
                </View>
              </View>

              {/* Streak Info */}
              {globalStats.longestStreak > 0 && (
                <View style={styles.streakInfo}>
                  <Text style={styles.streakText}>
                    🔥 {t.stats.longestStreak}: {globalStats.longestStreak} {t.stats.days}
                  </Text>
                </View>
              )}
            </View>

            {/* Level Stats Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.stats.levelStats}</Text>

              {levelStatsArray.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                    {t.stats.noLevelsCompleted}
                  </Text>
                </View>
              ) : (
                <View style={styles.levelStatsContainer}>
                  {levelStatsArray.map((levelStat) => (
                    <View
                      key={levelStat.levelNumber}
                      style={[styles.levelStatCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                    >
                      {/* Level Number */}
                      <View style={styles.levelStatHeader}>
                        <Text style={[styles.levelNumber, { color: colors.text }]}>
                          {t.stats.level} {levelStat.levelNumber}
                        </Text>
                        {levelStat.bestStars > 0 && (
                          <Text style={styles.levelStars}>
                            {'⭐'.repeat(levelStat.bestStars)}
                          </Text>
                        )}
                      </View>

                      {/* Stats Row */}
                      <View style={styles.levelStatRow}>
                        <View style={styles.levelStatItem}>
                          <Text style={[styles.levelStatLabel, { color: colors.textSecondary }]}>
                            {t.stats.bestTime}
                          </Text>
                          <Text style={[styles.levelStatValue, { color: colors.primary }]}>
                            {levelStat.bestTime
                              ? formatTime(levelStat.bestTime)
                              : '--:--'}
                          </Text>
                        </View>

                        <View style={styles.levelStatItem}>
                          <Text style={[styles.levelStatLabel, { color: colors.textSecondary }]}>
                            {t.stats.bestMoves}
                          </Text>
                          <Text style={[styles.levelStatValue, { color: colors.primary }]}>
                            {levelStat.bestMoves || '--'}
                          </Text>
                        </View>

                        <View style={styles.levelStatItem}>
                          <Text style={[styles.levelStatLabel, { color: colors.textSecondary }]}>
                            {t.stats.completions}
                          </Text>
                          <Text style={[styles.levelStatValue, { color: colors.primary }]}>
                            {levelStat.completions}x
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
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
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00e5ff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  globalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  globalStatCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  globalStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  globalStatLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    textAlign: 'center',
  },
  streakInfo: {
    marginTop: 16,
    backgroundColor: '#2a1a00',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ff6d00',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff6d00',
  },
  levelStatsContainer: {
    gap: 12,
  },
  levelStatCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  levelStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  levelStars: {
    fontSize: 14,
  },
  levelStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  levelStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  levelStatLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  levelStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00e5ff',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default StatsModal;
