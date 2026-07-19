import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text as RNText, LogBox } from 'react-native';
import { Image } from 'expo-image';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Suppress the yellow warning banner in dev mode
LogBox.ignoreAllLogs(true);

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PreferencesProvider, usePreferences } from '@/context/PreferencesContext';
import { UserProvider } from '@/context/UserContext';

// We DO NOT call SplashScreen.preventAutoHideAsync() here because we want the native 
// pure black splash screen to hide immediately to reveal our custom JS loading screen.
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
  const [hasNavigated, setHasNavigated] = useState(false);
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
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError, authLoading, onboardingComplete]);

  // 4. Absolute fallback — 5 seconds and we force open regardless
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // 5. Determine the correct initial route synchronously
  //    This prevents the Stack from briefly rendering the wrong screen
  const initialRoute = session ? '(tabs)' : 'onboarding';

  // 6. Handle navigation after app is ready
  useEffect(() => {
    if (!isAppReady) return;

    const inAuthGroup = segments[0] === 'auth';
    const isAuthTransitionScreen = segments[0] === 'auth' && (segments[1] === 'signup-success' || segments[1] === 'login-welcome' || segments[1] === 'register');
    const inOnboarding = segments[0] === 'onboarding';

    // Already on the right screen family — mark navigated and do nothing
    if (session && (!inAuthGroup && !inOnboarding || isAuthTransitionScreen)) {
      setHasNavigated(true);
      return;
    }
    if (!session && inOnboarding) {
      setHasNavigated(true);
      return;
    }
    if (!session && inAuthGroup) {
      setHasNavigated(true);
      return;
    }

    if (!session) {
      router.replace('/onboarding' as any);
    } else if (session && (inAuthGroup && !isAuthTransitionScreen || inOnboarding)) {
      router.replace('/(tabs)' as any);
    }

    // Mark navigated after a short delay to let the navigation settle
    const navTimer = setTimeout(() => setHasNavigated(true), 100);
    return () => clearTimeout(navTimer);
  }, [isAppReady, session, onboardingComplete, segments, router]);

  // Show the custom loading screen until ready AND first navigation is settled
  if (!isAppReady || !hasNavigated) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Image
            source={require('@/assets/images/muscliknot-logo.png')}
            style={{ width: 140, height: 100, marginBottom: 16 }}
            contentFit="contain"
          />
          <RNText style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: 1 }}>
            MuscliKnot
          </RNText>
        </View>
        <View style={{ width: 200, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#f97316' }} />
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }} initialRouteName={initialRoute}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
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
          <Stack.Screen name="coach-chat" />
        </Stack>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
