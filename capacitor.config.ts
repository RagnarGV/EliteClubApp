import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';
import { Style } from '@capacitor/status-bar';
const config: CapacitorConfig = {
  appId: 'com.clubelite.app',
  appName: 'Club Elite',
  webDir: 'www',
  plugins: {
    StatusBar: {
      style: Style.Dark,
    },
    EdgeToEdge: {
      backgroundColor: '#1F1F1F',
    },
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 3000, // Show for 3 seconds
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
