import React, { createContext, useContext, useState } from 'react';

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
    name: 'Alex Rivera',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNnzd-GV3B24Bcd6xHjlfFuasANL03ODkk-uPd2oMVJxTUGZ9UP425kJTEiSa54sI4kiDChYi_6GpkJMzmV3izbk6t50URWJE21zP0gZvRu_S8HMBYJBCb3U_7bXD7zGKsva8EppfGZqYDZjX4_txR-_COedD6zdQQzdy3HyR1ofKmgdwZ-fmRN5yohGUtr3UGE3cVqifwpGTOKYdJ1KD7FmKgHWgkFl3qu9qvMFiPEDFRAx9JTIcsRjcHGcwwV2ca8Z4sS-H4rZWc',
    status: 'DATA-DRIVEN ATHLETE',
    isPremium: true,
    stats: {
        workouts: 0, // This might be loaded from storage/history
        recoveryScore: 92,
        streakDays: 1,
    },
    attributes: {
        fitnessLevel: 'ADVANCED',
        level: 8,
        levelProgress: 78,
        injuryRecovery: 12, // +12%
    }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData>(defaultUser);

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
