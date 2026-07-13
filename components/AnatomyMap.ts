import { supabase } from '../utils/supabase';

export interface SelectionArea {
    x: number;
    y: number;
    width: number;
    height: number;
    view?: 'Front' | 'Back';
}

export interface muscleRegion {
    id: string;
    name: string;
    minY: number;
    maxY: number;
    minX?: number; // Optional narrow mapping to remove background
    maxX?: number;
    viewSide?: 'Front' | 'Back' | 'Both';
}

// Coordinate mapping based on approximately 1000px height coordinate system.
// X axis: body center is ~150px. Trunk = X 70–230. Arms/hands hang outside.
// Reordered so more specific joint regions (like knees/ankles) are evaluated first to prevent overlaps.
const MUSCLE_REGIONS: muscleRegion[] = [
    // Joints & Small Targets (high priority)
    { id: 'knees', name: 'Knees', minY: 770, maxY: 830, minX: 95, maxX: 205, viewSide: 'Both' },
    { id: 'ankles', name: 'Ankles', minY: 890, maxY: 950, minX: 105, maxX: 195, viewSide: 'Both' },
    { id: 'head', name: 'Head', minY: 0, maxY: 110, minX: 115, maxX: 185, viewSide: 'Both' },
    { id: 'neck', name: 'Neck', minY: 100, maxY: 210, minX: 120, maxX: 180, viewSide: 'Both' },
    
    // Core & Trunk (side specific)
    { id: 'chest', name: 'Chest', minY: 290, maxY: 420, minX: 90, maxX: 210, viewSide: 'Front' },
    { id: 'upper_back', name: 'Upper Back', minY: 290, maxY: 460, minX: 90, maxX: 210, viewSide: 'Back' },
    { id: 'lower_back', name: 'Lower Back', minY: 440, maxY: 590, minX: 100, maxX: 200, viewSide: 'Back' },
    { id: 'abdomen', name: 'Abdomen', minY: 400, maxY: 560, minX: 95, maxX: 205, viewSide: 'Front' },
    
    // Girdles & Large Targets
    { id: 'traps', name: 'Traps/Shoulders', minY: 200, maxY: 310, minX: 80, maxX: 220, viewSide: 'Both' },
    { id: 'hips', name: 'Hips', minY: 540, maxY: 660, minX: 85, maxX: 215, viewSide: 'Both' },
    { id: 'glutes', name: 'Glutes', minY: 610, maxY: 710, minX: 85, maxX: 215, viewSide: 'Back' },
    { id: 'thighs', name: 'Thighs', minY: 680, maxY: 790, minX: 85, maxX: 215, viewSide: 'Both' },
    { id: 'calves', name: 'Calves', minY: 810, maxY: 910, minX: 95, maxX: 205, viewSide: 'Both' },
    { id: 'feet', name: 'Feet', minY: 930, maxY: 1000, minX: 95, maxX: 205, viewSide: 'Both' },

    // Arms (lateral — detected by X coordinate, not Y alone)
    { id: 'arms', name: 'Arms', minY: 270, maxY: 500, viewSide: 'Both' },
    { id: 'forearms', name: 'Forearms', minY: 460, maxY: 650, viewSide: 'Both' },
    { id: 'hands', name: 'Hands/Wrists', minY: 620, maxY: 820, viewSide: 'Both' },
];

// Body model center X and half-width of trunk in the ~300px wide image
const TRUNK_MIN_X = 80;
const TRUNK_MAX_X = 220;

/**
 * Identifies the best muscle ID for the tapped area.
 * Uses BOTH X and Y coordinates so lateral taps correctly resolve
 * to arms/forearms/hands rather than trunk muscles.
 */
export const getMusclesInArea = (selectionArea: SelectionArea): string[] => {
    const { x, y, height, view } = selectionArea;
    const selectionMinY = y - height / 2;
    const selectionMaxY = y + height / 2;

    // Strict background exclusion for extreme edges, slightly widened to allow fingertips
    if (x < 10 || x > 290) {
        return [];
    }

    // Filter muscle regions by Front/Back view first
    const activeRegions = MUSCLE_REGIONS.filter(r => 
        !view || r.viewSide === 'Both' || r.viewSide === view
    );

    // Determine if the tap is outside the trunk (i.e. arm/hand area)
    const isLateral = (x >= 10 && x < TRUNK_MIN_X) || (x > TRUNK_MAX_X && x <= 290);

    if (isLateral) {
        // Only return lateral regions
        const lateralIds = ['arms', 'forearms', 'hands'];
        const lateralRegions = activeRegions.filter(r => lateralIds.includes(r.id));
        const matched = lateralRegions.filter(r =>
            selectionMinY <= r.maxY && selectionMaxY >= r.minY
        ).map(r => r.id);
        // Return most specific match, OR empty if none
        return matched.length > 0 ? [matched[matched.length - 1]] : [];
    }

    // Trunk tap — exclude lateral-only regions, prioritise best Y match + X limits
    const trunkExclusions = ['arms', 'forearms', 'hands'];
    const candidates = activeRegions
        .filter(r => !trunkExclusions.includes(r.id))
        .filter(r => selectionMinY <= r.maxY && selectionMaxY >= r.minY)
        .filter(r => {
            // Apply tight X constraints if the region defines them
            if (r.minX !== undefined && x < r.minX) return false;
            if (r.maxX !== undefined && x > r.maxX) return false;
            return true;
        })
        .map(r => r.id);

    return candidates.length > 0 ? [candidates[0]] : [];
};

/**
 * Future-Proof way to handle the selection
 * Queries Supabase for exercises that match the identified muscle IDs
 */
export const handleSelection = async (
    selectionArea: SelectionArea,
    setRecommendedExercises: (data: any[]) => void
) => {
    if (!supabase) {
        console.warn('Supabase client not initialized');
        return;
    }

    // 1. Identify all muscle IDs inside the drag area
    const activeMuscles = getMusclesInArea(selectionArea);

    if (activeMuscles.length === 0) {
        setRecommendedExercises([]);
        return;
    }

    try {
        // 2. Query Supabase for exercises that match ANY of those IDs
        const { data, error } = await supabase
            .from('recovery_knowledge_base')
            .select('*')
            .in('muscle_id', activeMuscles) // This looks for any overlap
            .eq('exercise_type', 'relief'); // Still keeping our Relief rule

        if (error) {
            console.error('Error fetching exercises from Supabase:', error);
            return;
        }

        // 3. Show the results on your Dynamic Page
        setRecommendedExercises(data || []);
    } catch (err) {
        console.error('Unexpected error during handleSelection:', err);
    }
};

/**
 * Fetch exercises by specific muscle ID
 * Uses a four-pass strategy for best results:
 *   Pass 0: muscle_id + exercise_type + area_of_pain (most specific — sub-location match)
 *   Pass 1: muscle_id array match + exercise_type filter
 *   Pass 2: common_name keyword search + exercise_type filter
 *   Pass 3: common_name keyword search, any exercise_type (fallback)
 *
 * @param difficultyFilter - Optional list of allowed difficulty_level values.
 * @param painLocation     - Optional sub-location (e.g. 'tailbone', 'kneecap').
 *   When provided, Pass 0 returns only exercises tagged to that exact area first.
 */
/** Remove duplicate exercises by their primary key. */
const dedupeById = (exercises: any[]): any[] => {
    const seen = new Set<string>();
    return exercises.filter(ex => {
        if (seen.has(ex.id)) return false;
        seen.add(ex.id);
        return true;
    });
};

export const fetchExercisesByMuscleAndSize = async (
    muscleId: string,
    size: string,
    activityType: string = 'relief',
    difficultyFilter?: string[],
    painLocation?: string,
    duration?: string
): Promise<any[]> => {
    if (!supabase) {
        console.warn('Supabase client not initialized');
        return [];
    }

    // Map app muscle zones to search keywords that match your database's common_name values
    const muscleKeywords: Record<string, string[]> = {
        // Head and Neck
        'head': ['temporalis', 'masseter', 'frontalis', 'occipitalis', 'face', 'jaw', 'temple'],
        'neck': ['trapezius', 'levator', 'sternocleidomastoid', 'scalene', 'splenius', 'cervic', 'neck'],

        // Upper Body
        'traps': ['trapezius', 'levator', 'scapulae', 'shoulder'],
        'chest': ['pectoralis', 'chest', 'pec'],
        'upper_back': ['rhomboid', 'trapezius', 'thoracic', 'latissimus', 'dorsi'],
        'arms': ['bicep', 'tricep', 'brachii', 'brachialis', 'deltoid', 'arm'],
        'forearms': ['forearm', 'wrist flexor', 'wrist extensor', 'brachioradialis', 'pronator', 'forearm'],
        'hands': ['hand', 'wrist', 'finger', 'thumb', 'carpal', 'grip', 'metacarpal'],

        // Core
        'lower_back': ['lumbar', 'erector', 'quadratus', 'lower back', 'lumborum'],
        'abdomen': ['abdominal', 'rectus', 'oblique', 'transverse', 'core'],
        'hips': ['hip', 'iliopsoas', 'tensor', 'flexor'],
        'glutes': ['gluteus', 'piriformis', 'glute'],

        // Legs
        'thighs': ['hamstring', 'quadriceps', 'quad', 'femor', 'adductor', 'thigh'],
        'knees': ['knee', 'patella', 'popliteus'],
        'calves': ['calf', 'gastrocnemius', 'soleus', 'achilles'],
        'ankles': ['ankle', 'tibialis', 'peroneal', 'fibular'],
        'feet': ['foot', 'feet', 'plantar', 'toe', 'metatarsal', 'heel'],

        // Legacy fallback
        'legs': ['hamstring', 'quadriceps', 'calf', 'gastrocnemius', 'tibialis', 'thigh'],
    };

    const keywords = muscleKeywords[muscleId] || [muscleId];
    const orConditions = keywords.map(k => `common_name.ilike.%${k}%`).join(',');

    try {
        // PASS 0: Sub-location specific match (most targeted)
        // Only runs when the user selected a specific pain sub-location (e.g. tailbone, kneecap)
        if (painLocation) {
            console.log(`[Pass 0] Searching by area_of_pain: ${painLocation}, muscle: ${muscleId}, type: ${activityType}`);
            let pass0Query = supabase
                .from('recovery_knowledge_base')
                .select('*')
                .eq('exercise_type', activityType)
                .eq('area_of_pain', painLocation)
                .contains('muscle_id', [muscleId]);
            if (difficultyFilter && difficultyFilter.length > 0) {
                pass0Query = pass0Query.in('difficulty_level', difficultyFilter);
            }
            const { data: pass0Data, error: pass0Error } = await pass0Query;

            if (!pass0Error && pass0Data && pass0Data.length > 0) {
                const deduped = dedupeById(pass0Data);
                console.log(`[Pass 0] Found ${deduped.length} location-specific exercises for: ${painLocation}`);
                return deduped;
            }
            console.log(`[Pass 0] No exact location tag found, trying keyword search (Pass 0.5).`);

            // PASS 0.5: Keyword search for sub-location
            let pass05Query = supabase
                .from('recovery_knowledge_base')
                .select('*')
                .eq('exercise_type', activityType)
                .contains('muscle_id', [muscleId])
                .ilike('common_name', `%${painLocation.replace(/_/g, '%')}%`);

            if (difficultyFilter && difficultyFilter.length > 0) {
                pass05Query = pass05Query.in('difficulty_level', difficultyFilter);
            }
            const { data: pass05Data, error: pass05Error } = await pass05Query;

            if (!pass05Error && pass05Data && pass05Data.length > 0) {
                const deduped = dedupeById(pass05Data);
                console.log(`[Pass 0.5] Found ${deduped.length} exercises by keyword match: ${painLocation}`);
                return deduped;
            }
        }

        // PASS 1: Try exact muscle_id array match + activity type
        console.log(`[Pass 1] Searching by muscle_id array: ${muscleId}, type: ${activityType}`);
        let pass1Query = supabase
            .from('recovery_knowledge_base')
            .select('*')
            .eq('exercise_type', activityType)
            .contains('muscle_id', [muscleId]);

        // If chronic pain (longer), also allow 'posture' exercises even if activityType is 'relief'
        if (duration === 'longer' && activityType === 'relief') {
            pass1Query = supabase
                .from('recovery_knowledge_base')
                .select('*')
                .in('exercise_type', ['relief', 'posture'])
                .contains('muscle_id', [muscleId]);
        }

        if (difficultyFilter && difficultyFilter.length > 0) {
            pass1Query = pass1Query.in('difficulty_level', difficultyFilter);
        }
        const { data: pass1Data, error: pass1Error } = await pass1Query;

        if (!pass1Error && pass1Data && pass1Data.length > 0) {
            let deduped = dedupeById(pass1Data);

            // If duration is 'just_now', prioritize 'relief' type
            if (duration === 'just_now') {
                deduped.sort((a, b) => (a.exercise_type === 'relief' ? -1 : 1));
            }

            console.log(`[Pass 1] Found ${deduped.length} exercises by muscle_id`);
            return deduped;
        }


        // PASS 2: Keyword search on common_name + activity type
        console.log(`[Pass 2] Searching by common_name keywords, type: ${activityType}`);
        let pass2Query = supabase
            .from('recovery_knowledge_base')
            .select('*')
            .eq('exercise_type', activityType)
            .or(orConditions);
        if (difficultyFilter && difficultyFilter.length > 0) {
            pass2Query = pass2Query.in('difficulty_level', difficultyFilter);
        }
        const { data: pass2Data, error: pass2Error } = await pass2Query;

        if (!pass2Error && pass2Data && pass2Data.length > 0) {
            const deduped = dedupeById(pass2Data);
            console.log(`[Pass 2] Found ${deduped.length} exercises by keyword`);
            return deduped;
        }

        // PASS 3: Any exercises for this muscle, any activity type (broadest fallback)
        console.log(`[Pass 3] Broadest search — any type for muscle: ${muscleId}`);
        let pass3Query = supabase
            .from('recovery_knowledge_base')
            .select('*')
            .or(orConditions);
        if (difficultyFilter && difficultyFilter.length > 0) {
            pass3Query = pass3Query.in('difficulty_level', difficultyFilter);
        }
        const { data: pass3Data, error: pass3Error } = await pass3Query;

        if (pass3Error) {
            console.error('Error fetching exercises (pass 3):', pass3Error);
            return [];
        }

        const deduped = dedupeById(pass3Data || []);
        console.log(`[Pass 3] Found ${deduped.length} exercises`);
        return deduped;
    } catch (err) {
        console.error('Unexpected error:', err);
        return [];
    }
};


