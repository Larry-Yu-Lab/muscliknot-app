/**
 * Social Utilities
 * 
 * Provides share link generation, native sharing,
 * and mock leaderboard data for Recovery Squads.
 */

import { Exercise } from '@/data/exercises';
import { Share, Platform } from 'react-native';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SquadMember {
    id: string;
    name: string;
    avatarUrl: string;
    streakDays: number;
    recoveryScore: number;
    level: number;
    isCurrentUser?: boolean;
}

export interface Squad {
    id: string;
    name: string;
    memberCount: number;
    inviteCode: string;
}

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

// ─── Mock Leaderboard Data ─────────────────────────────────────────────────

/**
 * Returns mock squad leaderboard data.
 * In a full implementation, this would query the Supabase
 * recovery_squads + squad_members + user_stats tables.
 */
export function getMockLeaderboard(currentUserName: string, currentUserStats: {
    streakDays: number;
    recoveryScore: number;
    level: number;
}): SquadMember[] {
    const members: SquadMember[] = [
        {
            id: 'current',
            name: currentUserName,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=f97316&color=fff`,
            streakDays: currentUserStats.streakDays,
            recoveryScore: currentUserStats.recoveryScore,
            level: currentUserStats.level,
            isCurrentUser: true,
        },
        {
            id: 'mock-1',
            name: 'Sarah K.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+K&background=8b5cf6&color=fff',
            streakDays: 12,
            recoveryScore: 88,
            level: 6,
        },
        {
            id: 'mock-2',
            name: 'James L.',
            avatarUrl: 'https://ui-avatars.com/api/?name=James+L&background=3b82f6&color=fff',
            streakDays: 7,
            recoveryScore: 76,
            level: 4,
        },
        {
            id: 'mock-3',
            name: 'Maria G.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Maria+G&background=22c55e&color=fff',
            streakDays: 5,
            recoveryScore: 82,
            level: 5,
        },
        {
            id: 'mock-4',
            name: 'Alex W.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Alex+W&background=ef4444&color=fff',
            streakDays: 3,
            recoveryScore: 64,
            level: 3,
        },
    ];

    // Sort by streak descending
    return members.sort((a, b) => b.streakDays - a.streakDays);
}

/**
 * Returns a mock squad for display.
 */
export function getMockSquad(): Squad {
    return {
        id: 'mock-squad',
        name: 'Recovery Warriors',
        memberCount: 5,
        inviteCode: 'RECOVER2026',
    };
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
