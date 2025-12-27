import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { RefreshCw, PlayFilled } from './Icons';

interface OverlayProps {
  type: 'won' | 'generating';
  moves: number;
  level: number;
  isPerfect: boolean;
  onRestart: () => void;
  onNextLevel?: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ type, moves, level, isPerfect, onRestart, onNextLevel }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (type === 'generating') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [type]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (type === 'generating') {
    return (
      <View style={styles.generatingContainer}>
        <View style={styles.spinnerContainer}>
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <View style={styles.spinnerBorder} />
          </Animated.View>
        </View>
        <Text style={styles.generatingText}>Loading Level {level}...</Text>
      </View>
    );
  }

  // Win overlay
  const stars = isPerfect ? 3 : moves <= 50 ? 2 : 1;

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.wonBlock}>
        <Text style={styles.wonTitle}>Level Complete!</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3].map((star) => (
            <View
              key={star}
              style={[
                styles.star,
                star <= stars ? styles.starActive : styles.starInactive,
              ]}
            >
              <Text style={styles.starText}>★</Text>
            </View>
          ))}
        </View>

        {isPerfect && (
          <View style={styles.perfectBadge}>
            <Text style={styles.perfectText}>PERFECT!</Text>
          </View>
        )}

        {/* Moves Display */}
        <View style={styles.movesBlock}>
          <Text style={styles.movesLabel}>Moves</Text>
          <Text style={styles.movesValue}>{moves}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onNextLevel}
        style={styles.nextButton}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Next Level</Text>
        <PlayFilled size={18} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRestart}
        style={styles.retryButton}
        activeOpacity={0.8}
      >
        <RefreshCw size={16} color="#6b7280" />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  generatingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 64,
    height: 64,
  },
  spinnerBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderTopColor: '#10b981',
  },
  generatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 50,
  },
  wonBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  wonTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  star: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  starActive: {
    backgroundColor: '#fbbf24',
  },
  starInactive: {
    backgroundColor: '#e5e7eb',
  },
  starText: {
    fontSize: 28,
    color: '#fff',
  },
  perfectBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  perfectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  movesBlock: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  movesLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  movesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#374151',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#10b981',
    borderRadius: 12,
    marginBottom: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default Overlay;
