-- MuscliKnot Exercise Seed Script (75 exercises: 15 muscle regions × 5 activity types)
-- Paste this ENTIRE script into: Supabase Dashboard → SQL Editor → New Query → Run

INSERT INTO recovery_knowledge_base (muscle_id, common_name, exercise_type, solution_stretch, why, instructions, process) VALUES
-- ─── HEAD ────────────────────────────────────────────────────────────────────
('{"head"}', 'temporalis', 'relief', 'Temple Pressure Release', 'The temporalis holds tension from jaw clenching and stress headaches. Releasing it reduces headache frequency.', '**STEP 1 (Setup):** Sit upright in a chair with your spine tall.
**STEP 2 (Position):** Place your fingertips on your temples.
**STEP 3 (Execute):** Apply gentle circular pressure for 30 seconds.
**STEP 4 (Release):** Breathe deeply and relax your jaw.', '3 sets of 30-second holds. Rest 10 seconds between sets.'),

('{"head"}', 'frontalis', 'warmup', 'Brow Raise Warmup', 'Activates the frontalis before activity, preventing forehead tension during prolonged focus.', '**STEP 1 (Setup):** Sit or stand relaxed.
**STEP 2 (Execute):** Raise your eyebrows as high as possible.
**STEP 3 (Hold):** Hold 3 seconds.
**STEP 4 (Release):** Lower slowly and relax.', '10 controlled reps. Takes about 1 minute.'),

('{"head"}', 'masseter', 'yoga', 'Lions Breath Jaw Release', 'Stretches the masseter and releases jaw tension caused by stress and grinding.', '**STEP 1 (Setup):** Kneel or sit cross-legged.
**STEP 2 (Inhale):** Breathe in deeply through the nose.
**STEP 3 (Exhale):** Open mouth wide, stick out tongue, and exhale loudly.
**STEP 4 (Repeat):** Return to neutral and repeat.', '5 rounds of Lions Breath. Excellent for facial tension.'),

('{"head"}', 'occipitalis', 'posture', 'Chin Tuck Occipital Reset', 'Forward head posture strains the occipitalis. Chin tucks correct alignment and reduce occipital headaches.', '**STEP 1 (Setup):** Stand against a wall, heels and shoulders touching it.
**STEP 2 (Tuck):** Pull your chin straight back (not down).
**STEP 3 (Hold):** Hold 5 seconds.
**STEP 4 (Repeat):** Release and repeat.', '3 sets of 10 reps. Do every hour at your desk.'),

('{"head"}', 'temporalis', 'strength', 'Jaw Resistance Press', 'Balanced jaw strength prevents TMJ issues and supports proper head alignment.', '**STEP 1 (Setup):** Place a folded cloth between your back molars.
**STEP 2 (Execute):** Gently bite to 50% effort.
**STEP 3 (Hold):** Hold 5 seconds.
**STEP 4 (Switch):** Repeat on the other side.', '3 sets of 5-second holds per side.'),

-- ─── NECK ────────────────────────────────────────────────────────────────────
('{"neck"}', 'trapezius', 'relief', 'Upper Trapezius Stretch', 'Lateral stretching decompresses C3-C5 vertebrae and releases neck tension.', '**STEP 1 (Setup):** Sit on one hand to anchor the shoulder.
**STEP 2 (Tilt):** Tilt your opposite ear toward your shoulder.
**STEP 3 (Enhance):** Add light hand pressure on the crown.
**STEP 4 (Hold):** Hold 30 seconds each side.', '2 sets per side. Breathe slowly throughout.'),

('{"neck"}', 'sternocleidomastoid', 'warmup', 'SCM Neck Rotation Warmup', 'Warms up the sternocleidomastoid before activity, preventing neck strain.', '**STEP 1 (Setup):** Stand tall, shoulders relaxed.
**STEP 2 (Rotate):** Turn head slowly to the right, hold 2 seconds.
**STEP 3 (Return):** Return to center.
**STEP 4 (Alternate):** Repeat to the left.', '10 slow rotations each side. Takes about 2 minutes.'),

('{"neck"}', 'levator scapulae', 'yoga', 'Yoga Neck Rolls', 'Slow yoga neck rolls release the levator scapulae and create space in the cervical spine.', '**STEP 1 (Setup):** Sit in easy pose (cross-legged).
**STEP 2 (Drop):** Drop your chin to your chest.
**STEP 3 (Roll):** Slowly roll your head to the right, back, left, and forward.
**STEP 4 (Reverse):** Repeat in the opposite direction.', '3 slow full circles each direction.'),

('{"neck"}', 'cervical', 'posture', 'Cervical Retraction Wall Drill', 'Strengthens deep neck flexors and corrects forward head posture.', '**STEP 1 (Setup):** Stand with back flat against a wall.
**STEP 2 (Retract):** Pull chin straight back until head touches the wall.
**STEP 3 (Hold):** Hold 5-10 seconds.
**STEP 4 (Release):** Return to neutral.', '3 sets of 10 reps. Do daily for best results.'),

('{"neck"}', 'scalene', 'strength', 'Lateral Neck Resistance', 'Strengthening the scalenes stabilizes the cervical spine and prevents recurring strains.', '**STEP 1 (Setup):** Place your hand against the side of your head.
**STEP 2 (Resist):** Push head into hand without moving.
**STEP 3 (Hold):** Hold 5 seconds each side.
**STEP 4 (Repeat):** Complete all sides (left, right, forward, back).', '3 sets of 5-second isometric holds per direction.'),

-- ─── TRAPS / SHOULDERS ───────────────────────────────────────────────────────
('{"traps"}', 'trapezius', 'relief', 'Shoulder Shrug and Drop', 'Removes chronic tension stored in the trapezius from stress and poor posture.', '**STEP 1 (Setup):** Stand or sit upright.
**STEP 2 (Shrug):** Raise both shoulders toward your ears as high as possible.
**STEP 3 (Hold):** Hold 3 seconds at the top.
**STEP 4 (Drop):** Let them fall suddenly — feel the release.', '3 sets of 10 reps.'),

('{"traps"}', 'shoulder', 'warmup', 'Arm Circle Warmup', 'Lubricates the shoulder joint and warms up the rotator cuff before upper body activity.', '**STEP 1 (Setup):** Stand with arms out at sides, parallel to floor.
**STEP 2 (Forward):** Make small forward circles for 15 seconds.
**STEP 3 (Enlarge):** Gradually increase circle size.
**STEP 4 (Reverse):** Repeat backward for 15 seconds.', '2 rounds (30 seconds each direction).'),

('{"traps"}', 'trapezius', 'yoga', 'Eagle Arms Stretch', 'Deeply stretches the upper trapezius and rhomboids, releasing interscapular tension.', '**STEP 1 (Setup):** Sit tall in a chair.
**STEP 2 (Cross):** Cross your right arm over your left at the elbows.
**STEP 3 (Wrap):** Wrap forearms and bring palms together.
**STEP 4 (Lift):** Lift elbows and hold 30 seconds.', '3 holds per side. Breathe into the upper back.'),

('{"traps"}', 'shoulder', 'posture', 'Wall Angel', 'Retrains scapular upward rotation and corrects rounded shoulder posture.', '**STEP 1 (Setup):** Stand with back flat against a wall, arms at 90 degrees.
**STEP 2 (Slide Up):** Slowly slide arms upward overhead against the wall.
**STEP 3 (Maintain):** Keep wrists and elbows touching the wall.
**STEP 4 (Return):** Slide back down slowly.', '3 sets of 10 reps. Slow is better than fast.'),

('{"traps"}', 'trapezius', 'strength', 'Y-T-W Exercise', 'Corrects muscle imbalances that cause shoulder impingement.', '**STEP 1 (Setup):** Lie face down on a mat.
**STEP 2 (Y):** Raise arms in a Y shape, thumbs up. Hold 2 seconds.
**STEP 3 (T):** Move arms to a T shape. Hold 2 seconds.
**STEP 4 (W):** Bend elbows to a W shape. Hold 2 seconds.', '3 sets of 10 Y-T-W cycles.'),

-- ─── CHEST ───────────────────────────────────────────────────────────────────
('{"chest"}', 'pectoralis', 'relief', 'Doorway Chest Opener', 'Tight pectorals pull shoulders forward causing neck and upper back pain.', '**STEP 1 (Setup):** Stand in a doorway, arms at 90 degrees on the frame.
**STEP 2 (Step):** Step one foot forward through the doorway.
**STEP 3 (Lean):** Lean forward until you feel a stretch across your chest.
**STEP 4 (Hold):** Hold 30 seconds.', '3 holds. Adjust arm height to target different chest fibers.'),

('{"chest"}', 'pec', 'warmup', 'Band Pull-Apart Warmup', 'Pre-stretches the pectorals and activates rear shoulder before pushing exercises.', '**STEP 1 (Setup):** Hold a resistance band at shoulder height.
**STEP 2 (Pull):** Pull band apart to full width.
**STEP 3 (Squeeze):** Squeeze shoulder blades together at end range.
**STEP 4 (Return):** Slowly return to start.', '3 sets of 15 reps.'),

('{"chest"}', 'pectoralis', 'yoga', 'Supported Fish Pose', 'Fish Pose stretches the chest and intercostals while opening the heart center.', '**STEP 1 (Setup):** Lie on your back with a rolled blanket under mid-back.
**STEP 2 (Open):** Let your chest rise and arms relax wide.
**STEP 3 (Breathe):** Take 10 deep breaths expanding your chest.
**STEP 4 (Hold):** Stay for 1-2 minutes.', '1-2 minute sustained hold.'),

('{"chest"}', 'pec', 'posture', 'Prone Cobra', 'Strengthens the posterior chain and counteracts rounded-back posture.', '**STEP 1 (Setup):** Lie face down, arms by sides, palms down.
**STEP 2 (Lift):** Lift chest by squeezing shoulder blades.
**STEP 3 (Rotate):** Rotate palms to face out, thumbs to ceiling.
**STEP 4 (Hold):** Hold 5 seconds and lower.', '3 sets of 10 reps.'),

('{"chest"}', 'pectoralis', 'strength', 'Push-Up with Plus', 'Adds serratus anterior activation, essential for shoulder health and chest strength.', '**STEP 1 (Setup):** Get into a high plank.
**STEP 2 (Lower):** Lower to the floor with control.
**STEP 3 (Push):** Push up fully.
**STEP 4 (Plus):** At the top, push shoulder blades apart (protract) extra. Hold 1 second.', '3 sets of 10. The plus at the top is the key movement.'),

-- ─── UPPER BACK ──────────────────────────────────────────────────────────────
('{"upper_back"}', 'rhomboid', 'relief', 'Thread the Needle', 'Stretches rhomboids and rotator cuff, relieving tension between the shoulder blades.', '**STEP 1 (Setup):** Start on hands and knees (tabletop).
**STEP 2 (Thread):** Slide right arm under left along the floor.
**STEP 3 (Rest):** Let right shoulder and ear rest on the floor.
**STEP 4 (Hold):** Hold 30 seconds, then switch.', '3 holds per side.'),

('{"upper_back"}', 'thoracic', 'warmup', 'Cat-Cow Warmup', 'Mobilizes the thoracic spine before upper body movements.', '**STEP 1 (Setup):** Start on hands and knees.
**STEP 2 (Cow):** Inhale, drop belly, lift chest and tailbone.
**STEP 3 (Cat):** Exhale, round spine, tuck chin.
**STEP 4 (Flow):** Continue flowing with breath.', '10 slow breath-linked cycles.'),

('{"upper_back"}', 'latissimus dorsi', 'yoga', 'Thread the Needle Yoga Flow', 'Deep thoracic rotation unwinding tension in the lats and serratus anterior.', '**STEP 1 (Setup):** Begin in Child''s Pose.
**STEP 2 (Sweep):** Sweep right hand across floor to the left.
**STEP 3 (Breathe):** Breathe deeply into the right ribs.
**STEP 4 (Return):** Inhale and reach up to open.', '5 breath cycles each side.'),

('{"upper_back"}', 'trapezius', 'posture', 'Scapular Retraction Hold', 'Corrects rounded upper back posture that strains the mid-trapezius.', '**STEP 1 (Setup):** Sit tall, arms at 90 degrees with elbows bent.
**STEP 2 (Retract):** Squeeze shoulder blades together as hard as you can.
**STEP 3 (Hold):** Hold 10 seconds.
**STEP 4 (Release):** Fully relax.', '3 sets of 10-second holds.'),

('{"upper_back"}', 'rhomboid', 'strength', 'Bent-Over Row', 'Strengthens rhomboids and lower traps, reversing weakness causing upper back pain.', '**STEP 1 (Setup):** Hinge forward at hips, holding light weights.
**STEP 2 (Row):** Pull weights toward hips, elbows close to body.
**STEP 3 (Squeeze):** Squeeze shoulder blades at top for 2 seconds.
**STEP 4 (Lower):** Lower with control.', '3 sets of 12 reps.'),

-- ─── ARMS ────────────────────────────────────────────────────────────────────
('{"arms"}', 'bicep', 'relief', 'Wall Bicep Stretch', 'Releases chronic bicep tightness from typing and repetitive carrying.', '**STEP 1 (Setup):** Stand beside a wall.
**STEP 2 (Place):** Place palm flat on wall at shoulder height, arm straight.
**STEP 3 (Rotate):** Slowly rotate body away from the wall.
**STEP 4 (Hold):** Hold 30 seconds each side.', '3 holds per side.'),

('{"arms"}', 'tricep', 'warmup', 'Arm Swings Warmup', 'Increases blood flow to triceps and shoulder before pushing exercises.', '**STEP 1 (Setup):** Stand feet shoulder-width apart.
**STEP 2 (Swing):** Swing both arms forward and back alternately.
**STEP 3 (Increase):** Gradually increase range of motion.
**STEP 4 (Continue):** Swing for 30 seconds.', '2 sets of 30 seconds.'),

('{"arms"}', 'deltoid', 'yoga', 'Warrior II Arms', 'Engages and stretches the deltoids through a sustained isometric hold.', '**STEP 1 (Setup):** Step feet wide, turn right foot out 90 degrees.
**STEP 2 (Bend):** Bend right knee over the ankle.
**STEP 3 (Extend):** Extend arms parallel to the floor, palms down.
**STEP 4 (Hold):** Hold for 5 breaths, then switch.', '3 holds of 5 breaths per side.'),

('{"arms"}', 'forearm', 'posture', 'Wrist Flexor Stretch', 'Tight wrist flexors from typing cause elbow pain and poor grip posture.', '**STEP 1 (Setup):** Extend your arm in front, palm up.
**STEP 2 (Pull):** Use other hand to pull fingers back toward you.
**STEP 3 (Hold):** Hold 20 seconds.
**STEP 4 (Repeat):** Switch hands.', '3 holds per side. Do every hour while working.'),

('{"arms"}', 'brachii', 'strength', 'Dumbbell Curl', 'Balanced bicep strength prevents elbow tendinopathy and supports shoulder stability.', '**STEP 1 (Setup):** Stand holding dumbbells at sides, palms forward.
**STEP 2 (Curl):** Curl both weights toward shoulders.
**STEP 3 (Squeeze):** Squeeze at top for 1 second.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '3 sets of 12 reps.'),

-- ─── LOWER BACK ──────────────────────────────────────────────────────────────
('{"lower_back"}', 'lumbar', 'relief', 'Knee-to-Chest Stretch', 'Decompresses lumbar vertebrae and stretches the erector spinae.', '**STEP 1 (Setup):** Lie flat on your back.
**STEP 2 (Pull):** Bring both knees to your chest.
**STEP 3 (Hug):** Wrap arms around your shins.
**STEP 4 (Rock):** Gently rock side to side for 30 seconds.', '3 holds of 30 seconds.'),

('{"lower_back"}', 'erector', 'warmup', 'Hip Hinge Warmup', 'Teaches the hip hinge pattern before lifting to protect the lumbar spine.', '**STEP 1 (Setup):** Stand with feet hip-width apart.
**STEP 2 (Hinge):** Push your hips back, keeping back flat.
**STEP 3 (Lower):** Lower until you feel a hamstring stretch.
**STEP 4 (Return):** Drive hips forward to stand.', '2 sets of 15 controlled reps before any lifting.'),

('{"lower_back"}', 'lower back', 'yoga', 'Supine Spinal Twist', 'Gently rotates the lumbar spine, releasing compression and improving mobility.', '**STEP 1 (Setup):** Lie on your back, bend knees to chest.
**STEP 2 (Drop):** Drop both knees to the right.
**STEP 3 (Extend):** Arms in a T shape, look left.
**STEP 4 (Hold):** Hold 1 minute, then switch.', '1 minute each side.'),

('{"lower_back"}', 'quadratus lumborum', 'posture', 'Standing Side Bend', 'The QL creates lateral pelvic tilt when tight, causing postural imbalances.', '**STEP 1 (Setup):** Stand feet hip-width, one arm overhead.
**STEP 2 (Bend):** Lean to the opposite side, reaching overhead.
**STEP 3 (Hold):** Hold 20 seconds.
**STEP 4 (Repeat):** Switch sides.', '3 holds per side.'),

('{"lower_back"}', 'lumborum', 'strength', 'Bird-Dog', 'Gold standard for back rehab — strengthens erector spinae and stabilizes the lumbar spine.', '**STEP 1 (Setup):** On hands and knees in tabletop.
**STEP 2 (Extend):** Extend right arm and left leg simultaneously.
**STEP 3 (Hold):** Hold 3 seconds, keeping hips level.
**STEP 4 (Switch):** Return and switch sides.', '3 sets of 10 per side.'),

-- ─── ABDOMEN ─────────────────────────────────────────────────────────────────
('{"abdomen"}', 'abdominal', 'relief', 'Cobra Stretch', 'Opens the abdominal wall and counters the effects of prolonged sitting.', '**STEP 1 (Setup):** Lie face down, palms under shoulders.
**STEP 2 (Press):** Press into hands and lift your chest.
**STEP 3 (Hold):** Hold 20-30 seconds.
**STEP 4 (Release):** Lower slowly.', '3 holds.'),

('{"abdomen"}', 'core', 'warmup', 'Dead Bug Warmup', 'Activates the deep core before training, ensuring spinal protection.', '**STEP 1 (Setup):** Lie on back, arms pointing up, knees at 90 degrees.
**STEP 2 (Lower):** Slowly lower right arm and left leg toward floor.
**STEP 3 (Return):** Bring them back up.
**STEP 4 (Switch):** Repeat on the other side.', '3 sets of 10 per side.'),

('{"abdomen"}', 'rectus', 'yoga', 'Bridge Pose', 'Supported backbends lengthen the rectus abdominis and open the front body.', '**STEP 1 (Setup):** Lie on your back, feet flat, arms crossed on chest.
**STEP 2 (Lift):** Lift into a bridge position.
**STEP 3 (Breathe):** Take 5 deep breaths expanding the front body.
**STEP 4 (Lower):** Roll spine back down slowly.', '3 rounds of 5 breaths.'),

('{"abdomen"}', 'oblique', 'posture', 'Pallof Press', 'Trains anti-rotation core stability, preventing lateral trunk shifts.', '**STEP 1 (Setup):** Stand sideways to a resistance band anchored at chest height.
**STEP 2 (Press):** Hold band at chest and press straight out.
**STEP 3 (Hold):** Hold 2 seconds.
**STEP 4 (Return):** Bring back to chest.', '3 sets of 12 per side.'),

('{"abdomen"}', 'transverse', 'strength', 'Plank', 'Most effective exercise for the transverse abdominis, the body''s natural weight belt.', '**STEP 1 (Setup):** Place forearms on the floor, elbows under shoulders.
**STEP 2 (Lift):** Rise on toes, straight from head to heels.
**STEP 3 (Brace):** Breathe into belly and brace your core.
**STEP 4 (Hold):** Hold 20-60 seconds.', '3 sets. Build up to 60 seconds over time.'),

-- ─── HIPS ────────────────────────────────────────────────────────────────────
('{"hips"}', 'hip flexor', 'relief', 'Low Lunge Hip Flexor Stretch', 'Sitting tightens hip flexors, tilting the pelvis and causing lower back pain.', '**STEP 1 (Setup):** Kneel on one knee in a lunge position.
**STEP 2 (Shift):** Shift hips forward until you feel a stretch in the front hip.
**STEP 3 (Arms):** Raise both arms overhead.
**STEP 4 (Hold):** Hold 30 seconds, then switch.', '3 holds per side.'),

('{"hips"}', 'iliopsoas', 'warmup', 'Leg Swings', 'Dynamically warms up hip flexors and extensors before running.', '**STEP 1 (Setup):** Hold a wall for balance, stand on one foot.
**STEP 2 (Forward):** Swing free leg forward as high as comfortable.
**STEP 3 (Back):** Swing it back behind you.
**STEP 4 (Continue):** 15 swings per leg.', '15 forward swings + 15 lateral swings per leg.'),

('{"hips"}', 'hip', 'yoga', 'Pigeon Pose', 'Definitive yoga hip opener, stretching the piriformis and hip external rotators.', '**STEP 1 (Setup):** From Downward Dog, bring right knee toward right wrist.
**STEP 2 (Lower):** Lower the right shin to the floor at an angle.
**STEP 3 (Fold):** Walk hands forward and lower torso over shin.
**STEP 4 (Hold):** Hold 2 minutes, then switch.', '2 minutes per side.'),

('{"hips"}', 'tensor', 'posture', 'Clamshell', 'Strengthens hip abductors and corrects Trendelenburg gait.', '**STEP 1 (Setup):** Lie on side, hips and knees at 45 degrees.
**STEP 2 (Open):** Lift top knee up like a clamshell, feet together.
**STEP 3 (Hold):** Hold 2 seconds at the top.
**STEP 4 (Lower):** Return slowly.', '3 sets of 15 per side.'),

('{"hips"}', 'flexor', 'strength', 'Resistance Band Hip Flexion', 'Strengthening hip flexors prevents hip instability and groin strains.', '**STEP 1 (Setup):** Resistance band on ankle anchored behind you.
**STEP 2 (Lift):** Drive knee up toward chest.
**STEP 3 (Hold):** Hold 1 second at the top.
**STEP 4 (Lower):** Lower slowly.', '3 sets of 15 per leg.'),

-- ─── GLUTES ──────────────────────────────────────────────────────────────────
('{"glutes"}', 'gluteus', 'relief', 'Figure Four Stretch', 'Targets the piriformis and gluteus medius, relieving sciatic-style hip pain.', '**STEP 1 (Setup):** Lie on back, cross right ankle over left knee.
**STEP 2 (Pull):** Reach through and pull left thigh toward you.
**STEP 3 (Press):** Push right knee open with elbow.
**STEP 4 (Hold):** Hold 30-60 seconds, switch.', '3 holds per side.'),

('{"glutes"}', 'piriformis', 'warmup', 'Glute Bridge Warmup', 'Activates glutes before lower body training, reducing knee and back stress.', '**STEP 1 (Setup):** Lie on back, knees bent, feet flat.
**STEP 2 (Squeeze):** Squeeze glutes and lift hips.
**STEP 3 (Hold):** Hold 2 seconds at the top.
**STEP 4 (Lower):** Lower with control.', '3 sets of 15 reps.'),

('{"glutes"}', 'glute', 'yoga', 'Happy Baby Pose', 'Decompresses the sacroiliac joint and stretches the inner glutes.', '**STEP 1 (Setup):** Lie on your back.
**STEP 2 (Grab):** Bring knees to chest and grab outer edges of feet.
**STEP 3 (Pull):** Gently pull knees toward armpits.
**STEP 4 (Rock):** Rock gently side to side for 1 minute.', '1 minute. Breathe deeply into the hips.'),

('{"glutes"}', 'gluteus', 'posture', 'Single-Leg Glute Bridge', 'Exposes and corrects glute strength imbalances causing pelvic drop.', '**STEP 1 (Setup):** Lie on back, left foot flat, right leg extended up.
**STEP 2 (Bridge):** Drive through left heel to lift hips.
**STEP 3 (Level):** Keep hips level — do not let one side drop.
**STEP 4 (Lower):** Lower slowly.', '3 sets of 10 per side.'),

('{"glutes"}', 'glute', 'strength', 'Hip Thrust', 'Produces the highest gluteus maximus activation of any exercise.', '**STEP 1 (Setup):** Sit against a bench, weight across hips.
**STEP 2 (Drive):** Drive hips up to full extension.
**STEP 3 (Squeeze):** Squeeze glutes hard at top for 1 second.
**STEP 4 (Lower):** Lower to just above floor.', '3 sets of 10 reps.'),

-- ─── THIGHS ──────────────────────────────────────────────────────────────────
('{"thighs"}', 'hamstring', 'relief', 'Standing Hamstring Stretch', 'Tight hamstrings pull the pelvis causing lower back pain.', '**STEP 1 (Setup):** Place one heel on an elevated surface.
**STEP 2 (Hinge):** Hinge forward at hips, keeping back flat.
**STEP 3 (Feel):** Feel the stretch down the back of the leg.
**STEP 4 (Hold):** 30 seconds, switch.', '3 holds per side.'),

('{"thighs"}', 'quadriceps', 'warmup', 'High Knees Warmup', 'Warms up quads, hip flexors, and calves simultaneously.', '**STEP 1 (Setup):** Stand feet hip-width apart.
**STEP 2 (March):** Drive right knee up to hip level.
**STEP 3 (Alternate):** Switch to left knee quickly.
**STEP 4 (Pace):** Increase speed over 30 seconds.', '3 sets of 30 seconds.'),

('{"thighs"}', 'quad', 'yoga', 'Low Lunge Quad Yoga', 'Classic yoga quad stretch that also opens the hip flexors.', '**STEP 1 (Setup):** Right foot forward in a low lunge, back knee down.
**STEP 2 (Sink):** Lower hips toward floor.
**STEP 3 (Reach):** Reach back for back foot for deeper stretch.
**STEP 4 (Hold):** Hold 45 seconds, switch.', '3 holds per side.'),

('{"thighs"}', 'adductor', 'posture', 'Sumo Squat Hold', 'Trains hip external rotation and corrects knee collapse.', '**STEP 1 (Setup):** Wide stance, toes turned out 45 degrees.
**STEP 2 (Squat):** Lower until thighs are parallel.
**STEP 3 (Press):** Press knees out over toes using elbows.
**STEP 4 (Hold):** Hold 30 seconds.', '3 holds.'),

('{"thighs"}', 'femor', 'strength', 'Bulgarian Split Squat', 'Most effective single-leg exercise for correcting quad and glute imbalances.', '**STEP 1 (Setup):** Back foot elevated on bench, front foot far out.
**STEP 2 (Lower):** Drop back knee toward floor.
**STEP 3 (Drive):** Drive through front heel to stand.
**STEP 4 (Repeat):** Complete all reps before switching.', '3 sets of 8-10 per leg.'),

-- ─── KNEES ───────────────────────────────────────────────────────────────────
('{"knees"}', 'knee', 'relief', 'Seated Knee Extension Stretch', 'Improves circulation and reduces inflammation from patellar tendinopathy.', '**STEP 1 (Setup):** Sit on the edge of a chair.
**STEP 2 (Extend):** Slowly straighten one leg out front.
**STEP 3 (Flex):** Flex your foot and hold 10 seconds.
**STEP 4 (Lower):** Lower slowly.', '3 sets of 12 per leg.'),

('{"knees"}', 'patella', 'warmup', 'Leg Swing Knee Warmup', 'Mobilizes the knee joint and warms up the patellar tendon.', '**STEP 1 (Setup):** Hold wall, stand on one leg.
**STEP 2 (Swing):** Swing bent leg, bending and extending through the knee.
**STEP 3 (Control):** Keep motion controlled not floppy.
**STEP 4 (Continue):** 15 swings per leg.', '2 sets of 15 per leg.'),

('{"knees"}', 'popliteus', 'yoga', 'Reclining Hero Pose', 'Stretches the quadriceps and popliteus, releasing posterior knee tension.', '**STEP 1 (Setup):** Kneel with feet beside your hips.
**STEP 2 (Sit):** Sit back between your feet if possible.
**STEP 3 (Recline):** Lean back onto hands then elbows.
**STEP 4 (Hold):** Hold 30-60 seconds with pillow support if needed.', '2 holds of 1 minute.'),

('{"knees"}', 'knee', 'posture', 'Terminal Knee Extension', 'Corrects knee hyperextension and activates the VMO (inner quad).', '**STEP 1 (Setup):** Loop resistance band behind knee, anchored in front.
**STEP 2 (Bend):** Slightly bend knee against band tension.
**STEP 3 (Extend):** Straighten knee while band resists.
**STEP 4 (Hold):** Hold straight for 1 second.', '3 sets of 15 per leg.'),

('{"knees"}', 'patella', 'strength', 'Step-Up', 'Strengthens the VMO and glutes in a knee-safe movement.', '**STEP 1 (Setup):** Stand in front of a sturdy step.
**STEP 2 (Step):** Step right foot up onto the box.
**STEP 3 (Drive):** Drive through heel to bring left foot up.
**STEP 4 (Lower):** Step back down with control.', '3 sets of 12 per leg.'),

-- ─── CALVES ──────────────────────────────────────────────────────────────────
('{"calves"}', 'gastrocnemius', 'relief', 'Wall Calf Stretch', 'Tight calves contribute to plantar fasciitis, knee pain, and Achilles tendinopathy.', '**STEP 1 (Setup):** Stand facing a wall, hands on wall.
**STEP 2 (Step):** Step one foot back about 1 metre.
**STEP 3 (Press):** Press back heel flat to the floor.
**STEP 4 (Hold):** Hold 30 seconds, switch.', '3 holds per side.'),

('{"calves"}', 'soleus', 'warmup', 'Calf Raise Warmup', 'Warms up the Achilles tendon and improves ankle dorsiflexion before running.', '**STEP 1 (Setup):** Stand feet hip-width apart.
**STEP 2 (Rise):** Rise onto toes as high as possible.
**STEP 3 (Hold):** Hold 1 second at the top.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '3 sets of 15.'),

('{"calves"}', 'achilles', 'yoga', 'Downward Dog Calf Walk', 'Alternately stretches each calf and Achilles tendon dynamically.', '**STEP 1 (Setup):** Get into Downward Facing Dog.
**STEP 2 (Pedal):** Press one heel to floor, bend the other knee.
**STEP 3 (Alternate):** Alternate in a slow walking motion.
**STEP 4 (Continue):** Walk for 10 breaths.', '3 rounds of 10 breaths.'),

('{"calves"}', 'calf', 'posture', 'Heel Drop on Step', 'Corrects equinus posture and treats Achilles tendinopathy.', '**STEP 1 (Setup):** Stand on a step with only the balls of your feet.
**STEP 2 (Rise):** Rise up on both feet.
**STEP 3 (Lower):** Lower on one foot slowly over 5 seconds.
**STEP 4 (Repeat):** Complete set, then switch.', '3 sets of 15 per side.'),

('{"calves"}', 'gastrocnemius', 'strength', 'Weighted Calf Raise', 'Strong calves reduce ankle sprain risk and protect the Achilles under load.', '**STEP 1 (Setup):** Hold dumbbells, stand on edge of a step.
**STEP 2 (Lower):** Lower heels below step level.
**STEP 3 (Rise):** Push up to full plantarflexion.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '4 sets of 15 reps.'),

-- ─── ANKLES ──────────────────────────────────────────────────────────────────
('{"ankles"}', 'ankle', 'relief', 'Ankle Circle Stretch', 'Restores full joint mobility after sprains and reduces stiffness.', '**STEP 1 (Setup):** Cross ankle over opposite knee.
**STEP 2 (Circle):** Rotate ankle clockwise 10 times.
**STEP 3 (Reverse):** Reverse direction.
**STEP 4 (Switch):** Repeat on the other ankle.', '10 circles each direction per ankle.'),

('{"ankles"}', 'tibialis', 'warmup', 'Ankle Alphabet', 'Warms up all planes of ankle motion and proprioception before sport.', '**STEP 1 (Setup):** Sit with leg extended.
**STEP 2 (Trace):** Use your foot to trace each letter of the alphabet in the air.
**STEP 3 (Large):** Make letters as large as possible.
**STEP 4 (Switch):** Repeat on the other foot.', 'One full alphabet per foot.'),

('{"ankles"}', 'peroneal', 'yoga', 'Lotus Ankle Rotation', 'Improves peroneal flexibility and lateral ankle stability.', '**STEP 1 (Setup):** Sit in easy pose (cross-legged).
**STEP 2 (Hold):** Cradle one foot in your hands.
**STEP 3 (Rotate):** Rotate foot through full range of motion.
**STEP 4 (Switch):** Repeat on the other foot.', '10 slow rotations each direction per foot.'),

('{"ankles"}', 'ankle', 'posture', 'Single-Leg Balance', 'Retrains ankle proprioception and prevents recurring sprains.', '**STEP 1 (Setup):** Stand near a wall for safety.
**STEP 2 (Lift):** Lift one foot off the floor.
**STEP 3 (Balance):** Balance for 30 seconds.
**STEP 4 (Progress):** Close eyes when it becomes easy.', '3 holds of 30 seconds per leg.'),

('{"ankles"}', 'fibular', 'strength', 'Resistance Band Ankle Eversion', 'Strengthening the peroneals is the best prevention for lateral ankle sprains.', '**STEP 1 (Setup):** Loop resistance band around foot, anchored inward.
**STEP 2 (Evert):** Pull foot outward against band resistance.
**STEP 3 (Hold):** Hold 2 seconds at end range.
**STEP 4 (Return):** Return slowly.', '3 sets of 15 per ankle.'),

-- ─── FEET ────────────────────────────────────────────────────────────────────
('{"feet"}', 'plantar', 'relief', 'Plantar Fascia Stretch', 'Prevents sharp morning heel pain of plantar fasciitis.', '**STEP 1 (Setup):** Sit on the edge of your bed.
**STEP 2 (Cross):** Cross one foot over the opposite knee.
**STEP 3 (Pull):** Pull toes back toward your shin.
**STEP 4 (Hold):** Hold 30 seconds, then switch.', '3 holds per foot. Do before your first steps in the morning.'),

('{"feet"}', 'foot', 'warmup', 'Toe Spread and Scrunch', 'Activates the intrinsic foot muscles before exercise.', '**STEP 1 (Setup):** Sit or stand barefoot.
**STEP 2 (Spread):** Spread toes as wide apart as possible. Hold 3 seconds.
**STEP 3 (Scrunch):** Curl and scrunch toes under. Hold 3 seconds.
**STEP 4 (Repeat):** Alternate for 10 reps.', '3 sets of 10 reps.'),

('{"feet"}', 'heel', 'yoga', 'Thunderbolt Toe Stretch', 'One of yoga''s most effective plantar fascia stretches.', '**STEP 1 (Setup):** Kneel on the floor and tuck all toes under.
**STEP 2 (Sit):** Sit back onto your heels.
**STEP 3 (Feel):** Feel the deep stretch through the soles.
**STEP 4 (Hold):** Hold 1-3 minutes.', '1-3 minute hold. Start with 30 seconds and build up.'),

('{"feet"}', 'metatarsal', 'posture', 'Short Foot Exercise', 'Corrects flat feet and improves overall lower limb posture.', '**STEP 1 (Setup):** Sit or stand barefoot, foot flat on floor.
**STEP 2 (Shorten):** Pull ball of foot toward heel without curling toes.
**STEP 3 (Hold):** Hold the arch contraction for 5 seconds.
**STEP 4 (Release):** Fully relax.', '3 sets of 10 per foot.'),

('{"feet"}', 'toe', 'strength', 'Towel Scrunches', 'Strengthens toe flexors and intrinsic foot muscles, building the arch.', '**STEP 1 (Setup):** Sit with a small towel on the floor.
**STEP 2 (Scrunch):** Use toes to scrunch and drag towel toward you.
**STEP 3 (Repeat):** Reposition and scrunch again.
**STEP 4 (Complete):** 15 scrunch reps per foot.', '3 sets of 15 per foot.');
