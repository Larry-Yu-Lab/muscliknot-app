import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Basic validation to prevent crashing on placeholder values or empty strings
const isConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 0;

if (!isConfigured && __DEV__) {
    console.warn('Supabase is not configured. Update your .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

// Custom storage adapter to handle SSR/Node environments
const ExpoStorage = {
    getItem: (key: string) => {
        if (typeof window !== 'undefined') {
            return AsyncStorage.getItem(key);
        }
        return Promise.resolve(null);
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
            return AsyncStorage.setItem(key, value);
        }
        return Promise.resolve();
    },
    removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
            return AsyncStorage.removeItem(key);
        }
        return Promise.resolve();
    },
};

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: ExpoStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    })
    : null as any;

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
if (typeof AppState !== 'undefined') {
    AppState.addEventListener('change', (state) => {
        if (state === 'active' && supabase) {
            supabase.auth.startAutoRefresh();
        } else if (supabase) {
            supabase.auth.stopAutoRefresh();
        }
    });
}
