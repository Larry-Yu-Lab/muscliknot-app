import { HistoryItem } from './storage';

export interface PainTrendEntry {
    date: number;
    painLevel: number;
}

export interface ActivityDistribution {
    type: string;
    count: number;
}

export interface MuscleFrequency {
    muscle: string;
    count: number;
}

export interface WeeklyStats {
    sessions: number;
    minutes: number;
    avgPain: number;
}

export interface WeeklyComparison {
    thisWeek: WeeklyStats;
    lastWeek: WeeklyStats;
}

export interface DailyDetail {
    painLevel: number;
    activityType: string;
    muscle: string;
    date: number;
}

export interface AnalyticsData {
    painTrends: PainTrendEntry[];
    activityDistribution: ActivityDistribution[];
    muscleFrequency: MuscleFrequency[];
    totalSessions: number;
    recoveryScore: number;
    streakDays: number;
    mostActiveMuscle: string;
    avgPainLevel: number;
    level: number;
    levelProgress: number;
    injuryRecovery: number;
    insights: { key: string; params?: Record<string, string | number> }[];
    weeklyComparison: WeeklyComparison;
    dailyBreakdown: DailyDetail[];
}

/**
 * Calculates the current consecutive day streak.
 */
const calculateStreak = (history: HistoryItem[]): number => {
    if (history.length === 0) return 0;

    // Get unique days (YYYY-MM-DD) sorted descending
    const days = Array.from(new Set(
        history.map(h => new Date(h.date).toISOString().split('T')[0])
    )).sort((a, b) => b.localeCompare(a));

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If the latest activity is not today or yesterday, streak is 0
    if (days[0] !== today && days[0] !== yesterday) return 0;

    let streak = 1;
    let currentDate = new Date(days[0]);

    for (let i = 1; i < days.length; i++) {
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(currentDate.getDate() - i);
        const expectedStr = expectedDate.toISOString().split('T')[0];

        if (days[i] === expectedStr) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Processes a history of items into analytics data.
 */
export const processAnalytics = (history: HistoryItem[]): AnalyticsData => {
    const painTrends: PainTrendEntry[] = [];
    const activityMap: Record<string, number> = {};
    const muscleMap: Record<string, number> = {};
    let totalPain = 0;
    let painEntriesCount = 0;

    // Sort history by date ascending for trends
    const sortedHistory = [...history].sort((a, b) => a.date - b.date);

    sortedHistory.forEach(item => {
        const assessment = item.assessment;

        // 1. Pain Trends
        if (assessment?.painLevel !== undefined) {
            painTrends.push({
                date: item.date,
                painLevel: assessment.painLevel
            });
            totalPain += assessment.painLevel;
            painEntriesCount++;
        }

        // 2. Activity Distribution
        if (assessment?.activityType) {
            activityMap[assessment.activityType] = (activityMap[assessment.activityType] || 0) + 1;
        }

        // 3. Muscle Frequency
        if (item.muscleGroup) {
            muscleMap[item.muscleGroup] = (muscleMap[item.muscleGroup] || 0) + 1;
        }
    });

    const activityDistribution: ActivityDistribution[] = Object.entries(activityMap).map(([type, count]) => ({
        type,
        count
    }));

    const muscleFrequency: MuscleFrequency[] = Object.entries(muscleMap)
        .map(([muscle, count]) => ({ muscle, count }))
        .sort((a, b) => b.count - a.count);

    const avgPainLevel = painEntriesCount > 0 ? Number((totalPain / painEntriesCount).toFixed(1)) : 0;
    const mostActiveMuscle = muscleFrequency[0]?.muscle || 'None';
    const streakDays = calculateStreak(history);

    // Level calculation: 1 level per 5 sessions
    const level = Math.floor(history.length / 5) + 1;
    const levelProgress = Math.round(((history.length % 5) / 5) * 100);

    // Injury Recovery: Percentage reduction in pain from start to now
    let injuryRecovery = 0;
    if (painTrends.length > 1) {
        const startPain = painTrends[0].painLevel;
        const currentPain = painTrends[painTrends.length - 1].painLevel;
        if (startPain > 0) {
            injuryRecovery = Math.round(Math.max(0, ((startPain - currentPain) / startPain) * 100));
        }
    }

    // Recovery score logic: 
    // Base 40
    // + Session Volume (up to 40 points): 4 points per session in last 7 days
    // + Consistency (up to 20 points): streakDays * 2
    // - Pain Penalty: (avgPainLevel / 10) * 30
    const now = Date.now();
    const last7DaysSessions = history.filter(h => (now - h.date) < 7 * 86400000).length;

    let recoveryScore = 40 + (last7DaysSessions * 4) + (streakDays * 2);
    recoveryScore -= (avgPainLevel / 10) * 30;
    recoveryScore = Math.min(100, Math.max(0, Math.round(recoveryScore)));

    // Insights generation
    const insights: { key: string; params?: Record<string, string | number> }[] = [];
    if (streakDays > 2) insights.push({ key: 'insight_streak', params: { days: streakDays } });
    if (last7DaysSessions > 3) insights.push({ key: 'insight_consistency' });
    if (avgPainLevel < 4 && history.length > 5) insights.push({ key: 'insight_pain_lower' });
    if (mostActiveMuscle !== 'None') insights.push({ key: 'insight_focus', params: { muscle: mostActiveMuscle } });
    if (insights.length === 0) insights.push({ key: 'insight_start' });

    // ── Weekly Comparison ─────────────────────────────────────────────
    const oneWeekAgo = now - 7 * 86400000;
    const twoWeeksAgo = now - 14 * 86400000;

    const thisWeekSessions = history.filter(h => h.date >= oneWeekAgo);
    const lastWeekSessions = history.filter(h => h.date >= twoWeeksAgo && h.date < oneWeekAgo);

    const calcWeeklyStats = (sessions: HistoryItem[]): WeeklyStats => {
        const painSessions = sessions.filter(s => s.assessment?.painLevel !== undefined);
        const totalPain = painSessions.reduce((sum, s) => sum + (s.assessment?.painLevel || 0), 0);
        return {
            sessions: sessions.length,
            minutes: sessions.length * 4, // ~4 min per exercise avg
            avgPain: painSessions.length > 0 ? Number((totalPain / painSessions.length).toFixed(1)) : 0,
        };
    };

    const weeklyComparison: WeeklyComparison = {
        thisWeek: calcWeeklyStats(thisWeekSessions),
        lastWeek: calcWeeklyStats(lastWeekSessions),
    };

    // ── Daily Breakdown (for interactive chart tooltips) ──────────────
    const dailyBreakdown: DailyDetail[] = sortedHistory
        .filter(h => h.assessment?.painLevel !== undefined)
        .map(h => ({
            painLevel: h.assessment!.painLevel!,
            activityType: h.assessment?.activityType || 'relief',
            muscle: h.muscleGroup,
            date: h.date,
        }));

    return {
        painTrends,
        activityDistribution,
        muscleFrequency,
        totalSessions: history.length,
        recoveryScore,
        streakDays,
        mostActiveMuscle,
        avgPainLevel,
        level,
        levelProgress,
        injuryRecovery,
        insights,
        weeklyComparison,
        dailyBreakdown,
    };
};
