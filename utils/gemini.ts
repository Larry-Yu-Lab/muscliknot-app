import AsyncStorage from '@react-native-async-storage/async-storage';

export const GEMINI_API_KEY_STORAGE_KEY = '@muscliknot_gemini_api_key';

export interface AiRecoveryPlan {
    reasoning: string;
    exercises: {
        id: string;
        customDuration: string;
        customInstructions: string;
    }[];
}

interface AssessmentInput {
    muscleId: string;
    activityType: string;
    painLevel?: number;
    duration?: string;
    painLocation?: string;
    causeNote?: string;
    fitnessLevel?: string;
}

/**
 * Retrieve the stored Gemini API key from local storage.
 */
export async function getGeminiApiKey(): Promise<string | null> {
    try {
        const stored = await AsyncStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
        if (stored && stored.trim() !== '') return stored.trim();
        return process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
    } catch {
        return process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;
    }
}

/**
 * Save the Gemini API key to local storage.
 */
export async function saveGeminiApiKey(key: string): Promise<boolean> {
    try {
        await AsyncStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key.trim());
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove the Gemini API key from local storage.
 */
export async function deleteGeminiApiKey(): Promise<boolean> {
    try {
        await AsyncStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, '');
        return true;
    } catch {
        return false;
    }
}

/**
 * Calls Gemini API to generate a personalized recovery routine.
 * Maps user assessment findings and selects the best matching exercises from database candidates.
 * Returns null if key is missing, network fails, or parse errors occur.
 */
export async function generateAiRecoveryPlan(
    assessment: AssessmentInput,
    candidateExercises: any[],
    language: string = 'en'
): Promise<AiRecoveryPlan | null> {
    try {
        const apiKey = await getGeminiApiKey();
        if (!apiKey) {
            console.log('[Gemini] No API key configured. Skipping AI plan generation.');
            return null;
        }

        if (candidateExercises.length === 0) {
            return null;
        }

        // Map exercise list to a simplified structure for the prompt context
        const exercisesContext = candidateExercises.map(ex => ({
            id: ex.id,
            title: ex.title,
            description: ex.description || '',
            duration: ex.duration || '',
            instructions: ex.instructions || ''
        }));

        const systemInstructions = `You are MuscliKnot's AI Recovery Specialist. 
Your goal is to tailor the recovery plan for a user based on their specific pain assessment and physical metadata.
You will receive the user's assessment and a list of available candidate exercises from the app's database.

You MUST respond with a single, valid JSON object containing exactly:
1. "reasoning" (string): A compassionate, professional explanation in language "${language}" explaining why you selected these exercises, how they help the user's specific condition, and safety advice. Keep it to 2-3 sentences.
2. "exercises" (array): An ordered subset of the candidate exercises (up to 4 exercises) tailored to their pain. For each selected exercise, return:
   - "id" (string): Must match the exact candidate exercise ID.
   - "customDuration" (string): A customized timing/hold recommendation (e.g. "3 mins - gentle pace", "5 mins - 30s holds").
   - "customInstructions" (string): Step-by-step instructions specifically customized to their pain description, location, or fitness level. Add safety modifiers (e.g., if knee pain is reported: "Keep hips high, do not flex knee past 90 degrees"). Deliver in language "${language}".

Ensure the JSON is completely valid, parseable, and does not contain markdown code wrappers like \`\`\`json.`;

        const prompt = `
=== USER METADATA & ASSESSMENT ===
Target Muscle: ${assessment.muscleId}
Activity Type: ${assessment.activityType}
Pain Intensity Score (1-10): ${assessment.painLevel ?? 'Not specified'}
Pain Duration: ${assessment.duration ?? 'Not specified'}
Specific Sub-location: ${assessment.painLocation ?? 'Not specified'}
User's Pain Description/Cause Note: "${assessment.causeNote || 'None provided'}"
User's General Fitness Level: ${assessment.fitnessLevel ?? 'BEGINNER'}

=== AVAILABLE DATABASE EXERCISE CANDIDATES ===
${JSON.stringify(exercisesContext, null, 2)}

Identify the best exercises from the candidates to form a sequence (up to 4 exercises) matching this user's needs. Return the custom JSON.
`;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `${systemInstructions}\n\n${prompt}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('[Gemini] API error response:', response.status, errBody);
            return null;
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            console.error('[Gemini] Response does not contain text content.');
            return null;
        }

        const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedPlan: AiRecoveryPlan = JSON.parse(cleanText);

        if (!parsedPlan.reasoning || !Array.isArray(parsedPlan.exercises)) {
            console.error('[Gemini] Response structure is invalid:', parsedPlan);
            return null;
        }

        return parsedPlan;
    } catch (error) {
        console.error('[Gemini] Exception during dynamic plan generation:', error);
        return null;
    }
}

// ─── Shared Gemini API Helper ──────────────────────────────────────────────

async function callGemini(prompt: string, systemInstructions: string): Promise<string | null> {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
        console.log('[Gemini] No API key configured.');
        return null;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemInstructions}\n\n${prompt}` }] }],
            generationConfig: { responseMimeType: 'application/json' },
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        console.error('[Gemini] API error:', response.status, errBody);
        return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        console.error('[Gemini] Empty response.');
        return null;
    }

    return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

// ─── AI Coaching Types ─────────────────────────────────────────────────────

export interface CoachingMessage {
    /** The main coaching message for today */
    message: string;
    /** A short motivational quote or tip */
    tip: string;
    /** Suggested activity for today: relief | yoga | strength | warmup | posture */
    suggestedActivity: string;
    /** Brief reason for the suggestion */
    activityReason: string;
}

export interface ChatMessage {
    role: 'user' | 'coach';
    content: string;
    timestamp: number;
}

export interface WeeklyRecap {
    /** Summary paragraph of the week */
    summary: string;
    /** Key highlights (e.g., "3 sessions completed", "Pain down 20%") */
    highlights: string[];
    /** What to focus on next week */
    nextWeekFocus: string;
    /** Motivational closing message */
    motivation: string;
}

// ─── AI Coaching Functions ─────────────────────────────────────────────────

export interface CoachingContext {
    painHistory: { muscle: string; painLevel: number; date: string; activityType: string }[];
    currentPhase: string;
    painTrend: string;
    avgPainLevel: number;
    targetMuscle: string;
    dayNumber: number;
    sessionsThisWeek: number;
    sessionsTotal: number;
    fitnessLevel: string;
    language: string;
}

/**
 * Generates a personalized daily coaching message using Gemini.
 * Returns null if API key is missing or call fails.
 */
export async function generateCoachingMessage(
    ctx: CoachingContext
): Promise<CoachingMessage | null> {
    try {
        const system = `You are MuscliKnot's AI Recovery Coach — a warm, knowledgeable physical therapist and personal trainer.
You provide daily personalized coaching messages based on the user's pain history and recovery progress.

Respond with a single valid JSON object:
{
  "message": "A personalized 2-3 sentence coaching message addressing the user's current state. Be empathetic, specific, and actionable. Reference their actual data (muscle group, pain trend, session count). Deliver in language '${ctx.language}'.",
  "tip": "A 1-sentence recovery tip or motivational note relevant to their phase. Deliver in language '${ctx.language}'.",
  "suggestedActivity": "One of: relief | yoga | strength | warmup | posture",
  "activityReason": "A 1-sentence explanation of why this activity is recommended today. Deliver in language '${ctx.language}'."
}`;

        const prompt = `
=== USER RECOVERY DATA ===
Target Muscle: ${ctx.targetMuscle}
Current Phase: ${ctx.currentPhase} (acute → mobility → strengthening → maintenance)
Day Number: ${ctx.dayNumber}
Pain Trend: ${ctx.painTrend} (improving/stable/worsening)
Average Pain Level: ${ctx.avgPainLevel}/10
Sessions This Week: ${ctx.sessionsThisWeek}
Total Sessions: ${ctx.sessionsTotal}
Fitness Level: ${ctx.fitnessLevel}

=== RECENT PAIN HISTORY (last 14 days) ===
${ctx.painHistory.map(h => `- ${h.date}: ${h.muscle} — Pain ${h.painLevel}/10 (${h.activityType})`).join('\n') || 'No sessions logged yet.'}

Generate a personalized coaching message for today.`;

        const result = await callGemini(prompt, system);
        if (!result) return null;

        const parsed: CoachingMessage = JSON.parse(result);
        if (!parsed.message || !parsed.suggestedActivity) return null;

        return parsed;
    } catch (error) {
        console.error('[Gemini] Coaching message error:', error);
        return null;
    }
}

/**
 * Generates an AI coach chat response for a user question.
 */
export async function generateChatResponse(
    userMessage: string,
    chatHistory: ChatMessage[],
    ctx: CoachingContext
): Promise<string | null> {
    try {
        const system = `You are MuscliKnot's AI Recovery Coach. You are having a conversation with a user about their muscle recovery, pain management, and exercise routine.

Rules:
- Be warm, empathetic, and professional
- Give evidence-based advice about stretching, strengthening, and pain management
- Reference the user's actual data when relevant
- Keep responses concise (2-4 sentences) unless they ask for detail
- NEVER diagnose medical conditions — recommend seeing a doctor for persistent/severe pain
- Respond in language: '${ctx.language}'
- Return valid JSON: { "response": "your response text" }`;

        const recentChat = chatHistory.slice(-6).map(m =>
            `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`
        ).join('\n');

        const prompt = `
=== USER RECOVERY PROFILE ===
Target Muscle: ${ctx.targetMuscle}
Current Phase: ${ctx.currentPhase}
Pain Trend: ${ctx.painTrend}
Average Pain: ${ctx.avgPainLevel}/10
Sessions This Week: ${ctx.sessionsThisWeek}
Fitness Level: ${ctx.fitnessLevel}

=== CONVERSATION HISTORY ===
${recentChat || '(New conversation)'}

User: ${userMessage}

Respond to the user's message.`;

        const result = await callGemini(prompt, system);
        if (!result) return null;

        const parsed = JSON.parse(result);
        return parsed.response || null;
    } catch (error) {
        console.error('[Gemini] Chat response error:', error);
        return null;
    }
}

/**
 * Generates a weekly recap of the user's recovery progress.
 */
export async function generateWeeklyRecap(
    ctx: CoachingContext & {
        sessionsLastWeek: number;
        painChangePercent: number;
        musclesWorked: string[];
    }
): Promise<WeeklyRecap | null> {
    try {
        const system = `You are MuscliKnot's AI Recovery Coach providing a weekly progress summary.

Return valid JSON:
{
  "summary": "A 2-3 sentence summary of the user's week — what they accomplished, how their pain changed, and overall progress. Be specific with numbers. Deliver in language '${ctx.language}'.",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "nextWeekFocus": "1-2 sentences about what to focus on next week based on their data. Deliver in language '${ctx.language}'.",
  "motivation": "A brief motivational closing. Deliver in language '${ctx.language}'."
}`;

        const prompt = `
=== WEEKLY STATS ===
Sessions This Week: ${ctx.sessionsThisWeek}
Sessions Last Week: ${ctx.sessionsLastWeek}
Pain Change: ${ctx.painChangePercent > 0 ? '+' : ''}${ctx.painChangePercent}%
Muscles Worked: ${ctx.musclesWorked.join(', ') || 'None'}
Current Phase: ${ctx.currentPhase}
Average Pain: ${ctx.avgPainLevel}/10
Fitness Level: ${ctx.fitnessLevel}
Total Sessions All-Time: ${ctx.sessionsTotal}

Generate a weekly recap.`;

        const result = await callGemini(prompt, system);
        if (!result) return null;

        const parsed: WeeklyRecap = JSON.parse(result);
        if (!parsed.summary || !Array.isArray(parsed.highlights)) return null;

        return parsed;
    } catch (error) {
        console.error('[Gemini] Weekly recap error:', error);
        return null;
    }
}
