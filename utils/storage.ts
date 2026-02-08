import { Exercise } from '@/data/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export interface HistoryItem {
    id: string;
    date: number; // timestamp
    muscleGroup: string;
    exercises: Exercise[];
}

const HISTORY_KEY = '@muscliknot_history';

export const saveToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    try {
        const timestamp = Date.now();
        const newItem: HistoryItem = {
            ...item,
            id: timestamp.toString(),
            date: timestamp,
        };

        // 1. Save to Supabase if logged in
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { error } = await supabase.from('user_history').insert({
                    user_id: session.user.id,
                    date: timestamp,
                    muscle_group: item.muscleGroup,
                    exercises: item.exercises,
                });

                if (error) {
                    console.error('Failed to save to Supabase:', error);
                }
            }
        }

        // 2. Always save to Local Storage (Offline/Cache)
        const existing = await getLocalHistory();
        const updated = [newItem, ...existing];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

        return newItem;
    } catch (e) {
        console.error('Failed to save history', e);
        throw e;
    }
};

// Helper for local storage only
const getLocalHistory = async (): Promise<HistoryItem[]> => {
    try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
}

export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        // 1. Try to fetch from Supabase if logged in
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data, error } = await supabase
                    .from('user_history')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('date', { ascending: false });

                if (!error && data) {
                    // Map Supabase format to App format
                    const cloudHistory: HistoryItem[] = data.map((row: any) => ({
                        id: row.id,
                        date: Number(row.date),
                        muscleGroup: row.muscle_group,
                        exercises: row.exercises,
                    }));

                    // Sync to local storage for offline use next time
                    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(cloudHistory));
                    return cloudHistory;
                }
            }
        }

        // 2. Fallback to Local Storage
        return await getLocalHistory();
    } catch (e) {
        console.error('Failed to load history', e);
        return await getLocalHistory();
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
        // We generally don't delete from server unless explicitly requested
    } catch (e) {
        console.error(e);
    }
}
