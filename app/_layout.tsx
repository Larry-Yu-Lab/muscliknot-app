import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { UserProvider } from '@/context/UserContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <PreferencesProvider>
            <RootLayoutNav />
          </PreferencesProvider>
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { theme } = usePreferences();
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [initialRouteHandled, setInitialRouteHandled] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      const complete = await AsyncStorage.getItem('onboarding_complete');
      setOnboardingComplete(complete === 'true');
    };
    checkOnboarding();
  }, []);

  // Handle initial routing only once
  useEffect(() => {
    if (isLoading || onboardingComplete === null || initialRouteHandled) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    // If onboarding not complete, redirect to onboarding
    if (!onboardingComplete && !inOnboarding) {
      setInitialRouteHandled(true);
      router.replace('/onboarding/welcome' as any);
      return;
    }

    // If onboarding complete but not logged in
    if (onboardingComplete && !session && !inAuthGroup) {
      setInitialRouteHandled(true);
      router.replace('/auth/login' as any);
      return;
    }

    // If logged in, go to tabs
    if (session) {
      setInitialRouteHandled(true);
      router.replace('/(tabs)' as any);
      return;
    }

    // Mark as handled if we're already in correct location
    setInitialRouteHandled(true);
  }, [isLoading, onboardingComplete, session]);


  if (isLoading || onboardingComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

