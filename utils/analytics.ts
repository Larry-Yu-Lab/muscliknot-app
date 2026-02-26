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

export interface AnalyticsData {
    painTrends: PainTrendEntry[];
    activityDistribution: ActivityDistribution[];
    muscleFrequency: MuscleFrequency[];
    totalSessions: number;
    recoveryScore: number;
    mostActiveMuscle: string;
    avgPainLevel: number;
}

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

    // Recovery score logic: Simple heuristic for now
    // Base 50, +5 per session (up to 30), -5 per avg pain level above 3
    let recoveryScore = 50 + (history.length * 5);
    if (avgPainLevel > 3) {
        recoveryScore -= (avgPainLevel - 3) * 5;
    }
    recoveryScore = Math.min(100, Math.max(0, Math.round(recoveryScore)));

    return {
        painTrends,
        activityDistribution,
        muscleFrequency,
        totalSessions: history.length,
        recoveryScore,
        mostActiveMuscle,
        avgPainLevel
    };
};
