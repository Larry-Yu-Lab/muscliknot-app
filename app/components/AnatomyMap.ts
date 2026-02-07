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
const MUSCLE_REGIONS: muscleRegion[] = [
    { id: 'neck', name: 'Neck', minY: 0, maxY: 200 },
    { id: 'traps', name: 'Traps/Shoulders', minY: 200, maxY: 350 },
    { id: 'upper_back', name: 'Upper Back', minY: 350, maxY: 500 },
    { id: 'lower_back', name: 'Lower Back', minY: 500, maxY: 650 },
    { id: 'glutes', name: 'Glutes', minY: 650, maxY: 750 },
    { id: 'legs', name: 'Legs', minY: 750, maxY: 1000 },
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
 * Fetch exercises by specific muscle ID and target area size
 * Uses .contains() for the text[] muscle_id column
 */
export const fetchExercisesByMuscleAndSize = async (
    muscleId: string,
    size: string
): Promise<any[]> => {
    if (!supabase) {
        console.warn('Supabase client not initialized');
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('recovery_knowledge_base')
            .select('*')
            .contains('muscle_id', [muscleId])
            .eq('target_area_size', size);

        if (error) {
            console.error('Error fetching exercises:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error:', err);
        return [];
    }
};
