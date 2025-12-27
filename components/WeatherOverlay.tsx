import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WeatherCondition } from '../types';

interface WeatherOverlayProps {
  condition: WeatherCondition;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ condition }) => {
  if (condition.type === 'clear') return null;

  return (
    <View style={styles.container}>
      {condition.type === 'rain' && (
        <View style={[styles.rainLayer, { opacity: condition.intensity * 0.3 }]} />
      )}
      {condition.type === 'storm' && <View style={styles.stormFlash} />}
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
    zIndex: 20,
  },
  rainLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(165, 180, 252, 0.2)',
  },
  stormFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default WeatherOverlay;
