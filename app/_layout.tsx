import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { UserProvider } from '@/context/UserContext';

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
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      const complete = await AsyncStorage.getItem('onboarding_complete');
      setOnboardingComplete(complete === 'true');
    };
    checkOnboarding();
  }, []);

  const onLayoutReady = useCallback(() => {
    setIsNavigationReady(true);
  }, []);

  // Handle routing once navigation is ready
  useEffect(() => {
    if (isLoading || onboardingComplete === null || !isNavigationReady) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    // If not logged in and onboarding is not complete -> go to onboarding
    if (!session && !onboardingComplete && !inOnboarding) {
      router.replace('/onboarding' as any);
      return;
    }

    // If not logged in and onboarding IS complete -> go to login
    if (!session && onboardingComplete && !inAuthGroup && !inOnboarding) {
      router.replace('/auth/login' as any);
      return;
    }

    // If logged in, block access to login/register routes by sending them to tabs
    if (session && inAuthGroup && segments[1] !== 'login-welcome' && segments[1] !== 'signup-success') {
      router.replace('/(tabs)' as any);
      return;
    }
  }, [isLoading, onboardingComplete, session, isNavigationReady, segments]);

  if (isLoading || onboardingComplete === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutReady}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/signup-success" />
          <Stack.Screen name="auth/login-welcome" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
          <Stack.Screen name="settings" options={{ presentation: 'card' }} />
          <Stack.Screen name="settings/equipment" options={{ presentation: 'card' }} />
          <Stack.Screen name="exercise/[id]" />
          <Stack.Screen name="analytics" />
          <Stack.Screen name="results" />
          <Stack.Screen name="privacy" />
        </Stack>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
