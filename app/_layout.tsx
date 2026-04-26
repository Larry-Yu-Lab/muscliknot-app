import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { UserProvider } from '@/context/UserContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
  // Track whether we had a session when the component first loaded (cold start)
  const [initialSessionChecked, setInitialSessionChecked] = useState(false);
  const [hadSessionOnMount, setHadSessionOnMount] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

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

  // Track whether session existed on first load (to distinguish cold-start vs fresh login)
  useEffect(() => {
    if (!isLoading && !initialSessionChecked) {
      setHadSessionOnMount(!!session);
      setInitialSessionChecked(true);
    }
  }, [isLoading, initialSessionChecked, session]);

  // Handle routing once navigation is ready
  useEffect(() => {
    if (isLoading || onboardingComplete === null || !isNavigationReady || !initialSessionChecked) return;

    // Check if app is fully ready
    if (!isAppReady) {
      setIsAppReady(true);
      SplashScreen.hideAsync();
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    // If not logged in and onboarding is not complete -> go to onboarding
    if (!session && !onboardingComplete && !inOnboarding && !inAuthGroup) {
      router.replace('/onboarding' as any);
      return;
    }

    // If not logged in and onboarding IS complete -> go to login
    if (!session && onboardingComplete && !inAuthGroup && !inOnboarding) {
      router.replace('/auth/login' as any);
      return;
    }

    // If logged in and in auth group:
    // - Allow login-welcome and signup-success screens (post-auth transition screens)
    // - Only redirect login/register → tabs if user had a session on cold start
    //   (meaning they're already logged in and somehow navigated to auth)
    // - Do NOT redirect if the session was just created (fresh login/signup),
    //   because the login/register screens handle their own navigation
    if (session && inAuthGroup) {
      const onTransitionScreen = segments[1] === 'login-welcome' || segments[1] === 'signup-success';
      if (onTransitionScreen) return; // Let them stay on welcome/success screen

      // Only force-redirect if user was already logged in before this app session
      // (i.e., they opened the app already logged in and somehow ended up on auth screens)
      if (hadSessionOnMount) {
        router.replace('/(tabs)' as any);
        return;
      }
      // Otherwise: fresh login just happened, let login.tsx/register.tsx handle navigation
    }
  }, [isLoading, onboardingComplete, session, isNavigationReady, initialSessionChecked, segments, isAppReady]);

  if (!isAppReady) {
    return null; // Keep native splash screen visible
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
