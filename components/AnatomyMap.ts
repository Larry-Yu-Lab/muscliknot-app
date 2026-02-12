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

// Coordinate mapping based on approximately 1000px height coordinate system used in HomeScreen
// More granular regions for better exercise matching
const MUSCLE_REGIONS: muscleRegion[] = [
    // Head and Neck
    { id: 'head', name: 'Head', minY: 0, maxY: 100 },
    { id: 'neck', name: 'Neck', minY: 100, maxY: 200 },

    // Upper Body
    { id: 'traps', name: 'Traps/Shoulders', minY: 200, maxY: 300 },
    { id: 'chest', name: 'Chest', minY: 300, maxY: 400 },
    { id: 'upper_back', name: 'Upper Back', minY: 300, maxY: 450 },
    { id: 'arms', name: 'Arms', minY: 280, maxY: 480 },

    // Core
    { id: 'lower_back', name: 'Lower Back', minY: 450, maxY: 580 },
    { id: 'abdomen', name: 'Abdomen', minY: 400, maxY: 550 },
    { id: 'hips', name: 'Hips', minY: 550, maxY: 650 },
    { id: 'glutes', name: 'Glutes', minY: 600, maxY: 700 },

    // Legs - More granular
    { id: 'thighs', name: 'Thighs', minY: 680, maxY: 780 },
    { id: 'knees', name: 'Knees', minY: 770, maxY: 820 },
    { id: 'calves', name: 'Calves', minY: 810, maxY: 900 },
    { id: 'ankles', name: 'Ankles', minY: 890, maxY: 940 },
    { id: 'feet', name: 'Feet', minY: 930, maxY: 1000 },
];

/**
 * Identifies all muscle IDs inside the drag area
 */
export const getMusclesInArea = (selectionArea: SelectionArea): string[] => {
    const { y, height } = selectionArea;
    const selectionMinY = y - height / 2;
    const selectionMaxY = y + height / 2;

    return MUSCLE_REGIONS.filter(region => {
        // Check for overlap between selection area and muscle region
        return selectionMinY <= region.maxY && selectionMaxY >= region.minY;
    }).map(region => region.id);
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
 * Since your database has muscle_id = null, we search by common_name instead
 */
export const fetchExercisesByMuscleAndSize = async (
    muscleId: string,
    size: string,
    activityType: string = 'relief'
): Promise<any[]> => {
    if (!supabase) {
        console.warn('Supabase client not initialized');
        return [];
    }

    // Map app muscle zones to search keywords that match your database's common_name values
    const muscleKeywords: Record<string, string[]> = {
        // Head and Neck
        'head': ['temporalis', 'masseter', 'frontalis', 'occipitalis'],
        'neck': ['trapezius', 'levator', 'sternocleidomastoid', 'scalene', 'splenius', 'cervic'],

        // Upper Body
        'traps': ['trapezius', 'levator', 'scapulae', 'shoulder'],
        'chest': ['pectoralis', 'chest', 'pec'],
        'upper_back': ['rhomboid', 'trapezius', 'thoracic', 'latissimus', 'dorsi'],
        'arms': ['bicep', 'tricep', 'forearm', 'brachii', 'brachialis', 'deltoid'],

        // Core
        'lower_back': ['lumbar', 'erector', 'quadratus', 'lower back'],
        'abdomen': ['abdominal', 'rectus', 'oblique', 'transverse', 'core'],
        'hips': ['hip', 'iliopsoas', 'tensor', 'flexor'],
        'glutes': ['gluteus', 'piriformis', 'glute'],

        // Legs - Granular
        'thighs': ['hamstring', 'quadriceps', 'quad', 'femor', 'adductor', 'thigh'],
        'knees': ['knee', 'patella', 'popliteus'],
        'calves': ['calf', 'gastrocnemius', 'soleus', 'achilles'],
        'ankles': ['ankle', 'tibialis', 'peroneal', 'fibular'],
        'feet': ['foot', 'feet', 'plantar', 'toe', 'metatarsal', 'heel'],

        // Legacy fallback
        'legs': ['hamstring', 'quadriceps', 'calf', 'gastrocnemius', 'tibialis', 'thigh'],
    };

    const keywords = muscleKeywords[muscleId] || [muscleId];

    try {
        console.log(`Searching for ${activityType} exercises matching: ${keywords.join(', ')}`);

        // Build OR conditions for all keywords
        const orConditions = keywords.map(k => `common_name.ilike.%${k}%`).join(',');

        const { data, error } = await supabase
            .from('recovery_knowledge_base')
            .select('*')
            .eq('exercise_type', activityType) // Filter by activity type
            .or(orConditions);

        if (error) {
            console.error('Error fetching exercises:', error);
            return [];
        }

        console.log(`Found ${data?.length || 0} exercises`);
        return data || [];
    } catch (err) {
        console.error('Unexpected error:', err);
        return [];
    }
};
