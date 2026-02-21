import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const SAVED_KEY = 'muscliknot_saved_exercises';

// ─── AsyncStorage helpers ────────────────────────────────────────────────────

export const fetchSavedExercises = async (_userId?: string): Promise<string[]> => {
    try {
        const raw = await AsyncStorage.getItem(SAVED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('fetchSavedExercises error:', e);
        return [];
    }
};

export const saveExercise = async (_userId: string, exerciseId: string): Promise<boolean> => {
    try {
        const current = await fetchSavedExercises();
        if (!current.includes(exerciseId)) {
            const updated = [...current, exerciseId];
            await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));
        }

        // Best-effort Supabase sync
        try {
            const user = (await supabase?.auth.getUser())?.data?.user;
            if (user) {
                await supabase
                    ?.from('user_saved_exercises')
                    .upsert({ user_id: user.id, exercise_id: exerciseId });
            }
        } catch (_) { /* ignored */ }

        return true;
    } catch (e) {
        console.error('saveExercise error:', e);
        return false;
    }
};

export const unsaveExercise = async (_userId: string, exerciseId: string): Promise<boolean> => {
    try {
        const current = await fetchSavedExercises();
        const updated = current.filter(id => id !== exerciseId);
        await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(updated));

        // Best-effort Supabase sync
        try {
            const user = (await supabase?.auth.getUser())?.data?.user;
            if (user) {
                await supabase
                    ?.from('user_saved_exercises')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('exercise_id', exerciseId);
            }
        } catch (_) { /* ignored */ }

        return true;
    } catch (e) {
        console.error('unsaveExercise error:', e);
        return false;
    }
};
