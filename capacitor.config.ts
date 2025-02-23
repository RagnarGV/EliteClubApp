import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'EliteClubApp',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['phone'],
    },
  },
  webDir: 'www',
};

export default config;
