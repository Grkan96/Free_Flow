# AdMob Setup Guide

This app now includes Google AdMob banner ads on the following screens:
- Main Menu (bottom)
- Level Complete Modal (bottom)
- Game Screen (bottom)

## Current Configuration

### Test Mode
The app is currently configured to use **Google's test ad units** during development. This is safe and allows you to see how ads will appear without violating AdMob policies.

### Before Publishing to Production

1. **Create an AdMob Account**
   - Go to https://admob.google.com
   - Create an account and register your app
   - Get your App ID and Banner Ad Unit IDs

2. **Update AdBanner Component**
   Edit `components/AdBanner.tsx` and replace the placeholder IDs:
   ```typescript
   const BANNER_AD_UNIT_ID = __DEV__
     ? TestIds.BANNER // Keep test ID for development
     : Platform.select({
         ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your iOS banner ID
         android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Replace with your Android banner ID
       }) || TestIds.BANNER;
   ```

3. **Update app.json**
   Add your AdMob App IDs to `app.json`:
   ```json
   {
     "expo": {
       "ios": {
         "config": {
           "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
         }
       },
       "android": {
         "config": {
           "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
         }
       }
     }
   }
   ```

4. **Rebuild the App**
   After changing ad IDs, rebuild your app:
   ```bash
   npx expo prebuild
   npx expo run:android
   # or
   npx expo run:ios
   ```

## Testing

The app will show test ads during development. You should see banner ads at the bottom of:
- Main menu screen
- Level complete modal
- Game screen

## Banner Positioning

Banners are positioned at the bottom of each screen using the `AdBanner` component with `position="bottom"`. You can adjust the positioning by modifying the styles in `components/AdBanner.tsx`.

## Removing Ads

If you decide to remove ads from any screen:
1. Open the screen component (e.g., `MainMenu.tsx`, `LevelCompleteModal.tsx`, or `App.tsx`)
2. Remove the `<AdBanner position="bottom" />` component
3. Remove the import: `import { AdBanner } from './AdBanner';`

## Documentation

For more information about Google Mobile Ads with Expo:
- https://docs.expo.dev/versions/latest/sdk/admob/
- https://developers.google.com/admob
