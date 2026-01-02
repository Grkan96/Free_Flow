// Wire Cell Component - Individual grid cell for Wire Master

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { CellData, CellState } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface WireCellProps {
  data: CellData | null;
  size: number;
  isDrawing?: boolean;
  isHint?: boolean;
  hasTop?: boolean;
  hasBottom?: boolean;
  hasLeft?: boolean;
  hasRight?: boolean;
}

const WireCell: React.FC<WireCellProps> = ({
  data,
  isDrawing,
  isHint,
  hasTop = false,
  hasBottom = false,
  hasLeft = false,
  hasRight = false
}) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when drawing starts from this port
  useEffect(() => {
    if (isDrawing && data?.isPort) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDrawing, data?.isPort, pulseAnim]);

  if (!data) {
    return <View style={[styles.cell, { backgroundColor: colors.cellEmpty, borderColor: colors.cellBorder }]} />;
  }

  // Use theme wire colors
  const wireColors = colors.wireColors || [];
  const cellColor = data.color !== undefined && wireColors[data.color] ? wireColors[data.color] : colors.primary;

  // Obstacle cell
  if (data.isObstacle || data.state === CellState.OBSTACLE) {
    return (
      <View style={[styles.cell, { backgroundColor: colors.cellEmpty, borderColor: colors.cellBorder }]}>
        <View style={[styles.obstacle, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
          <View style={[styles.obstacleInner, { backgroundColor: colors.backgroundSecondary }]} />
        </View>
      </View>
    );
  }

  // Port cell (endpoint)
  if (data.isPort) {
    return (
      <View style={[styles.cell, { backgroundColor: colors.cellEmpty, borderColor: colors.cellBorder }]}>
        {/* Draw wire connections to port */}
        {hasTop && (
          <View style={[styles.wireSegmentVertical, styles.wireTop, { backgroundColor: cellColor }]} />
        )}
        {hasBottom && (
          <View style={[styles.wireSegmentVertical, styles.wireBottom, { backgroundColor: cellColor }]} />
        )}
        {hasLeft && (
          <View style={[styles.wireSegmentHorizontal, styles.wireLeft, { backgroundColor: cellColor }]} />
        )}
        {hasRight && (
          <View style={[styles.wireSegmentHorizontal, styles.wireRight, { backgroundColor: cellColor }]} />
        )}
        <Animated.View
          style={[
            styles.port,
            {
              backgroundColor: cellColor,
              transform: [{ scale: pulseAnim }]
            },
            isHint && styles.portHint,
          ]}
        />
      </View>
    );
  }

  // Wire path cell
  if (data.state === CellState.PATH || isDrawing) {
    return (
      <View style={[styles.cell, { backgroundColor: colors.cellEmpty, borderColor: colors.cellBorder }]}>
        {/* Vertical segments */}
        {hasTop && (
          <View style={[styles.wireSegmentVertical, styles.wireTop, { backgroundColor: cellColor }]} />
        )}
        {hasBottom && (
          <View style={[styles.wireSegmentVertical, styles.wireBottom, { backgroundColor: cellColor }]} />
        )}
        {/* Horizontal segments */}
        {hasLeft && (
          <View style={[styles.wireSegmentHorizontal, styles.wireLeft, { backgroundColor: cellColor }]} />
        )}
        {hasRight && (
          <View style={[styles.wireSegmentHorizontal, styles.wireRight, { backgroundColor: cellColor }]} />
        )}
        {/* Center dot for connections */}
        {(hasTop || hasBottom || hasLeft || hasRight) && (
          <View style={[styles.wireDot, { backgroundColor: cellColor }]} />
        )}
      </View>
    );
  }

  // Empty cell
  return <View style={[styles.cell, { backgroundColor: colors.cellEmpty, borderColor: colors.cellBorder }]} />;
};

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  port: {
    width: '65%',
    height: '65%',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  portHint: {
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  wireDot: {
    position: 'absolute',
    width: '30%', // Reduced from 45% to 30%
    height: '30%', // Reduced from 45% to 30%
    borderRadius: 100,
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  wireSegmentVertical: {
    position: 'absolute',
    width: '30%', // Reduced from 35% to 30%
    height: '50%',
    left: '35%', // Adjusted to center
    opacity: 1,
    borderRadius: 2, // Reduced from 3 to 2
  },
  wireSegmentHorizontal: {
    position: 'absolute',
    width: '50%',
    height: '30%', // Reduced from 35% to 30%
    top: '35%', // Adjusted to center
    opacity: 1,
    borderRadius: 2, // Reduced from 3 to 2
  },
  wireTop: {
    top: 0,
  },
  wireBottom: {
    bottom: 0,
  },
  wireLeft: {
    left: 0,
  },
  wireRight: {
    right: 0,
  },
  obstacle: {
    width: '80%',
    height: '80%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  obstacleInner: {
    width: '60%',
    height: '60%',
    borderRadius: 2,
  },
});

export default React.memo(WireCell);
