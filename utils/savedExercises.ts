import { supabase } from './supabase';

export interface SavedExercise {
    id: string;
    user_id: string;
    exercise_id: string;
    created_at: string;
}

export const fetchSavedExercises = async (userId: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase
            .from('user_saved_exercises')
            .select('exercise_id')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching saved exercises:', error);
            return [];
        }

        return data.map((item: any) => item.exercise_id);
    } catch (e) {
        console.error('Exception fetching saved exercises:', e);
        return [];
    }
};

export const saveExercise = async (userId: string, exerciseId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_saved_exercises')
            .insert({ user_id: userId, exercise_id: exerciseId });

        if (error) {
            console.error('Error saving exercise:', error);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Exception saving exercise:', e);
        return false;
    }
};

export const unsaveExercise = async (userId: string, exerciseId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('user_saved_exercises')
            .delete()
            .eq('user_id', userId)
            .eq('exercise_id', exerciseId);

        if (error) {
            console.error('Error unsaving exercise:', error);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Exception unsaving exercise:', e);
        return false;
    }
};
