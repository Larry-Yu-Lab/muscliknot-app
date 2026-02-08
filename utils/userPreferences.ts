import { supabase } from './supabase';

export interface UserPreferences {
    id?: string;
    user_id: string;
    lifestyle: 'sedentary' | 'active' | 'athlete' | null;
    primary_goal: 'relieve_pain' | 'improve_mobility' | 'daily_maintenance' | null;
    onboarding_completed: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Save or update user preferences in the database
 */
export async function saveUserPreferences(
    userId: string,
    preferences: Partial<Pick<UserPreferences, 'lifestyle' | 'primary_goal' | 'onboarding_completed'>>
): Promise<{ data: UserPreferences | null; error: Error | null }> {
    if (!supabase) {
        console.warn('Supabase not configured, preferences not saved to database');
        return { data: null, error: new Error('Supabase not configured') };
    }

    try {
        // Check if preferences exist for this user
        const { data: existing, error: fetchError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = no rows found, which is fine for new users
            console.error('Error fetching preferences:', fetchError);
            return { data: null, error: fetchError };
        }

        if (existing) {
            // Update existing preferences
            const { data, error } = await supabase
                .from('user_preferences')
                .update({
                    ...preferences,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating preferences:', error);
                return { data: null, error };
            }
            return { data, error: null };
        } else {
            // Insert new preferences
            const { data, error } = await supabase
                .from('user_preferences')
                .insert({
                    user_id: userId,
                    ...preferences,
                    onboarding_completed: preferences.onboarding_completed ?? false,
                })
                .select()
                .single();

            if (error) {
                console.error('Error inserting preferences:', error);
                return { data: null, error };
            }
            return { data, error: null };
        }
    } catch (error) {
        console.error('Exception saving preferences:', error);
        return { data: null, error: error as Error };
    }
}

/**
 * Get user preferences from the database
 */
export async function getUserPreferences(
    userId: string
): Promise<{ data: UserPreferences | null; error: Error | null }> {
    if (!supabase) {
        return { data: null, error: new Error('Supabase not configured') };
    }

    try {
        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching preferences:', error);
            return { data: null, error };
        }

        return { data: data || null, error: null };
    } catch (error) {
        console.error('Exception fetching preferences:', error);
        return { data: null, error: error as Error };
    }
}

/**
 * Update user's lifestyle preference
 */
export async function updateLifestyle(
    userId: string,
    lifestyle: UserPreferences['lifestyle']
): Promise<{ success: boolean; error: Error | null }> {
    const result = await saveUserPreferences(userId, { lifestyle });
    return { success: result.data !== null, error: result.error };
}

/**
 * Update user's primary goal
 */
export async function updatePrimaryGoal(
    userId: string,
    primaryGoal: UserPreferences['primary_goal']
): Promise<{ success: boolean; error: Error | null }> {
    const result = await saveUserPreferences(userId, { primary_goal: primaryGoal });
    return { success: result.data !== null, error: result.error };
}

/**
 * Mark onboarding as completed and save final preferences
 */
export async function completeOnboarding(
    userId: string,
    lifestyle: UserPreferences['lifestyle'],
    primaryGoal: UserPreferences['primary_goal']
): Promise<{ success: boolean; error: Error | null }> {
    const result = await saveUserPreferences(userId, {
        lifestyle,
        primary_goal: primaryGoal,
        onboarding_completed: true,
    });
    return { success: result.data !== null, error: result.error };
}
