import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text as RNText } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { UserProvider } from '@/context/UserContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {});

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
  const { session, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Three pieces of state we need before we can route
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [progress, setProgress] = useState(0);

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
  });

  // 1. Load onboarding status once on mount (with timeout safety)
  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('AsyncStorage timed out — defaulting onboarding to false');
        setOnboardingComplete(false);
      }
    }, 3000);

    AsyncStorage.getItem('onboarding_complete')
      .then(val => {
        if (!cancelled) setOnboardingComplete(val === 'true');
      })
      .catch(() => {
        if (!cancelled) setOnboardingComplete(false);
      })
      .finally(() => clearTimeout(timeout));

    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  // 2. Animate the fake progress bar
  useEffect(() => {
    if (isAppReady) { setProgress(100); return; }
    const interval = setInterval(() => {
      setProgress(prev => prev >= 95 ? prev : prev + Math.floor(Math.random() * 5) + 2);
    }, 150);
    return () => clearInterval(interval);
  }, [isAppReady]);

  // 3. Mark app ready once ALL three conditions are satisfied
  //    fonts + auth + onboarding state — with a hard 5s safety ceiling
  useEffect(() => {
    const fontsReady = fontsLoaded || !!fontError;
    const authReady = !authLoading;
    const onboardingReady = onboardingComplete !== null;

    if (fontsReady && authReady && onboardingReady) {
      // Short cosmetic delay so the progress bar doesn't snap
      const timer = setTimeout(() => {
        setIsAppReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError, authLoading, onboardingComplete]);

  // 4. Absolute fallback — 5 seconds and we force open regardless
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 5. Handle navigation after app is ready
  useEffect(() => {
    if (!isAppReady) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    // Already on the right screen family — do nothing
    if (session && !inAuthGroup && !inOnboarding) return;
    if (!session && inOnboarding) return;
    if (!session && inAuthGroup) return;

    if (!session && !onboardingComplete) {
      router.replace('/onboarding' as any);
    } else if (!session && onboardingComplete) {
      router.replace('/auth/login' as any);
    } else if (session && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)' as any);
    }
  }, [isAppReady, session, onboardingComplete, segments, router]);

  // Show the custom loading screen until ready
  if (!isAppReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('@/assets/images/splash-logo.png')}
          style={{ width: 140, height: 140, marginBottom: 40 }}
          contentFit="contain"
        />
        <View style={{ width: 200, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#f97316' }} />
        </View>
        <RNText style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '700', marginTop: 12, letterSpacing: 1 }}>
          INITIALIZING... {progress}%
        </RNText>
      </View>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
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
          <Stack.Screen name="guided-session" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
          <Stack.Screen name="squads" />
        </Stack>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
