import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../data/exercises';

export interface HistoryItem {
    id: string;
    date: number; // timestamp
    muscleGroup: string;
    exercises: Exercise[];
}

const HISTORY_KEY = '@muscliknot_history';

export const saveToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    try {
        const existing = await getHistory();
        const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
        };
        const updated = [newItem, ...existing];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return newItem;
    } catch (e) {
        console.error('Failed to save history', e);
    }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const json = await AsyncStorage.getItem(HISTORY_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Failed to load history', e);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error(e);
    }
}
