-- MuscliKnot Exercise Seed Script (75 exercises: 15 muscle regions Ã— 5 activity types)
-- Paste this ENTIRE script into: Supabase Dashboard â†’ SQL Editor â†’ New Query â†’ Run

INSERT INTO recovery_knowledge_base (muscle_id, common_name, exercise_type, solution_stretch, why, instructions, process) VALUES
-- â”€â”€â”€ HEAD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ NECK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ TRAPS / SHOULDERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"traps"}', 'trapezius', 'relief', 'Shoulder Shrug and Drop', 'Removes chronic tension stored in the trapezius from stress and poor posture.', '**STEP 1 (Setup):** Stand or sit upright.
**STEP 2 (Shrug):** Raise both shoulders toward your ears as high as possible.
**STEP 3 (Hold):** Hold 3 seconds at the top.
**STEP 4 (Drop):** Let them fall suddenly â€” feel the release.', '3 sets of 10 reps.'),

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

-- â”€â”€â”€ CHEST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ UPPER BACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ ARMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ LOWER BACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

('{"lower_back"}', 'lumborum', 'strength', 'Bird-Dog', 'Gold standard for back rehab â€” strengthens erector spinae and stabilizes the lumbar spine.', '**STEP 1 (Setup):** On hands and knees in tabletop.
**STEP 2 (Extend):** Extend right arm and left leg simultaneously.
**STEP 3 (Hold):** Hold 3 seconds, keeping hips level.
**STEP 4 (Switch):** Return and switch sides.', '3 sets of 10 per side.'),

-- â”€â”€â”€ ABDOMEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ HIPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ GLUTES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
**STEP 3 (Level):** Keep hips level â€” do not let one side drop.
**STEP 4 (Lower):** Lower slowly.', '3 sets of 10 per side.'),

('{"glutes"}', 'glute', 'strength', 'Hip Thrust', 'Produces the highest gluteus maximus activation of any exercise.', '**STEP 1 (Setup):** Sit against a bench, weight across hips.
**STEP 2 (Drive):** Drive hips up to full extension.
**STEP 3 (Squeeze):** Squeeze glutes hard at top for 1 second.
**STEP 4 (Lower):** Lower to just above floor.', '3 sets of 10 reps.'),

-- â”€â”€â”€ THIGHS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ KNEES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ CALVES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ ANKLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ FEET â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- ADDITIONAL EXERCISES â€” BATCH 2 (75 more: 15 regions Ã— 5 activity types)
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
INSERT INTO recovery_knowledge_base (muscle_id, common_name, exercise_type, solution_stretch, why, instructions, process) VALUES

-- â”€â”€â”€ HEAD (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"head"}', 'scalp', 'relief', 'Scalp Tension Release', 'Scalp massage reduces cortisol levels and directly relieves tension-type headaches originating from scalp muscles.', '**STEP 1 (Setup):** Sit comfortably with your spine tall.
**STEP 2 (Place):** Spread fingertips across your entire scalp.
**STEP 3 (Press):** Apply firm but gentle pressure and move scalp skin in small circles.
**STEP 4 (Shift):** Move through crown, sides, and back of head.', '90 seconds of continuous scalp massage. Works best with eyes closed.'),

('{"head"}', 'cervical', 'warmup', 'Gentle Head Nod Warmup', 'Activates deep cervical flexors and lubricate the upper cervical joints before any neck activity.', '**STEP 1 (Setup):** Sit upright, chin level with floor.
**STEP 2 (Nod):** Slowly nod your head yes, moving just 10â€“15 degrees up and down.
**STEP 3 (Pace):** Keep movement very slow and controlled, 2 seconds each way.
**STEP 4 (Breathe):** Breathe normally throughout.', '2 sets of 10 slow nods. Essential for anyone with a forward head posture.'),

('{"head"}', 'frontalis', 'yoga', 'Trataka Gaze Yoga', 'Fixed-gaze meditation relaxes eye strain muscles and reduces tension-headache frequency through parasympathetic activation.', '**STEP 1 (Setup):** Sit in a comfortable meditation posture.
**STEP 2 (Focus):** Fix your gaze softly on a single point or candle flame.
**STEP 3 (Hold):** Keep gaze steady without blinking for 20â€“30 seconds.
**STEP 4 (Rest):** Close eyes and observe the after-image for 20 seconds.', '5 rounds. Excellent for digital eye strain headaches.'),

('{"head"}', 'occipitalis', 'posture', 'Head Leveling Drill', 'Most people carry their head tilted 5â€“10 degrees. This drill retrains neutral head positioning to reduce suboccipital strain.', '**STEP 1 (Setup):** Sit against a wall with your sacrum and upper back touching.
**STEP 2 (Adjust):** Without tucking chin down, slide head back to touch the wall lightly.
**STEP 3 (Level):** Eyes should be horizontal â€” not tilted up or down.
**STEP 4 (Hold):** Hold this position for 30 seconds.', '5 rounds of 30-second holds. Practice during phone calls.'),

('{"head"}', 'masseter', 'strength', 'Tongue Press Strength', 'Strengthening the tongue-to-palate position activates deep intrinsic jaw muscles and corrects open-mouth breathing posture.', '**STEP 1 (Setup):** Sit or stand upright with teeth slightly apart.
**STEP 2 (Press):** Press tip of tongue firmly to the roof of your mouth (palate).
**STEP 3 (Engage):** Press entire tongue flat against palate â€” all surfaces.
**STEP 4 (Hold):** Hold the full press for 10 seconds.', '3 sets of 10-second holds. Do daily to retrain jaw alignment.'),

-- â”€â”€â”€ NECK (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"neck"}', 'suboccipital', 'relief', 'Suboccipital Self-Release', 'The suboccipitals are frequently the hidden cause of tension headaches; direct pressure deactivates trigger points.', '**STEP 1 (Setup):** Lie on your back, place two tennis balls in a sock at the base of your skull.
**STEP 2 (Rest):** Let the weight of your head sink onto the balls.
**STEP 3 (Nod):** Make tiny yes-nods to roll over the sub-occipital muscles.
**STEP 4 (Pause):** Stop on any tender spot for 20â€“30 seconds.', '5 minutes total. Work through entire base of skull.'),

('{"neck"}', 'longus colli', 'warmup', 'Cervical Rotation Warmup', 'Rotating the cervical spine through full range before activity prevents whiplash-type muscle strains.', '**STEP 1 (Setup):** Sit tall, shoulders relaxed.
**STEP 2 (Right):** Turn head slowly to the right as far as comfortable. 2-second pause.
**STEP 3 (Centre):** Return to centre.
**STEP 4 (Left):** Turn to the left. Return to centre.', '10 full rotations each direction. Never force at end range.'),

('{"neck"}', 'splenius', 'yoga', 'Extended Puppy Pose Neck', 'Extended Puppy Pose creates cervical traction and releases the splenius capitis and cervicis simultaneously.', '**STEP 1 (Setup):** Start on hands and knees.
**STEP 2 (Walk):** Walk hands forward, lowering chest toward the floor.
**STEP 3 (Drop):** Rest your chin on the mat â€” feel the traction in the back of the neck.
**STEP 4 (Breathe):** Take 8 slow breaths.', '3 holds of 8 breaths. One of the most relieving neck yoga poses.'),

('{"neck"}', 'trap upper', 'posture', 'Scapular Setting with Neck Retraction', 'Trains the synergy between scapular depressors and deep neck flexors â€” essential for correcting forward head posture.', '**STEP 1 (Setup):** Sit tall, hands resting on thighs.
**STEP 2 (Depress):** Draw shoulder blades gently down and together.
**STEP 3 (Retract):** At the same time, pull your chin straight back.
**STEP 4 (Hold):** Maintain both actions for 10 seconds.', '3 sets of 10. The double cue is what makes this posture-correcting.'),

('{"neck"}', 'deep flexors', 'strength', 'Supine Head Lift', 'Directly strengthens the deep cervical flexors (longus colli), the most important muscles for protecting the cervical spine.', '**STEP 1 (Setup):** Lie flat on your back.
**STEP 2 (Nod):** Perform a gentle chin tuck.
**STEP 3 (Lift):** Keeping the chin tucked, lift head ONE inch off the floor.
**STEP 4 (Hold):** Hold 5 seconds, lower slowly.', '3 sets of 8. Never let the chin poke forward mid-rep.'),

-- â”€â”€â”€ TRAPS / SHOULDERS (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"traps"}', 'infraspinatus', 'relief', 'Sleeper Stretch', 'Specifically stretches the posterior shoulder capsule and infraspinatus â€” the most common source of rotator cuff pain.', '**STEP 1 (Setup):** Lie on your side with affected shoulder down, arm at shoulder height.
**STEP 2 (Bend):** Bend elbow to 90 degrees, forearm pointing upward.
**STEP 3 (Press):** Use other hand to gently press forearm downward toward the bed.
**STEP 4 (Hold):** Hold 30 seconds. Stop if sharp pain occurs.', '3 holds per side. Use light pressure only.'),

('{"traps"}', 'rotator cuff', 'warmup', 'External Rotation with Band', 'Warming up the external rotators pre-workout is the single most effective prevention of rotator cuff impingement.', '**STEP 1 (Setup):** Elbow tucked to side, holding light resistance band.
**STEP 2 (Rotate):** Rotate forearm outward against band resistance.
**STEP 3 (Control):** Slowly return to start.
**STEP 4 (Keep):** Keep elbow glued to your side throughout.', '2 sets of 20 reps each side before any pressing.'),

('{"traps"}', 'serratus anterior', 'yoga', 'Side Plank Star', 'Side Plank Star maximally activates the serratus anterior and opens the intercostal muscles on the raised side.', '**STEP 1 (Setup):** Come into a side plank on your bottom hand and edge of bottom foot.
**STEP 2 (Lift):** Stack top foot on bottom or modify with knee on floor.
**STEP 3 (Reach):** Raise top arm overhead, opening into a star shape.
**STEP 4 (Hold):** Hold 5 breaths, then switch.', '3 holds per side.'),

('{"traps"}', 'rhomboids', 'posture', 'Prone Y Raise', 'Isolated rhomboid and lower trap activation that directly counteracts the rounded-shoulder pattern caused by desk work.', '**STEP 1 (Setup):** Lie face down on a mat, arms in a Y shape overhead.
**STEP 2 (Thumbs):** Rotate thumbs toward the ceiling.
**STEP 3 (Lift):** Lift arms off the mat using your upper back muscles â€” NOT your neck.
**STEP 4 (Hold):** Hold at the top for 3 seconds.', '3 sets of 15. Very light or no weight needed.'),

('{"traps"}', 'deltoid', 'strength', 'Lateral Raise', 'Lateral raises build the medial deltoid, creating shoulder width and improving joint stability under load.', '**STEP 1 (Setup):** Stand holding light dumbbells at your sides.
**STEP 2 (Raise):** Raise arms out to the side to shoulder height with a slight forward lean.
**STEP 3 (Pause):** Pause 1 second at the top.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '3 sets of 15 reps. Lead with your elbows, not your wrists.'),

-- â”€â”€â”€ CHEST (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"chest"}', 'intercostals', 'relief', 'Lateral Rib Opener', 'Sitting compresses the rib cage. Lateral opening stretches the intercostals, improves lung volume and reduces referred chest tightness.', '**STEP 1 (Setup):** Sit cross-legged, right hand on floor beside you.
**STEP 2 (Reach):** Raise left arm and reach it over your head to the right.
**STEP 3 (Breathe):** Take 5 deep breaths expanding the left ribs.
**STEP 4 (Switch):** Return and repeat on the other side.', '5 breaths per side. Move deeper with each exhale.'),

('{"chest"}', 'pec minor', 'warmup', 'Pec Minor Stretch on Foam Roller', 'Tight pec minor causes the shoulder blade to tip forward creating anterior shoulder pain. Releasing it restores proper mechanics.', '**STEP 1 (Setup):** Place foam roller vertically along your spine on the floor.
**STEP 2 (Lie):** Lie back on roller with arms out in goal-post position.
**STEP 3 (Relax):** Let gravity naturally open your chest â€” do not force.
**STEP 4 (Breathe):** Take slow deep breaths for 60 seconds.', '60â€“90 second sustained opening. Perfect pre-workout warm-up.'),

('{"chest"}', 'pectoralis', 'yoga', 'Wheel Pose Preparation', 'Wheel Pose preparation creates profound chest opening and counteracts prolonged spinal flexion from sitting.', '**STEP 1 (Setup):** Lie on your back, feet flat, hands by ears with fingertips pointing toward shoulders.
**STEP 2 (Press):** Press through hands and feet to lift into bridge.
**STEP 3 (Open):** If comfortable, push higher to full wheel.
**STEP 4 (Hold):** Hold 3â€“5 breaths.', '3 rounds. Use Bridge Pose as a modification if wheel is too intense.'),

('{"chest"}', 'sternocostal', 'posture', 'Towel Roll Chest Lift', 'A rolled towel placed horizontally between the shoulder blades provides a passive thoracic extension stretch correcting kyphosis.', '**STEP 1 (Setup):** Roll a bath towel and place it on the floor.
**STEP 2 (Lie):** Place towel horizontally behind your mid/upper back.
**STEP 3 (Extend):** Arms out to sides or overhead, let chest open above the roll.
**STEP 4 (Breathe):** 10 slow deep breaths.', '1â€“2 minute hold. Move roller up or down to target different thoracic levels.'),

('{"chest"}', 'serratus', 'strength', 'Dumbbell Pullover', 'The dumbbell pullover is uniquely effective for building serratus anterior and expanding the rib cage.', '**STEP 1 (Setup):** Lie across a bench with upper back supported, feet flat on floor.
**STEP 2 (Hold):** Hold one dumbbell with both hands above chest.
**STEP 3 (Lower):** Arc dumbbell back over your head toward the floor.
**STEP 4 (Return):** Arc back to start, keeping arms nearly fully extended.', '3 sets of 12. Focus on the rib-cage stretch at the bottom.'),

-- â”€â”€â”€ UPPER BACK (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"upper_back"}', 'teres major', 'relief', 'Doorframe Lat Stretch', 'Releases the teres major and lat, both of which pull the shoulder into internal rotation causing upper back pain.', '**STEP 1 (Setup):** Stand facing a doorframe, arm raised, hand gripping the top.
**STEP 2 (Lean):** Lean your body weight away from the door.
**STEP 3 (Twist):** Add a slight torso rotation for a deeper stretch.
**STEP 4 (Hold):** Hold 30 seconds each arm.', '3 holds per side.'),

('{"upper_back"}', 'trapezius mid', 'warmup', 'Face Pull with Band', 'Face pulls warm up the rear deltoid and mid-trap â€” the muscles most neglected by typical gym warm-ups.', '**STEP 1 (Setup):** Anchor resistance band at face height.
**STEP 2 (Grip):** Hold band overhand, step back to create tension.
**STEP 3 (Pull):** Pull band toward your face, elbows flare high.
**STEP 4 (Return):** Extend arms slowly back to start.', '3 sets of 20 reps. One of the most important shoulder health exercises.'),

('{"upper_back"}', 'serratus', 'yoga', 'Cow Face Arms', 'Cow Face Arms creates the deepest external rotation stretch for the posterior shoulder â€” excellent for thoracic mobility.', '**STEP 1 (Setup):** Sit comfortably.
**STEP 2 (Right arm):** Raise right arm, bend elbow, reach hand down your back.
**STEP 3 (Left arm):** Bring left arm behind and reach up. Clasp fingers.
**STEP 4 (Hold):** Hold 30 seconds, then switch side.', '3 holds per side. Use a strap if hands do not reach.'),

('{"upper_back"}', 'rhomboids', 'posture', 'Jefferson Curl', 'The Jefferson Curl creates active ROM in segmental spinal flexion, the most underused movement pattern for upper back health.', '**STEP 1 (Setup):** Stand on a small step holding very light dumbbells.
**STEP 2 (Tuck):** Tuck chin and begin curling from the top of the spine, one vertebra at a time.
**STEP 3 (Lower):** Continue curling all the way down toward the feet.
**STEP 4 (Uncurl):** Stack vertebrae back up one at a time to standing.', '3 sets of 5 very slow reps. This is not a deadlift â€” think slow, controlled articulation.'),

('{"upper_back"}', 'trapezius lower', 'strength', 'Cable Row to Neck', 'Trains lower trapezius and rear deltoids â€” the primary muscles for scapular depression and upward rotation.', '**STEP 1 (Setup):** Sit at cable row machine with handle at face level.
**STEP 2 (Pull):** Row handle toward your neck, elbows high.
**STEP 3 (Squeeze):** Squeeze shoulder blades toward each other at end range.
**STEP 4 (Return):** Extend slowly back to full stretch.', '3 sets of 15 reps.'),

-- â”€â”€â”€ ARMS (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"arms"}', 'tricep', 'relief', 'Overhead Tricep Stretch', 'Tricep tightness from pushing activities creates elbow and posterior shoulder pain. This stretch directly addresses the long head.', '**STEP 1 (Setup):** Stand or sit, raise one arm overhead.
**STEP 2 (Bend):** Bend elbow so hand reaches behind your head.
**STEP 3 (Assist):** Use opposite hand to gently press elbow back and down.
**STEP 4 (Hold):** Hold 30 seconds each arm.', '3 holds per side.'),

('{"arms"}', 'wrist extensors', 'warmup', 'Wrist Circle Warmup', 'Full-range wrist circles lubricate the radiocarpal joint and warm up all wrist muscles before load.', '**STEP 1 (Setup):** Extend arms forward, make loose fists.
**STEP 2 (Rotate):** Rotate both wrists in large clockwise circles.
**STEP 3 (Reverse):** Rotate counter-clockwise.
**STEP 4 (Continue):** 10 rotations each direction.', '2 sets of 10 rotations each direction. Essential pre-workout for any pushing or gripping exercises.'),

('{"arms"}', 'bicep', 'yoga', 'Reverse Prayer Hands', 'Reverse Prayer (Paschima Namaskarasana) provides a deep bilateral wrist flexor and forearm stretch.', '**STEP 1 (Setup):** Sit tall, bring hands behind back.
**STEP 2 (Press):** Press palms together with fingers pointing down.
**STEP 3 (Rotate):** Rotate fingertips upward so fingers point toward spine.
**STEP 4 (Hold):** Hold 30 seconds.', '3 holds. If palms cannot meet, just touch the backs of hands.'),

('{"arms"}', 'pronator teres', 'posture', 'Wrist Extensor Stretch', 'Over-active wrist extensors from mouse use create forearm pain and lateral elbow tendinopathy (tennis elbow).', '**STEP 1 (Setup):** Extend arm forward, palm facing down.
**STEP 2 (Pull):** Use other hand to pull fingers downward and toward you.
**STEP 3 (Feel):** Feel the stretch across the top of the forearm.
**STEP 4 (Hold):** Hold 20 seconds, then switch.', '3 holds per side. Do every hour if using a computer mouse.'),

('{"arms"}', 'grip', 'strength', 'Dead Hang', 'Dead hangs decompress the spine, build grip strength, and are enormously effective for shoulder health.', '**STEP 1 (Setup):** Grip a pull-up bar with both hands, overhand grip, shoulder-width.
**STEP 2 (Hang):** Let your body hang with feet off the floor â€” full suspension.
**STEP 3 (Breathe):** Breathe steadily, feel the pull-apart of the spine and shoulders.
**STEP 4 (Hold):** Hold as long as comfortable.', 'Build from 10 seconds to 1 minute. 3 sets per session.'),

-- â”€â”€â”€ LOWER BACK (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"lower_back"}', 'piriformis', 'relief', 'Seated Figure Four', 'The seated figure four targets the piriformis, which when tight presses on the sciatic nerve causing radiating leg pain.', '**STEP 1 (Setup):** Sit on a chair, cross right ankle over left knee.
**STEP 2 (Lean):** Lean forward from the hips (not the waist) keeping spine straight.
**STEP 3 (Feel):** Feel a deep stretch in the right glute.
**STEP 4 (Hold):** Hold 45 seconds, then switch.', '3 holds per side.'),

('{"lower_back"}', 'multifidus', 'warmup', 'Pelvic Rock', 'Anterior/posterior pelvic rocking warms up spinal stabilizers and teaches proper lumbar neutral position.', '**STEP 1 (Setup):** Stand with feet hip-width apart, hands on hips.
**STEP 2 (Anterior):** Tilt pelvis forward, increasing arch (anterior tilt).
**STEP 3 (Posterior):** Tilt pelvis back, flattening arch (posterior tilt).
**STEP 4 (Find):** Find and remember the neutral midpoint.', '3 sets of 10 controlled tilts. Very helpful before any loaded movement.'),

('{"lower_back"}', 'QL', 'yoga', '90/90 Spinal Twist', 'The 90/90 supine twist deeply rotates the lumbar spine and releases the quadratus lumborum on the raised side.', '**STEP 1 (Setup):** Lie on your back, bend both knees 90 degrees above the hip.
**STEP 2 (Drop):** Lower both knees together to the right floor.
**STEP 3 (Open):** Extend arms in a T, look left.
**STEP 4 (Hold):** Hold 90 seconds, then switch.', '90 seconds per side. Use a block under knees for tight hips.'),

('{"lower_back"}', 'glute-lumbar', 'posture', 'Pelvic Neutral Wall Drill', 'Most lower back pain begins with loss of lumbar neutral. This drill resets proprioception for neutral spine posture.', '**STEP 1 (Setup):** Stand with back against wall, heels 3cm from baseboard.
**STEP 2 (Adjust):** Allow the natural curve of your lower back â€” there should be a small gap at the lumbar spine.
**STEP 3 (Engage):** Gently brace your core without changing lumbar curve.
**STEP 4 (Hold):** Memorise this feeling. Hold 30 seconds.', '5 holds. Step away and try to maintain this posture while walking.'),

('{"lower_back"}', 'thoracolumbar fascia', 'strength', 'Deadlift', 'The deadlift is the single most effective exercise for building posterior chain resilience and eliminating chronic lower back pain.', '**STEP 1 (Setup):** Stand over barbell, feet hip-width, toes slightly out.
**STEP 2 (Grip):** Hinge at hips, keep spine neutral, grip bar outside knees.
**STEP 3 (Brace):** Take a deep breath, brace core 360 degrees.
**STEP 4 (Pull):** Drive floor away with feet, keep bar against legs all the way up.', '3 sets of 5. Begin with just a barbell (20kg) and learn form before adding weight.'),

-- â”€â”€â”€ ABDOMEN (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"abdomen"}', 'rectus abdominis', 'relief', 'Supported Recline Belly Stretch', 'Prolonged sitting shortens the rectus abdominis. This passive stretch restores full hip extension and reduces anterior pelvic tilt pain.', '**STEP 1 (Setup):** Sit on the edge of your bed and lie back so your back is on the bed but hips are at the edge.
**STEP 2 (Lower):** Let legs drop toward the floor, feeling a stretch from hips to abdomen.
**STEP 3 (Arms):** Reach arms overhead for maximum stretch.
**STEP 4 (Hold):** Hold 60 seconds.', '3 holds of 60 seconds. Use a pillow under lower back if too intense.'),

('{"abdomen"}', 'core', 'warmup', 'Diaphragmatic Breathing Warmup', 'Activating the diaphragm before training restores proper intra-abdominal pressure and protects the spine.', '**STEP 1 (Setup):** Lie on back, knees bent, one hand on chest, one on belly.
**STEP 2 (Inhale):** Breathe in through the nose â€” let belly hand rise, chest stays still.
**STEP 3 (Exhale):** Breathe out fully through pursed lips.
**STEP 4 (Repeat):** 10 slow breaths, always belly expanding, not chest.', '10 breaths. This is the foundational warm-up for all core training.'),

('{"abdomen"}', 'transverse', 'yoga', 'Boat Pose', 'Boat Pose (Navasana) is yoga''s primary core strengthening posture, engaging transverse abdominis and hip flexors isometrically.', '**STEP 1 (Setup):** Sit with knees bent, feet flat, hands on sides of thighs.
**STEP 2 (Lean):** Lean back slightly until feet hover off the ground.
**STEP 3 (Extend):** Straighten legs as much as possible while keeping spine long.
**STEP 4 (Hold):** Hold 30 seconds.', '3 holds of 30 seconds. Bend knees as needed to maintain a long spine.'),

('{"abdomen"}', 'obliques', 'posture', 'Suitcase Carry', 'The suitcase carry builds lateral core stability and corrects lateral trunk shift â€” the #1 posture issue from unilateral carrying habits.', '**STEP 1 (Setup):** Hold a moderate dumbbell in one hand at your side.
**STEP 2 (Walk):** Walk forward keeping body perfectly upright â€” do NOT lean away from the weight.
**STEP 3 (Resist):** Resist the weight pulling you sideways using your core.
**STEP 4 (Switch):** Switch hands for equal distance.', '3 rounds of 30 metres each side.'),

('{"abdomen"}', 'rectus', 'strength', 'Cable Crunch', 'Cable crunches provide consistent tension through the full range of motion, building rectus abdominis better than floor crunches.', '**STEP 1 (Setup):** Kneel at cable machine, hold rope attachment at the sides of your head.
**STEP 2 (Crunch):** Curl your torso down toward your knees using your abs â€” not your hips.
**STEP 3 (Pause):** Pause at the bottom for 1 second.
**STEP 4 (Return):** Slowly uncurl back to upright.', '3 sets of 15. Keep hips stationary throughout.'),

-- â”€â”€â”€ HIPS (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"hips"}', 'IT band', 'relief', 'Foam Roller IT Band Release', 'The IT band itself is not actually a muscle, but foam rolling the TFL and vastus lateralis reduces lateral hip and knee pain.', '**STEP 1 (Setup):** Lie on side, foam roller under your outer thigh just below the hip.
**STEP 2 (Roll):** Using upper-body support, roll slowly from hip to just above the knee.
**STEP 3 (Pause):** Stop and hold on any tender spot for 20â€“30 seconds.
**STEP 4 (Continue):** Work the full length of the outer thigh.', '60â€“90 seconds per side.'),

('{"hips"}', 'glute medius', 'warmup', '90/90 Hip Switch Warmup', 'The 90/90 hip switch warms up both hip internal and external rotation in one movement â€” the most comprehensive hip joint warm-up.', '**STEP 1 (Setup):** Sit on floor with both knees bent at 90 degrees in front of you. One leg external rotation (right), one internal (left).
**STEP 2 (Lift):** Lift your knees up and rotate hips to flip to the other side.
**STEP 3 (Land):** Land softly with opposite 90/90 position.
**STEP 4 (Continue):** Flow back and forth continuously.', '2 sets of 10 switches each direction.'),

('{"hips"}', 'piriformis', 'yoga', 'Reclined Figure Four Yoga', 'Yields 15â€“20% more piriformis elongation than the seated version, and is safer for beginners with sciatic symptoms.', '**STEP 1 (Setup):** Lie on your back, both knees bent.
**STEP 2 (Cross):** Place right ankle on left knee.
**STEP 3 (Pull):** Reach through and clasp hands behind left thigh. Pull leg toward chest.
**STEP 4 (Flex):** Flex right foot for added safety.', 'Hold 2 minutes per side.'),

('{"hips"}', 'hip external rotators', 'posture', 'Fire Hydrant', 'The fire hydrant corrects hip drop (Trendelenburg sign) and builds hip external rotator strength for better pelvic stability.', '**STEP 1 (Setup):** Start on hands and knees in tabletop position.
**STEP 2 (Lift):** Keeping knee bent at 90 degrees, lift right leg out to the side to hip height.
**STEP 3 (Pause):** Pause 1 second at the top.
**STEP 4 (Lower):** Lower with control without rotating your hips.', '3 sets of 15 per side. Keep hips square â€” they should not rock.'),

('{"hips"}', 'gluteus medius', 'strength', 'Lateral Band Walk', 'Lateral band walks are the most effective exercise for strengthening the hip abductors and gluteus medius.', '**STEP 1 (Setup):** Place a resistance band just above your knees. Stand with feet hip-width.
**STEP 2 (Squat):** Lower into a quarter squat position and maintain it throughout.
**STEP 3 (Step):** Step sideways 12 steps to the right, keeping tension on the band.
**STEP 4 (Return):** Step 12 paces back to the left.', '3 sets of 12 paces each direction.'),

-- â”€â”€â”€ GLUTES (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"glutes"}', 'gluteus maximus', 'relief', 'Foam Roll Glute Release', 'Foam rolling the gluteus maximus releases myofascial trigger points that cause posterior hip pain and referred sciatica symptoms.', '**STEP 1 (Setup):** Sit on a foam roller, one ankle crossed over the opposite knee.
**STEP 2 (Roll):** Lean slightly to the crossed-leg side and roll over the glute.
**STEP 3 (Pause):** Stop on any tender spot for 20â€“30 seconds of sustained pressure.
**STEP 4 (Switch):** Repeat on the other side.', '90 seconds per side.'),

('{"glutes"}', 'piriformis', 'warmup', 'Donkey Kick Warmup', 'Donkey kicks activate the gluteus maximus in hip extension before any lower body training.', '**STEP 1 (Setup):** Hands and knees, tabletop position.
**STEP 2 (Kick):** Drive right heel toward the ceiling, keep knee at 90 degrees.
**STEP 3 (Squeeze):** Squeeze glute hard at the top.
**STEP 4 (Lower):** Control the descent without touching the floor between reps.', '2 sets of 20 per side before lower body training.'),

('{"glutes"}', 'glute', 'yoga', 'Lizard Lunge Twist', 'Lizard Lunge opens the hip flexor while the added twist releases the IT band and glute on the trail leg side.', '**STEP 1 (Setup):** Step right foot forward outside right hand in a wide lunge.
**STEP 2 (Lower):** Lower back knee to the floor.
**STEP 3 (Twist):** Open chest to the right, reaching right arm up.
**STEP 4 (Hold):** Hold 5 breaths, then switch.', '3 holds per side.'),

('{"glutes"}', 'glute medius', 'posture', 'Reverse Hyper on Bench', 'Trains the glutes in terminal hip extension â€” the position most people are weak in â€” and corrects anterior pelvic tilt.', '**STEP 1 (Setup):** Lie face down on a flat bench, hips at the edge, legs hanging down.
**STEP 2 (Squeeze):** Squeeze glutes and raise both legs until parallel with the floor.
**STEP 3 (Hold):** Hold 2 seconds, feeling glute contraction.
**STEP 4 (Lower):** Lower legs slowly.', '3 sets of 15.'),

('{"glutes"}', 'hamstring', 'strength', 'Romanian Deadlift', 'The Romanian Deadlift is the most effective exercise for building hamstring-glute integrationâ€” key for protecting the posterior chain.', '**STEP 1 (Setup):** Hold dumbbells in front of thighs, stand tall.
**STEP 2 (Hinge):** Push hips back and lower dumbbells down the front of your legs.
**STEP 3 (Stretch):** Lower until you feel a strong hamstring stretch (usually just below knees).
**STEP 4 (Return):** Drive hips forward to return to standing.', '3 sets of 10. Keep bar close to body â€” it should brush your shins.'),

-- â”€â”€â”€ THIGHS (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"thighs"}', 'quad', 'relief', 'Standing Quad Stretch', 'Prolonged sitting shortens the quadriceps and hip flexors. Standing quad stretches counter anterior pelvic tilt and knee pain.', '**STEP 1 (Setup):** Stand on one leg, hold a wall for balance.
**STEP 2 (Bend):** Bend the free knee and grasp the foot behind you.
**STEP 3 (Pull):** Draw heel toward your buttock.
**STEP 4 (Upright):** Keep torso upright â€” do not lean forward.', '3 holds of 45 seconds per side.'),

('{"thighs"}', 'hamstring', 'warmup', 'Inchworm Warmup', 'Inchworms dynamically warm up hamstrings, calves, and hip flexors simultaneously, making them the best overall lower body warmup.', '**STEP 1 (Setup):** Stand with feet hip-width.
**STEP 2 (Fold):** Hinge forward and walk hands out until you are in a high plank.
**STEP 3 (Walk):** Walk hands back toward feet, keeping legs as straight as possible.
**STEP 4 (Stand):** Roll up to standing.', '3 sets of 5 inchworms.'),

('{"thighs"}', 'IT band lateral', 'yoga', 'Reclined Hand-to-Big-Toe Pose', 'Stretches all three hamstring muscles and the adductors with the greatest range of motion control â€” perfect for yoga beginners.', '**STEP 1 (Setup):** Lie on your back, loop a strap or towel around right foot.
**STEP 2 (Lift):** Raise leg toward ceiling, straightening as much as comfortable.
**STEP 3 (Hold):** Hold 45 seconds.
**STEP 4 (Cross):** Guide leg across body for adductor stretch, hold 20 seconds.', '3 holds per side.'),

('{"thighs"}', 'VMO', 'posture', 'Terminal Knee Extension Standing', 'The VMO (inner teardrop quad muscle) is the primary controller of correct knee tracking. This drill corrects knee-in walking gait.', '**STEP 1 (Setup):** Place resistance band behind one knee, anchored in front.
**STEP 2 (Flex):** Slightly bend knee against band tension.
**STEP 3 (Extend):** Fully straighten knee, focusing on inner quad contraction.
**STEP 4 (Hold):** Hold straight for 2 seconds.', '3 sets of 15 per leg. Can be done while watching TV.'),

('{"thighs"}', 'quadriceps', 'strength', 'Leg Press', 'The leg press allows high volume quad training with lower spinal load than squats â€” ideal for beginners and those with back pain.', '**STEP 1 (Setup):** Sit in leg press machine, feet shoulder-width, toes slightly out.
**STEP 2 (Release):** Disengage safety handles and lower platform slowly toward chest.
**STEP 3 (Press):** Push platform away without locking knees at full extension.
**STEP 4 (Control):** Control descent over 3 seconds.', '3 sets of 12.'),

-- â”€â”€â”€ KNEES (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"knees"}', 'patellar tendon', 'relief', 'Patellar Tendon Massage', 'Direct friction massage over the patellar tendon reduces inflammation from tendinopathy faster than rest alone.', '**STEP 1 (Setup):** Sit with leg extended and relaxed.
**STEP 2 (Locate):** Find the patellar tendon â€” the cord just below the kneecap.
**STEP 3 (Massage):** Using thumbs, apply cross-friction massage side to side.
**STEP 4 (Duration):** Massage for 3 minutes.', '5 minutes per session. Follow with ice for 10 minutes.'),

('{"knees"}', 'quad', 'warmup', 'Leg Swing Forward-Back', 'Warms up the full ROM of the knee and hip and promotes synovial fluid distribution in the joint.', '**STEP 1 (Setup):** Hold wall, stand on left foot.
**STEP 2 (Swing):** Swing right leg straight forward to hip height.
**STEP 3 (Back):** Swing back behind you into mild hip extension.
**STEP 4 (Continue):** 20 swings per leg.', '20 forward/back swings then 20 lateral swings per leg.'),

('{"knees"}', 'IT band knee', 'yoga', 'Warrior III Knee Stability', 'Warrior III is the best single-leg balance yoga pose for building the knee stability needed to prevent running injuries.', '**STEP 1 (Setup):** Stand on left leg, bend slightly.
**STEP 2 (Hinge):** Hinge forward at hips, raising right leg straight behind you.
**STEP 3 (Arms):** Reach arms forward, forming a T with your body and ground.
**STEP 4 (Hold):** Hold 5 breaths then switch.', '3 holds per side.'),

('{"knees"}', 'knee stabilizers', 'posture', 'Knee Tracking Box Step', 'This drill retrains the knee to track over the second toe during stairs and functional movement, preventing patellofemoral pain.', '**STEP 1 (Setup):** Stand in front of a step, place one foot on it.
**STEP 2 (Step):** Step up slowly, watching your knee â€” it should track over toes 2-3.
**STEP 3 (Correct):** If knee caves in, actively push it outward with your glutes.
**STEP 4 (Down):** Step down slowly with control.', '3 sets of 10 per leg. Use a mirror to check knee alignment.'),

('{"knees"}', 'vastus medialis', 'strength', 'Heel-Elevated Goblet Squat', 'Elevating the heels increases quadricep activation by 25%, essential for building VMO strength to protect the knee.', '**STEP 1 (Setup):** Stand on a 2.5cm heel raise (plates or wedge), goblet-hold a dumbbell at chest.
**STEP 2 (Descend):** Squat down keeping torso upright and knees tracking over toes.
**STEP 3 (Depth):** Go as deep as comfortable without knee pain.
**STEP 4 (Rise):** Drive through feet to stand.', '3 sets of 12.'),

-- â”€â”€â”€ CALVES (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"calves"}', 'achilles tendon', 'relief', 'Achilles Tendon Massage', 'Manual massage of the Achilles tendon breaks down adhesions and improves circulation in chronic tendinopathy.', '**STEP 1 (Setup):** Sit with one leg crossed over the other.
**STEP 2 (Grip):** Pinch the Achilles tendon between thumb and index finger.
**STEP 3 (Squeeze):** Apply sustained pinching pressure for 20 seconds on a tender point.
**STEP 4 (Move):** Slide up and down the full length of the tendon.', '3 minutes per ankle. Follow with gentle calf stretching.'),

('{"calves"}', 'tibialis anterior', 'warmup', 'Ankle Dorsiflexion Mobilisation', 'Limited ankle dorsiflexion is the most common cause of poor squat mechanics and knee valgus in athletes.', '**STEP 1 (Setup):** Stand facing a wall, foot 15cm from wall, toes touching.
**STEP 2 (Drive):** Drive knee toward wall while keeping heel flat.
**STEP 3 (Advance):** If knee touches wall, step foot back slightly and repeat.
**STEP 4 (Continue):** 10 reps per ankle.', '3 sets of 10 per ankle. The limiting factor is heel staying flat on floor.'),

('{"calves"}', 'soleus', 'yoga', 'Yin Yoga Calf Release', 'Sustained low-intensity calf stretching in yin style remodels the connective tissue around the Achilles and plantar fascia.', '**STEP 1 (Setup):** Sit with legs straight, place block or blanket under your calves for elevation.
**STEP 2 (Flex):** Flex feet pulling toes toward shins.
**STEP 3 (Strap):** Loop a strap around the balls of feet and gently pull.
**STEP 4 (Hold):** Hold for 3 minutes.', '5-minute sustained hold per side. The key is sustained time â€” not intensity.'),

('{"calves"}', 'peroneals', 'posture', 'Tandem Stance Balance', 'Tandem stance (heel-to-toe) maximally challenges the peroneals and ankle stabilizers, retraining the postural reflexes.', '**STEP 1 (Setup):** Stand with one foot directly in front of the other in a line.
**STEP 2 (Arms):** Arms out for initial balance.
**STEP 3 (Challenge):** Cross arms over chest when stable.
**STEP 4 (Eyes):** Close eyes for maximum challenge when ready.', '3 holds of 30 seconds per orientation. Switch which foot is in front.'),

('{"calves"}', 'soleus', 'strength', 'Seated Calf Raise with Bent Knee', 'The bent-knee position isolates the soleus (deeper calf muscle), which most people neglect training entirely.', '**STEP 1 (Setup):** Sit with a dumbbell on your knee, foot on edge of a step.
**STEP 2 (Lower):** Lower heel below step level.
**STEP 3 (Rise):** Press up onto toes as high as possible.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '4 sets of 15 per leg. The soleus is slow-twitch so it needs higher reps.'),

-- â”€â”€â”€ ANKLES (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"ankles"}', 'spring ligament', 'relief', 'Ankle Self-Mobilisation', 'A sprained ankle loses dorsiflexion ROM from the fibula jamming anteriorly. Self-mobilisation restores normal joint mechanics.', '**STEP 1 (Setup):** Loop a resistance band around the front of your lower leg, just above the ankle.
**STEP 2 (Step):** Step foot forward onto a low step, with band pulling from behind.
**STEP 3 (Rock):** Gently rock knee forward over toes, feeling the band provide a posteriorly-directed force.
**STEP 4 (Repeat):** 10 gentle rocks per ankle.', '3 sets of 10 per ankle. Very effective for post-sprain stiffness.'),

('{"ankles"}', 'peroneals', 'warmup', 'Jump Rope Simulation Warmup', 'Jump rope mechanics (calf-dominant, single-leg transitions) are the best warm-up for all court and running sports.', '**STEP 1 (Setup):** Stand feet together, arms at sides.
**STEP 2 (Simulate):** Bounce on the balls of your feet, using small quick hops as if skipping rope.
**STEP 3 (Single):** Progress to single-leg hops on each foot.
**STEP 4 (Duration):** Continue for 60 seconds.', '3 rounds of 60 seconds with 20 seconds rest.'),

('{"ankles"}', 'ankle', 'yoga', 'Lotus Ankle Warm Flow', 'The lotus preparation sequence targets all planes of ankle mobility and the medial and lateral ankle retinaculum.', '**STEP 1 (Setup):** Sit in easy pose with one ankle resting on the opposite thigh.
**STEP 2 (Hold):** Interlace fingers between toes.
**STEP 3 (Move):** Flex, point, circle and spread the foot through its full range.
**STEP 4 (Switch):** Repeat on the other foot.', '2 minutes per foot of explorative movement.'),

('{"ankles"}', 'achilles-ankle', 'posture', 'Barefoot Standing on Rocker Board', 'Training proprioception on an unstable surface (rocker board or Bosu) is the most effective intervention for preventing ankle sprain recurrence.', '**STEP 1 (Setup):** Stand on a rocker board, feet hip-width.
**STEP 2 (Balance):** Balance for 30 seconds, rocking gently in all directions.
**STEP 3 (Single):** Progress to single-leg stance on the board.
**STEP 4 (Eyes):** Close eyes for the ultimate challenge.', '3 sets of 30 seconds per leg. Do 3 times per week after an ankle sprain.'),

('{"ankles"}', 'tibialis anterior', 'strength', 'Dorsiflexion Resistance Band', 'Directly strengthens the tibialis anterior, the most important muscle for landing mechanics and shin splint prevention.', '**STEP 1 (Setup):** Sit with leg extended, loop band around top of foot, anchored below.
**STEP 2 (Pull):** Pull foot upward against band resistance (dorsiflex).
**STEP 3 (Hold):** Hold peak contraction 2 seconds.
**STEP 4 (Return):** Lower foot slowly.', '3 sets of 20 per foot.'),

-- â”€â”€â”€ FEET (batch 2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
('{"feet"}', 'plantar fascia', 'relief', 'Golf Ball Foot Massage', 'Rolling a firm ball under the foot provides targeted plantar fascia release and reduces morning heel pain by 40% in studies.', '**STEP 1 (Setup):** Sit in a chair and place a golf ball or massage ball under one foot.
**STEP 2 (Roll):** Apply moderate downward pressure and roll ball from heel to ball.
**STEP 3 (Target):** Pause on any particularly sore spot for 30 seconds.
**STEP 4 (Continue):** Work entire sole for 2 minutes.', '2 minutes per foot. Do before your first steps in the morning.'),

('{"feet"}', 'intrinsic muscles', 'warmup', 'Toe Yoga Warmup', 'Toe isolation (lifting just the big toe while others stay down, and vice versa) activates the intrinsic foot muscles essential for proper ground contact mechanics.', '**STEP 1 (Setup):** Sit with foot flat on the floor.
**STEP 2 (Big):** Lift only the big toe off the floor, keeping other 4 down.
**STEP 3 (Four):** Lower big toe and lift the other four, keeping big toe down.
**STEP 4 (Alternate):** Alternate back and forth.', '3 sets of 10 per foot. This is harder than it sounds â€” it rewires foot motor control.'),

('{"feet"}', 'arch', 'yoga', 'Mountain Pose Foot Awareness', 'Mountain Pose teaches the tripod of the foot â€” the three points that should always be in contact with the ground for correct posture.', '**STEP 1 (Setup):** Stand with feet hip-width, eyes closed.
**STEP 2 (Feel):** Notice the three points of contact: heel, inner ball, outer ball.
**STEP 3 (Lift):** Gently lift inner arches off the floor without gripping toes.
**STEP 4 (Balance):** Distribute weight evenly across all three points.', 'Hold 2 minutes. Practice makes this your default standing posture.'),

('{"feet"}', 'navicular', 'posture', 'Arch Strengthening with Toe Spreading', 'Combining arch lift with active toe spreading creates the widest, most stable foot base and corrects over-pronation.', '**STEP 1 (Setup):** Sit or stand barefoot.
**STEP 2 (Spread):** Spread all toes as wide apart as possible.
**STEP 3 (Arch):** While keeping toes spread, lift your inner arch (short foot position).
**STEP 4 (Hold):** Maintain both spread and arch for 5 seconds.', '3 sets of 10. Toe spreading prevents the arch collapse that causes plantar fasciitis.'),

('{"feet"}', 'intrinsics', 'strength', 'Single-Leg Calf Raise with Toe Curl', 'Combining a calf raise with active toe curling engages the toe flexors and plantar intrinsics alongside the gastrocnemius in one integrated movement.', '**STEP 1 (Setup):** Stand barefoot on the edge of a step, one foot only.
**STEP 2 (Lower):** Drop heel below step level.
**STEP 3 (Rise):** Press up to full calf raise height.
**STEP 4 (Curl):** At the top, curl your toes under as you squeeze the calf.', '3 sets of 12 per foot.');

