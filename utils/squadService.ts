/**
 * Squad Service — Supabase-backed Recovery Squads
 *
 * Provides CRUD operations for creating, joining, leaving squads
 * and fetching real leaderboard data from the database.
 */

import { supabase } from './supabase';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Squad {
    id: string;
    name: string;
    invite_code: string;
    created_by: string | null;
    created_at: string;
    member_count?: number;
}

export interface SquadMember {
    id: string;
    user_id: string;
    name: string;
    avatar_url: string;
    streak_days: number;
    recovery_score: number;
    level: number;
    is_current_user: boolean;
    joined_at: string;
}

export interface SquadChallenge {
    id: string;
    squad_id: string;
    title: string;
    description: string | null;
    target_sessions: number;
    start_date: string;
    end_date: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Generates a random 6-character alphanumeric invite code */
function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0/O, 1/I/L)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/** Gets the current authenticated user ID or null */
async function getCurrentUserId(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
}

// ─── Squad CRUD ────────────────────────────────────────────────────────────

/**
 * Creates a new squad and adds the current user as the first member.
 * Returns the created squad or throws on error.
 */
export async function createSquad(name: string): Promise<Squad> {
    if (!supabase) throw new Error('Supabase not configured');

    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    // Generate a unique invite code (retry if collision)
    let inviteCode = generateInviteCode();
    let attempts = 0;
    while (attempts < 5) {
        const { data: existing } = await supabase
            .from('recovery_squads')
            .select('id')
            .eq('invite_code', inviteCode)
            .maybeSingle();

        if (!existing) break;
        inviteCode = generateInviteCode();
        attempts++;
    }

    // Create the squad
    const { data: squad, error: squadError } = await supabase
        .from('recovery_squads')
        .insert({
            name: name.trim(),
            invite_code: inviteCode,
            created_by: userId,
        })
        .select()
        .single();

    if (squadError) throw new Error(squadError.message);

    // Add creator as first member
    const { error: memberError } = await supabase
        .from('squad_members')
        .insert({
            squad_id: squad.id,
            user_id: userId,
        });

    if (memberError) {
        // Rollback squad creation
        await supabase.from('recovery_squads').delete().eq('id', squad.id);
        throw new Error(memberError.message);
    }

    return { ...squad, member_count: 1 };
}

/**
 * Joins an existing squad by invite code.
 * Returns the squad details or throws on error.
 */
export async function joinSquad(inviteCode: string): Promise<Squad> {
    if (!supabase) throw new Error('Supabase not configured');

    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    // Look up squad by invite code
    const { data: squad, error: lookupError } = await supabase
        .from('recovery_squads')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase().trim())
        .maybeSingle();

    if (lookupError) throw new Error(lookupError.message);
    if (!squad) throw new Error('No squad found with that invite code');

    // Check if already a member
    const { data: existing } = await supabase
        .from('squad_members')
        .select('id')
        .eq('squad_id', squad.id)
        .eq('user_id', userId)
        .maybeSingle();

    if (existing) throw new Error('You are already a member of this squad');

    // Join the squad
    const { error: joinError } = await supabase
        .from('squad_members')
        .insert({
            squad_id: squad.id,
            user_id: userId,
        });

    if (joinError) throw new Error(joinError.message);

    return squad;
}

/**
 * Leaves a squad. If the user is the creator and the last member, deletes the squad.
 */
export async function leaveSquad(squadId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Not authenticated');

    // Remove the user from the squad
    const { error } = await supabase
        .from('squad_members')
        .delete()
        .eq('squad_id', squadId)
        .eq('user_id', userId);

    if (error) throw new Error(error.message);

    // Check if squad is now empty and clean up
    const { count } = await supabase
        .from('squad_members')
        .select('id', { count: 'exact', head: true })
        .eq('squad_id', squadId);

    if (count === 0) {
        // Delete the orphaned squad
        await supabase.from('recovery_squads').delete().eq('id', squadId);
    }
}

/**
 * Fetches the user's current squad (the first one they belong to).
 * Returns null if the user is not in any squad.
 */
export async function getMySquad(): Promise<Squad | null> {
    if (!supabase) return null;

    const userId = await getCurrentUserId();
    if (!userId) return null;

    // Get the squad_id for the user
    const { data: membership, error: memError } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

    if (memError || !membership) return null;

    // Get the squad details
    const { data: squad, error: squadError } = await supabase
        .from('recovery_squads')
        .select('*')
        .eq('id', membership.squad_id)
        .single();

    if (squadError || !squad) return null;

    // Get member count
    const { count } = await supabase
        .from('squad_members')
        .select('id', { count: 'exact', head: true })
        .eq('squad_id', squad.id);

    return { ...squad, member_count: count ?? 1 };
}

/**
 * Fetches the full leaderboard for a squad, sorted by streak days descending.
 * Joins profiles and user_stats tables to get real data.
 */
export async function getLeaderboard(squadId: string): Promise<SquadMember[]> {
    if (!supabase) return [];

    const userId = await getCurrentUserId();

    // Fetch all members of this squad
    const { data: members, error } = await supabase
        .from('squad_members')
        .select('user_id, joined_at')
        .eq('squad_id', squadId);

    if (error || !members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);

    // Fetch profiles for all members
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

    // Fetch stats for all members
    const { data: stats } = await supabase
        .from('user_stats')
        .select('user_id, streak_days, recovery_score, level')
        .in('user_id', userIds);

    // Build the leaderboard
    const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));
    const statsMap = new Map((stats ?? []).map(s => [s.user_id, s]));
    const memberMap = new Map(members.map(m => [m.user_id, m]));

    const leaderboard: SquadMember[] = userIds.map(uid => {
        const profile = profileMap.get(uid);
        const stat = statsMap.get(uid);
        const member = memberMap.get(uid);
        const name = profile?.full_name || 'Unknown';

        return {
            id: uid,
            user_id: uid,
            name,
            avatar_url: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
            streak_days: stat?.streak_days ?? 0,
            recovery_score: stat?.recovery_score ?? 0,
            level: stat?.level ?? 1,
            is_current_user: uid === userId,
            joined_at: member?.joined_at ?? '',
        };
    });

    // Sort by streak descending
    leaderboard.sort((a, b) => b.streak_days - a.streak_days);

    return leaderboard;
}

/**
 * Gets the active challenge for a squad (current week).
 */
export async function getActiveChallenge(squadId: string): Promise<SquadChallenge | null> {
    if (!supabase) return null;

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('squad_challenges')
        .select('*')
        .eq('squad_id', squadId)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) return null;
    return data;
}
