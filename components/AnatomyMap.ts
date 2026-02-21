import { supabase } from '../utils/supabase';

export interface SelectionArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface muscleRegion {
    id: string;
    name: string;
    minY: number;
    maxY: number;
}

// Coordinate mapping based on approximately 1000px height coordinate system.
// X axis: body center is ~150px. Trunk = X 70–230. Arms/hands hang outside.
const MUSCLE_REGIONS: muscleRegion[] = [
    // Head and Neck
    { id: 'head', name: 'Head', minY: 0, maxY: 110 },
    { id: 'neck', name: 'Neck', minY: 100, maxY: 210 },

    // Upper Body (trunk only)
    { id: 'traps', name: 'Traps/Shoulders', minY: 200, maxY: 310 },
    { id: 'chest', name: 'Chest', minY: 290, maxY: 420 },
    { id: 'upper_back', name: 'Upper Back', minY: 290, maxY: 460 },

    // Core (trunk)
    { id: 'lower_back', name: 'Lower Back', minY: 440, maxY: 590 },
    { id: 'abdomen', name: 'Abdomen', minY: 400, maxY: 560 },
    { id: 'hips', name: 'Hips', minY: 540, maxY: 660 },
    { id: 'glutes', name: 'Glutes', minY: 610, maxY: 710 },

    // Legs
    { id: 'thighs', name: 'Thighs', minY: 680, maxY: 790 },
    { id: 'knees', name: 'Knees', minY: 770, maxY: 830 },
    { id: 'calves', name: 'Calves', minY: 810, maxY: 910 },
    { id: 'ankles', name: 'Ankles', minY: 890, maxY: 950 },
    { id: 'feet', name: 'Feet', minY: 930, maxY: 1000 },

    // Arms (lateral — detected by X coordinate, not Y alone)
    { id: 'arms', name: 'Arms', minY: 270, maxY: 500 },
    { id: 'forearms', name: 'Forearms', minY: 460, maxY: 650 },
    { id: 'hands', name: 'Hands/Wrists', minY: 620, maxY: 780 },
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
    const { x, y, height } = selectionArea;
    const selectionMinY = y - height / 2;
    const selectionMaxY = y + height / 2;

    // Determine if the tap is clearly outside the trunk (i.e. arm/hand area)
    const isLateral = x < TRUNK_MIN_X || x > TRUNK_MAX_X;

    if (isLateral) {
        // Only return lateral regions
        const lateralIds = ['arms', 'forearms', 'hands'];
        const lateralRegions = MUSCLE_REGIONS.filter(r => lateralIds.includes(r.id));
        const matched = lateralRegions.filter(r =>
            selectionMinY <= r.maxY && selectionMaxY >= r.minY
        ).map(r => r.id);
        // Return most specific match, or arms as default for lateral
        return matched.length > 0 ? [matched[matched.length - 1]] : ['arms'];
    }

    // Trunk tap — exclude lateral-only regions, prioritise best Y match
    const trunkExclusions = ['arms', 'forearms', 'hands'];
    const candidates = MUSCLE_REGIONS
        .filter(r => !trunkExclusions.includes(r.id))
        .filter(r => selectionMinY <= r.maxY && selectionMaxY >= r.minY)
        .map(r => r.id);

    return candidates.length > 0 ? [candidates[0]] : ['abdomen'];
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
 * Uses a three-pass strategy for best results:
 *   Pass 1: muscle_id array match + exercise_type filter
 *   Pass 2: common_name keyword search + exercise_type filter
 *   Pass 3: common_name keyword search, any exercise_type (fallback)
 *
 * @param difficultyFilter - Optional list of allowed difficulty_level values.
 *   Derived from the assessment engine (e.g. ['beginner'] for high pain).
 *   When omitted, no difficulty filtering is applied.
 */
export const fetchExercisesByMuscleAndSize = async (
    muscleId: string,
    size: string,
    activityType: string = 'relief',
    difficultyFilter?: string[]
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
        // PASS 1: Try exact muscle_id array match + activity type
        console.log(`[Pass 1] Searching by muscle_id array: ${muscleId}, type: ${activityType}`);
        let pass1Query = supabase
            .from('recovery_knowledge_base')
            .select('*')
            .eq('exercise_type', activityType)
            .contains('muscle_id', [muscleId]);
        if (difficultyFilter && difficultyFilter.length > 0) {
            pass1Query = pass1Query.in('difficulty_level', difficultyFilter);
        }
        const { data: pass1Data, error: pass1Error } = await pass1Query;

        if (!pass1Error && pass1Data && pass1Data.length > 0) {
            console.log(`[Pass 1] Found ${pass1Data.length} exercises by muscle_id`);
            return pass1Data;
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
            console.log(`[Pass 2] Found ${pass2Data.length} exercises by keyword`);
            return pass2Data;
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

        console.log(`[Pass 3] Found ${pass3Data?.length || 0} exercises`);
        return pass3Data || [];
    } catch (err) {
        console.error('Unexpected error:', err);
        return [];
    }
};


