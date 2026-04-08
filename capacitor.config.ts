import type { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: 'com.jergasus.ascend',
  appName: 'Ascend',
  webDir: 'out',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://ascend-github.vercel.app',
    cleartext: true,
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: process.env.GOOGLE_CLIENT_ID || '',
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || '',
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || '',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
