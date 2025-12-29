// Wire Master - AdMob Banner Component
// Reusable banner ad component for monetization

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

// AdMob Banner Ad Unit IDs
// TODO: Replace with your actual AdMob IDs before production
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER // Test ID for development
  : Platform.select({
      ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your iOS banner ID
      android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android banner ID
    }) || TestIds.BANNER;

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom' }) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  return (
    <View style={[
      styles.container,
      position === 'top' ? styles.topPosition : styles.bottomPosition
    ]}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setIsAdLoaded(true);
          console.log('[AdBanner] Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdBanner] Failed to load banner ad:', error);
          setIsAdLoaded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  topPosition: {
    marginBottom: 8,
  },
  bottomPosition: {
    marginTop: 8,
  },
});
