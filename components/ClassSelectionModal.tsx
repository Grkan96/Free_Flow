// Wire Master - Class Selection Modal
// Select difficulty class and chapter

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { DifficultyClass, UserProfile } from '../types';
import { CLASSES, CHAPTERS_PER_CLASS, classChapterToLevel, levelToClassChapter } from '../constants';
import { hasClassPerfectCompletion } from '../utils/userProfileStorage';
import { loadLevelStats } from '../utils/levelStatsStorage';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface ClassSelectionModalProps {
  visible: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onSelectLevel: (level: number) => void;
  onUnlockClass: (classId: DifficultyClass) => Promise<void>;
}

const ClassSelectionModal: React.FC<ClassSelectionModalProps> = ({
  visible,
  userProfile,
  onClose,
  onSelectLevel,
  onUnlockClass,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState<DifficultyClass | null>(null);
  const [perfectCompletionStatus, setPerfectCompletionStatus] = useState<Record<string, boolean>>({});
  const [chapterStars, setChapterStars] = useState<Record<number, number>>({});

  // Check perfect completion status for all classes when modal opens
  useEffect(() => {
    if (visible) {
      const checkPerfectCompletion = async () => {
        const status: Record<string, boolean> = {};
        for (const classId of Object.keys(CLASSES)) {
          status[classId] = await hasClassPerfectCompletion(classId);
        }
        setPerfectCompletionStatus(status);
      };
      checkPerfectCompletion();
    }
  }, [visible]);

  // Load chapter stars when a class is selected
  useEffect(() => {
    if (selectedClass) {
      const loadStarsForClass = async () => {
        const classInfo = CLASSES[selectedClass];
        const stars: Record<number, number> = {};

        for (let level = classInfo.chapterRange.start; level <= classInfo.chapterRange.end; level++) {
          const stats = await loadLevelStats(level);
          stars[level] = stats?.bestStars || 0;
        }

        setChapterStars(stars);
      };
      loadStarsForClass();
    }
  }, [selectedClass]);

  const handleClassSelect = (classId: DifficultyClass) => {
    // Check if class is unlocked
    const isUnlocked = userProfile.unlockedClasses.includes(classId);
    if (!isUnlocked) {
      // Don't allow selection if locked
      return;
    }
    setSelectedClass(classId);
  };

  const handleUnlockClick = async (classId: DifficultyClass) => {
    await onUnlockClass(classId);
  };

  const handleChapterSelect = (chapter: number) => {
    if (!selectedClass) return;
    const level = classChapterToLevel(selectedClass, chapter);
    onSelectLevel(level);
    setSelectedClass(null);
    onClose();
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  // Get user's progress for a class
  const getClassProgress = (classId: DifficultyClass): number => {
    const classInfo = CLASSES[classId];
    const userProgress = levelToClassChapter(userProfile.currentLevel);

    if (userProgress.class === classId) {
      return userProgress.chapter;
    } else if (userProfile.currentLevel >= classInfo.chapterRange.end) {
      return CHAPTERS_PER_CLASS; // Completed
    }
    return 0; // Not started
  };

  // Get translated class name
  const getClassName = (classId: DifficultyClass): string => {
    switch (classId) {
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

  // Get translated class description
  const getClassDesc = (classId: DifficultyClass): string => {
    switch (classId) {
      case 'basic':
        return t.classes.basicDesc;
      case 'medium':
        return t.classes.mediumDesc;
      case 'hard':
        return t.classes.hardDesc;
      default:
        return t.classes.basicDesc;
    }
  };

  const renderClassSelection = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t.classSelection.selectClass}</Text>

      {Object.values(CLASSES).map((classInfo, index) => {
        const progress = getClassProgress(classInfo.id);
        const isUnlocked = userProfile.unlockedClasses.includes(classInfo.id);

        // Check if previous class has perfect completion (all 5 stars) - for Medium and Hard
        let previousClassPerfect = true;
        let previousClassName = '';
        if (index > 0) {
          const previousClass = Object.values(CLASSES)[index - 1];
          previousClassPerfect = perfectCompletionStatus[previousClass.id] || false;
          previousClassName = getClassName(previousClass.id);
        }

        const canUnlock = previousClassPerfect;
        const showUnlockButton = !isUnlocked && index > 0; // Show unlock button for Medium and Hard

        return (
          <View key={classInfo.id} style={styles.classCardContainer}>
            <TouchableOpacity
              style={[
                styles.classCard,
                { backgroundColor: colors.background, borderColor: isUnlocked ? classInfo.color : colors.border },
                !isUnlocked && styles.classCardLocked,
              ]}
              onPress={() => isUnlocked && handleClassSelect(classInfo.id)}
              disabled={!isUnlocked}
              activeOpacity={0.7}
            >
              <View style={styles.classCardHeader}>
                <View style={[styles.classIcon, { backgroundColor: classInfo.color + '20' }]}>
                  <Text style={styles.classIconText}>{classInfo.icon}</Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={[styles.className, { color: isUnlocked ? classInfo.color : colors.textTertiary }]}>
                    {getClassName(classInfo.id)}
                  </Text>
                  <Text style={[styles.classDescription, { color: colors.textSecondary }]}>{getClassDesc(classInfo.id)}</Text>
                </View>
                {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
              </View>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(progress / CHAPTERS_PER_CLASS) * 100}%`,
                        backgroundColor: classInfo.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {progress}/{CHAPTERS_PER_CLASS} {t.classSelection.chapters}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Unlock Requirements or Button */}
            {showUnlockButton && (
              <View style={styles.unlockContainer}>
                {/* Requirements */}
                <View style={styles.requirementsContainer}>
                  {/* Perfect Completion Requirement */}
                  <View style={styles.requirement}>
                    <Text style={styles.requirementIcon}>{previousClassPerfect ? '✅' : '❌'}</Text>
                    <Text style={[styles.requirementText, { color: colors.textSecondary }, previousClassPerfect && styles.requirementMet]}>
                      {t.classSelection.perfectAll} {previousClassName}
                    </Text>
                  </View>
                </View>

                {/* Unlock Button */}
                <TouchableOpacity
                  style={[
                    styles.unlockButton,
                    { backgroundColor: colors.primary },
                    !canUnlock && [styles.unlockButtonDisabled, { backgroundColor: colors.backgroundTertiary }],
                  ]}
                  onPress={() => canUnlock && handleUnlockClick(classInfo.id)}
                  disabled={!canUnlock}
                  activeOpacity={0.7}
                >
                  <Text style={styles.unlockButtonIcon}>⭐</Text>
                  <Text style={[styles.unlockButtonText, { color: colors.buttonText }]}>
                    {canUnlock ? t.classSelection.unlock : t.classSelection.locked}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderChapterSelection = () => {
    if (!selectedClass) return null;

    const classInfo = CLASSES[selectedClass];
    const userProgress = getClassProgress(selectedClass);

    // Generate chapters (25 rows × 4 columns = 100 chapters)
    const chapters: number[][] = [];
    const COLUMNS = 4;
    const totalChapters = 100;
    const rows = Math.ceil(totalChapters / COLUMNS);

    for (let row = 0; row < rows; row++) {
      const rowChapters: number[] = [];
      for (let col = 0; col < COLUMNS; col++) {
        const chapterNum = row * COLUMNS + col + 1;
        if (chapterNum <= totalChapters) {
          rowChapters.push(chapterNum);
        }
      }
      chapters.push(rowChapters);
    }

    return (
      <>
        {/* Back Button and Current World Label */}
        <View style={[styles.chapterTopBar, { borderBottomColor: colors.primary }]}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={handleBackToClasses}
            activeOpacity={0.7}
          >
            <View style={[styles.backArrowBox, { borderColor: colors.border }]}>
              <Text style={[styles.backArrowText, { color: colors.text }]}>{'<'}</Text>
            </View>
            <View style={[styles.backTextBox, { borderColor: colors.border }]}>
              <Text style={[styles.backLabel, { color: colors.text }]}>{t.classSelection.back}</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.currentWorldBadge, { backgroundColor: colors.background, borderColor: colors.primary }]}>
            <Text style={[styles.currentWorldText, { color: colors.primary }]}>
              {t.classSelection.currentWorld}: {getClassName(selectedClass).toUpperCase()}
            </Text>
            <Text style={styles.currentWorldIcon}>{classInfo.icon}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.chapterScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Grid of chapters */}
          {chapters.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.chapterRow}>
              {row.map((chapter) => {
                const level = classChapterToLevel(selectedClass, chapter);
                const stars = chapterStars[level] || 0;
                const isCompleted = chapter < userProgress;
                const isCurrent = chapter === userProgress;
                const isLocked = chapter > userProgress;

                return (
                  <TouchableOpacity
                    key={chapter}
                    style={[
                      styles.chapterButtonNew,
                      { backgroundColor: colors.background, borderColor: colors.primary },
                      isCompleted && styles.chapterCompletedNew,
                      isCurrent && [styles.chapterCurrentNew, { backgroundColor: colors.backgroundTertiary }],
                      isLocked && [styles.chapterLockedNew, { borderColor: colors.border }],
                    ]}
                    onPress={() => !isLocked && handleChapterSelect(chapter)}
                    disabled={isLocked}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chapterNumberNew,
                        { color: colors.primary },
                        isCompleted && styles.chapterNumberCompletedNew,
                        isCurrent && [styles.chapterNumberCurrentNew, { color: colors.text }],
                        isLocked && [styles.chapterNumberLockedNew, { color: colors.textTertiary }],
                      ]}
                    >
                      {chapter}
                    </Text>

                    {/* Star display - only show for completed or current chapters */}
                    {!isLocked && (
                      <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <Text
                            key={starNum}
                            style={[
                              styles.starIcon,
                              { color: colors.border },
                              starNum <= stars && [styles.starIconFilled, { color: colors.primary }],
                            ]}
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                    )}

                    {isLocked && <Text style={styles.lockIconNew}>🔒</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Progress bar at bottom */}
          <View style={[styles.progressSection, { backgroundColor: colors.background, borderTopColor: colors.primary }]}>
            <Text style={[styles.progressLabel, { color: colors.primary }]}>{t.classSelection.progress}</Text>
            <Text style={[styles.progressValue, { color: colors.textSecondary }]}>
              {userProgress} / {CHAPTERS_PER_CLASS} {t.classSelection.completed}
            </Text>
            <View style={[styles.progressBarContainer, { backgroundColor: colors.backgroundTertiary }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(userProgress / CHAPTERS_PER_CLASS) * 100}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background, borderColor: colors.primary }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={[styles.titleWhite, { color: colors.text }]}>{t.classSelection.choose}</Text>
              <Text style={[styles.titleGreen, { color: colors.primary }]}>{t.classSelection.chapter}</Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedClass ? renderChapterSelection() : renderClassSelection()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxWidth: 650,
    maxHeight: '90%',
    backgroundColor: '#000000',
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#00ff41',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 32,
    paddingTop: 40,
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleWhite: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 3,
  },
  titleGreen: {
    fontSize: 36,
    fontWeight: '800',
    color: '#00ff41',
    letterSpacing: 3,
  },
  closeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  closeButtonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '400',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b9bff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  classCardContainer: {
    marginBottom: 16,
  },
  classCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    borderWidth: 2,
  },
  classCardLocked: {
    opacity: 0.5,
  },
  classCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  classIconText: {
    fontSize: 32,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: '#9ca3af',
  },
  lockIcon: {
    fontSize: 24,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  unlockContainer: {
    gap: 12,
  },
  requirementsContainer: {
    gap: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementIcon: {
    fontSize: 16,
  },
  requirementText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  requirementMet: {
    color: '#00ff41',
  },
  unlockButton: {
    backgroundColor: '#8b9bff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  unlockButtonDisabled: {
    backgroundColor: '#2a2a2a',
    opacity: 0.6,
  },
  unlockButtonIcon: {
    fontSize: 18,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    color: '#8b9bff',
    fontWeight: '600',
  },
  classTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  chapterScrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  chapterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
    justifyContent: 'space-between',
  },
  chapterButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chapterCompleted: {
    backgroundColor: '#1a2a1a',
    borderColor: '#2a4a2a',
  },
  chapterCurrent: {
    backgroundColor: '#1a1a2a',
    borderWidth: 3,
  },
  chapterLocked: {
    opacity: 0.3,
  },
  chapterNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  chapterNumberCompleted: {
    color: '#00ff41',
  },
  chapterNumberCurrent: {
    fontSize: 18,
  },
  chapterNumberLocked: {
    color: '#6b7280',
  },
  checkmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 10,
    color: '#00ff41',
  },
  lockIconSmall: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    fontSize: 8,
  },
  // New styles for redesigned chapter selection
  chapterTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff41',
    gap: 12,
  },
  backButtonNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  backButtonTextNew: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '400',
  },
  backButtonLabel: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 2,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  backArrowBox: {
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '400',
  },
  backTextBox: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  currentWorldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0a0a0a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00ff41',
    flexShrink: 1,
  },
  currentWorldText: {
    fontSize: 12,
    color: '#00ff41',
    fontWeight: '700',
    letterSpacing: 1,
    flexShrink: 1,
  },
  currentWorldIcon: {
    fontSize: 18,
    flexShrink: 0,
  },
  chapterButtonNew: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#000000',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#00ff41',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 10,
  },
  chapterCompletedNew: {
    backgroundColor: '#000000',
    borderColor: '#00ff41',
  },
  chapterCurrentNew: {
    backgroundColor: '#0a1a0a',
    borderColor: '#00ff41',
    borderWidth: 3,
  },
  chapterLockedNew: {
    backgroundColor: '#000000',
    borderColor: '#1a1a1a',
    opacity: 0.5,
  },
  chapterNumberNew: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00ff41',
    marginBottom: 4,
  },
  chapterNumberCompletedNew: {
    color: '#00ff41',
  },
  chapterNumberCurrentNew: {
    fontSize: 30,
    color: '#ffffff',
  },
  chapterNumberLockedNew: {
    color: '#4a4a4a',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  starIcon: {
    fontSize: 10,
    color: '#2a2a2a',
  },
  starIconFilled: {
    color: '#00ff41',
  },
  lockIconNew: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.5,
  },
  progressSection: {
    marginTop: 32,
    padding: 28,
    backgroundColor: '#000000',
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#00ff41',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00ff41',
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6a6a6a',
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#0a0a0a',
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00ff41',
    borderRadius: 0,
  },
});

export default ClassSelectionModal;
