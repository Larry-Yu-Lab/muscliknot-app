import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { UserProvider } from './context/UserContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PreferencesProvider>
        <UserProvider>
          <ThemedStack />
        </UserProvider>
      </PreferencesProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { theme } = usePreferences();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card', title: 'Settings' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
