/**
 * Recovery Roadmap Engine
 * 
 * Analyzes the user's pain history over the last 14 days to generate
 * a phased recovery plan (Acute → Mobility → Strengthening → Maintenance).
 * 
 * This is a local, deterministic engine — no API keys required.
 */

import { EXERCISES } from '@/data/exercises';
import { HistoryItem } from './storage';

// ─── Types ─────────────────────────────────────────────────────────────────

export type RecoveryPhase = 'acute' | 'mobility' | 'strengthening' | 'maintenance';
export type PainTrend = 'improving' | 'stable' | 'worsening';

export interface WeeklyProgress {
    sessionsThisWeek: number;
    sessionsLastWeek: number;
    painChangePercent: number;
    musclesWorked: string[];
}

export interface Milestone {
    id: string;
    labelKey: string;
    icon: string;
    achieved: boolean;
}

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
    /** Weekly progress metrics */
    weeklyProgress: WeeklyProgress;
    /** Recovery milestones */
    milestones: Milestone[];
    /** Pre-selected exercise IDs for today's plan */
    suggestedExerciseIds: string[];
    /** Total number of sessions in the analysis window */
    totalSessions: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const ANALYSIS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const RECENT_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;   // 2 days
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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

const PHASE_CATEGORY_MAP: Record<RecoveryPhase, string> = {
    acute: 'Relief',
    mobility: 'Yoga',
    strengthening: 'Strength',
    maintenance: 'Warm-ups',
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function calculatePainTrend(painLevels: { date: number; level: number }[]): PainTrend {
    if (painLevels.length < 2) return 'stable';

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
    if (recentHighPain || avgPainLevel >= 6) return 'acute';
    if (avgPainLevel >= 3 || painTrend === 'worsening') return 'mobility';
    if (avgPainLevel >= 1 && daysSinceFirstSession >= 3) return 'strengthening';
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

function computeWeeklyProgress(history: HistoryItem[]): WeeklyProgress {
    const now = Date.now();
    const thisWeekCutoff = now - ONE_WEEK_MS;
    const lastWeekCutoff = now - 2 * ONE_WEEK_MS;

    const thisWeekSessions = history.filter(h => h.date >= thisWeekCutoff);
    const lastWeekSessions = history.filter(h => h.date >= lastWeekCutoff && h.date < thisWeekCutoff);

    const thisWeekPain = thisWeekSessions
        .filter(h => h.assessment?.painLevel !== undefined)
        .map(h => h.assessment!.painLevel!);
    const lastWeekPain = lastWeekSessions
        .filter(h => h.assessment?.painLevel !== undefined)
        .map(h => h.assessment!.painLevel!);

    const thisWeekAvg = thisWeekPain.length > 0
        ? thisWeekPain.reduce((a, b) => a + b, 0) / thisWeekPain.length : 0;
    const lastWeekAvg = lastWeekPain.length > 0
        ? lastWeekPain.reduce((a, b) => a + b, 0) / lastWeekPain.length : 0;

    let painChangePercent = 0;
    if (lastWeekAvg > 0) {
        painChangePercent = Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100);
    }

    const musclesWorked = Array.from(new Set(
        thisWeekSessions.map(h => h.muscleGroup).filter(Boolean)
    ));

    return {
        sessionsThisWeek: thisWeekSessions.length,
        sessionsLastWeek: lastWeekSessions.length,
        painChangePercent,
        musclesWorked,
    };
}

function computeMilestones(history: HistoryItem[], dayNumber: number, painTrend: PainTrend, avgPain: number): Milestone[] {
    const totalSessions = history.filter(h => h.assessment?.painLevel !== undefined).length;
    const now = Date.now();
    const oneWeekAgo = now - ONE_WEEK_MS;
    const thisWeekSessions = history.filter(h => h.date >= oneWeekAgo).length;

    return [
        {
            id: 'first_session',
            labelKey: 'milestoneFirstSession',
            icon: '🎯',
            achieved: totalSessions >= 1,
        },
        {
            id: 'three_sessions',
            labelKey: 'milestoneThreeSessions',
            icon: '💪',
            achieved: totalSessions >= 3,
        },
        {
            id: 'week_streak',
            labelKey: 'milestoneWeekStreak',
            icon: '🔥',
            achieved: thisWeekSessions >= 5,
        },
        {
            id: 'pain_improving',
            labelKey: 'milestonePainImproving',
            icon: '📉',
            achieved: painTrend === 'improving',
        },
        {
            id: 'ten_sessions',
            labelKey: 'milestoneTenSessions',
            icon: '🏆',
            achieved: totalSessions >= 10,
        },
        {
            id: 'low_pain',
            labelKey: 'milestoneLowPain',
            icon: '🌟',
            achieved: avgPain < 3 && totalSessions >= 3,
        },
    ];
}

/**
 * Selects exercises for today's plan based on the recovery phase and target muscle.
 */
function selectDailyExercises(targetMuscle: string, phase: RecoveryPhase): string[] {
    const category = PHASE_CATEGORY_MAP[phase];

    const muscleMap: Record<string, string> = {
        'neck': 'Neck', 'Neck': 'Neck',
        'shoulders': 'Shoulders', 'Shoulders': 'Shoulders',
        'upper_back': 'Upper Back', 'Upper Back': 'Upper Back',
        'lower_back': 'Lower Back', 'Lower Back': 'Lower Back',
        'glutes': 'Glutes', 'Glutes': 'Glutes',
        'legs': 'Legs', 'Legs': 'Legs',
        'hips': 'Hips', 'Hips': 'Hips',
        'abdomen': 'Abdomen', 'Abdomen': 'Abdomen',
        'calves': 'Calves', 'Calves': 'Calves',
        'feet': 'Feet', 'Feet': 'Feet',
    };

    const muscleGroup = muscleMap[targetMuscle] || targetMuscle;

    let candidates = EXERCISES.filter(
        e => e.muscleGroup === muscleGroup && e.category === category
    );

    if (candidates.length < 2) {
        candidates = EXERCISES.filter(e => e.muscleGroup === muscleGroup);
    }

    if (candidates.length < 2) {
        candidates = EXERCISES.filter(e => e.category === category);
    }

    return candidates.slice(0, 4).map(e => e.id);
}

// ─── Main Engine ───────────────────────────────────────────────────────────

/**
 * Analyzes the user's history and generates a recovery roadmap
 * for the most frequently targeted muscle with pain data.
 */
export function generateRoadmap(history: HistoryItem[]): RecoveryRoadmap | null {
    if (!history || history.length === 0) return null;

    const now = Date.now();
    const cutoff = now - ANALYSIS_WINDOW_MS;
    const recentCutoff = now - RECENT_WINDOW_MS;

    // Filter relevant sessions in 14-day window; fallback to all history if window is empty
    let relevantSessions = history.filter(h => h.date >= cutoff);
    if (relevantSessions.length === 0) {
        relevantSessions = [...history];
    }

    // Group sessions by target muscle group
    const muscleGroups: Record<string, HistoryItem[]> = {};
    relevantSessions.forEach(session => {
        const muscle = session.muscleGroup || 'Neck';
        if (!muscleGroups[muscle]) muscleGroups[muscle] = [];
        muscleGroups[muscle].push(session);
    });

    // Pick muscle group with highest session count, defaulting to most recent session
    let targetMuscle = '';
    let maxSessions = 0;
    Object.entries(muscleGroups).forEach(([muscle, sessions]) => {
        if (sessions.length >= maxSessions) {
            maxSessions = sessions.length;
            targetMuscle = muscle;
        }
    });

    if (!targetMuscle && history.length > 0) {
        targetMuscle = history[history.length - 1].muscleGroup || 'Neck';
    }

    if (!targetMuscle) return null;

    const muscleSessions = (muscleGroups[targetMuscle] || [history[history.length - 1]]).sort((a, b) => a.date - b.date);

    const painRecords = muscleSessions
        .filter(s => typeof s.assessment?.painLevel === 'number')
        .map(s => ({ date: s.date, level: s.assessment!.painLevel! }));

    const painValues = painRecords.map(p => p.level);
    const avgPainLevel = painValues.length > 0
        ? painValues.reduce((sum, p) => sum + p, 0) / painValues.length
        : 4.0;

    const painTrend = calculatePainTrend(painRecords);
    const recentHighPain = painRecords.some(p => p.date >= recentCutoff && p.level >= 6);

    const firstSessionDate = muscleSessions[0].date;
    const dayNumber = Math.max(1, Math.ceil((now - firstSessionDate) / (24 * 60 * 60 * 1000)));

    const daysSinceFirst = dayNumber;
    const currentPhase = determinePhase(avgPainLevel, daysSinceFirst, painTrend, recentHighPain);

    const coachMessage = getCoachMessageKey(currentPhase, painTrend);
    const weeklyProgress = computeWeeklyProgress(history);
    const roundedAvg = Math.round(avgPainLevel * 10) / 10;
    const milestones = computeMilestones(history, dayNumber, painTrend, roundedAvg);
    const suggestedExerciseIds = selectDailyExercises(targetMuscle, currentPhase);

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
            pain: roundedAvg,
        },
        painTrend,
        avgPainLevel: roundedAvg,
        difficultyFilter: PHASE_DIFFICULTY_MAP[currentPhase],
        phaseColor: PHASE_COLORS[currentPhase],
        phaseIcon: PHASE_ICONS[currentPhase],
        weeklyProgress,
        milestones,
        suggestedExerciseIds,
        totalSessions: relevantSessions.length,
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
