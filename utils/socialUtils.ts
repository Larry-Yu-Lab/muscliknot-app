/**
 * Social Utilities
 *
 * Provides share link generation and native sharing for routines and squad invites.
 * Mock leaderboard data has been removed — see squadService.ts for real Supabase data.
 */

import { Exercise } from '@/data/exercises';
import { Share } from 'react-native';

// ─── Share Utilities ───────────────────────────────────────────────────────

/**
 * Generates a deep link encoding a routine for sharing.
 */
export function generateShareLink(
    exercises: Exercise[],
    muscleGroup: string,
    activityType: string
): string {
    // Create a compact representation
    const exerciseIds = exercises.map(e => e.id).join(',');
    const params = new URLSearchParams({
        m: muscleGroup,
        a: activityType,
        e: exerciseIds,
    });
    return `muscliknot://routine?${params.toString()}`;
}

/**
 * Opens the native share sheet with a routine link.
 */
export async function shareRoutine(
    exercises: Exercise[],
    muscleGroup: string,
    activityType: string,
    userName: string
): Promise<boolean> {
    const link = generateShareLink(exercises, muscleGroup, activityType);

    // Create a human-readable message
    const exerciseNames = exercises.slice(0, 3).map(e => e.title).join(', ');
    const more = exercises.length > 3 ? ` +${exercises.length - 3} more` : '';

    const message = `💪 ${userName} shared a ${activityType} routine for ${muscleGroup}!\n\nExercises: ${exerciseNames}${more}\n\nTry it in MuscliKnot: ${link}`;

    try {
        const result = await Share.share({
            message,
            title: `MuscliKnot ${activityType} Routine`,
        });

        return result.action === Share.sharedAction;
    } catch (error) {
        console.error('Share failed:', error);
        return false;
    }
}

/**
 * Generates an invite message for the squad.
 */
export async function shareSquadInvite(squadName: string, inviteCode: string): Promise<boolean> {
    const message = `🏋️ Join my Recovery Squad "${squadName}" on MuscliKnot!\n\nUse invite code: ${inviteCode}\n\nTrack your recovery streak and compete with friends!\n\nDownload MuscliKnot: https://muscliknot.app`;

    try {
        const result = await Share.share({
            message,
            title: `Join ${squadName} on MuscliKnot`,
        });
        return result.action === Share.sharedAction;
    } catch (error) {
        console.error('Share invite failed:', error);
        return false;
    }
}
