/**
 * AI Coach Service
 * 
 * Orchestrates the AI coaching experience by combining:
 * - Gemini AI for personalized messages (when API key is available)
 * - Recovery Roadmap engine for deterministic fallbacks
 * - AsyncStorage caching to minimize API calls
 * 
 * Provides the daily coaching message, weekly summaries,
 * and chat functionality for the AI Coach feature.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    CoachingContext,
    CoachingMessage,
    ChatMessage,
    WeeklyRecap,
    generateCoachingMessage,
    generateChatResponse,
    generateWeeklyRecap,
    getGeminiApiKey,
} from './gemini';
import { generateRoadmap, RecoveryRoadmap } from './recoveryRoadmap';
import { getHistory, HistoryItem } from './storage';
import { formatLabel } from './i18n';

// ─── Cache Keys ────────────────────────────────────────────────────────────

const DAILY_COACH_KEY = '@muscliknot_daily_coach';
const WEEKLY_RECAP_KEY = '@muscliknot_weekly_recap';
const CHAT_HISTORY_KEY = '@muscliknot_coach_chat';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DailyCoachData {
    /** Date string (YYYY-MM-DD) when this was generated */
    date: string;
    /** The AI-generated coaching message, or deterministic fallback */
    message: string;
    /** A tip or motivational note */
    tip: string;
    /** Suggested activity for today */
    suggestedActivity: string;
    /** Reason for the suggestion */
    activityReason: string;
    /** Whether this was AI-generated or a deterministic fallback */
    isAiGenerated: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getTodayKey(): string {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getWeekKey(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek.toISOString().split('T')[0];
}

/**
 * Build a CoachingContext from roadmap + history data for Gemini prompts.
 */
function buildCoachingContext(
    roadmap: RecoveryRoadmap,
    history: HistoryItem[],
    fitnessLevel: string,
    language: string
): CoachingContext {
    const ANALYSIS_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const cutoff = now - ANALYSIS_WINDOW_MS;

    const painHistory = history
        .filter(h => h.date >= cutoff && h.assessment?.painLevel !== undefined)
        .map(h => ({
            muscle: h.muscleGroup,
            painLevel: h.assessment!.painLevel!,
            date: new Date(h.date).toLocaleDateString(),
            activityType: h.assessment?.activityType || 'relief',
        }));

    return {
        painHistory,
        currentPhase: roadmap.currentPhase,
        painTrend: roadmap.painTrend,
        avgPainLevel: roadmap.avgPainLevel,
        targetMuscle: roadmap.targetMuscle,
        dayNumber: roadmap.dayNumber,
        sessionsThisWeek: roadmap.weeklyProgress.sessionsThisWeek,
        sessionsTotal: roadmap.totalSessions,
        fitnessLevel,
        language,
    };
}

/**
 * Generate a deterministic fallback coaching message when Gemini is unavailable.
 */
function getDeterministicMessage(roadmap: RecoveryRoadmap): DailyCoachData {
    const muscle = formatLabel(roadmap.targetMuscle);
    const phase = roadmap.currentPhase;
    const trend = roadmap.painTrend;
    const pain = roadmap.avgPainLevel;

    let message = '';
    let tip = '';
    let suggestedActivity = roadmap.suggestedActivityType;
    let activityReason = '';

    switch (phase) {
        case 'acute':
            message = trend === 'worsening'
                ? `Your ${muscle} pain has been increasing (avg ${pain}/10). Let's focus on gentle relief today — no pushing through pain.`
                : `You're in the acute phase for ${muscle} (pain avg ${pain}/10). Gentle stretches and rest are key right now.`;
            tip = '💡 Ice for 15-20 minutes can help reduce inflammation in the acute phase.';
            activityReason = 'Gentle relief exercises help manage acute pain without overstressing tissues.';
            break;
        case 'mobility':
            message = trend === 'improving'
                ? `Great progress on your ${muscle}! Pain is trending down (avg ${pain}/10). Time to work on restoring full range of motion.`
                : `Your ${muscle} is in the mobility phase (avg ${pain}/10). Focus on gentle, controlled movements today.`;
            tip = '💡 Consistency beats intensity — 10 minutes daily is better than an hour once a week.';
            activityReason = 'Yoga and mobility work help restore range of motion as pain decreases.';
            break;
        case 'strengthening':
            message = `Your ${muscle} recovery is progressing well (avg ${pain}/10). Time to build strength and resilience.`;
            tip = '💡 Progressive overload: gradually increase resistance or reps each week.';
            activityReason = 'Strengthening prevents recurrence and builds long-term resilience.';
            break;
        case 'maintenance':
            message = `Excellent work! Your ${muscle} is in maintenance mode (avg ${pain}/10). Keep up the consistent movement to stay pain-free.`;
            tip = '💡 Don\'t skip warm-ups — they prime your muscles and prevent re-injury.';
            activityReason = 'Regular warm-ups and light activity maintain your recovery gains.';
            break;
    }

    return {
        date: getTodayKey(),
        message,
        tip,
        suggestedActivity,
        activityReason,
        isAiGenerated: false,
    };
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Get today's coaching message.
 * Checks cache first, then tries Gemini AI, then falls back to deterministic.
 */
export async function getDailyCoach(
    roadmap: RecoveryRoadmap,
    history: HistoryItem[],
    fitnessLevel: string,
    language: string
): Promise<DailyCoachData> {
    const todayKey = getTodayKey();

    // 1. Check cache
    try {
        const cached = await AsyncStorage.getItem(DAILY_COACH_KEY);
        if (cached) {
            const parsed: DailyCoachData = JSON.parse(cached);
            if (parsed.date === todayKey) {
                return parsed;
            }
        }
    } catch (e) {
        console.log('[AICoach] Cache read error:', e);
    }

    // 2. Try Gemini AI
    const hasKey = await getGeminiApiKey();
    if (hasKey) {
        try {
            const ctx = buildCoachingContext(roadmap, history, fitnessLevel, language);
            const aiMessage = await generateCoachingMessage(ctx);
            if (aiMessage) {
                const data: DailyCoachData = {
                    date: todayKey,
                    message: aiMessage.message,
                    tip: aiMessage.tip,
                    suggestedActivity: aiMessage.suggestedActivity,
                    activityReason: aiMessage.activityReason,
                    isAiGenerated: true,
                };
                // Cache it
                await AsyncStorage.setItem(DAILY_COACH_KEY, JSON.stringify(data));
                return data;
            }
        } catch (e) {
            console.error('[AICoach] Gemini coaching error:', e);
        }
    }

    // 3. Deterministic fallback
    const fallback = getDeterministicMessage(roadmap);
    await AsyncStorage.setItem(DAILY_COACH_KEY, JSON.stringify(fallback)).catch(() => {});
    return fallback;
}

/**
 * Get the weekly recap. Uses Gemini if available, otherwise returns null.
 */
export async function getWeeklyRecapData(
    roadmap: RecoveryRoadmap,
    history: HistoryItem[],
    fitnessLevel: string,
    language: string
): Promise<WeeklyRecap | null> {
    const weekKey = getWeekKey();

    // Check cache
    try {
        const cached = await AsyncStorage.getItem(WEEKLY_RECAP_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed._weekKey === weekKey) {
                return parsed;
            }
        }
    } catch (e) {}

    // Generate via Gemini
    const hasKey = await getGeminiApiKey();
    if (!hasKey) return null;

    try {
        const ctx = buildCoachingContext(roadmap, history, fitnessLevel, language);
        const recap = await generateWeeklyRecap({
            ...ctx,
            sessionsLastWeek: roadmap.weeklyProgress.sessionsLastWeek,
            painChangePercent: roadmap.weeklyProgress.painChangePercent,
            musclesWorked: roadmap.weeklyProgress.musclesWorked,
        });

        if (recap) {
            await AsyncStorage.setItem(WEEKLY_RECAP_KEY, JSON.stringify({
                ...recap,
                _weekKey: weekKey,
            }));
        }

        return recap;
    } catch (e) {
        console.error('[AICoach] Weekly recap error:', e);
        return null;
    }
}

/**
 * Send a message to the AI coach and get a response.
 */
export async function sendCoachMessage(
    userMessage: string,
    roadmap: RecoveryRoadmap,
    history: HistoryItem[],
    fitnessLevel: string,
    language: string
): Promise<{ response: string; chatHistory: ChatMessage[] }> {
    // Load existing chat history
    let chatHistory: ChatMessage[] = [];
    try {
        const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
        if (stored) chatHistory = JSON.parse(stored);
    } catch (e) {}

    // Add user message
    const userMsg: ChatMessage = {
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
    };
    chatHistory.push(userMsg);

    // Generate response
    const ctx = buildCoachingContext(roadmap, history, fitnessLevel, language);
    const response = await generateChatResponse(userMessage, chatHistory, ctx);

    const coachMsg: ChatMessage = {
        role: 'coach',
        content: response || getDefaultChatResponse(language),
        timestamp: Date.now(),
    };
    chatHistory.push(coachMsg);

    // Keep only last 50 messages
    if (chatHistory.length > 50) {
        chatHistory = chatHistory.slice(-50);
    }

    // Save
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory)).catch(() => {});

    return { response: coachMsg.content, chatHistory };
}

/**
 * Load the chat history from storage.
 */
export async function loadChatHistory(): Promise<ChatMessage[]> {
    try {
        const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Clear the coach's daily cache to force a refresh.
 */
export async function refreshDailyCoach(): Promise<void> {
    await AsyncStorage.removeItem(DAILY_COACH_KEY).catch(() => {});
}

/**
 * Clear chat history.
 */
export async function clearChatHistory(): Promise<void> {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY).catch(() => {});
}

function getDefaultChatResponse(language: string): string {
    const defaults: Record<string, string> = {
        en: "I'm here to help with your recovery! Could you tell me more about what you'd like to know?",
        fr: "Je suis là pour vous aider dans votre récupération ! Pourriez-vous me dire plus sur ce que vous aimeriez savoir ?",
        es: "¡Estoy aquí para ayudarte con tu recuperación! ¿Podrías decirme más sobre lo que te gustaría saber?",
        de: "Ich bin hier, um dir bei deiner Erholung zu helfen! Könntest du mir mehr darüber erzählen, was du wissen möchtest?",
    };
    return defaults[language] || defaults.en;
}
