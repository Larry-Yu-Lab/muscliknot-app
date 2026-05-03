/**
 * Recovery Roadmap Engine
 * 
 * Analyzes the user's pain history over the last 14 days to generate
 * a phased recovery plan (Acute → Mobility → Strengthening → Maintenance).
 * 
 * This is a local, deterministic engine — no API keys required.
 */

import { HistoryItem } from './storage';

// ─── Types ─────────────────────────────────────────────────────────────────

export type RecoveryPhase = 'acute' | 'mobility' | 'strengthening' | 'maintenance';
export type PainTrend = 'improving' | 'stable' | 'worsening';

export interface RecoveryRoadmap {
    /** The muscle group being recovered */
    targetMuscle: string;
    /** Current phase of recovery */
    currentPhase: RecoveryPhase;
    /** How many days into this recovery journey */
    dayNumber: number;
    /** Suggested activity type for today */
    suggestedActivityType: string;
    /** i18n key for the coaching message */
    coachMessage: string;
    /** Parameters for the coaching message (for interpolation) */
    coachParams: Record<string, string | number>;
    /** Whether pain is improving, stable, or worsening */
    painTrend: PainTrend;
    /** Average pain level in the analysis window */
    avgPainLevel: number;
    /** The difficulty filter to apply */
    difficultyFilter: string[];
    /** Accent color for the phase badge */
    phaseColor: string;
    /** Icon name for the phase */
    phaseIcon: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const ANALYSIS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const RECENT_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;   // 2 days

const PHASE_COLORS: Record<RecoveryPhase, string> = {
    acute: '#ef4444',        // Red
    mobility: '#f97316',     // Orange
    strengthening: '#22c55e', // Green
    maintenance: '#3b82f6',   // Blue
};

const PHASE_ICONS: Record<RecoveryPhase, string> = {
    acute: 'medkit-outline',
    mobility: 'body-outline',
    strengthening: 'fitness-outline',
    maintenance: 'shield-checkmark-outline',
};

const PHASE_ACTIVITY_MAP: Record<RecoveryPhase, string> = {
    acute: 'relief',
    mobility: 'yoga',
    strengthening: 'strength',
    maintenance: 'warmup',
};

const PHASE_DIFFICULTY_MAP: Record<RecoveryPhase, string[]> = {
    acute: ['beginner'],
    mobility: ['beginner', 'intermediate'],
    strengthening: ['beginner', 'intermediate', 'advanced'],
    maintenance: ['beginner', 'intermediate', 'advanced'],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function calculatePainTrend(painLevels: { date: number; level: number }[]): PainTrend {
    if (painLevels.length < 2) return 'stable';

    // Compare first half to second half average
    const mid = Math.floor(painLevels.length / 2);
    const firstHalf = painLevels.slice(0, mid);
    const secondHalf = painLevels.slice(mid);

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.level, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.level, 0) / secondHalf.length;

    const diff = firstAvg - secondAvg;
    if (diff > 1) return 'improving';
    if (diff < -1) return 'worsening';
    return 'stable';
}

function determinePhase(
    avgPainLevel: number,
    daysSinceFirstSession: number,
    painTrend: PainTrend,
    recentHighPain: boolean
): RecoveryPhase {
    // High pain recently → acute
    if (recentHighPain || avgPainLevel >= 6) return 'acute';

    // Moderate pain or worsening → mobility
    if (avgPainLevel >= 3 || painTrend === 'worsening') return 'mobility';

    // Low pain, improving, and enough sessions → strengthening
    if (avgPainLevel >= 1 && daysSinceFirstSession >= 3) return 'strengthening';

    // Very low pain, stable/improving, been at it for a while → maintenance
    return 'maintenance';
}

function getCoachMessageKey(phase: RecoveryPhase, painTrend: PainTrend): string {
    if (phase === 'acute' && painTrend === 'worsening') return 'coach_acute_worsening';
    if (phase === 'acute') return 'coach_acute';
    if (phase === 'mobility' && painTrend === 'improving') return 'coach_mobility_improving';
    if (phase === 'mobility') return 'coach_mobility';
    if (phase === 'strengthening') return 'coach_strengthening';
    return 'coach_maintenance';
}

// ─── Main Engine ───────────────────────────────────────────────────────────

/**
 * Analyzes the user's history and generates a recovery roadmap
 * for the most frequently targeted muscle with pain data.
 */
export function generateRoadmap(history: HistoryItem[]): RecoveryRoadmap | null {
    const now = Date.now();
    const cutoff = now - ANALYSIS_WINDOW_MS;
    const recentCutoff = now - RECENT_WINDOW_MS;

    // Filter to sessions within the analysis window that have pain data
    const relevantSessions = history.filter(
        h => h.date >= cutoff && h.assessment?.painLevel !== undefined
    );

    if (relevantSessions.length < 2) return null;

    // Group by muscle and find the one with the most sessions
    const muscleGroups: Record<string, HistoryItem[]> = {};
    relevantSessions.forEach(session => {
        const muscle = session.muscleGroup;
        if (!muscleGroups[muscle]) muscleGroups[muscle] = [];
        muscleGroups[muscle].push(session);
    });

    // Find muscle with most sessions (the one needing a roadmap)
    let targetMuscle = '';
    let maxSessions = 0;
    Object.entries(muscleGroups).forEach(([muscle, sessions]) => {
        if (sessions.length > maxSessions) {
            maxSessions = sessions.length;
            targetMuscle = muscle;
        }
    });

    if (!targetMuscle || maxSessions < 2) return null;

    const muscleSessions = muscleGroups[targetMuscle].sort((a, b) => a.date - b.date);

    // Calculate pain metrics
    const painLevels = muscleSessions.map(s => ({
        date: s.date,
        level: s.assessment!.painLevel!,
    }));

    const avgPainLevel = painLevels.reduce((sum, p) => sum + p.level, 0) / painLevels.length;
    const painTrend = calculatePainTrend(painLevels);

    // Check for recent high pain (≥ 6 in last 2 days)
    const recentHighPain = painLevels.some(
        p => p.date >= recentCutoff && p.level >= 6
    );

    // Calculate day number (from first session in window)
    const firstSessionDate = muscleSessions[0].date;
    const dayNumber = Math.max(1, Math.ceil((now - firstSessionDate) / (24 * 60 * 60 * 1000)));

    // Determine phase
    const daysSinceFirst = dayNumber;
    const currentPhase = determinePhase(avgPainLevel, daysSinceFirst, painTrend, recentHighPain);

    // Build roadmap
    const coachMessage = getCoachMessageKey(currentPhase, painTrend);

    return {
        targetMuscle,
        currentPhase,
        dayNumber,
        suggestedActivityType: PHASE_ACTIVITY_MAP[currentPhase],
        coachMessage,
        coachParams: {
            muscle: targetMuscle,
            day: dayNumber,
            phase: currentPhase,
            pain: Math.round(avgPainLevel * 10) / 10,
        },
        painTrend,
        avgPainLevel: Math.round(avgPainLevel * 10) / 10,
        difficultyFilter: PHASE_DIFFICULTY_MAP[currentPhase],
        phaseColor: PHASE_COLORS[currentPhase],
        phaseIcon: PHASE_ICONS[currentPhase],
    };
}

/**
 * Returns a human-readable phase label key for i18n.
 */
export function phaseLabelKey(phase: RecoveryPhase): string {
    switch (phase) {
        case 'acute': return 'phaseAcute';
        case 'mobility': return 'phaseMobility';
        case 'strengthening': return 'phaseStrengthening';
        case 'maintenance': return 'phaseMaintenance';
    }
}
