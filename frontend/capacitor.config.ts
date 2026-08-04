import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.empresa.sistema',
  appName: 'Sistema',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
