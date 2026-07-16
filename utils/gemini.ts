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
        return await AsyncStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
    } catch {
        return null;
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
