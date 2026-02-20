// Run with: node scripts/seed-exercises.js
// Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY as env vars or update below.
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY env vars.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXERCISES = [
    // ─── HEAD ────────────────────────────────────────────────────────────────
    {
        muscle_id: ['head'], common_name: 'temporalis', exercise_type: 'relief',
        solution_stretch: 'Temple Pressure Release',
        why: 'The temporalis muscle often holds tension from jaw clenching and stress headaches. Releasing it reduces headache frequency.',
        instructions: '**STEP 1 (Setup):** Sit upright in a chair with your spine tall.\n**STEP 2 (Position):** Place your fingertips on your temples.\n**STEP 3 (Execute):** Apply gentle circular pressure for 30 seconds.\n**STEP 4 (Release):** Breathe deeply and relax your jaw.',
        process: 'Perform 3 sets of 30-second holds. Rest 10 seconds between sets.'
    },
    {
        muscle_id: ['head'], common_name: 'frontalis', exercise_type: 'warmup',
        solution_stretch: 'Brow Raises Warmup',
        why: 'Activates the frontalis muscle before activity, preventing forehead tension buildup during prolonged focus.',
        instructions: '**STEP 1 (Setup):** Sit or stand relaxed.\n**STEP 2 (Execute):** Raise your eyebrows as high as possible.\n**STEP 3 (Hold):** Hold 3 seconds.\n**STEP 4 (Release):** Lower slowly and relax.',
        process: 'Do 10 controlled reps. Takes about 1 minute.'
    },
    {
        muscle_id: ['head'], common_name: 'masseter', exercise_type: 'yoga',
        solution_stretch: 'Lion\'s Breath Jaw Release',
        why: 'Lion\'s Breath from yoga stretches the masseter and releases jaw tension caused by stress and grinding.',
        instructions: '**STEP 1 (Setup):** Kneel or sit cross-legged.\n**STEP 2 (Inhale):** Breathe in through the nose deeply.\n**STEP 3 (Exhale):** Open your mouth wide, stick out your tongue, and exhale loudly.\n**STEP 4 (Repeat):** Return to neutral and repeat.',
        process: '5 rounds of Lion\'s Breath. Excellent for releasing facial tension.'
    },
    {
        muscle_id: ['head'], common_name: 'occipitalis', exercise_type: 'posture',
        solution_stretch: 'Chin Tuck Occipital Reset',
        why: 'Forward head posture strains the occipitalis. Chin tucks correct alignment and reduce occipital headaches.',
        instructions: '**STEP 1 (Setup):** Stand against a wall with heels, shoulders, and head touching it.\n**STEP 2 (Tuck):** Pull your chin straight back (not down) to create a double chin.\n**STEP 3 (Hold):** Hold 5 seconds.\n**STEP 4 (Repeat):** Release and repeat.',
        process: '3 sets of 10 reps. Do this every hour at your desk.'
    },
    {
        muscle_id: ['head'], common_name: 'temporalis', exercise_type: 'strength',
        solution_stretch: 'Jaw Resistance Press',
        why: 'Balanced jaw strength prevents TMJ issues and supports proper head alignment under load.',
        instructions: '**STEP 1 (Setup):** Place a folded cloth between your back molars on one side.\n**STEP 2 (Execute):** Gently bite down to 50% effort.\n**STEP 3 (Hold):** Hold 5 seconds.\n**STEP 4 (Switch):** Repeat on the other side.',
        process: '3 sets of 5-second holds per side. Never exceed 60% effort.'
    },

    // ─── NECK ────────────────────────────────────────────────────────────────
    {
        muscle_id: ['neck'], common_name: 'trapezius', exercise_type: 'relief',
        solution_stretch: 'Upper Trapezius Stretch',
        why: 'The upper trapezius is the most common site of neck tension. Lateral stretching decompresses C3–C5 vertebrae.',
        instructions: '**STEP 1 (Setup):** Sit on one hand to anchor the shoulder.\n**STEP 2 (Tilt):** Tilt your opposite ear toward your shoulder.\n**STEP 3 (Enhance):** Gently use your free hand to add light pressure on the crown.\n**STEP 4 (Hold):** Hold 30 seconds each side.',
        process: '2 sets per side. Breathe slowly throughout.'
    },
    {
        muscle_id: ['neck'], common_name: 'sternocleidomastoid', exercise_type: 'warmup',
        solution_stretch: 'SCM Neck Rotation Warmup',
        why: 'Warms up the sternocleidomastoid before activity, crucial for preventing neck strain during exercise.',
        instructions: '**STEP 1 (Setup):** Stand tall, shoulders relaxed.\n**STEP 2 (Rotate):** Turn your head slowly to the right, hold 2 seconds.\n**STEP 3 (Return):** Return to center.\n**STEP 4 (Alternate):** Repeat to the left.',
        process: '10 slow rotations each side. Takes about 2 minutes.'
    },
    {
        muscle_id: ['neck'], common_name: 'levator scapulae', exercise_type: 'yoga',
        solution_stretch: 'Yoga Neck Rolls',
        why: 'Slow yoga neck rolls release the levator scapulae and create space in the cervical spine.',
        instructions: '**STEP 1 (Setup):** Sit in easy pose (cross-legged).\n**STEP 2 (Drop):** Drop your chin to your chest.\n**STEP 3 (Roll):** Slowly roll your head to the right, back, left, and forward.\n**STEP 4 (Reverse):** Repeat in the opposite direction.',
        process: '3 slow full circles each direction. Never rush neck rolls.'
    },
    {
        muscle_id: ['neck'], common_name: 'cervical', exercise_type: 'posture',
        solution_stretch: 'Cervical Retraction Wall Drill',
        why: 'Strengthens deep neck flexors and corrects forward head posture — the root cause of most neck pain.',
        instructions: '**STEP 1 (Setup):** Stand with back flat against a wall.\n**STEP 2 (Retract):** Pull your chin straight back until head touches the wall.\n**STEP 3 (Hold):** Hold 5–10 seconds.\n**STEP 4 (Release):** Return to neutral.',
        process: '3 sets of 10 reps. Do daily for best posture results.'
    },
    {
        muscle_id: ['neck'], common_name: 'scalene', exercise_type: 'strength',
        solution_stretch: 'Lateral Neck Resistance',
        why: 'Strengthening the scalenes stabilizes the cervical spine and prevents recurring neck strains.',
        instructions: '**STEP 1 (Setup):** Place your hand against the side of your head.\n**STEP 2 (Resist):** Push your head into your hand without moving.\n**STEP 3 (Hold):** Hold 5 seconds each side.\n**STEP 4 (Repeat):** Complete all sides (left, right, forward, back).',
        process: '3 sets of 5-second isometric holds per direction.'
    },

    // ─── TRAPS / SHOULDERS ───────────────────────────────────────────────────
    {
        muscle_id: ['traps'], common_name: 'trapezius', exercise_type: 'relief',
        solution_stretch: 'Shoulder Shrug & Drop',
        why: 'Actively shrugging and releasing removes chronic tension stored in the trapezius from stress and poor posture.',
        instructions: '**STEP 1 (Setup):** Stand or sit upright.\n**STEP 2 (Shrug):** Raise both shoulders toward your ears as high as possible.\n**STEP 3 (Hold):** Hold 3 seconds at the top.\n**STEP 4 (Drop):** Let them fall suddenly — feel the release.',
        process: '3 sets of 10 reps. Exhale sharply on the drop.'
    },
    {
        muscle_id: ['traps'], common_name: 'shoulder', exercise_type: 'warmup',
        solution_stretch: 'Arm Circle Warmup',
        why: 'Arm circles lubricate the shoulder joint and warm up the rotator cuff before upper body activity.',
        instructions: '**STEP 1 (Setup):** Stand with arms out at sides, parallel to floor.\n**STEP 2 (Forward):** Make small forward circles for 15 seconds.\n**STEP 3 (Enlarge):** Gradually increase circle size.\n**STEP 4 (Reverse):** Repeat backward for 15 seconds.',
        process: '2 rounds (30 seconds each direction). A must before any upper body workout.'
    },
    {
        muscle_id: ['traps'], common_name: 'trapezius', exercise_type: 'yoga',
        solution_stretch: 'Eagle Arms Stretch',
        why: 'The Eagle Arms yoga pose deeply stretches the upper trapezius and rhomboids, releasing interscapular tension.',
        instructions: '**STEP 1 (Setup):** Sit tall in a chair.\n**STEP 2 (Cross):** Cross your right arm over your left at the elbows.\n**STEP 3 (Wrap):** If possible, wrap the forearms and bring palms together.\n**STEP 4 (Lift):** Lift elbows and hold 30 seconds.',
        process: '3 holds per side. Breathe into the upper back.'
    },
    {
        muscle_id: ['traps'], common_name: 'shoulder', exercise_type: 'posture',
        solution_stretch: 'Wall Angel',
        why: 'Wall angels retrain scapular upward rotation and correct rounded shoulder posture.',
        instructions: '**STEP 1 (Setup):** Stand with back flat against a wall, arms at 90 degrees.\n**STEP 2 (Slide Up):** Slowly slide arms upward overhead against the wall.\n**STEP 3 (Maintain Contact):** Keep wrists and elbows touching the wall throughout.\n**STEP 4 (Return):** Slide back down slowly.',
        process: '3 sets of 10 reps. Slow is better — quality over speed.'
    },
    {
        muscle_id: ['traps'], common_name: 'trapezius', exercise_type: 'strength',
        solution_stretch: 'Y-T-W Exercise',
        why: 'Y-T-W trains the lower and middle trapezius, correcting muscle imbalances that cause shoulder impingement.',
        instructions: '**STEP 1 (Setup):** Lie face down on a mat.\n**STEP 2 (Y):** Raise arms into a Y shape, thumbs up. Hold 2 seconds.\n**STEP 3 (T):** Move arms to a T shape. Hold 2 seconds.\n**STEP 4 (W):** Bend elbows to a W shape. Hold 2 seconds.',
        process: '3 sets of 10 Y-T-W cycles. Use light dumbbells when ready.'
    },

    // ─── CHEST ───────────────────────────────────────────────────────────────
    {
        muscle_id: ['chest'], common_name: 'pectoralis', exercise_type: 'relief',
        solution_stretch: 'Doorway Chest Opener',
        why: 'Tight pectorals pull shoulders forward causing neck and upper back pain. The doorway stretch directly reverses this.',
        instructions: '**STEP 1 (Setup):** Stand in a doorway, arms at 90 degrees on the frame.\n**STEP 2 (Step Forward):** Step one foot forward through the doorway.\n**STEP 3 (Open):** Lean forward until you feel a stretch across your chest.\n**STEP 4 (Hold):** Hold 30 seconds.',
        process: '3 holds. Adjust arm height to target different chest fibers.'
    },
    {
        muscle_id: ['chest'], common_name: 'pec', exercise_type: 'warmup',
        solution_stretch: 'Band Pull-Apart Warmup',
        why: 'Activates the posterior shoulder and pre-stretches the pectorals before pushing exercises.',
        instructions: '**STEP 1 (Setup):** Hold a resistance band in front at shoulder height.\n**STEP 2 (Pull):** Pull the band apart to full width.\n**STEP 3 (Squeeze):** Squeeze shoulder blades together at end range.\n**STEP 4 (Return):** Slowly return to start.',
        process: '3 sets of 15 reps as part of your warmup routine.'
    },
    {
        muscle_id: ['chest'], common_name: 'pectoralis', exercise_type: 'yoga',
        solution_stretch: 'Supported Fish Pose',
        why: 'Fish Pose (Matsyasana) stretches the chest and intercostals while opening the heart center.',
        instructions: '**STEP 1 (Setup):** Lie on your back with a rolled blanket under your mid-back.\n**STEP 2 (Open):** Let your chest rise and arms relax wide.\n**STEP 3 (Breathe):** Take 10 deep breaths expanding your chest.\n**STEP 4 (Hold):** Stay for 1–2 minutes.',
        process: '1–2 minute sustained hold. Use a rolled blanket or yoga block.'
    },
    {
        muscle_id: ['chest'], common_name: 'pec', exercise_type: 'posture',
        solution_stretch: 'Prone Cobra',
        why: 'The Prone Cobra strengthens the posterior chain and directly counteracts the rounded-back posture caused by tight pecs.',
        instructions: '**STEP 1 (Setup):** Lie face down, arms by your sides, palms down.\n**STEP 2 (Lift):** Lift your chest off the floor by squeezing your shoulder blades.\n**STEP 3 (Rotate):** Rotate your palms to face out, thumbs pointing to the ceiling.\n**STEP 4 (Hold):** Hold 5 seconds and lower.',
        process: '3 sets of 10 reps. Focus on squeezing, not hyperextending.'
    },
    {
        muscle_id: ['chest'], common_name: 'pectoralis', exercise_type: 'strength',
        solution_stretch: 'Push-Up with Plus',
        why: 'The push-up plus adds serratus anterior activation, essential for shoulder health and chest strength.',
        instructions: '**STEP 1 (Setup):** Get into a high plank (push-up position).\n**STEP 2 (Lower):** Lower to the floor with control.\n**STEP 3 (Push):** Push up fully.\n**STEP 4 (Plus):** At the top, push your shoulder blades apart (protract) extra. Hold 1 second.',
        process: '3 sets of 10. The "plus" at the top is the key movement.'
    },

    // ─── UPPER BACK ──────────────────────────────────────────────────────────
    {
        muscle_id: ['upper_back'], common_name: 'rhomboid', exercise_type: 'relief',
        solution_stretch: 'Thread the Needle',
        why: 'Thread the Needle stretches the rhomboids and rotator cuff, relieving the aching tension between the shoulder blades.',
        instructions: '**STEP 1 (Setup):** Start on hands and knees (tabletop).\n**STEP 2 (Thread):** Slide your right arm under your left arm along the floor.\n**STEP 3 (Rest):** Let your right shoulder and ear rest on the floor.\n**STEP 4 (Hold):** Hold 30 seconds, then switch sides.',
        process: '3 holds per side. Breathe into the stretch.'
    },
    {
        muscle_id: ['upper_back'], common_name: 'thoracic', exercise_type: 'warmup',
        solution_stretch: 'Cat-Cow Warmup',
        why: 'Cat-Cow mobilizes the entire thoracic spine, preparing it for extension-based upper body movements.',
        instructions: '**STEP 1 (Setup):** Start on hands and knees.\n**STEP 2 (Cow):** Inhale, drop your belly, lift your chest and tailbone.\n**STEP 3 (Cat):** Exhale, round your spine toward the ceiling, tuck chin.\n**STEP 4 (Flow):** Continue flowing with breath.',
        process: '10 slow breath-linked cycles.'
    },
    {
        muscle_id: ['upper_back'], common_name: 'latissimus dorsi', exercise_type: 'yoga',
        solution_stretch: 'Thread the Needle Yoga Flow',
        why: 'Focuses deep thoracic rotation, unwinding tension in the lats and serratus anterior.',
        instructions: '**STEP 1 (Setup):** Begin in Child\'s Pose.\n**STEP 2 (Sweep):** Sweep your right hand across the floor to the left.\n**STEP 3 (Breathe):** Breathe deeply into the right ribs.\n**STEP 4 (Return):** Return and inhale to reach up and open.',
        process: '5 breath cycles each side in a flowing yoga sequence.'
    },
    {
        muscle_id: ['upper_back'], common_name: 'trapezius', exercise_type: 'posture',
        solution_stretch: 'Scapular Retraction Hold',
        why: 'Retraining scapular retraction corrects the rounded upper back posture that strains the mid-trapezius.',
        instructions: '**STEP 1 (Setup):** Sit tall, arms at 90 degrees with elbows bent.\n**STEP 2 (Retract):** Squeeze your shoulder blades together as hard as you can.\n**STEP 3 (Hold):** Hold 10 seconds.\n**STEP 4 (Release):** Fully relax and repeat.',
        process: '3 sets of 10-second holds. Do throughout the workday.'
    },
    {
        muscle_id: ['upper_back'], common_name: 'rhomboid', exercise_type: 'strength',
        solution_stretch: 'Bent-Over Row',
        why: 'Rows directly strengthen the rhomboids and lower traps, reversing the muscle weakness causing upper back pain.',
        instructions: '**STEP 1 (Setup):** Hinge forward at the hips, holding light weights.\n**STEP 2 (Row):** Pull the weights toward your hips, elbows close to body.\n**STEP 3 (Squeeze):** Squeeze your shoulder blades at the top for 2 seconds.\n**STEP 4 (Lower):** Lower with control.',
        process: '3 sets of 12 reps. Focus on the squeeze, not the weight.'
    },

    // ─── ARMS ────────────────────────────────────────────────────────────────
    {
        muscle_id: ['arms'], common_name: 'bicep', exercise_type: 'relief',
        solution_stretch: 'Wall Bicep Stretch',
        why: 'Releases chronic bicep tightness from typing and repetitive carrying activities.',
        instructions: '**STEP 1 (Setup):** Stand beside a wall.\n**STEP 2 (Place):** Place your palm flat on the wall at shoulder height, arm straight.\n**STEP 3 (Rotate):** Slowly rotate your body away from the wall.\n**STEP 4 (Hold):** Hold 30 seconds each side.',
        process: '3 holds per side. Feel the stretch down the inner arm.'
    },
    {
        muscle_id: ['arms'], common_name: 'tricep', exercise_type: 'warmup',
        solution_stretch: 'Arm Swings Warmup',
        why: 'Dynamic arm swings increase blood flow to the triceps and shoulder before pushing exercises.',
        instructions: '**STEP 1 (Setup):** Stand with feet shoulder-width apart.\n**STEP 2 (Swing):** Swing both arms forward and back alternately.\n**STEP 3 (Increase):** Gradually increase the range of motion.\n**STEP 4 (Continue):** Swing for 30 seconds.',
        process: '2 sets of 30 seconds. Follow with cross-body swings.'
    },
    {
        muscle_id: ['arms'], common_name: 'deltoid', exercise_type: 'yoga',
        solution_stretch: 'Warrior II Arms',
        why: 'Warrior II engages and stretches the deltoids through a sustained isometric hold with breath focus.',
        instructions: '**STEP 1 (Setup):** Step feet wide apart, turn right foot out 90 degrees.\n**STEP 2 (Bend):** Bend the right knee over the ankle.\n**STEP 3 (Extend):** Extend arms parallel to the floor, palms down.\n**STEP 4 (Hold):** Hold for 5 breaths, then switch.',
        process: '3 holds of 5 breaths per side. Sink deeper into the pose with each exhale.'
    },
    {
        muscle_id: ['arms'], common_name: 'forearm', exercise_type: 'posture',
        solution_stretch: 'Wrist Flexor Stretch',
        why: 'Tight wrist flexors from typing cause elbow pain and poor grip posture. Regular stretching prevents RSI.',
        instructions: '**STEP 1 (Setup):** Extend your arm in front with palm up.\n**STEP 2 (Pull):** Use your other hand to pull your fingers back toward you.\n**STEP 3 (Hold):** Hold for 20 seconds.\n**STEP 4 (Repeat):** Switch hands and repeat.',
        process: '3 holds per side. Do every hour while working at a desk.'
    },
    {
        muscle_id: ['arms'], common_name: 'brachii', exercise_type: 'strength',
        solution_stretch: 'Dumbbell Curl',
        why: 'Balanced bicep strength prevents elbow tendinopathy and supports shoulder stability.',
        instructions: '**STEP 1 (Setup):** Stand holding dumbbells at your sides, palms forward.\n**STEP 2 (Curl):** Curl both weights toward your shoulders.\n**STEP 3 (Squeeze):** Squeeze at the top for 1 second.\n**STEP 4 (Lower):** Lower slowly over 3 seconds.',
        process: '3 sets of 12 reps. The slow lowering is key for muscle building.'
    },

    // ─── LOWER BACK ──────────────────────────────────────────────────────────
    {
        muscle_id: ['lower_back'], common_name: 'lumbar', exercise_type: 'relief',
        solution_stretch: 'Knee-to-Chest Stretch',
        why: 'Decompresses the lumbar vertebrae and stretches the erector spinae, providing immediate relief from lower back pain.',
        instructions: '**STEP 1 (Setup):** Lie flat on your back.\n**STEP 2 (Pull):** Bring both knees to your chest.\n**STEP 3 (Hug):** Wrap arms around your shins.\n**STEP 4 (Rock):** Gently rock side to side for 30 seconds.',
        process: '3 holds of 30 seconds. Use a yoga mat for comfort.'
    },
    {
        muscle_id: ['lower_back'], common_name: 'erector', exercise_type: 'warmup',
        solution_stretch: 'Hip Hinge Warmup',
        why: 'Teaching the hip hinge pattern before lifting protects the lumbar spine by using the hips rather than the back.',
        instructions: '**STEP 1 (Setup):** Stand with feet hip-width apart.\n**STEP 2 (Hinge):** Push your hips back while keeping your back flat.\n**STEP 3 (Lower):** Lower until you feel a hamstring stretch.\n**STEP 4 (Return):** Drive hips forward to stand.',
        process: '2 sets of 15 controlled reps before any lifting.'
    },
    {
        muscle_id: ['lower_back'], common_name: 'lower back', exercise_type: 'yoga',
        solution_stretch: 'Supine Spinal Twist',
        why: 'Supine Twist gently rotates the lumbar spine, releasing compression and improving spinal mobility.',
        instructions: '**STEP 1 (Setup):** Lie on your back, bend knees to chest.\n**STEP 2 (Drop):** Drop both knees to the right.\n**STEP 3 (Extend):** Extend arms in a T shape, look left.\n**STEP 4 (Hold):** Hold 1 minute, then switch.',
        process: '1 minute each side. Breathe deeply into the back.'
    },
    {
        muscle_id: ['lower_back'], common_name: 'quadratus lumborum', exercise_type: 'posture',
        solution_stretch: 'Standing Side Bend',
        why: 'The quadratus lumborum creates lateral pelvic tilt when tight, causing postural imbalances and lower back pain.',
        instructions: '**STEP 1 (Setup):** Stand with feet hip-width apart, one arm overhead.\n**STEP 2 (Bend):** Lean to the opposite side, reaching overhead.\n**STEP 3 (Hold):** Hold 20 seconds.\n**STEP 4 (Repeat):** Switch sides.',
        process: '3 holds per side. Keep hips level and avoid rotating.'
    },
    {
        muscle_id: ['lower_back'], common_name: 'lumborum', exercise_type: 'strength',
        solution_stretch: 'Bird-Dog',
        why: 'Bird-Dog simultaneously strengthens the erector spinae and stabilizes the lumbar spine — the gold standard for back rehabilitation.',
        instructions: '**STEP 1 (Setup):** On hands and knees in tabletop.\n**STEP 2 (Extend):** Extend right arm and left leg simultaneously.\n**STEP 3 (Hold):** Hold 3 seconds, keeping hips level.\n**STEP 4 (Switch):** Return and switch sides.',
        process: '3 sets of 10 per side. Do not allow hips to rotate.'
    },

    // ─── ABDOMEN ─────────────────────────────────────────────────────────────
    {
        muscle_id: ['abdomen'], common_name: 'abdominal', exercise_type: 'relief',
        solution_stretch: 'Cobra Stretch',
        why: 'The Cobra Stretch opens up the abdominal wall, relieving tightness and bloating, and counters the effects of prolonged sitting.',
        instructions: '**STEP 1 (Setup):** Lie face down, palms under shoulders.\n**STEP 2 (Press):** Press into hands and lift your chest.\n**STEP 3 (Hold):** Hold 20–30 seconds.\n**STEP 4 (Release):** Lower slowly.',
        process: '3 holds. Keep hips on the floor for a gentler stretch.'
    },
    {
        muscle_id: ['abdomen'], common_name: 'core', exercise_type: 'warmup',
        solution_stretch: 'Dead Bug Warmup',
        why: 'The Dead Bug activates the deep core before training, ensuring spinal protection during heavy lifts.',
        instructions: '**STEP 1 (Setup):** Lie on back with arms pointing to ceiling, knees bent at 90 degrees.\n**STEP 2 (Lower):** Slowly lower your right arm and left leg toward the floor.\n**STEP 3 (Return):** Bring them back up.\n**STEP 4 (Switch):** Repeat on the other side.',
        process: '3 sets of 10 per side. Keep lower back pressed to the floor throughout.'
    },
    {
        muscle_id: ['abdomen'], common_name: 'rectus', exercise_type: 'yoga',
        solution_stretch: 'Wheel Pose Preparation',
        why: 'Supported backbends from yoga lengthen the rectus abdominis and open the entire front body.',
        instructions: '**STEP 1 (Setup):** Lie on your back, feet flat, arms crossed on chest.\n**STEP 2 (Lift):** Lift into a bridge position (hips up).\n**STEP 3 (Breathe):** Take 5 deep breaths expanding the front body.\n**STEP 4 (Lower):** Roll the spine back down slowly.',
        process: '3 rounds of 5 breaths. Progress toward full Wheel when ready.'
    },
    {
        muscle_id: ['abdomen'], common_name: 'oblique', exercise_type: 'posture',
        solution_stretch: 'Pallof Press',
        why: 'The Pallof Press trains anti-rotation core stability, preventing the lateral trunk shifts that cause back pain.',
        instructions: '**STEP 1 (Setup):** Stand sideways to a resistance band anchored at chest height.\n**STEP 2 (Press):** Hold the band at your chest and press straight out.\n**STEP 3 (Hold):** Hold 2 seconds with the band pulling you to the side.\n**STEP 4 (Return):** Bring back to chest.',
        process: '3 sets of 12 per side. Do not allow your body to rotate.'
    },
    {
        muscle_id: ['abdomen'], common_name: 'transverse', exercise_type: 'strength',
        solution_stretch: 'Plank',
        why: 'The plank is the most effective exercise for the transverse abdominis, the body\'s natural weight belt.',
        instructions: '**STEP 1 (Setup):** Place forearms on the floor, elbows under shoulders.\n**STEP 2 (Lift):** Rise on toes, creating a straight line from head to heels.\n**STEP 3 (Brace):** Breathe into your belly and brace your core.\n**STEP 4 (Hold):** Hold for 20–60 seconds.',
        process: '3 sets. Build up to 60 seconds over time.'
    },

    // ─── HIPS ────────────────────────────────────────────────────────────────
    {
        muscle_id: ['hips'], common_name: 'hip flexor', exercise_type: 'relief',
        solution_stretch: 'Low Lunge Hip Flexor Stretch',
        why: 'Sitting tightens the hip flexors and tilts the pelvis forward, causing lower back pain. This stretch directly reverses that.',
        instructions: '**STEP 1 (Setup):** Kneel on one knee in a lunge position.\n**STEP 2 (Shift):** Shift your hips forward until you feel a stretch in the front hip.\n**STEP 3 (Arms):** Raise both arms overhead to increase the stretch.\n**STEP 4 (Hold):** Hold 30 seconds, then switch.',
        process: '3 holds per side. Do after every long sitting session.'
    },
    {
        muscle_id: ['hips'], common_name: 'iliopsoas', exercise_type: 'warmup',
        solution_stretch: 'Leg Swings',
        why: 'Leg swings dynamically warm up the hip flexors and extensors before running or lower body training.',
        instructions: '**STEP 1 (Setup):** Hold a wall for balance, stand on one foot.\n**STEP 2 (Forward):** Swing the free leg forward as high as comfortable.\n**STEP 3 (Back):** Swing it back behind you naturally.\n**STEP 4 (Continue):** 15 swings per leg, then go side-to-side.',
        process: '15 forward swings + 15 lateral swings per leg.'
    },
    {
        muscle_id: ['hips'], common_name: 'hip', exercise_type: 'yoga',
        solution_stretch: 'Pigeon Pose',
        why: 'Pigeon Pose is the definitive yoga hip opener, stretching the piriformis and hip external rotators deeply.',
        instructions: '**STEP 1 (Setup):** From Downward Dog, bring your right knee toward your right wrist.\n**STEP 2 (Lower):** Lower the right shin to the floor at an angle.\n**STEP 3 (Fold):** Walk hands forward and lower your torso over your shin.\n**STEP 4 (Hold):** Hold for 2 minutes, then switch.',
        process: '2 minutes per side. Use a blanket under the hip for comfort.'
    },
    {
        muscle_id: ['hips'], common_name: 'tensor', exercise_type: 'posture',
        solution_stretch: 'Clamshell',
        why: 'The Clamshell strengthens the hip abductors and corrects Trendelenburg gait, a common postural imbalance.',
        instructions: '**STEP 1 (Setup):** Lie on your side with hips and knees at 45 degrees.\n**STEP 2 (Open):** Lift the top knee up like a clamshell, keeping feet together.\n**STEP 3 (Hold):** Hold 2 seconds at the top.\n**STEP 4 (Lower):** Return slowly.',
        process: '3 sets of 15 per side. Add a resistance band around thighs to progress.'
    },
    {
        muscle_id: ['hips'], common_name: 'flexor', exercise_type: 'strength',
        solution_stretch: 'Resistance Band Hip Flexion',
        why: 'Strengthening the hip flexors prevents hip instability, groin strains, and lower back overload.',
        instructions: '**STEP 1 (Setup):** Attach a resistance band to your ankle and anchor it behind you.\n**STEP 2 (Lift):** Drive your knee up toward your chest.\n**STEP 3 (Hold):** Hold 1 second at the top.\n**STEP 4 (Lower):** Lower slowly with control.',
        process: '3 sets of 15 per leg.'
    },

    // ─── GLUTES ──────────────────────────────────────────────────────────────
    {
        muscle_id: ['glutes'], common_name: 'gluteus', exercise_type: 'relief',
        solution_stretch: 'Figure Four Stretch',
        why: 'The Figure Four directly targets the piriformis and gluteus medius, relieving sciatic-style hip pain.',
        instructions: '**STEP 1 (Setup):** Lie on your back, cross your right ankle over your left knee.\n**STEP 2 (Pull):** Reach through and pull your left thigh toward you.\n**STEP 3 (Press):** Use your right elbow to push the right knee open.\n**STEP 4 (Hold):** Hold 30–60 seconds, then switch.',
        process: '3 holds per side. The deeper the pull, the deeper the stretch.'
    },
    {
        muscle_id: ['glutes'], common_name: 'piriformis', exercise_type: 'warmup',
        solution_stretch: 'Glute Bridge Warmup',
        why: 'Glute bridges activate the glutes before lower body training, reducing knee and lower back stress during lifts.',
        instructions: '**STEP 1 (Setup):** Lie on back, knees bent, feet flat.\n**STEP 2 (Squeeze):** Squeeze your glutes and lift your hips.\n**STEP 3 (Hold):** Hold 2 seconds at the top.\n**STEP 4 (Lower):** Lower with control.',
        process: '3 sets of 15 reps. Focus on squeezing glutes, not pushing through the feet.'
    },
    {
        muscle_id: ['glutes'], common_name: 'glute', exercise_type: 'yoga',
        solution_stretch: 'Happy Baby Pose',
        why: 'Happy Baby decompresses the sacroiliac joint and stretches the inner glutes and adductors.',
        instructions: '**STEP 1 (Setup):** Lie on your back.\n**STEP 2 (Grab):** Bring knees to chest and grab the outer edges of your feet.\n**STEP 3 (Pull):** Gently pull knees toward armpits.\n**STEP 4 (Rock):** Rock gently side to side for 1 minute.',
        process: '1 minute sustained hold. Breathe deeply into the hips.'
    },
    {
        muscle_id: ['glutes'], common_name: 'gluteus', exercise_type: 'posture',
        solution_stretch: 'Single-Leg Glute Bridge',
        why: 'Single-leg variations expose and correct glute strength imbalances that cause pelvic drop and back pain.',
        instructions: '**STEP 1 (Setup):** Lie on back, left foot flat, right leg extended to the ceiling.\n**STEP 2 (Bridge):** Drive through the left heel to lift hips.\n**STEP 3 (Level):** Keep hips level — don\'t let one side drop.\n**STEP 4 (Lower):** Lower slowly.',
        process: '3 sets of 10 per side. Very revealing of imbalances.'
    },
    {
        muscle_id: ['glutes'], common_name: 'glute', exercise_type: 'strength',
        solution_stretch: 'Hip Thrust',
        why: 'The hip thrust produces the highest gluteus maximus activation of any exercise, building the power that protects the lower back and knees.',
        instructions: '**STEP 1 (Setup):** Sit against a bench, barbell/weight across hips.\n**STEP 2 (Drive):** Drive hips up to full extension.\n**STEP 3 (Squeeze):** Squeeze glutes hard at the top for 1 second.\n**STEP 4 (Lower):** Lower to just above floor.',
        process: '3 sets of 10 reps. Keep chin tucked to avoid hyperextending the spine.'
    },

    // ─── THIGHS ──────────────────────────────────────────────────────────────
    {
        muscle_id: ['thighs'], common_name: 'hamstring', exercise_type: 'relief',
        solution_stretch: 'Standing Hamstring Stretch',
        why: 'Tight hamstrings are a major contributor to lower back pain by pulling the pelvis into a posterior tilt.',
        instructions: '**STEP 1 (Setup):** Stand and place one heel on an elevated surface.\n**STEP 2 (Hinge):** Hinge forward at the hips, keeping your back flat.\n**STEP 3 (Feel):** Feel the stretch down the back of the leg.\n**STEP 4 (Hold):** Hold 30 seconds, then switch.',
        process: '3 holds per side. Flex your foot to deepen the stretch.'
    },
    {
        muscle_id: ['thighs'], common_name: 'quadriceps', exercise_type: 'warmup',
        solution_stretch: 'High Knees Warmup',
        why: 'High knees elevate heart rate and warm up the quads, hip flexors, and calves simultaneously.',
        instructions: '**STEP 1 (Setup):** Stand with feet hip-width apart.\n**STEP 2 (March):** Drive your right knee up to hip level.\n**STEP 3 (Alternate):** Quickly switch to the left knee.\n**STEP 4 (Pace):** Increase speed progressively over 30 seconds.',
        process: '3 sets of 30 seconds. Drive through the arms for full activation.'
    },
    {
        muscle_id: ['thighs'], common_name: 'quad', exercise_type: 'yoga',
        solution_stretch: 'Low Lunge Quadricep Yoga',
        why: 'Low Lunge with a back knee down is a classic yoga quad stretch that also opens the hip flexors.',
        instructions: '**STEP 1 (Setup):** Step right foot forward into a low lunge, back knee down.\n**STEP 2 (Sink):** Lower your hips toward the floor.\n**STEP 3 (Reach):** For deeper stretch, reach back and grab your back foot.\n**STEP 4 (Hold):** Hold 45 seconds, then switch.',
        process: '3 holds per side. Breathe and surrender into the stretch.'
    },
    {
        muscle_id: ['thighs'], common_name: 'adductor', exercise_type: 'posture',
        solution_stretch: 'Sumo Squat Hold',
        why: 'The Sumo Squat trains hip external rotation, corrects knee collapse (valgus), and restores symmetrical lower body posture.',
        instructions: '**STEP 1 (Setup):** Stand wide, toes turned out 45 degrees.\n**STEP 2 (Squat):** Lower until thighs are parallel.\n**STEP 3 (Press):** Press knees out over toes using elbows.\n**STEP 4 (Hold):** Hold 30 seconds.',
        process: '3 holds. Work up to a full and flat-footed squat over time.'
    },
    {
        muscle_id: ['thighs'], common_name: 'femor', exercise_type: 'strength',
        solution_stretch: 'Bulgarian Split Squat',
        why: 'The Bulgarian Split Squat is the most effective single-leg exercise correcting quad and glute imbalances.',
        instructions: '**STEP 1 (Setup):** Back foot elevated on a bench, front foot far out.\n**STEP 2 (Lower):** Drop your back knee toward the floor.\n**STEP 3 (Drive):** Drive through your front heel to stand.\n**STEP 4 (Repeat):** Complete all reps before switching.',
        process: '3 sets of 8–10 per leg. Hold dumbbells for added resistance.'
    },

    // ─── KNEES ───────────────────────────────────────────────────────────────
    {
        muscle_id: ['knees'], common_name: 'knee', exercise_type: 'relief',
        solution_stretch: 'Seated Knee Extension Stretch',
        why: 'Improves circulation around the knee joint and reduces inflammation from patellar tendinopathy.',
        instructions: '**STEP 1 (Setup):** Sit on the edge of a chair.\n**STEP 2 (Extend):** Slowly straighten one leg out in front.\n**STEP 3 (Flex):** Flex your foot and hold 10 seconds.\n**STEP 4 (Lower):** Slowly lower with control.',
        process: '3 sets of 12 per leg. Pair with icing after if inflamed.'
    },
    {
        muscle_id: ['knees'], common_name: 'patella', exercise_type: 'warmup',
        solution_stretch: 'Leg Swing Knee Warmup',
        why: 'Gently mobilizes the knee joint and warms up the patellar tendon before activity.',
        instructions: '**STEP 1 (Setup):** Hold a wall, stand on one leg.\n**STEP 2 (Swing):** Swing the bent leg, bending and extending through the knee.\n**STEP 3 (Control):** Keep the motion controlled, not floppy.\n**STEP 4 (Continue):** 15 swings per leg.',
        process: '2 sets of 15 per leg. Great before running or squatting.'
    },
    {
        muscle_id: ['knees'], common_name: 'popliteus', exercise_type: 'yoga',
        solution_stretch: 'Reclining Hero Pose',
        why: 'Reclining Hero (Supta Virasana) stretches the quadriceps and popliteus, releasing posterior knee tension.',
        instructions: '**STEP 1 (Setup):** Kneel with feet beside your hips.\n**STEP 2 (Sit):** Sit back between your feet if possible.\n**STEP 3 (Recline):** Lean back onto your hands, then elbows.\n**STEP 4 (Hold):** Hold 30–60 seconds, supporting with a pillow if needed.',
        process: '2 holds of 1 minute. Use a blanket under knees for comfort.'
    },
    {
        muscle_id: ['knees'], common_name: 'knee', exercise_type: 'posture',
        solution_stretch: 'Terminal Knee Extension',
        why: 'TKE corrects knee hyperextension and activates the VMO (inner quad), critical for healthy knee tracking.',
        instructions: '**STEP 1 (Setup):** Loop a resistance band behind your knee, anchored in front.\n**STEP 2 (Bend):** Slightly bend your knee against the band tension.\n**STEP 3 (Extend):** Straighten your knee while the band resists.\n**STEP 4 (Hold):** Hold straight for 1 second.',
        process: '3 sets of 15 per leg. Excellent for post-knee-surgery rehab.'
    },
    {
        muscle_id: ['knees'], common_name: 'patella', exercise_type: 'strength',
        solution_stretch: 'Step-Up',
        why: 'Step-ups strengthen the VMO and glutes in a knee-safe movement that improves joint tracking.',
        instructions: '**STEP 1 (Setup):** Stand in front of a sturdy step or box.\n**STEP 2 (Step):** Step your right foot up onto the box.\n**STEP 3 (Drive):** Drive through the right heel to bring the left foot up.\n**STEP 4 (Lower):** Step back down with control.',
        process: '3 sets of 12 per leg. Add dumbbells to progress.'
    },

    // ─── CALVES ──────────────────────────────────────────────────────────────
    {
        muscle_id: ['calves'], common_name: 'gastrocnemius', exercise_type: 'relief',
        solution_stretch: 'Wall Calf Stretch',
        why: 'Tight calves contribute to plantar fasciitis, knee pain, and Achilles tendinopathy. This is the fastest relief.',
        instructions: '**STEP 1 (Setup):** Stand facing a wall, hands on the wall.\n**STEP 2 (Step):** Step one foot back about 1 metre.\n**STEP 3 (Press):** Press the back heel flat to the floor.\n**STEP 4 (Hold):** Hold 30 seconds, then switch.',
        process: '3 holds per side. Bend the back knee slightly to target the soleus.'
    },
    {
        muscle_id: ['calves'], common_name: 'soleus', exercise_type: 'warmup',
        solution_stretch: 'Calf Raise Warmup',
        why: 'Calf raises warm up the Achilles tendon and improve ankle dorsiflexion before running and jumping activities.',
        instructions: '**STEP 1 (Setup):** Stand with feet hip-width apart.\n**STEP 2 (Rise):** Rise onto your toes as high as possible.\n**STEP 3 (Hold):** Hold 1 second at the top.\n**STEP 4 (Lower):** Lower slowly over 3 seconds.',
        process: '3 sets of 15. Also do with toes turned in and out.'
    },
    {
        muscle_id: ['calves'], common_name: 'achilles', exercise_type: 'yoga',
        solution_stretch: 'Downward Dog Calf Walk',
        why: 'Walking the dog in Downward Dog alternately stretches each calf and Achilles tendon dynamically.',
        instructions: '**STEP 1 (Setup):** Get into Downward Facing Dog.\n**STEP 2 (Pedal):** Press one heel to the floor while bending the other knee.\n**STEP 3 (Alternate):** Alternate in a slow walking motion.\n**STEP 4 (Continue):** Walk for 10 breaths.',
        process: '3 rounds of 10 breaths. One of the most effective yoga calf stretches.'
    },
    {
        muscle_id: ['calves'], common_name: 'calf', exercise_type: 'posture',
        solution_stretch: 'Heel Drop on Step',
        why: 'Eccentric calf loading on a step corrects equinus posture (walking on toes) and treats Achilles tendinopathy.',
        instructions: '**STEP 1 (Setup):** Stand on a step with only the balls of your feet.\n**STEP 2 (Rise):** Rise up on both feet.\n**STEP 3 (Lower):** Lower on one foot slowly over 5 seconds.\n**STEP 4 (Repeat):** Complete set, then switch.',
        process: '3 sets of 15 per side. The gold standard for Achilles rehab.'
    },
    {
        muscle_id: ['calves'], common_name: 'gastrocnemius', exercise_type: 'strength',
        solution_stretch: 'Weighted Calf Raise',
        why: 'Strong calves reduce ankle sprain risk, improve running economy, and protect the Achilles under load.',
        instructions: '**STEP 1 (Setup):** Hold dumbbells, stand on the edge of a step.\n**STEP 2 (Lower):** Lower heels below step level.\n**STEP 3 (Rise):** Push up to full plantarflexion.\n**STEP 4 (Lower):** Lower slowly over 3 seconds.',
        process: '4 sets of 15 reps. Go heavy for strength, light for endurance.'
    },

    // ─── ANKLES ──────────────────────────────────────────────────────────────
    {
        muscle_id: ['ankles'], common_name: 'ankle', exercise_type: 'relief',
        solution_stretch: 'Ankle Circle Stretch',
        why: 'Ankle circles restore full joint mobility after sprains and reduce stiffness from prolonged standing and walking.',
        instructions: '**STEP 1 (Setup):** Sit in a chair and cross one ankle over the opposite knee.\n**STEP 2 (Circle):** Rotate the ankle in large slow circles clockwise.\n**STEP 3 (Reverse):** Reverse direction after 10 circles.\n**STEP 4 (Switch):** Repeat on the other ankle.',
        process: '10 circles each direction per ankle. Do twice daily after ankle injury.'
    },
    {
        muscle_id: ['ankles'], common_name: 'tibialis', exercise_type: 'warmup',
        solution_stretch: 'Ankle Alphabet',
        why: 'Tracing the alphabet with the foot warms up all planes of ankle motion and proprioception before sport.',
        instructions: '**STEP 1 (Setup):** Sit with leg extended or cross-legged.\n**STEP 2 (Trace):** Use your foot to trace each letter of the alphabet in the air.\n**STEP 3 (Large):** Make the letters as large as possible.\n**STEP 4 (Switch):** Repeat on the other foot.',
        process: 'One full alphabet per foot. Takes about 2 minutes each.'
    },
    {
        muscle_id: ['ankles'], common_name: 'peroneal', exercise_type: 'yoga',
        solution_stretch: 'Lotus Ankle Rotation',
        why: 'Gentle ankle rotation in a seated yoga position improves peroneal flexibility and lateral ankle stability.',
        instructions: '**STEP 1 (Setup):** Sit in easy pose (cross-legged).\n**STEP 2 (Hold):** Cradle one foot in your hands.\n**STEP 3 (Rotate):** Slowly rotate the foot through full range of motion.\n**STEP 4 (Switch):** Repeat on the other foot.',
        process: '10 slow rotations each direction per foot. Focus on breath.'
    },
    {
        muscle_id: ['ankles'], common_name: 'ankle', exercise_type: 'posture',
        solution_stretch: 'Single-Leg Balance',
        why: 'Single-leg balance retrains ankle proprioception and prevents the lateral instability that causes recurring sprains.',
        instructions: '**STEP 1 (Setup):** Stand near a wall for safety.\n**STEP 2 (Lift):** Lift one foot off the floor.\n**STEP 3 (Balance):** Balance on one leg for 30 seconds.\n**STEP 4 (Progress):** Close your eyes when it becomes easy.',
        process: '3 holds of 30 seconds per leg. Eyes closed = advanced.'
    },
    {
        muscle_id: ['ankles'], common_name: 'fibular', exercise_type: 'strength',
        solution_stretch: 'Resistance Band Ankle Eversion',
        why: 'Strengthening the peroneal muscles (evertors) is the most effective prevention for lateral ankle sprains.',
        instructions: '**STEP 1 (Setup):** Loop a resistance band around your foot and anchor it inward.\n**STEP 2 (Evert):** Pull your foot outward against band resistance.\n**STEP 3 (Hold):** Hold 2 seconds at end range.\n**STEP 4 (Return):** Return slowly.',
        process: '3 sets of 15 per ankle. Also do inversion with band anchored outward.'
    },

    // ─── FEET ────────────────────────────────────────────────────────────────
    {
        muscle_id: ['feet'], common_name: 'plantar', exercise_type: 'relief',
        solution_stretch: 'Plantar Fascia Stretch',
        why: 'Stretching the plantar fascia first thing in the morning prevents the sharp morning heel pain of plantar fasciitis.',
        instructions: '**STEP 1 (Setup):** Sit on the edge of your bed.\n**STEP 2 (Cross):** Cross one foot over the opposite knee.\n**STEP 3 (Pull):** Pull the toes back toward your shin.\n**STEP 4 (Hold):** Hold 30 seconds, then switch.',
        process: '3 holds per foot. Do before your first steps in the morning.'
    },
    {
        muscle_id: ['feet'], common_name: 'foot', exercise_type: 'warmup',
        solution_stretch: 'Toe Spread and Scrunch',
        why: 'Toe spreading and scrunching activates the intrinsic foot muscles, preparing the foot for the impact forces of exercise.',
        instructions: '**STEP 1 (Setup):** Sit or stand barefoot.\n**STEP 2 (Spread):** Spread your toes as wide apart as possible. Hold 3 seconds.\n**STEP 3 (Scrunch):** Curl and scrunch toes under. Hold 3 seconds.\n**STEP 4 (Repeat):** Alternate for 10 reps.',
        process: '3 sets of 10 reps. Do barefoot for maximum activation.'
    },
    {
        muscle_id: ['feet'], common_name: 'heel', exercise_type: 'yoga',
        solution_stretch: 'Thunderbolt Toe Stretch',
        why: 'Thunderbolt pose (Vajrasana with toes curled under) is one of yoga\'s most intense and effective plantar fascia stretches.',
        instructions: '**STEP 1 (Setup):** Kneel on the floor and tuck all toes under.\n**STEP 2 (Sit):** Sit back onto your heels.\n**STEP 3 (Feel):** Feel the deep stretch through the soles of your feet.\n**STEP 4 (Hold):** Hold 1–3 minutes.',
        process: '1–3 minute hold. Start with 30 seconds and build up tolerance.'
    },
    {
        muscle_id: ['feet'], common_name: 'metatarsal', exercise_type: 'posture',
        solution_stretch: 'Short Foot Exercise',
        why: 'The Short Foot Exercise trains the intrinsic arch muscles, correcting flat feet and improving overall lower limb posture.',
        instructions: '**STEP 1 (Setup):** Sit or stand barefoot with foot flat on the floor.\n**STEP 2 (Shorten):** Pull the ball of your foot toward your heel without curling toes.\n**STEP 3 (Hold):** Hold the arch contraction for 5 seconds.\n**STEP 4 (Release):** Fully relax and repeat.',
        process: '3 sets of 10 per foot. Very subtle movement — quality over quantity.'
    },
    {
        muscle_id: ['feet'], common_name: 'toe', exercise_type: 'strength',
        solution_stretch: 'Towel Scrunches',
        why: 'Towel scrunches strengthen the toe flexors and intrinsic foot muscles, building the arch and preventing foot collapse.',
        instructions: '**STEP 1 (Setup):** Sit in a chair with a small towel on the floor.\n**STEP 2 (Scrunch):** Use your toes to scrunch and drag the towel toward you.\n**STEP 3 (Repeat):** Reposition the towel and do another rep.\n**STEP 4 (Complete):** 15 scrunch-and-drag reps per foot.',
        process: '3 sets of 15 per foot. Progress to picking up marbles with toes.'
    },
];

async function seed() {
    console.log(`\nSeeding ${EXERCISES.length} exercises to Supabase...`);
    let successCount = 0;
    let errorCount = 0;

    for (const exercise of EXERCISES) {
        const { error } = await supabase
            .from('recovery_knowledge_base')
            .insert([exercise]);

        if (error) {
            console.error(`✗ Failed: ${exercise.solution_stretch} —`, error.message);
            errorCount++;
        } else {
            console.log(`✓ Inserted: ${exercise.solution_stretch} (${exercise.muscle_id[0]} / ${exercise.exercise_type})`);
            successCount++;
        }
    }

    console.log(`\n─── Seed Complete ───`);
    console.log(`✓ Inserted: ${successCount} exercises`);
    console.log(`✗ Errors:   ${errorCount} exercises`);
}

seed().catch(console.error);
