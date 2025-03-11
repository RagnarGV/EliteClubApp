import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eliteclub.app',
  appName: 'EliteClubApp',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Show for 3 seconds
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  webDir: 'www',
};

export default config;
