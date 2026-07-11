/**
 * Proactive Prevention Engine
 * 
 * Analyzes muscle frequency patterns from history to generate
 * preventive suggestions before injuries occur.
 */

import { HistoryItem } from './storage';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PreventionAlert {
    id: string;
    /** Ionicons icon name */
    icon: string;
    /** i18n key for the alert title */
    titleKey: string;
    /** i18n key for the alert subtitle */
    subtitleKey: string;
    /** Parameters for subtitle interpolation */
    subtitleParams: Record<string, string | number>;
    /** Accent color for the alert card */
    color: string;
    /** Target muscle for the suggested routine */
    targetMuscle: string;
    /** Suggested activity type */
    suggestedActivityType: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const ANALYSIS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const INACTIVITY_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

const ALERT_COLORS = {
    strengthWarning: '#f97316',   // Orange — "you've been hitting this area a lot"
    painWarning: '#ef4444',       // Red — "high pain in this area"
    inactivity: '#3b82f6',        // Blue — "you've been inactive"
    prevention: '#8b5cf6',        // Purple — "try this to prevent issues"
};

// ─── Main Engine ───────────────────────────────────────────────────────────

/**
 * Generates up to 2 proactive prevention alerts based on recent history.
 */
export function generatePreventionAlerts(history: HistoryItem[]): PreventionAlert[] {
    const now = Date.now();
    const cutoff = now - ANALYSIS_WINDOW_MS;
    const alerts: PreventionAlert[] = [];

    // Filter to sessions within the analysis window
    const recentSessions = history.filter(h => h.date >= cutoff);

    // ── Rule 1: Inactivity Alert ───────────────────────────────────────
    if (history.length > 0) {
        const lastSession = history.reduce((latest, h) => h.date > latest.date ? h : latest, history[0]);
        const daysSinceLastSession = (now - lastSession.date) / (24 * 60 * 60 * 1000);

        if (daysSinceLastSession >= 3) {
            alerts.push({
                id: 'prevention-inactivity',
                icon: 'time-outline',
                titleKey: 'prev_inactivity_title',
                subtitleKey: 'prev_inactivity_subtitle',
                subtitleParams: { days: Math.floor(daysSinceLastSession) },
                color: ALERT_COLORS.inactivity,
                targetMuscle: 'neck', // Default to a common area
                suggestedActivityType: 'warmup',
            });
        }
    }

    if (recentSessions.length === 0) {
        // No recent data, can't generate muscle-specific alerts
        return alerts.slice(0, 2);
    }

    // ── Build muscle frequency map ─────────────────────────────────────
    const muscleData: Record<string, {
        count: number;
        totalPain: number;
        painEntries: number;
    }> = {};

    recentSessions.forEach(session => {
        const muscle = session.muscleGroup;
        if (!muscleData[muscle]) {
            muscleData[muscle] = { count: 0, totalPain: 0, painEntries: 0 };
        }
        muscleData[muscle].count++;

        if (session.assessment?.painLevel !== undefined) {
            muscleData[muscle].totalPain += session.assessment.painLevel;
            muscleData[muscle].painEntries++;
        }
    });

    // Sort muscles by frequency (descending)
    const sortedMuscles = Object.entries(muscleData)
        .sort(([, a], [, b]) => b.count - a.count);

    // ── Rule 2: High-Frequency Muscle — Suggest Strengthening ──────────
    for (const [muscle, data] of sortedMuscles) {
        if (alerts.length >= 2) break;

        const avgPain = data.painEntries > 0 ? data.totalPain / data.painEntries : 0;

        if (data.count >= 3 && avgPain < 6) {
            // Frequent targeting with manageable pain → strengthen to prevent
            alerts.push({
                id: `prevention-strengthen-${muscle}`,
                icon: 'fitness-outline',
                titleKey: 'prev_strengthen_title',
                subtitleKey: 'prev_strengthen_subtitle',
                subtitleParams: { muscle, count: data.count },
                color: ALERT_COLORS.strengthWarning,
                targetMuscle: muscle,
                suggestedActivityType: 'strength',
            });
        } else if (data.count >= 2 && avgPain >= 6) {
            // Frequent targeting with high pain → gentle yoga
            alerts.push({
                id: `prevention-highpain-${muscle}`,
                icon: 'warning-outline',
                titleKey: 'prev_highpain_title',
                subtitleKey: 'prev_highpain_subtitle',
                subtitleParams: { muscle, pain: Math.round(avgPain * 10) / 10 },
                color: ALERT_COLORS.painWarning,
                targetMuscle: muscle,
                suggestedActivityType: 'yoga',
            });
        }
    }

    // ── Rule 3: Complementary Muscle Suggestion ────────────────────────
    if (alerts.length < 2 && sortedMuscles.length > 0) {
        const topMuscle = sortedMuscles[0][0];

        // Suggest complementary muscle groups
        const complementaryMap: Record<string, { muscle: string; reason: string }> = {
            'neck': { muscle: 'Upper Back', reason: 'prev_complementary_neck' },
            'Neck': { muscle: 'Upper Back', reason: 'prev_complementary_neck' },
            'lower_back': { muscle: 'Abdomen', reason: 'prev_complementary_lowerback' },
            'Lower Back': { muscle: 'Abdomen', reason: 'prev_complementary_lowerback' },
            'Shoulders': { muscle: 'Upper Back', reason: 'prev_complementary_shoulders' },
            'Legs': { muscle: 'Hips', reason: 'prev_complementary_legs' },
            'Hips': { muscle: 'Glutes', reason: 'prev_complementary_hips' },
        };

        const complement = complementaryMap[topMuscle];
        if (complement) {
            // Only suggest if they haven't been working this complementary area
            const complementCount = muscleData[complement.muscle]?.count || 0;
            if (complementCount < 2) {
                alerts.push({
                    id: `prevention-complement-${complement.muscle}`,
                    icon: 'shield-outline',
                    titleKey: 'prev_complement_title',
                    subtitleKey: complement.reason,
                    subtitleParams: { muscle: complement.muscle, targetMuscle: topMuscle },
                    color: ALERT_COLORS.prevention,
                    targetMuscle: complement.muscle,
                    suggestedActivityType: 'strength',
                });
            }
        }
    }

    return alerts.slice(0, 2);
}
