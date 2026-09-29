import { supabase } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { configurePurchases, checkPremiumStatus, logoutPurchases } from '@/utils/purchases';

// Define the shape of the user data
export interface UserData {
    name: string;
    avatarUrl: string;
    status: string; // e.g. "DATA-DRIVEN ATHLETE"
    isPremium: boolean;
    stats: {
        workouts: number;
        recoveryScore: number;
        streakDays: number;
    };
    attributes: {
        fitnessLevel: string; // e.g. "ADVANCED"
        level: number; // e.g. 8
        levelProgress: number; // 0-100
        injuryRecovery: number; // 0-100 (graph data simulation)
    }
}

interface UserContextType {
    user: UserData;
    updateUser: (data: Partial<UserData>) => void;
}

const defaultUser: UserData = {
    name: 'Guest User',
    avatarUrl: 'https://ui-avatars.com/api/?name=Guest+User&background=random',
    status: 'DATA-DRIVEN ATHLETE',
    isPremium: false,
    stats: {
        workouts: 0,
        recoveryScore: 92,
        streakDays: 1,
    },
    attributes: {
        fitnessLevel: 'ADVANCED',
        level: 8,
        levelProgress: 78,
        injuryRecovery: 12,
    }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<UserData>(defaultUser);

    useEffect(() => {
        let mounted = true;

        const fetchUserStats = async () => {
            if (authUser) {
                try {
                    // Initialize RevenueCat for the logged in user and check premium entitlement
                    await configurePurchases(authUser.id);
                    const rcPremium = await checkPremiumStatus();

                    // 1. Fetch Stats from Supabase
                    const { data: statsData, error } = await supabase
                        .from('user_stats')
                        .select('*')
                        .eq('user_id', authUser.id)
                        .single();

                    if (mounted) {
                        const meta = authUser.user_metadata;

                        // Use fetched stats or fallback to defaults if strictly necessary (though trigger should create them)
                        const stats = statsData ? {
                            workouts: statsData.workouts ?? 0,
                            recoveryScore: statsData.recovery_score ?? 92,
                            streakDays: statsData.streak_days ?? 1,
                        } : defaultUser.stats;

                        const attributes = statsData ? {
                            fitnessLevel: statsData.fitness_level ?? 'BEGINNER',
                            level: statsData.level ?? 1,
                            levelProgress: statsData.level_progress ?? 0,
                            injuryRecovery: statsData.injury_recovery ?? 0,
                        } : defaultUser.attributes;

                        const isPremiumActive = statsData ? (statsData.is_premium ?? false) : rcPremium;

                        setUser({
                            name: meta.full_name || 'User',
                            avatarUrl: meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(meta.full_name || 'User')}&background=f97316&color=fff`,
                            status: 'DATA-DRIVEN ATHLETE', // could also be DB field
                            isPremium: isPremiumActive,
                            stats,
                            attributes,
                        });
                    }
                } catch (e) {
                    console.error('Error fetching user stats:', e);
                    // Fallback to basic auth info but check local referral status for premium flag
                    if (mounted) {
                        const meta = authUser.user_metadata;
                        
                        // Check if premium referral code was entered offline
                        AsyncStorage.getItem('user_referral_code').then((refCode) => {
                            const validCodes = ['GIFT2026', 'COACH100', 'KNOTFREE', 'VIPRECOVERY', 'FREEKNOT'];
                            const isOfflinePremium = !!(refCode && validCodes.includes(refCode.trim().toUpperCase()));
                            
                            if (mounted) {
                                setUser(prev => ({
                                    ...prev,
                                    name: meta.full_name || 'User',
                                    avatarUrl: meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(meta.full_name || 'User')}&background=f97316&color=fff`,
                                    isPremium: isOfflinePremium,
                                }));
                            }
                        }).catch((err) => {
                            console.log('Error reading local referral code offline:', err);
                            if (mounted) {
                                setUser(prev => ({
                                    ...prev,
                                    name: meta.full_name || 'User',
                                    avatarUrl: meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(meta.full_name || 'User')}&background=f97316&color=fff`,
                                }));
                            }
                        });
                    }
                }
            } else {
                logoutPurchases();
                if (mounted) {
                    setUser(defaultUser);
                }
            }
        };

        fetchUserStats();

        return () => { mounted = false; };
    }, [authUser]);

    const updateUser = async (data: Partial<UserData>) => {
        // Optimistic update
        setUser(prev => ({ ...prev, ...data }));

        // Write to Supabase if logged in
        if (authUser) {
            try {
                const updates: any = {};
                if (data.isPremium !== undefined) {
                    updates.is_premium = data.isPremium;
                    await supabase
                        .from('profiles')
                        .update({ is_premium: data.isPremium })
                        .eq('id', authUser.id);

                    if (!data.isPremium) {
                        await AsyncStorage.removeItem('user_referral_code');
                    }
                }
                if (data.stats) {
                    updates.workouts = data.stats.workouts;
                    updates.recovery_score = data.stats.recoveryScore;
                    updates.streak_days = data.stats.streakDays;
                }
                if (data.attributes) {
                    updates.fitness_level = data.attributes.fitnessLevel;
                    updates.level = data.attributes.level;
                    updates.level_progress = data.attributes.levelProgress;
                    updates.injury_recovery = data.attributes.injuryRecovery;
                }

                if (Object.keys(updates).length > 0) {
                    updates.updated_at = new Date().toISOString();
                    const { error } = await supabase
                        .from('user_stats')
                        .update(updates)
                        .eq('user_id', authUser.id);

                    if (error) throw error;
                }
            } catch (err) {
                console.error('Failed to sync user stats:', err);
                // In a real app, might want to revert optimistic update or show error
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
