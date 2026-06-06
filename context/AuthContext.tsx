import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    signInOffline: (email: string, fullName?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signOut: async () => { },
    signInOffline: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const localSessionStr = await AsyncStorage.getItem('app_offline_session');
                if (localSessionStr) {
                    const localSession = JSON.parse(localSessionStr);
                    setSession(localSession);
                    setUser(localSession.user);
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('Failed to load local session:', err);
            }

            if (!supabase) {
                console.warn('Supabase client not initialized. Authentication disabled.');
                setIsLoading(false);
                return;
            }

            supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
                AsyncStorage.getItem('app_offline_session').then((localSession) => {
                    if (!localSession) {
                        setSession(session);
                        setUser(session?.user ?? null);
                    }
                });
                setIsLoading(false);
            });

            return () => subscription.unsubscribe();
        };

        loadSession();
    }, []);

    const signInOffline = async (email: string, fullName?: string) => {
        const mockUser: User = {
            id: 'offline-user-' + Math.random().toString(36).substring(2, 11),
            email: email,
            user_metadata: {
                full_name: fullName || email.split('@')[0],
            },
            aud: 'authenticated',
            role: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: {},
            factors: [],
        } as any;

        const mockSession: Session = {
            access_token: 'offline-mock-access-token',
            refresh_token: 'offline-mock-refresh-token',
            expires_in: 3600 * 24 * 365,
            expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 365,
            token_type: 'bearer',
            user: mockUser,
        };

        try {
            await AsyncStorage.setItem('app_offline_session', JSON.stringify(mockSession));
            await AsyncStorage.setItem('onboarding_complete', 'true');
        } catch (err) {
            console.error('Failed to save offline session:', err);
        }

        setSession(mockSession);
        setUser(mockUser);
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('app_offline_session');
        } catch (err) {
            console.error('Failed to remove offline session:', err);
        }
        setSession(null);
        setUser(null);
        if (supabase) {
            await supabase.auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signOut, signInOffline }}>
            {children}
        </AuthContext.Provider>
    );
}
