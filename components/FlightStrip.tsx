import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Plane } from './Icons';

interface FlightStripProps {
  flightId: string;
  path: string[];
}

const FlightStrip: React.FC<FlightStripProps> = ({ flightId, path }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconBox}>
          <Plane size={14} color="#334155" />
        </View>
        <View style={styles.flightInfo}>
          <Text style={styles.flightId}>{flightId}</Text>
          <Text style={styles.flightLabel}>MANUAL SEQ</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Waypoints</Text>
          <Text style={styles.statValue}>{path.length}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={styles.statusReady}>READY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
    padding: 8,
    marginBottom: 8,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    backgroundColor: '#cbd5e1',
    padding: 4,
    borderRadius: 2,
  },
  flightInfo: {
    gap: 2,
  },
  flightId: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0f172a',
  },
  flightLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statColumn: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statValue: {
    fontWeight: '700',
    color: '#1e293b',
  },
  divider: {
    height: 24,
    width: 1,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  statusReady: {
    fontWeight: '700',
    color: '#059669',
  },
});

export default FlightStrip;
