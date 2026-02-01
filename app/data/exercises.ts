export interface Exercise {
    id: string;
    title: string;
    duration: string; // e.g. "5 MINS"
    muscleGroup: 'Neck' | 'Shoulders' | 'Upper Back' | 'Lower Back' | 'Glutes' | 'Legs' | 'General';
    image: string; // Placeholder URL or local require if available
    description: string;
}

export const EXERCISES: Exercise[] = [
    // Neck (Y < 200 approx)
    {
        id: 'n1',
        title: 'Neck Tilts',
        duration: '3 MINS',
        muscleGroup: 'Neck',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Gently tilt your head side to side, holding for 15 seconds each.',
    },
    {
        id: 'n2',
        title: 'Neck Rotations',
        duration: '2 MINS',
        muscleGroup: 'Neck',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Slowly rotate your neck in a circular motion.',
    },

    // Shoulders (200 < Y < 300)
    {
        id: 's1',
        title: 'Shoulder Rolls',
        duration: '2 MINS',
        muscleGroup: 'Shoulders',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Roll your shoulders forward and backward to release tension.',
    },
    {
        id: 's2',
        title: 'Cross-Body Arm Stretch',
        duration: '3 MINS',
        muscleGroup: 'Shoulders',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Pull one arm across your chest with the other arm.',
    },

    // Upper Back (300 < Y < 500)
    {
        id: 'ub1',
        title: 'Cat-Cow Stretch',
        duration: '5 MINS',
        muscleGroup: 'Upper Back',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Alternate between arching and rounding your back on all fours.',
    },
    {
        id: 'ub2',
        title: 'Thoracic Extension',
        duration: '4 MINS',
        muscleGroup: 'Upper Back',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Lean back over a chair or foam roller to open the chest.',
    },

    // Lower Back (500 < Y < 650)
    {
        id: 'lb1',
        title: 'Child’s Pose',
        duration: '5 MINS',
        muscleGroup: 'Lower Back',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Sit back on your heels with arms stretched forward.',
    },
    {
        id: 'lb2',
        title: 'Knee-to-Chest',
        duration: '3 MINS',
        muscleGroup: 'Lower Back',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Lie on your back and pull one knee to your chest.',
    },

    // Glutes (650 < Y < 750)
    {
        id: 'g1',
        title: 'Pigeon Pose',
        duration: '4 MINS',
        muscleGroup: 'Glutes',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Deep glute stretch on the floor.',
    },

    // Legs (Y > 750)
    {
        id: 'l1',
        title: 'Hamstring Stretch',
        duration: '3 MINS',
        muscleGroup: 'Legs',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Reach for your toes while standing or sitting.',
    },
];

export const getExercisesForPosition = (y: number, view: 'Front' | 'Back'): Exercise[] => {
    // Very rough mapping based on standard body image height (approx 1000px coordinate space usually)
    // Adjust y thresholds as needed based on specific image
    let target: Exercise['muscleGroup'] = 'General';

    if (y < 200) target = 'Neck';
    else if (y < 350) target = 'Shoulders';
    else if (y < 500) target = 'Upper Back';
    else if (y < 650) target = 'Lower Back';
    else if (y < 750) target = 'Glutes';
    else target = 'Legs';

    // Simple filter
    return EXERCISES.filter(e => e.muscleGroup === target || e.muscleGroup === 'General');
};
