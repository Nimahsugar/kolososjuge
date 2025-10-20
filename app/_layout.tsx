import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
    Inter_400Regular,
    Inter_500Medium,
} from '@expo-google-fonts/inter';
import {
    Manrope_600SemiBold,
    Manrope_700Bold,
} from '@expo-google-fonts/manrope';

import { Colors } from '@/constants/theme';
import { migrateTenants } from '@/utils/migrate-tenants';

// Keep the splash screen visible while we fetch fonts
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom light theme based on Rent Flow HQ design
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.secondary,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Run data migrations on app start
  useEffect(() => {
    const runMigrations = async () => {
      try {
        const result = await migrateTenants();
        if (result.migratedCount > 0) {
          console.log(`Migrated ${result.migratedCount} out of ${result.totalCount} tenants`);
        }
      } catch (error) {
        console.error('Error running migrations:', error);
      }
    };

    runMigrations();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={LightTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
