import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

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
        if (authUser) {
            // Update user data from Supabase Auth metadata
            const meta = authUser.user_metadata;
            setUser(prev => ({
                ...prev,
                name: meta.full_name || 'User',
                avatarUrl: meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(meta.full_name || 'User')}&background=f97316&color=fff`,
                isPremium: true, // simplified for demo
            }));
        } else {
            // Reset to guest/default if logged out (though route protection should prevent this screen access)
            setUser(defaultUser);
        }
    }, [authUser]);

    const updateUser = (data: Partial<UserData>) => {
        setUser(prev => ({ ...prev, ...data }));
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
