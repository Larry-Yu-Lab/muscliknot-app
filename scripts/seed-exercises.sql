-- ============================================================
-- MuscliKnot Exercise Database — Part 1
-- Muscle groups: head, neck, traps, chest, upper_back,
--                arms, forearms, hands
-- Run AFTER the CREATE TABLE statement.
-- ============================================================
TRUNCATE TABLE recovery_knowledge_base;

INSERT INTO recovery_knowledge_base
  (id, muscle_id, exercise_type, difficulty_level, common_name, area_of_pain, solution_stretch, why, instructions, process)
VALUES

-- ── HEAD ────────────────────────────────────────────────────
('h-001', ARRAY['head'], 'relief', 'beginner', 'temple pressure relief temporalis',
 'temples', 'Temple Pressure Point Release',
 'Gentle circular pressure to the temporalis muscle instantly reduces tension headaches and jaw-related temple pain.',
 '**STEP 1 (Find):** Place your fingertips on your temples — the hollow just behind and above the outer corners of your eyes. **STEP 2 (Press):** Apply gentle, firm circular pressure, moving in slow inward circles. **STEP 3 (Breathe):** Close your eyes, breathe slowly, and maintain pressure for 30–60 seconds.',
 '2–3 minutes. Repeat whenever tension builds.'),

('h-002', ARRAY['head'], 'relief', 'beginner', 'jaw masseter self-massage face',
 'jaw', 'Jaw Masseter Release',
 'Releasing the masseter muscle reduces clenching, jaw fatigue, and radiating temple/cheek pain caused by TMJ tension.',
 '**STEP 1 (Locate):** Clench your teeth gently — you will feel the masseter bulge at your cheekbone. **STEP 2 (Knead):** Use 2–3 fingertips to apply slow, firm circular pressure over the entire muscle. **STEP 3 (Stretch):** Open your mouth as wide as comfortable and hold for 5 seconds.',
 '60–90 seconds each side, 2–3 rounds.'),

('h-003', ARRAY['head'], 'relief', 'beginner', 'occipitalis back head suboccipital',
 'back_head', 'Suboccipital Release',
 'Releasing the muscles at the base of the skull relieves occipital headaches and neck-origin head pain.',
 '**STEP 1 (Position):** Lie on your back. Make two fists and place your knuckles at the base of your skull where it meets the neck. **STEP 2 (Sink):** Allow the weight of your head to sink slowly onto your knuckles for 1–2 minutes. **STEP 3 (Roll):** Gently roll your head side to side 3–4 times.',
 'Hold 2–3 minutes, 1–2 times daily.'),

('h-004', ARRAY['head'], 'relief', 'beginner', 'frontalis forehead tension face headache',
 'forehead', 'Forehead Tension Smoothing',
 'Manually relaxing the frontalis muscle breaks the tension-headache cycle caused by sustained frowning or screen time.',
 '**STEP 1 (Start):** Place your fingertips flat across your forehead. **STEP 2 (Smooth):** Applying light pressure, drag your fingers upward toward the hairline, then separate sideways to the temples. **STEP 3 (Repeat):** Work from the centre outward in overlapping strokes.',
 '2 minutes of slow strokes. Combine with slow nasal breathing.'),

('h-005', ARRAY['head'], 'yoga', 'beginner', 'neck head drop chin chest cervic',
 NULL, 'Guided Head Drop',
 'Slow, gravity-assisted head drops decompress the cervical spine and quieten headache signals at the skull base.',
 '**STEP 1 (Sit tall):** Sit in a chair with spine erect. **STEP 2 (Drop):** Let your chin fall gently toward your chest. Hold 20 seconds. **STEP 3 (Side):** Roll your right ear toward your right shoulder. Hold 20 seconds. Mirror on the left.',
 '3 rounds each direction. Move very slowly — no bouncing.'),

('h-006', ARRAY['head'], 'posture', 'beginner', 'chin tuck neck head cervic posture',
 NULL, 'Chin Tuck Head Reset',
 'Corrects forward-head posture which compresses the skull base and is the number-one cause of chronic tension headaches.',
 '**STEP 1 (Wall):** Stand with your back against a wall. **STEP 2 (Tuck):** Draw your chin straight back (not down) until the back of your head touches the wall. **STEP 3 (Hold):** Hold 5 seconds, release, repeat.',
 '10 reps × 3 sets. Do this every hour at a desk.'),

-- ── NECK ────────────────────────────────────────────────────
('n-001', ARRAY['neck'], 'relief', 'beginner', 'neck side stretch cervic sternocleidomastoid',
 'left_side', 'Left Neck Side Stretch',
 'Lengthens the left SCM and scalene muscles to relieve one-sided neck stiffness and nerve compression.',
 '**STEP 1 (Sit):** Sit upright, feet flat on floor. **STEP 2 (Tilt):** Tilt your right ear toward your right shoulder until you feel a strong pull on the left side of your neck. **STEP 3 (Deepen):** Place your right hand gently on your left temple to add light pressure. Hold 30 seconds.',
 '3 holds × 30 seconds. Switch sides if needed.'),

('n-002', ARRAY['neck'], 'relief', 'beginner', 'neck side stretch cervic',
 'right_side', 'Right Neck Side Stretch',
 'Targets the right SCM and scalene muscles to relieve right-sided neck tightness.',
 '**STEP 1 (Sit):** Sit upright, feet flat on floor. **STEP 2 (Tilt):** Tilt your left ear toward your left shoulder until you feel a pull on the right neck. **STEP 3 (Deepen):** Place your left hand gently on your right temple. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('n-003', ARRAY['neck'], 'relief', 'beginner', 'neck flexion cervic chin chest',
 'back_neck', 'Chin-to-Chest Stretch',
 'Stretches the posterior cervical extensor muscles and sub-occipital group to relieve back-of-neck tightness.',
 '**STEP 1 (Sit):** Sit upright. **STEP 2 (Lower):** Slowly bring your chin toward your chest until you feel a stretch at the back of your neck. **STEP 3 (Deepen):** Clasp your hands behind your head and let the weight add gentle pressure. Hold 30–45 seconds.',
 '3 rounds, 30–45 seconds each.'),

('n-004', ARRAY['neck'], 'relief', 'beginner', 'scalene anterior neck stretch front cervic',
 'front_neck', 'Anterior Scalene Stretch',
 'Opens the front of the neck to relieve tightness from prolonged looking down and reduces pressure on the brachial plexus.',
 '**STEP 1 (Sit):** Sit tall and place your right hand on your collarbone to hold the skin down. **STEP 2 (Tilt):** Tilt your head back and to the right, looking up at the ceiling. **STEP 3 (Hold):** You should feel the stretch along the front-left of your neck. Hold 30 seconds, then switch.',
 '3 holds × 30 seconds per side.'),

('n-005', ARRAY['neck'], 'relief', 'intermediate', 'levator scapulae neck stretch cervic',
 'back_neck', 'Levator Scapulae Stretch',
 'Targets the muscle running from C1–C4 to the shoulder blade — a primary source of "stiff neck" pain.',
 '**STEP 1 (Anchor):** Sit and tuck your right hand under your sitting bone to anchor your shoulder. **STEP 2 (Rotate):** Turn your head 45° to the left. **STEP 3 (Lower):** Drop your chin toward your left armpit until you feel the stretch at the base of your right neck. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('n-006', ARRAY['neck'], 'warmup', 'beginner', 'neck roll cervic rotation warmup',
 NULL, 'Neck Roll Warm-Up',
 'Slowly mobilises all cervical joints to increase synovial fluid and prepare the neck for activity.',
 '**STEP 1 (Start):** Sit or stand tall. **STEP 2 (Roll):** Let your head drop gently to the right, roll forward to your chest, then to the left, then back to upright. Do NOT go full backward. **STEP 3 (Reverse):** Repeat in the opposite direction.',
 '5 slow circles each direction. Take 10 seconds per circle.'),

('n-007', ARRAY['neck'], 'strength', 'beginner', 'neck isometric cervic deep flexor',
 NULL, 'Neck Isometric Press',
 'Builds deep cervical flexor endurance to reduce chronic neck fatigue and prevent repeat injury.',
 '**STEP 1 (Hand):** Place your palm flat on your right temple. **STEP 2 (Press):** Push your head into your hand while your hand resists — no movement. **STEP 3 (Hold):** Maintain tension for 10 seconds. Repeat on all four sides.',
 '10 sec × 5 reps per direction. Build to 15 seconds.'),

('n-008', ARRAY['neck'], 'posture', 'beginner', 'chin tuck wall neck cervic posture alignment',
 NULL, 'Wall Chin Tuck',
 'Retrains the deep neck flexors and counters forward-head posture which causes chronic neck pain.',
 '**STEP 1 (Wall):** Stand with back, shoulders, and head against a wall. **STEP 2 (Tuck):** Without lifting your chin, pull your head straight back until it lightly touches the wall. **STEP 3 (Hold):** Hold 5 seconds, relax forward, repeat.',
 '15 reps × 2 sets per hour at a screen.'),

('n-009', ARRAY['neck'], 'yoga', 'beginner', 'neck cervic seated release yoga',
 NULL, 'Seated Neck Release',
 'A restorative pose that allows complete passive lengthening of all neck muscles using only gravity.',
 '**STEP 1 (Sit):** Sit cross-legged on the floor. **STEP 2 (Drop):** Let your right ear fall toward your right shoulder. **STEP 3 (Arms):** Let both arms rest heavily in your lap to anchor the shoulders down. Breathe and hold 1 minute per side.',
 '1 minute each side, 2 rounds.'),

-- ── TRAPS / SHOULDERS ───────────────────────────────────────
('t-001', ARRAY['traps'], 'relief', 'beginner', 'trapezius upper trap cross body shoulder stretch',
 'upper_traps', 'Upper Trap Cross-Body Stretch',
 'Directly stretches the upper trapezius belly to release the knot of tightness that lives between the neck and shoulder.',
 '**STEP 1 (Anchor):** Sit and hold the seat edge with your right hand to anchor that shoulder. **STEP 2 (Tilt):** Place your left hand on your head and gently pull your left ear toward your left shoulder. **STEP 3 (Hold):** Feel the pull along the top of the right shoulder. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('t-002', ARRAY['traps'], 'relief', 'beginner', 'levator scapulae shoulder base neck trapezius',
 'base_neck', 'Base-of-Neck Levator Release',
 'Releases the levator scapulae at the point where it attaches to the shoulder blade — a hotspot for chronic tension.',
 '**STEP 1 (Find):** Reach your right hand over your left shoulder and press your fingertips into the muscle where neck meets shoulder. **STEP 2 (Press):** Apply firm pressure and hold. **STEP 3 (Move):** Gently turn your head away from the side you are pressing. Hold 30 seconds.',
 '2–3 minutes per side working into tight spots.'),

('t-003', ARRAY['traps'], 'relief', 'beginner', 'shoulder left trapezius levator',
 'left_shoulder', 'Left Shoulder Trapezius Stretch',
 'Lengthens the left upper trapezius fibers to restore shoulder elevation symmetry.',
 '**STEP 1 (Anchor):** Sit and anchor your left hand under your thigh. **STEP 2 (Tilt):** Tilt your right ear to your right shoulder and look slightly down. **STEP 3 (Breathe):** Relax your left shoulder away from your ear. Hold 30–45 seconds.',
 '3 rounds, 30–45 seconds.'),

('t-004', ARRAY['traps'], 'relief', 'beginner', 'shoulder right trapezius levator',
 'right_shoulder', 'Right Shoulder Trapezius Stretch',
 'Lengthens the right upper trapezius to relieve unilateral shoulder elevation and tension.',
 '**STEP 1 (Anchor):** Sit and anchor your right hand under your thigh. **STEP 2 (Tilt):** Tilt your left ear to your left shoulder and look slightly down. **STEP 3 (Breathe):** Relax your right shoulder away from your ear. Hold 30–45 seconds.',
 '3 rounds, 30–45 seconds.'),

('t-005', ARRAY['traps'], 'warmup', 'beginner', 'shoulder shrug trapezius warmup',
 NULL, 'Shoulder Shrug and Drop',
 'Contracts then fully releases the trapezius, flushing stagnant fluid and warming the tissue before activity.',
 '**STEP 1 (Lift):** Inhale and shrug both shoulders up toward your ears as high as possible. **STEP 2 (Hold):** Hold at the top for 2 seconds. **STEP 3 (Drop):** Exhale forcefully and let the shoulders CRASH down — feel the release.',
 '10 reps, 2 sets.'),

('t-006', ARRAY['traps'], 'yoga', 'beginner', 'thread needle trapezius shoulder yoga',
 NULL, 'Thread the Needle',
 'Passively rotates the thoracic spine and opens the traps/rhomboids in a restorative position.',
 '**STEP 1 (Tabletop):** Start on hands and knees. **STEP 2 (Thread):** Slide your right arm under your body to the left, lowering your right shoulder and ear to the mat. **STEP 3 (Hold):** Keep your left arm extended or press into the floor. Hold 1 minute per side.',
 '1 minute per side, 2 rounds.'),

('t-007', ARRAY['traps'], 'strength', 'intermediate', 'trapezius scapulae prone YTW rhomboid',
 NULL, 'Prone Y-T-W',
 'Strengthens the lower trapezius and rotator cuff — the muscles that counterbalance chronic upper trap overload.',
 '**STEP 1 (Prone):** Lie face down with arms at your sides. **STEP 2 (Y):** Lift arms diagonally in a Y shape, thumbs up. Hold 2 seconds. **STEP 3 (T then W):** Bring arms to a T, then bend elbows into a W, squeezing shoulder blades. Lower slowly.',
 '10 reps per shape, 3 sets.'),

('t-008', ARRAY['traps'], 'posture', 'beginner', 'wall angel trapezius shoulder posture',
 NULL, 'Wall Angel',
 'Retrains scapular upward rotation and lower trap activation to counteract the rounded-shoulder posture that drives trap pain.',
 '**STEP 1 (Wall):** Stand with back flat against the wall, feet 3 cm away. Press low back, upper back, and head into the wall. **STEP 2 (Arms):** Raise arms into a goalpost position (90°) against the wall. **STEP 3 (Slide):** Slowly slide arms up overhead, keeping all contact points. Slide back down.',
 '10 slow reps, 2–3 sets.'),

-- ── CHEST ───────────────────────────────────────────────────
('c-001', ARRAY['chest'], 'relief', 'beginner', 'pectoralis doorway chest stretch pec',
 'left_chest', 'Left Pec Doorway Stretch',
 'Opens the left pectoralis major to relieve anterior chest tightness and reduce compression on left-side ribs.',
 '**STEP 1 (Doorway):** Stand in a doorframe and place your left forearm against it at 90°. **STEP 2 (Step):** Step your right foot forward, rotating your chest to the right. **STEP 3 (Hold):** Feel the stretch across your left chest. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('c-002', ARRAY['chest'], 'relief', 'beginner', 'pectoralis chest stretch pec right',
 'right_chest', 'Right Pec Doorway Stretch',
 'Opens the right pectoralis major to relieve right anterior chest tightness.',
 '**STEP 1 (Doorway):** Stand in a doorframe and place your right forearm against it at 90°. **STEP 2 (Step):** Step your left foot forward, rotating your chest to the left. **STEP 3 (Hold):** Feel the stretch across your right chest. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('c-003', ARRAY['chest'], 'relief', 'beginner', 'pectoralis sternum chest cross body stretch',
 'sternum', 'Sternum Chest Opener',
 'Relieves costal and sternal tightness by externally rotating both arms and expanding the ribcage.',
 '**STEP 1 (Stand):** Stand tall, feet shoulder-width apart. **STEP 2 (Clasp):** Clasp your hands behind your lower back. **STEP 3 (Open):** Squeeze your shoulder blades together, lift your chest, and gently roll your fists downward. Hold 20–30 seconds.',
 '5 reps, hold 20–30 seconds each.'),

('c-004', ARRAY['chest'], 'relief', 'intermediate', 'pec minor collarbone chest stretch clavicle',
 'collarbone', 'Pec Minor Collarbone Release',
 'Stretches the pec minor attachment near the coracoid process to relieve collarbone pressure and subclavian tension.',
 '**STEP 1 (Corner):** Stand in a corner with both hands on the walls. **STEP 2 (Press):** Lean your body forward, keeping elbows below shoulder height. **STEP 3 (Focus):** Concentrate the stretch high on the chest just below the collarbones. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('c-005', ARRAY['chest'], 'yoga', 'beginner', 'cobra pose chest pec yoga',
 NULL, 'Cobra Pose',
 'Gently extends the thoracic spine backward and opens the entire anterior chest and anterior shoulders.',
 '**STEP 1 (Prone):** Lie face down, hands under shoulders, elbows close to body. **STEP 2 (Press):** Inhale and slowly press your chest off the floor, straightening arms only to your comfortable limit. **STEP 3 (Hold):** Draw shoulder blades down and back. Hold 20–30 seconds.',
 '5 holds × 20–30 seconds.'),

('c-006', ARRAY['chest'], 'warmup', 'beginner', 'arm swing chest warmup pec',
 NULL, 'Arm Swing Chest Opener',
 'Dynamically warms up the pec fibers, anterior deltoids, and shoulder capsule before upper-body activity.',
 '**STEP 1 (Cross):** Cross both arms in front of your chest. **STEP 2 (Swing):** Swing them out wide to the sides like wings, squeezing the shoulder blades. **STEP 3 (Alternate):** Swing back to the cross position, alternating which arm is on top.',
 '20 reps, building speed gradually.'),

('c-007', ARRAY['chest'], 'strength', 'intermediate', 'push up chest pec brachii',
 NULL, 'Push-Up',
 'Strengthens the pectorals, anterior deltoid, and triceps — building the anterior chain that supports the chest wall.',
 '**STEP 1 (Plank):** Start in a high plank — hands under shoulders, body straight. **STEP 2 (Lower):** Bend elbows to 45° and lower your chest to 3 cm from the floor. **STEP 3 (Press):** Push back up fully, squeezing chest at the top.',
 '10–15 reps, 3 sets. Knees down if needed.'),

('c-008', ARRAY['chest'], 'posture', 'beginner', 'thoracic chest extension posture pec',
 NULL, 'Thoracic Extension Over Chair',
 'Reverses the hunched posture that chronically shortens the chest by passively extending the thoracic spine.',
 '**STEP 1 (Chair):** Sit in a hard chair, place a rolled towel along the upper back. **STEP 2 (Arch):** Support your head with your hands and lean back over the towel. **STEP 3 (Breathe):** Let gravity open your chest. Hold 20–30 seconds.',
 '5 holds, 20–30 seconds each. Move towel up one vertebra each round.'),

-- ── UPPER BACK ──────────────────────────────────────────────
('ub-001', ARRAY['upper_back'], 'relief', 'beginner', 'rhomboid shoulder blade stretch thoracic',
 'left_blade', 'Left Shoulder Blade Release',
 'Stretches the left rhomboid and middle trapezius to relieve the aching knot between the spine and shoulder blade.',
 '**STEP 1 (Cross):** Reach your left arm across your body at shoulder height. **STEP 2 (Hook):** Use your right hand to pull the left elbow closer to your chest. **STEP 3 (Round):** Round your upper back and feel the stretch at the left inner shoulder blade. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('ub-002', ARRAY['upper_back'], 'relief', 'beginner', 'rhomboid right shoulder blade thoracic',
 'right_blade', 'Right Shoulder Blade Release',
 'Stretches the right rhomboid and middle trapezius to release the knot between the spine and right blade.',
 '**STEP 1 (Cross):** Reach your right arm across your body at shoulder height. **STEP 2 (Hook):** Use your left hand to pull the right elbow closer to your chest. **STEP 3 (Round):** Round your upper back and feel the stretch at the right inner shoulder blade. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('ub-003', ARRAY['upper_back'], 'relief', 'beginner', 'thoracic cat cow upper back between blades',
 'between_blades', 'Between-Blades Cat-Cow',
 'Alternately shortens and lengthens the mid-back muscles to release the chronic tension between the shoulder blades.',
 '**STEP 1 (Tabletop):** On hands and knees. **STEP 2 (Cat):** Push through your hands, rounding the entire upper back toward the ceiling — feel the blades separate. **STEP 3 (Cow):** Inhale, let the upper back drop and spine arch between the blades.',
 '10–15 slow cycles. Focus awareness between the shoulder blades.'),

('ub-004', ARRAY['upper_back'], 'relief', 'intermediate', 'thoracic seated rotation mid spine',
 'mid_spine', 'Seated Mid-Spine Rotation',
 'Mobilises the thoracic vertebral joints that become locked from prolonged sitting, causing mid-back stiffness.',
 '**STEP 1 (Sit):** Sit sideways on a chair, feet flat on the floor. **STEP 2 (Hands):** Cross arms over your chest. **STEP 3 (Rotate):** Rotate your torso toward the chair back, using it as a gentle end-range stop. Hold 10 seconds. Repeat on the other side.',
 '8 reps each direction, 2 sets.'),

('ub-005', ARRAY['upper_back'], 'yoga', 'beginner', 'thread needle thoracic rhomboid blade yoga',
 'left_blade', 'Thread the Needle — Left',
 'Passively rotates the thoracic spine left, releasing the right rhomboid and left serratus anterior.',
 '**STEP 1 (Tabletop):** Start on hands and knees. **STEP 2 (Thread):** Slide your right arm under your body to the left, lowering your right shoulder to the mat. **STEP 3 (Hold):** Extend your left arm forward for balance. Hold 1 minute.',
 '1 minute per side.'),

('ub-006', ARRAY['upper_back'], 'strength', 'beginner', 'rhomboid row band upper back squeeze',
 NULL, 'Resistance Band Row',
 'Strengthens the rhomboids, middle trapezius, and rear deltoids — the muscles that prevent forward-shoulder collapse.',
 '**STEP 1 (Band):** Stand on a resistance band, holding one end in each hand. **STEP 2 (Hinge):** Hinge 30° forward at the hips. **STEP 3 (Row):** Pull the band up to your lower ribs, elbows back, squeezing shoulder blades together. Lower slowly.',
 '12 reps, 3 sets.'),

('ub-007', ARRAY['upper_back'], 'posture', 'beginner', 'thoracic wall slide posture upper back rhomboid',
 NULL, 'Thoracic Wall Slide',
 'Trains the mid-back to hold an upright position against the wall, correcting the forward hunch at the root cause.',
 '**STEP 1 (Wall):** Stand with spine flat against the wall. **STEP 2 (Arms):** Place arms in a goalpost shape touching the wall. **STEP 3 (Slide):** Slowly slide arms overhead, keeping the entire back in contact. Slide back down.',
 '10 reps, 2–3 sets daily.'),

-- ── ARMS ────────────────────────────────────────────────────
('a-001', ARRAY['arms'], 'relief', 'beginner', 'bicep wall arm stretch brachii',
 'bicep', 'Bicep Wall Stretch',
 'Lengthens the biceps brachii along the entire arm to relieve the anterior elbow and shoulder tightness that builds from repeated curling motions.',
 '**STEP 1 (Wall):** Stand facing a wall and place your right palm flat on it at shoulder height, thumb facing up. **STEP 2 (Rotate):** Rotate your body away from the wall, keeping your palm in contact. **STEP 3 (Hold):** Feel the pull from shoulder to elbow. Hold 30 seconds.',
 '3 holds × 30 seconds per arm.'),

('a-002', ARRAY['arms'], 'relief', 'beginner', 'tricep overhead stretch brachii arm',
 'tricep', 'Tricep Overhead Stretch',
 'Stretches the long head of the triceps from the scapula to the elbow, relieving the posterior arm and elbow pain.',
 '**STEP 1 (Lift):** Raise your right arm, bend the elbow, and let your right hand fall behind your head. **STEP 2 (Assist):** Use your left hand to gently push the right elbow further behind your head. **STEP 3 (Hold):** Feel the pull from armpit down the back of the arm. Hold 30 seconds.',
 '3 holds × 30 seconds per arm.'),

('a-003', ARRAY['arms'], 'relief', 'beginner', 'deltoid cross body shoulder arm stretch',
 'shoulder', 'Cross-Body Shoulder Stretch',
 'Targets the posterior deltoid and posterior capsule — relieves the deep ache at the back of the shoulder that follows overhead or throwing work.',
 '**STEP 1 (Cross):** Bring your right arm straight across your chest. **STEP 2 (Hook):** Use your left forearm to hold and pull the right arm closer to your chest. **STEP 3 (Hold):** Feel the pull at the back of the right shoulder. Hold 30 seconds.',
 '3 holds × 30 seconds per arm.'),

('a-004', ARRAY['arms'], 'relief', 'beginner', 'elbow brachialis arm stretch tennis elbow',
 'elbow', 'Elbow Flexor Stretch',
 'Reduces tightness in the brachialis and bicep tendon at the elbow crease, relieving elbow flexion stiffness.',
 '**STEP 1 (Extend):** Straighten your arm fully. **STEP 2 (Supinate):** Rotate your forearm so the palm faces upward. **STEP 3 (Mild pull):** Use the other hand to gently press the wrist further back. Hold 20–30 seconds.',
 '3 holds × 20–30 seconds per arm.'),

('a-005', ARRAY['arms'], 'warmup', 'beginner', 'arm circle deltoid brachii warmup',
 NULL, 'Arm Circle Warm-Up',
 'Lubricates the shoulder joint, warms the biceps and deltoid, and increases blood flow before lifting.',
 '**STEP 1 (Small):** Extend arms sideways, make 10 small forward circles. **STEP 2 (Large):** Increase to large sweeping circles, 10 reps. **STEP 3 (Reverse):** Repeat both sizes backward.',
 '20 reps each direction.'),

('a-006', ARRAY['arms'], 'yoga', 'beginner', 'cow face pose tricep deltoid arm yoga',
 'tricep', 'Cow Face Arm Pose',
 'Provides a deep simultaneous stretch for one tricep and one shoulder at once, restoring full overhead range.',
 '**STEP 1 (Right up):** Raise your right arm, bend the elbow, hand behind your head. **STEP 2 (Left behind):** Bring your left arm behind your back and try to clasp fingers. **STEP 3 (Hold):** If you cannot clasp, hold a towel between hands. Hold 45 seconds.',
 '45 seconds each side, 2 rounds.'),

('a-007', ARRAY['arms'], 'strength', 'beginner', 'isometric bicep hold arm brachii wall',
 'bicep', 'Isometric Bicep Hold',
 'Builds bicep tensile strength without joint movement — safe for acute elbow or shoulder pain.',
 '**STEP 1 (Position):** Stand in a doorway. Place your forearm under the frame at 90°. **STEP 2 (Press):** Push your forearm up into the frame as hard as possible. **STEP 3 (Hold):** Maintain maximum effort for 10 seconds.',
 '10 sec × 8 reps, 2 sets.'),

('a-008', ARRAY['arms'], 'posture', 'beginner', 'external rotation cuff deltoid arm shoulder posture',
 'shoulder', 'External Rotation Cuff Reset',
 'Strengthens the external rotators to undo the internal rotation pattern that causes shoulder impingement and bicep pain.',
 '**STEP 1 (Elbow):** Stand with elbow bent 90° at your side, holding a light resistance band. **STEP 2 (Rotate):** Keeping the elbow glued to your side, rotate the forearm outward. **STEP 3 (Control):** Return slowly — focus on the back of the shoulder.',
 '15 reps × 3 sets per arm.'),

-- ── FOREARMS ────────────────────────────────────────────────
('f-001', ARRAY['forearms'], 'relief', 'beginner', 'wrist flexor stretch forearm prayer inner',
 'inner_forearm', 'Wrist Flexor Prayer Stretch',
 'Lengthens the wrist flexors running along the inner forearm to relieve the tightness behind Golfer''s elbow and carpal tunnel pressure.',
 '**STEP 1 (Prayer):** Bring both palms together in front of your chest in a prayer position. **STEP 2 (Lower):** Slowly lower your hands toward your waist, keeping the palms pressed together. **STEP 3 (Hold):** Feel the pull along the inner forearms. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('f-002', ARRAY['forearms'], 'relief', 'beginner', 'wrist extensor stretch forearm outer',
 'outer_forearm', 'Wrist Extensor Stretch',
 'Stretches the extensor muscle along the outer forearm to relieve the pain driving Tennis elbow (lateral epicondylitis).',
 '**STEP 1 (Extend):** Extend your right arm forward, palm facing you. **STEP 2 (Flex):** Use your left hand to gently pull the right fingers and wrist toward your body. **STEP 3 (Hold):** Feel the pull along the outer forearm. Hold 30 seconds.',
 '3 holds × 30 seconds per arm.'),

('f-003', ARRAY['forearms'], 'relief', 'beginner', 'elbow brachioradialis forearm stretch',
 'elbow', 'Brachioradialis Elbow Release',
 'Specifically stretches the brachioradialis which is taut at the elbow — the primary driver of lateral elbow pain.',
 '**STEP 1 (Arm out):** Hold your right arm straight in front, palm facing down. **STEP 2 (Curl wrist):** Bend your right wrist downward. **STEP 3 (Pull):** Use your left hand to add gentle downward pressure on the right fingers, stretching the outer forearm. Hold 20 seconds.',
 '3 holds × 20 seconds per arm.'),

('f-004', ARRAY['forearms'], 'relief', 'intermediate', 'golfers elbow medial inner forearm stretch',
 'inner_forearm', 'Golfer''s Elbow Inner Forearm Stretch',
 'Specifically targets the flexor-pronator mass at the medial epicondyle — the cause of Golfer''s elbow pain.',
 '**STEP 1 (Extend):** Straighten your right arm in front of you, palm up. **STEP 2 (Cock back):** Use your left hand to bend the right wrist back (fingers up). **STEP 3 (Pronate):** Slightly internally rotate the arm while maintaining the stretch. Hold 30 seconds.',
 '3 holds × 30 seconds per arm.'),

('f-005', ARRAY['forearms'], 'warmup', 'beginner', 'wrist circle forearm warmup brachioradialis',
 NULL, 'Wrist Circle Warm-Up',
 'Lubricates the wrist and distal radioulnar joints and warms the forearm muscles before gripping or lifting.',
 '**STEP 1 (Fist):** Make loose fists. **STEP 2 (Circle):** Slowly rotate both wrists in large circles — 10 reps clockwise. **STEP 3 (Reverse):** 10 reps counter-clockwise.',
 '10 reps each direction.'),

('f-006', ARRAY['forearms'], 'strength', 'beginner', 'wrist curl forearm brachioradialis',
 NULL, 'Wrist Curl',
 'Strengthens the wrist flexors for balanced forearm strength and reduced repetitive strain injury risk.',
 '**STEP 1 (Sit):** Sit and rest your forearm on your thigh, palm up, holding a light weight. **STEP 2 (Lower):** Lower the weight toward the floor. **STEP 3 (Curl):** Curl the wrist up as far as it will go. Lower slowly.',
 '15 reps × 3 sets per arm.'),

('f-007', ARRAY['forearms'], 'strength', 'beginner', 'reverse wrist curl forearm extensor outer',
 'outer_forearm', 'Reverse Wrist Curl',
 'Strengthens the extensor group to correct the flexor/extensor imbalance that causes Tennis elbow.',
 '**STEP 1 (Sit):** Rest forearm on your thigh, palm facing down. **STEP 2 (Lower):** Let the weight dangle. **STEP 3 (Lift):** Raise the back of your hand toward the ceiling. Lower slowly.',
 '15 reps × 3 sets per arm.'),

('f-008', ARRAY['forearms'], 'posture', 'beginner', 'neutral wrist forearm ergonomic posture',
 NULL, 'Neutral Wrist Desk Reset',
 'Corrects the flexed-wrist typing posture that progressively tightens the forearm and strains the carpal tunnel.',
 '**STEP 1 (Desk):** At your desk, ensure your wrists are straight — not bent up or down. **STEP 2 (Shake):** Shake out your wrists for 10 seconds to reset blood flow. **STEP 3 (Reset):** Place forearms on the desk surface so wrists are fully supported and neutral.',
 'Check wrist position every 30 minutes. Do shake-out hourly.'),

-- ── HANDS / WRISTS ──────────────────────────────────────────
('hw-001', ARRAY['hands'], 'relief', 'beginner', 'finger tendon glide hand carpal',
 'fingers', 'Finger Tendon Glide',
 'Moves the flexor tendons through their full range inside the carpal tunnel, reducing adhesion-related finger pain and stiffness.',
 '**STEP 1 (Straight):** Hold your hand out, fingers straight. **STEP 2 (Tabletop):** Bend fingers at the large knuckles only — like a tabletop — keeping the tips straight. Hold 3 seconds. **STEP 3 (Fist):** Curl into a full gentle fist. Hold 3 seconds. Straighten and repeat.',
 '10 full cycles, 3–4 times per day.'),

('hw-002', ARRAY['hands'], 'relief', 'beginner', 'thumb opposition hand grip carpal',
 'thumb', 'Thumb Opposition',
 'Restores the full range of the thumb carpometacarpal joint and relieves the ache at the base of the thumb from de Quervain''s or overuse.',
 '**STEP 1 (Ready):** Hold your hand open. **STEP 2 (Touch):** Bring the tip of your thumb to touch the tip of your little finger. **STEP 3 (Sequence):** Move back through each finger — ring, middle, index. Repeat in both directions.',
 '10 full sequences, 3 times per day.'),

('hw-003', ARRAY['hands'], 'relief', 'beginner', 'palm hand stretch metacarpal wrist',
 'palm', 'Palm Stretch',
 'Opens the intrinsic muscles of the palm and the palmar fascia — relieves Dupuytren''s-type tightness and palm cramping.',
 '**STEP 1 (Press):** Interlace fingers of both hands. **STEP 2 (Flip):** Turn palms outward away from you and straighten elbows. **STEP 3 (Hold):** Feel the deep stretch through both palms. Hold 20–30 seconds.',
 '3 holds × 20–30 seconds.'),

('hw-004', ARRAY['hands'], 'relief', 'beginner', 'wrist ulnar radial deviation hand stretch carpal',
 'wrist', 'Wrist Side-to-Side Stretch',
 'Mobilises the radiocarpal joint and stretches the ulnar and radial collateral ligaments compressed by sustained gripping.',
 '**STEP 1 (Extend):** Extend your right arm forward, palm facing down. **STEP 2 (Ulnar):** Bend your wrist toward the ground (ulnar deviation). Hold 10 seconds. **STEP 3 (Radial):** Bend your wrist back and toward the thumb (radial deviation). Hold 10 seconds.',
 '5 cycles per wrist.'),

('hw-005', ARRAY['hands'], 'relief', 'beginner', 'pinky finger abduction hand',
 'pinky', 'Pinky Abduction Stretch',
 'Opens the ulnar side of the hand and stretches the hypothenar muscles that cause pinky-side hand aching.',
 '**STEP 1 (Spread):** Place your hand palm-up on a flat surface. **STEP 2 (Pull):** Use the other hand to gently pull your little finger away from the ring finger. **STEP 3 (Hold):** Hold the gentle separation for 15 seconds.',
 '5 reps on each hand.'),

('hw-006', ARRAY['hands'], 'relief', 'beginner', 'ring finger stretch hand finger',
 'ring_finger', 'Ring Finger Stretch',
 'Individually stretches the flexor digitorum tendon of the ring finger — the most commonly adhered tendon in trigger finger.',
 '**STEP 1 (Isolate):** Hold all other fingers bent and curl only your ring finger into your palm. **STEP 2 (Extend):** Use the opposite thumb to gently extend just the ring finger. **STEP 3 (Hold):** Hold 15 seconds, feel the dorsal pull.',
 '5 reps per hand, 3 times daily.'),

('hw-007', ARRAY['hands'], 'warmup', 'beginner', 'hand shake wrist finger warmup grip',
 NULL, 'Hand Shake Loose',
 'Rapidly increases blood flow to the intrinsic hand muscles and wrist joints before fine motor or grip activities.',
 '**STEP 1 (Dangle):** Let both arms hang loosely at your sides. **STEP 2 (Shake):** Rapidly shake your hands from the wrists as if flicking water off them. **STEP 3 (Up):** Raise arms overhead and shake briefly, then circle back down.',
 '30 seconds, 2–3 times before activity.'),

('hw-008', ARRAY['hands'], 'strength', 'beginner', 'grip squeeze hand strength finger metacarpal',
 NULL, 'Grip Squeeze',
 'Builds balanced gripping strength to reduce fatigue-related finger and wrist pain during repetitive hand tasks.',
 '**STEP 1 (Ball):** Hold a soft stress ball or rolled towel in your hand. **STEP 2 (Squeeze):** Squeeze as hard as you comfortably can. **STEP 3 (Hold):** Hold 5 seconds, then fully relax for 5 seconds.',
 '20 reps × 3 sets per hand.'),

('hw-009', ARRAY['hands'], 'posture', 'beginner', 'neutral hand wrist ergonomic posture carpal',
 NULL, 'Neutral Hand Reset',
 'Teaching the hand to rest in a neutral cup shape prevents the hyperextension and overgripping that progressively strains tendons.',
 '**STEP 1 (Cup):** Let your hand rest in a natural cup shape — not flat, not clenched. **STEP 2 (Check):** Your fingers should be gently curved, wrist straight. **STEP 3 (Hold):** Maintain this shape for a minute, feeling it as the "resting" default.',
 'Practice for 2 minutes, 3–4 times per day while at a desk.');
