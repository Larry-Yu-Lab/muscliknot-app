import { AssessmentData } from './storage';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type IntensityLevel = 'low' | 'moderate' | 'high';
export type ExerciseCategory = 'gentle' | 'moderate' | 'full';

export interface RecommendationResult {
    /** Overall intensity tier derived from pain/tension slider */
    intensity: IntensityLevel;
    /** Cap on exercise difficulty that should be shown to the user */
    category: ExerciseCategory;
    /** Short advisory string shown as a banner on the activity page (null = no warning) */
    advisory: string | null;
    /** Array of difficulty_level values to pass as a filter to Supabase */
    difficultyFilter: string[];
    /** True when pain/tension is ≥ 8 — show prominent rest warning */
    showRestWarning: boolean;
    /** Colour to use for the advisory banner / pain badge */
    accentColor: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

const GENTLE_FILTER = ['beginner'];
const MODERATE_FILTER = ['beginner', 'intermediate'];
const FULL_FILTER = ['beginner', 'intermediate', 'advanced'];

const COLOR_RED = '#ef4444';
const COLOR_ORANGE = '#f97316';
const COLOR_GREEN = '#22c55e';

function painToIntensity(level: number): IntensityLevel {
    if (level >= 8) return 'high';
    if (level >= 5) return 'moderate';
    return 'low';
}

function intensityToCategory(intensity: IntensityLevel): ExerciseCategory {
    if (intensity === 'high') return 'gentle';
    if (intensity === 'moderate') return 'moderate';
    return 'full';
}

// ─────────────────────────────────────────────────────────────
// Main engine
// ─────────────────────────────────────────────────────────────

/**
 * Convert assessment answers into a concrete set of recommendations.
 * All exercise-filtering and advisory-banner decisions live here.
 */
export function getExerciseRecommendation(assessment: AssessmentData): RecommendationResult {
    const type = assessment.activityType ?? 'relief';

    // ── RELIEF (Pain Assessment) ──────────────────────────────
    if (type === 'relief') {
        const rawLevel = assessment.painLevel ?? 5;
        let intensity = painToIntensity(rawLevel);
        let category = intensityToCategory(intensity);
        let advisory: string | null = null;
        let accentColor = COLOR_GREEN;

        // Slider thresholds
        if (rawLevel >= 8) {
            advisory = '⚠️ High pain detected — rest is recommended. We\'ve selected gentle exercises only. If pain persists, please see a doctor.';
            accentColor = COLOR_RED;
        } else if (rawLevel >= 5) {
            advisory = 'Moderate pain — we\'ve limited recommendations to low-impact movements to avoid aggravating the area.';
            accentColor = COLOR_ORANGE;
        }

        // Chronic pain modifier: even moderate pain that's been around >1 month
        // should be capped at moderate exercises to break the cycle safely.
        if (assessment.duration === 'longer' && category === 'full') {
            category = 'moderate';
            advisory = advisory ?? 'Chronic pain detected — consistency with low-load exercises is key. We\'ve adjusted your plan accordingly.';
            accentColor = accentColor === COLOR_GREEN ? COLOR_ORANGE : accentColor;
        }

        return {
            intensity,
            category,
            advisory,
            difficultyFilter: category === 'gentle' ? GENTLE_FILTER
                : category === 'moderate' ? MODERATE_FILTER
                    : FULL_FILTER,
            showRestWarning: rawLevel >= 8,
            accentColor,
        };
    }

    // ── WARMUP ──────────────────────────────────────────────
    if (type === 'warmup') {
        const feel = assessment.q2; // 'cold' | 'stiff' | 'normal' | 'warm'
        let advisory: string | null = null;
        let category: ExerciseCategory = 'full';
        let accentColor = COLOR_GREEN;

        if (feel === 'cold' || feel === 'stiff') {
            category = 'moderate';
            advisory = 'Your muscles are cold/stiff — we\'ve added extra prep steps. Ease in slowly before increasing intensity.';
            accentColor = COLOR_ORANGE;
        } else if (feel === 'warm') {
            advisory = '🔥 You\'re already warm — your plan jumps straight to activation exercises.';
        }

        return {
            intensity: 'low',
            category,
            advisory,
            difficultyFilter: category === 'moderate' ? MODERATE_FILTER : FULL_FILTER,
            showRestWarning: false,
            accentColor,
        };
    }

    // ── YOGA ────────────────────────────────────────────────
    if (type === 'yoga') {
        const rawLevel = assessment.painLevel ?? 3; // tension slider
        const mobility = assessment.q1;             // 'yes' | 'limited' | 'no'
        let intensity = painToIntensity(rawLevel);
        let category: ExerciseCategory = 'full';
        let advisory: string | null = null;
        let accentColor = COLOR_GREEN;

        if (mobility === 'no') {
            category = 'gentle';
            advisory = '⚠️ Painful joint movement detected — only restorative / Yin yoga poses will be shown. Avoid active stretching.';
            accentColor = COLOR_RED;
        } else if (mobility === 'limited' || rawLevel >= 5) {
            category = 'moderate';
            advisory = 'Limited mobility noted — we\'ve selected poses that work within your current range of motion.';
            accentColor = COLOR_ORANGE;
        }

        return {
            intensity,
            category,
            advisory,
            difficultyFilter: category === 'gentle' ? GENTLE_FILTER
                : category === 'moderate' ? MODERATE_FILTER
                    : FULL_FILTER,
            showRestWarning: mobility === 'no',
            accentColor,
        };
    }

    // ── STRENGTH ────────────────────────────────────────────
    if (type === 'strength') {
        const expLevel = assessment.q1; // 'beginner' | 'intermediate' | 'advanced'
        let category: ExerciseCategory = 'full';
        let difficultyFilter = FULL_FILTER;
        let advisory: string | null = null;
        const accentColor = COLOR_GREEN;

        if (expLevel === 'beginner') {
            category = 'gentle';
            difficultyFilter = GENTLE_FILTER;
            advisory = '💪 Beginner program — we\'ll focus on proper form and foundational movements.';
        } else if (expLevel === 'intermediate') {
            category = 'moderate';
            difficultyFilter = MODERATE_FILTER;
            advisory = '💪 Intermediate program — progressive exercises to build on your existing base.';
        }
        // advanced → full program, no advisory needed

        return {
            intensity: 'low',
            category,
            advisory,
            difficultyFilter,
            showRestWarning: false,
            accentColor,
        };
    }

    // ── POSTURE ─────────────────────────────────────────────
    if (type === 'posture') {
        const sittingDuration = assessment.q1; // 'short' | 'medium' | 'long' | 'all_day'
        let category: ExerciseCategory = 'moderate';
        let advisory: string | null = null;
        let accentColor = COLOR_GREEN;

        if (sittingDuration === 'all_day') {
            category = 'gentle';
            advisory = '⏰ All-day sitting detected — we\'re starting with gentle decompression. Aim for a 5-min movement break every 45 min.';
            accentColor = COLOR_ORANGE;
        } else if (sittingDuration === 'long') {
            category = 'gentle';
            advisory = 'Extended sitting detected — gentle postural resets recommended before progressing.';
            accentColor = COLOR_ORANGE;
        } else if (sittingDuration === 'medium') {
            advisory = 'Moderate sitting time — we\'ve included postural stretches and activation exercises.';
        }

        return {
            intensity: 'low',
            category,
            advisory,
            difficultyFilter: category === 'gentle' ? GENTLE_FILTER : MODERATE_FILTER,
            showRestWarning: false,
            accentColor,
        };
    }

    // Fallback — full program, no restrictions
    return {
        intensity: 'low',
        category: 'full',
        advisory: null,
        difficultyFilter: FULL_FILTER,
        showRestWarning: false,
        accentColor: COLOR_GREEN,
    };
}

/**
 * Utility: given a pain level 1-10, return the appropriate track/badge color.
 * Used by pain-assessment.tsx to colour the slider in real-time.
 */
export function painLevelColor(level: number): string {
    if (level >= 8) return COLOR_RED;
    if (level >= 5) return COLOR_ORANGE;
    return COLOR_GREEN;
}

/**
 * Short human-readable label for the recommendation category.
 */
export function categoryLabel(category: ExerciseCategory): string {
    switch (category) {
        case 'gentle': return 'Gentle Program';
        case 'moderate': return 'Moderate Program';
        case 'full': return 'Full Program';
    }
}
