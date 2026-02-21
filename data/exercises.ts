export interface Exercise {
    id: string;
    title: string;
    duration: string; // e.g. "5 MINS"
    muscleGroup: 'Neck' | 'Shoulders' | 'Upper Back' | 'Lower Back' | 'Glutes' | 'Legs' | 'Hips' | 'Abdomen' | 'Calves' | 'Feet' | 'General';
    category: 'Relief' | 'Yoga' | 'Warm-ups' | 'Posture' | 'Strength';
    image: string; // Placeholder URL or local require if available
    description: string;
}

export const EXERCISES: Exercise[] = [
    // ── Neck ──────────────────────────────────────────────────────────────
    {
        id: 'n1',
        title: 'Neck Tilts',
        duration: '3 MINS',
        muscleGroup: 'Neck',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Gently tilt your head side to side, holding for 15 seconds each.',
    },
    {
        id: 'n2',
        title: 'Neck Rotations',
        duration: '2 MINS',
        muscleGroup: 'Neck',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Slowly rotate your neck in a circular motion.',
    },
    {
        id: 'n3',
        title: 'Yoga Neck Rolls',
        duration: '4 MINS',
        muscleGroup: 'Neck',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Slow circular neck rolls in easy pose to release cervical tension.',
    },
    {
        id: 'n4',
        title: 'Chin Tuck Drill',
        duration: '3 MINS',
        muscleGroup: 'Neck',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Pull chin straight back against a wall to correct forward head posture.',
    },
    {
        id: 'n5',
        title: 'Lateral Neck Resistance',
        duration: '4 MINS',
        muscleGroup: 'Neck',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Isometric holds in all four neck directions to strengthen the cervical stabilizers.',
    },

    // ── Shoulders ─────────────────────────────────────────────────────────
    {
        id: 's1',
        title: 'Shoulder Rolls',
        duration: '2 MINS',
        muscleGroup: 'Shoulders',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Roll your shoulders forward and backward to release tension.',
    },
    {
        id: 's2',
        title: 'Cross-Body Arm Stretch',
        duration: '3 MINS',
        muscleGroup: 'Shoulders',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Pull one arm across your chest with the other arm.',
    },
    {
        id: 's3',
        title: 'Arm Circles',
        duration: '2 MINS',
        muscleGroup: 'Shoulders',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Forward and backward arm circles to warm up the rotator cuff.',
    },
    {
        id: 's4',
        title: 'Eagle Arms Stretch',
        duration: '4 MINS',
        muscleGroup: 'Shoulders',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Cross arms at elbow and wrap forearms together to stretch the upper traps.',
    },
    {
        id: 's5',
        title: 'Wall Angel',
        duration: '5 MINS',
        muscleGroup: 'Shoulders',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Slide arms overhead on the wall to retrain scapular upward rotation.',
    },
    {
        id: 's6',
        title: 'Lateral Raise',
        duration: '6 MINS',
        muscleGroup: 'Shoulders',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Raise arms laterally to shoulder height to build medial deltoid.',
    },
    {
        id: 's7',
        title: 'Dead Hang',
        duration: '3 MINS',
        muscleGroup: 'Shoulders',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Hang from a bar to decompress the spine and improve shoulder health.',
    },

    // ── Upper Back ────────────────────────────────────────────────────────
    {
        id: 'ub1',
        title: 'Cat-Cow Stretch',
        duration: '5 MINS',
        muscleGroup: 'Upper Back',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Alternate between arching and rounding your back on all fours.',
    },
    {
        id: 'ub2',
        title: 'Thoracic Extension',
        duration: '4 MINS',
        muscleGroup: 'Upper Back',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Lean back over a chair or foam roller to open the chest.',
    },
    {
        id: 'ub3',
        title: 'Face Pull with Band',
        duration: '4 MINS',
        muscleGroup: 'Upper Back',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Pull a resistance band toward your face to warm up rear deltoids and mid-trap.',
    },
    {
        id: 'ub4',
        title: 'Thread the Needle',
        duration: '5 MINS',
        muscleGroup: 'Upper Back',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Slide one arm under your body in tabletop to release the rhomboids.',
    },
    {
        id: 'ub5',
        title: 'Scapular Retraction Hold',
        duration: '5 MINS',
        muscleGroup: 'Upper Back',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Squeeze shoulder blades firmly together to correct rounded posture.',
    },
    {
        id: 'ub6',
        title: 'Bent-Over Row',
        duration: '8 MINS',
        muscleGroup: 'Upper Back',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Strengthen the rhomboids and lower traps with a hinge-and-row movement.',
    },

    // ── Lower Back ────────────────────────────────────────────────────────
    {
        id: 'lb1',
        title: "Child's Pose",
        duration: '5 MINS',
        muscleGroup: 'Lower Back',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Sit back on your heels with arms stretched forward.',
    },
    {
        id: 'lb2',
        title: 'Knee-to-Chest',
        duration: '3 MINS',
        muscleGroup: 'Lower Back',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Lie on your back and pull one knee to your chest.',
    },
    {
        id: 'lb3',
        title: 'Hip Hinge Warmup',
        duration: '3 MINS',
        muscleGroup: 'Lower Back',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Teach the hip hinge pattern before loading to protect the lumbar spine.',
    },
    {
        id: 'lb4',
        title: 'Supine Spinal Twist',
        duration: '4 MINS',
        muscleGroup: 'Lower Back',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Gently rotate the lumbar spine by dropping knees to one side.',
    },
    {
        id: 'lb5',
        title: 'Pelvic Neutral Drill',
        duration: '4 MINS',
        muscleGroup: 'Lower Back',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Learn to find and hold a neutral lumbar curve against a wall.',
    },
    {
        id: 'lb6',
        title: 'Bird-Dog',
        duration: '5 MINS',
        muscleGroup: 'Lower Back',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Extend opposite arm and leg from tabletop to build spinal stability.',
    },

    // ── Hips ──────────────────────────────────────────────────────────────
    {
        id: 'h1',
        title: 'Low Lunge Hip Flexor Stretch',
        duration: '5 MINS',
        muscleGroup: 'Hips',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Shift hips into a lunge to release tight hip flexors from prolonged sitting.',
    },
    {
        id: 'h2',
        title: 'Leg Swings',
        duration: '3 MINS',
        muscleGroup: 'Hips',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Dynamic leg swings forward, back, and laterally to warm up the hip capsule.',
    },
    {
        id: 'h3',
        title: 'Pigeon Pose',
        duration: '6 MINS',
        muscleGroup: 'Hips',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Deep hip opener targeting the piriformis and external rotators.',
    },
    {
        id: 'h4',
        title: 'Clamshell',
        duration: '5 MINS',
        muscleGroup: 'Hips',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Sidelying hip abduction to correct pelvic drop and Trendelenburg gait.',
    },
    {
        id: 'h5',
        title: 'Lateral Band Walk',
        duration: '6 MINS',
        muscleGroup: 'Hips',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Resistance band side-stepping to strengthen hip abductors and glute medius.',
    },

    // ── Glutes ────────────────────────────────────────────────────────────
    {
        id: 'g1',
        title: 'Figure Four Stretch',
        duration: '4 MINS',
        muscleGroup: 'Glutes',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Cross ankle over knee to deeply stretch the piriformis.',
    },
    {
        id: 'g2',
        title: 'Glute Bridge Warmup',
        duration: '3 MINS',
        muscleGroup: 'Glutes',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Activate glutes before lower body training to protect the knees and back.',
    },
    {
        id: 'g3',
        title: 'Happy Baby Pose',
        duration: '3 MINS',
        muscleGroup: 'Glutes',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Gently decompress the sacroiliac joint and stretch the inner glutes.',
    },
    {
        id: 'g4',
        title: 'Single-Leg Glute Bridge',
        duration: '5 MINS',
        muscleGroup: 'Glutes',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Correct glute strength imbalances causing pelvic drop.',
    },
    {
        id: 'g5',
        title: 'Hip Thrust',
        duration: '8 MINS',
        muscleGroup: 'Glutes',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Highest glute activation exercise — drive hips up against a bench.',
    },

    // ── Legs ──────────────────────────────────────────────────────────────
    {
        id: 'l1',
        title: 'Hamstring Stretch',
        duration: '3 MINS',
        muscleGroup: 'Legs',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Reach for your toes while standing or sitting.',
    },
    {
        id: 'l2',
        title: 'Standing Quad Stretch',
        duration: '3 MINS',
        muscleGroup: 'Legs',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Balance on one leg and draw your heel toward your buttock.',
    },
    {
        id: 'l3',
        title: 'High Knees',
        duration: '3 MINS',
        muscleGroup: 'Legs',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Drive alternating knees to hip height to warm up quads and calves.',
    },
    {
        id: 'l4',
        title: 'Low Lunge Quad Yoga',
        duration: '5 MINS',
        muscleGroup: 'Legs',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Classic yoga quad stretch with deep hip flexor opening.',
    },
    {
        id: 'l5',
        title: 'Sumo Squat Hold',
        duration: '4 MINS',
        muscleGroup: 'Legs',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Wide-stance squat hold to train hip external rotation and correct knee cave.',
    },
    {
        id: 'l6',
        title: 'Bulgarian Split Squat',
        duration: '8 MINS',
        muscleGroup: 'Legs',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Back foot elevated for single-leg quad and glute work.',
    },

    // ── Abdomen ───────────────────────────────────────────────────────────
    {
        id: 'ab1',
        title: 'Cobra Stretch',
        duration: '3 MINS',
        muscleGroup: 'Abdomen',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Press through hands to lift chest and open the abdominal wall.',
    },
    {
        id: 'ab2',
        title: 'Dead Bug Warmup',
        duration: '4 MINS',
        muscleGroup: 'Abdomen',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Alternate opposite arm and leg toward the floor to activate deep core.',
    },
    {
        id: 'ab3',
        title: 'Boat Pose',
        duration: '5 MINS',
        muscleGroup: 'Abdomen',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Balance on the sit bones with legs lifted to build core stability.',
    },
    {
        id: 'ab4',
        title: 'Pallof Press',
        duration: '5 MINS',
        muscleGroup: 'Abdomen',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Anti-rotation press with a resistance band to train lateral core stability.',
    },
    {
        id: 'ab5',
        title: 'Plank Hold',
        duration: '5 MINS',
        muscleGroup: 'Abdomen',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Forearm plank to maximally engage the transverse abdominis.',
    },

    // ── Calves ────────────────────────────────────────────────────────────
    {
        id: 'ca1',
        title: 'Wall Calf Stretch',
        duration: '3 MINS',
        muscleGroup: 'Calves',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Press rear heel flat against the floor in a split stance.',
    },
    {
        id: 'ca2',
        title: 'Calf Raise Warmup',
        duration: '3 MINS',
        muscleGroup: 'Calves',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Rise onto toes and lower slowly to warm up the Achilles tendon.',
    },
    {
        id: 'ca3',
        title: 'Downward Dog Calf Walk',
        duration: '4 MINS',
        muscleGroup: 'Calves',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Alternate pressing each heel to the floor in Downward Facing Dog.',
    },
    {
        id: 'ca4',
        title: 'Heel Drop on Step',
        duration: '5 MINS',
        muscleGroup: 'Calves',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Eccentric calf lowering on a step to treat Achilles tendinopathy.',
    },
    {
        id: 'ca5',
        title: 'Weighted Calf Raise',
        duration: '6 MINS',
        muscleGroup: 'Calves',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Full-range calf raise with dumbbells to build plantarflexion strength.',
    },

    // ── Feet ──────────────────────────────────────────────────────────────
    {
        id: 'ft1',
        title: 'Plantar Fascia Stretch',
        duration: '3 MINS',
        muscleGroup: 'Feet',
        category: 'Relief',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        description: 'Pull toes back toward shin before first steps in the morning.',
    },
    {
        id: 'ft2',
        title: 'Toe Spread & Scrunch',
        duration: '2 MINS',
        muscleGroup: 'Feet',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Activate intrinsic foot muscles before sport or walking.',
    },
    {
        id: 'ft3',
        title: 'Thunderbolt Toe Stretch',
        duration: '4 MINS',
        muscleGroup: 'Feet',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Kneel and sit back on tucked toes for a deep plantar fascia yoga stretch.',
    },
    {
        id: 'ft4',
        title: 'Short Foot Exercise',
        duration: '4 MINS',
        muscleGroup: 'Feet',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Pull the ball of foot toward the heel to strengthen the arch.',
    },
    {
        id: 'ft5',
        title: 'Towel Scrunches',
        duration: '3 MINS',
        muscleGroup: 'Feet',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Drag a towel toward you with your toes to build intrinsic foot strength.',
    },

    // ── General / Multi-region ────────────────────────────────────────────
    {
        id: 'y1',
        title: 'Sun Salutation',
        duration: '10 MINS',
        muscleGroup: 'General',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Classic yoga flow to energize the body.',
    },
    {
        id: 'y2',
        title: 'Warrior II',
        duration: '8 MINS',
        muscleGroup: 'General',
        category: 'Yoga',
        image: 'https://images.unsplash.com/photo-1544367563-8f2127fa2b6d?w=400',
        description: 'Strong standing yoga pose building hip and shoulder endurance.',
    },
    {
        id: 'w1',
        title: 'Dynamic Warm-up',
        duration: '5 MINS',
        muscleGroup: 'General',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Get your blood flowing with a full-body warmup routine.',
    },
    {
        id: 'w2',
        title: 'Inchworm',
        duration: '4 MINS',
        muscleGroup: 'General',
        category: 'Warm-ups',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Walk hands out to plank and back — full-body warm-up and mobility.',
    },
    {
        id: 'p1',
        title: 'Desk Posture Fix',
        duration: '6 MINS',
        muscleGroup: 'Upper Back',
        category: 'Posture',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
        description: 'Correct slouching and open up the chest for desk workers.',
    },
    {
        id: 'st1',
        title: 'Core Blast',
        duration: '15 MINS',
        muscleGroup: 'General',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
        description: 'Intensive core workout for total-body stability.',
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

// Maps activityType (from params) to exercise category in local data
const ACTIVITY_TYPE_TO_CATEGORY: Record<string, Exercise['category']> = {
    'relief': 'Relief',
    'warmup': 'Warm-ups',
    'yoga': 'Yoga',
    'posture': 'Posture',
    'strength': 'Strength',
};

/**
 * Fallback: returns local exercises filtered by activity type and optionally muscle position.
 * Used when Supabase returns no results.
 */
export const getExercisesByActivityType = (
    activityType: string,
    y: number,
    view: 'Front' | 'Back'
): Exercise[] => {
    const category = ACTIVITY_TYPE_TO_CATEGORY[activityType] || 'Relief';

    // For type-specific categories, return all matching exercises
    if (category !== 'Relief') {
        return EXERCISES.filter(e => e.category === category);
    }

    // For Relief, narrow by body position as before
    return getExercisesForPosition(y, view);
};
