import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { CellData, PlaneType } from '../types';
import { ROTATION_MAP, PLANE_CONFIG } from '../constants';
import { Plane, Box, AlertTriangle, AlertTriangleFilled, Fuel, Cone, PlaneFilled } from './Icons';

interface CellProps {
  data: CellData | null;
  size: number;
  onPress: (row: number, col: number) => void;
  isPath?: boolean;
}

const Cell: React.FC<CellProps> = ({ data, size, onPress, isPath }) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (data?.isExiting) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: PLANE_CONFIG[data.type].duration,
        useNativeDriver: true,
      }).start();
    }
  }, [data?.isExiting]);

  // Empty cell
  if (!data) {
    return (
      <View style={[styles.cell, { borderColor: 'rgba(251, 191, 36, 0.2)' }]}>
        {isPath && <View style={styles.pathHighlight} />}
        <View style={styles.taxiwayLines} />
      </View>
    );
  }

  // Obstacle rendering
  if (data.isObstacle) {
    return (
      <View style={[styles.cell, { borderColor: 'rgba(251, 191, 36, 0.2)', backgroundColor: 'rgba(251, 191, 36, 0.05)' }]}>
        <View style={styles.obstacleIcon}>
          <Cone size={size > 4 ? 20 : 28} color="#fbbf24" />
        </View>
        <View style={styles.warningLight} />
      </View>
    );
  }

  const handlePress = () => {
    if (!data.isExiting) {
      onPress(data.row, data.col);
    }
  };

  const isEmergency = data.fuel !== undefined && data.fuel > 0;
  const isCritical = data.fuel !== undefined && data.fuel <= 5;

  let planeColor = '#cbd5e1'; // slate-300
  if (data.type === PlaneType.LIGHT) {
    planeColor = '#d1fae5'; // emerald-100
  } else if (data.type === PlaneType.HEAVY) {
    planeColor = '#fef3c7'; // amber-100
  }

  if (data.isError) {
    planeColor = '#fecaca'; // red-200
  } else if (isPath) {
    planeColor = '#fbbf24'; // yellow-400
  } else if (isCritical) {
    planeColor = '#fed7aa'; // orange-200
  }

  const rotation = ROTATION_MAP[data.direction];
  const planeSize = size > 4 ? 28 : 42;

  // Calculate combined rotation
  const rotationDegrees = parseInt(rotation) - 45;
  const combinedRotation = `${rotationDegrees}deg`;

  return (
    <View style={[styles.cell, { borderColor: 'rgba(251, 191, 36, 0.2)' }, isEmergency && styles.emergencyBg]}>
      {isPath && <View style={styles.pathHighlight} />}
      <View style={styles.taxiwayLines} />

      {isEmergency && !data.isExiting && (
        <View style={[styles.emergencyBorder, isCritical && styles.criticalBorder]} />
      )}

      <TouchableOpacity
        onPress={handlePress}
        style={styles.touchable}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.planeContainer, { opacity: animatedValue }]}>
          <View style={[styles.planeIconWrapper, { transform: [{ rotate: combinedRotation }] }]}>
            {isPath ? (
              <PlaneFilled size={planeSize} color={planeColor} />
            ) : (
              <Plane
                size={planeSize}
                color={planeColor}
                strokeWidth={data.type === PlaneType.HEAVY ? 2.5 : 1.5}
              />
            )}

            {data.type === PlaneType.HEAVY && (
              <View style={styles.heavyIcon}>
                <Box size={14} color="rgba(120, 53, 15, 0.5)" />
              </View>
            )}

            {isEmergency && (
              <View style={styles.emergencyIcon}>
                <AlertTriangleFilled
                  size={16}
                  color={isCritical ? '#dc2626' : '#f97316'}
                />
              </View>
            )}
          </View>
        </Animated.View>

        {isEmergency && !data.isExiting && (
          <View style={styles.fuelBadgeContainer}>
            <View style={[styles.fuelBadge, isCritical ? styles.fuelCritical : styles.fuelWarning]}>
              <Fuel size={8} color={isCritical ? '#fff' : '#000'} />
              <Text style={[styles.fuelText, { color: isCritical ? '#fff' : '#000' }]}>
                {data.fuel}s
              </Text>
            </View>
            {isCritical && (
              <Text style={styles.maydayText}>MAYDAY</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  taxiwayLines: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
  },
  pathHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.5)',
  },
  obstacleIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  warningLight: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    backgroundColor: '#ef4444',
    borderRadius: 3,
  },
  emergencyBg: {
    backgroundColor: 'rgba(127, 29, 29, 0.1)',
  },
  emergencyBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  criticalBorder: {
    borderColor: '#ef4444',
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planeIconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heavyIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -7 }, { translateY: -7 }],
  },
  emergencyIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  fuelBadgeContainer: {
    position: 'absolute',
    bottom: -4,
    alignItems: 'center',
  },
  fuelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  fuelCritical: {
    backgroundColor: '#dc2626',
  },
  fuelWarning: {
    backgroundColor: '#f97316',
  },
  fuelText: {
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 2,
  },
  maydayText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#ef4444',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 4,
    marginTop: 2,
    borderRadius: 2,
  },
});

export default React.memo(Cell);
