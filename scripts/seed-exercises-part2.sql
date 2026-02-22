-- ============================================================
-- MuscliKnot Exercise Database — Part 2
-- Muscle groups: lower_back, abdomen, hips, glutes, thighs
-- APPEND this after Part 1 in the Supabase SQL editor.
-- ============================================================

INSERT INTO recovery_knowledge_base
  (id, muscle_id, exercise_type, difficulty_level, common_name, area_of_pain, solution_stretch, why, instructions, process)
VALUES

-- ── LOWER BACK ──────────────────────────────────────────────
('lb-001', ARRAY['lower_back'], 'relief', 'beginner', 'knee chest lumbar lower back stretch',
 NULL, 'Knee-to-Chest Stretch',
 'Gently decompresses the lumbar vertebrae and releases the erector spinae to relieve general lower back aching.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Hug):** Draw both knees simultaneously toward your chest and wrap your arms around your shins. **STEP 3 (Rock):** Gently rock side to side for 30 seconds, then hold still for 30 seconds.',
 '3 rounds, 1 minute each.'),

('lb-002', ARRAY['lower_back'], 'relief', 'beginner', 'quadratus lumborum left lower back stretch QL',
 'left_lower', 'Left QL Side Stretch',
 'Directly lengthens the left quadratus lumborum — the muscle responsible for lateral lower back pain and hip-hike.',
 '**STEP 1 (Stand):** Stand with feet hip-width apart. **STEP 2 (Side bend):** Reach your right arm overhead and lean to the RIGHT — you stretch the LEFT side. **STEP 3 (Anchor):** Place your left hand on your left hip for support. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('lb-003', ARRAY['lower_back'], 'relief', 'beginner', 'quadratus lumborum right lower back QL',
 'right_lower', 'Right QL Side Stretch',
 'Lengthens the right quadratus lumborum to relieve right-sided lower back pain and lumbar tightness.',
 '**STEP 1 (Stand):** Stand with feet hip-width apart. **STEP 2 (Side bend):** Reach your left arm overhead and lean to the LEFT — you stretch the RIGHT side. **STEP 3 (Anchor):** Place your right hand on your right hip. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('lb-004', ARRAY['lower_back', 'glutes'], 'relief', 'beginner', 'coccyx tailbone relief forward lean supine tilt',
 'tailbone', 'Tailbone Forward Lean Relief',
 'Tilts the pelvis forward slightly to unload pressure from the coccyx — immediate relief for tailbone (coccydynia) pain, especially after sitting.',
 '**STEP 1 (Sit):** Sit on the edge of a firm chair. **STEP 2 (Lean):** Lean your weight slightly forward onto your thighs, tilting your pelvis forward. This lifts the coccyx off the seat. **STEP 3 (Hold):** Maintain this tilt for 30 seconds, breathing normally.',
 'Do this any time you stand up after sitting. 5 reps × 30 seconds.'),

('lb-005', ARRAY['lower_back', 'glutes'], 'relief', 'beginner', 'sacral rocking sacrum coccyx tailbone lumbar',
 'tailbone', 'Sacral Rocking',
 'Provides gentle, rhythmic mobilisation of the sacrum and coccyx — reduces compressive coccydynia pain through joint oscillation.',
 '**STEP 1 (Lie):** Lie on your back with knees bent, feet flat. **STEP 2 (Tilt):** Flatten your low back into the floor (posterior tilt), hold 3 seconds. **STEP 3 (Arch):** Arch your low back up (anterior tilt), hold 3 seconds. Rock between the two.',
 '15–20 slow cycles. Focus on moving the tailbone away from the floor, then toward it.'),

('lb-006', ARRAY['lower_back', 'glutes'], 'relief', 'beginner', 'sacroiliac joint sacrum release lower back lumbar',
 'sacrum', 'Sacroiliac Joint Release',
 'Gently gaps the sacroiliac joint to relieve the deep, unilateral sacral pain characteristic of SI joint dysfunction.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Drop):** Let both knees drop slowly to the right, feeling a gentle rotation through the sacrum. **STEP 3 (Hold):** Hold 45 seconds, then return centre and drop left.',
 '3 holds each side, 45 seconds.'),

('lb-007', ARRAY['lower_back'], 'relief', 'beginner', 'double knee chest sacrum coccyx lumbar lumborum',
 'sacrum', 'Double Knee-to-Chest Sacral Release',
 'Flexing both hips simultaneously flattens and releases the sacrum against the floor, relieving sacral compression.',
 '**STEP 1 (Lie):** Lie flat. Hug both knees to your chest at the same time, sacrum pressing into the floor. **STEP 2 (Hold):** Hold the hug firmly for 45 seconds. **STEP 3 (Rock):** Gently rock left and right 10 times before releasing.',
 '3 rounds.'),

('lb-008', ARRAY['lower_back'], 'relief', 'beginner', 'cat cow lumbar lower back erector',
 NULL, 'Cat-Cow — Lumbar Focus',
 'Rhythmically flexes and extends the lumbar spine to reduce stiffness in the L1–L5 joints and warm up the paraspinals.',
 '**STEP 1 (Tabletop):** On hands and knees, wrists under shoulders. **STEP 2 (Cat):** Exhale and round your lower back toward the ceiling. **STEP 3 (Cow):** Inhale and let the lower back arch, pelvis tilting forward.',
 '15 slow cycles morning and evening.'),

('lb-009', ARRAY['lower_back'], 'relief', 'intermediate', 'press up extension lumbar erector lower back McKenzie',
 NULL, 'Press-Up Extension',
 'McKenzie-style lumbar extension that centralises disc-related pain and opens the anterior disc space to relieve nerve compression.',
 '**STEP 1 (Prone):** Lie face down, hands under shoulders. **STEP 2 (Press):** Slowly straighten elbows, letting your pelvis stay on the floor as your back arches. **STEP 3 (Hold):** Hold at top 10 seconds, lower with control.',
 '10 reps, 2–3 sets. Stop if pain increases.'),

('lb-010', ARRAY['lower_back'], 'yoga', 'beginner', 'childs pose lumbar lower back stretch yoga',
 NULL, 'Child''s Pose — Lumbar',
 'Passively decompresses every lumbar vertebra and provides full spine-length traction using body weight.',
 '**STEP 1 (Kneel):** Kneel and sit back toward your heels. **STEP 2 (Extend):** Reach arms forward on the floor. **STEP 3 (Sink):** Let your chest drop toward your thighs and breathe deeply into your lower back. Hold 2 minutes.',
 '2–3 minutes. Use as your go-to rest position throughout the day.'),

('lb-011', ARRAY['lower_back'], 'yoga', 'beginner', 'supine twist lower back lumbar yoga rotation',
 NULL, 'Supine Spinal Twist',
 'Rotates and decompresses the lumbar facet joints, releasing torsional stiffness that aches after sitting.',
 '**STEP 1 (Lie):** Lie on your back. Bring right knee to your chest. **STEP 2 (Cross):** Guide the right knee across your body to the left using your left hand. **STEP 3 (Open):** Extend the right arm to the right and look right. Hold 1 minute each side.',
 '1 minute per side.'),

('lb-012', ARRAY['lower_back'], 'strength', 'intermediate', 'bird dog erector lower back lumbar spinae core',
 NULL, 'Bird Dog',
 'Trains the erector spinae, multifidus, and glutes in coordinated stability — the foundation of lasting lower back health.',
 '**STEP 1 (Tabletop):** On hands and knees. **STEP 2 (Extend):** Simultaneously extend your right arm and left leg until both are horizontal. **STEP 3 (Hold):** Hold 5 seconds, then switch sides. Focus on not rotating the hips.',
 '10 reps per side, 3 sets.'),

('lb-013', ARRAY['lower_back'], 'posture', 'beginner', 'pelvic tilt lower back lumbar erector posture',
 NULL, 'Pelvic Tilt Reset',
 'Teaches the pelvis to find neutral — the single most important posture habit for preventing recurring lower back pain.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Flatten):** Gently tighten your lower abdomen and press your back flat to the floor. **STEP 3 (Hold):** Hold 10 seconds, breathe normally, release.',
 '15 reps × 2 sets. Also practise standing against a wall.'),

('lb-014', ARRAY['lower_back'], 'warmup', 'beginner', 'hip circle lower back warmup lumbar',
 NULL, 'Hip Circle Warm-Up',
 'Warms the lumbar joints, hip flexors, and QL through their full rotary range before physical activity.',
 '**STEP 1 (Stand):** Feet slightly wider than shoulder-width, hands on hips. **STEP 2 (Circle):** Make large, slow circles with your hips — 10 clockwise. **STEP 3 (Reverse):** 10 counter-clockwise.',
 '10 circles each direction. Gradually increase the size of circles.'),

-- ── ABDOMEN ─────────────────────────────────────────────────
('ab-001', ARRAY['abdomen'], 'relief', 'beginner', 'belly breathing diaphragm abdominal release',
 NULL, 'Diaphragmatic Breathing Release',
 'Deep belly breathing reduces intra-abdominal pressure, releases the diaphragm, and deactivates the abdominal guarding that clusters around mild abdominal pain.',
 '**STEP 1 (Lie):** Lie on your back, one hand on your stomach. **STEP 2 (Inhale):** Breathe in slowly through your nose for 4 counts — let your belly rise, not your chest. **STEP 3 (Exhale):** Exhale slowly for 6 counts, letting your belly fall.',
 '10 deep cycles. Use as an ongoing reset whenever discomfort spikes.'),

('ab-002', ARRAY['abdomen'], 'relief', 'beginner', 'upper abdominal massage rectus stomach',
 'upper_abs', 'Upper Abdomen Massage',
 'Gentle circular massage over the epigastric region releases muscle tightness and improves visceral motility.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Press):** Using three fingertips, apply gentle clockwise circular pressure below your ribcage. **STEP 3 (Move):** Work slowly across the upper abdomen from right to left, following the colon direction.',
 '3–5 minutes of slow circular massage.'),

('ab-003', ARRAY['abdomen'], 'relief', 'beginner', 'lower abdominal release rectus oblique',
 'lower_abs', 'Lower Abdominal Release',
 'Reduces tension in the lower rectus abdominis and hip flexor attachment that causes low abdominal and pelvic cramping.',
 '**STEP 1 (Prone):** Lie face down with a pillow under your lower abdomen. **STEP 2 (Breathe):** Take 10 slow, deep breaths, letting gravity gently decompress the lower belly. **STEP 3 (Relax):** Focus on fully relaxing the abdomen with each exhale.',
 '3–5 minutes.'),

('ab-004', ARRAY['abdomen'], 'strength', 'intermediate', 'dead bug abdominal core transverse rectus',
 NULL, 'Dead Bug',
 'Trains the deep transverse abdominis against limb loading — a safe, spine-neutral core exercise for all levels.',
 '**STEP 1 (Lie):** Lie on your back, arms and knees pointing to the ceiling at 90°. **STEP 2 (Brace):** Press your low back to the floor. **STEP 3 (Extend):** Simultaneously lower your right arm overhead and left leg toward the floor. Return, switch.',
 '8 reps per side, 3 sets. Never let your back lift.'),

('ab-005', ARRAY['abdomen'], 'strength', 'intermediate', 'plank core abdominal rectus oblique stabiliser',
 NULL, 'Plank Hold',
 'Builds endurance in the rectus abdominis and obliques in their supporting (not moving) role — safer for spine than crunches.',
 '**STEP 1 (Forearm):** Forearms on floor, elbows under shoulders. Body in one straight line. **STEP 2 (Squeeze):** Brace your core, squeeze glutes, keep hips level. **STEP 3 (Breathe):** Breathe slowly and hold.',
 'Start at 20 seconds, build to 60 seconds. 3 sets.'),

('ab-006', ARRAY['abdomen'], 'strength', 'intermediate', 'pallof press oblique left side core',
 'left_side', 'Left-Side Oblique Pallof Press',
 'Anti-rotation training for the left obliques — prevents the side-flexion weakness that leads to lateral abdominal strain.',
 '**STEP 1 (Band):** Anchor a band to your right. Stand sideways. **STEP 2 (Press):** Hold band at your chest and press it straight forward. **STEP 3 (Resist):** Resist the pull from rotating — hold 3 seconds per rep.',
 '12 reps × 3 sets per side.'),

('ab-007', ARRAY['abdomen'], 'posture', 'beginner', 'TVA transverse abdominis activation core posture',
 NULL, 'TVA Draw-In',
 'Rehabilitates the deep transverse abdominis — the inner corset whose weakness is the primary cause of abdominal wall pain and recurrence.',
 '**STEP 1 (Hook):** Lie on your back, knees bent. **STEP 2 (Draw):** Gently draw your belly button toward the floor without moving your pelvis or ribs. **STEP 3 (Hold):** Hold 10 seconds, breathe out naturally. Release and repeat.',
 '15 reps × 2 sets, twice per day.'),

('ab-008', ARRAY['abdomen'], 'yoga', 'beginner', 'boat pose core abdominal yoga modification',
 NULL, 'Modified Boat Pose',
 'Activates the hip flexors and rectus abdominis in a controlled, neutral spinal position to re-awaken abdominal tone.',
 '**STEP 1 (Sit):** Sit with knees bent, feet flat. **STEP 2 (Lean):** Lean back slightly until you feel abdominal tension. **STEP 3 (Lift):** Option: lift feet off ground to deepen.',
 '20–30 second holds, 3 rounds.'),

-- ── HIPS ────────────────────────────────────────────────────
('hi-001', ARRAY['hips'], 'relief', 'beginner', 'hip flexor lunge stretch iliopsoas',
 'hip_flexor', 'Hip Flexor Kneeling Lunge',
 'Directly lengthens the iliopsoas in its short position — relieves the pulling ache at the front of the hip after prolonged sitting.',
 '**STEP 1 (Kneel):** Kneel on your right knee, left foot forward. **STEP 2 (Sink):** Push your hips forward and down until you feel the stretch deep in the front of the right hip. **STEP 3 (Raise):** Raise your right arm overhead to increase the iliopsoas stretch. Hold 45 seconds.',
 '3 holds × 45 seconds per side.'),

('hi-002', ARRAY['hips'], 'relief', 'beginner', 'groin adductor stretch hip inner thigh',
 'groin', 'Groin Adductor Stretch',
 'Stretches the adductor longus at the groin crease — relieves the sharp pulling pain in the inner hip from kicking, lunging, or prolonged striding.',
 '**STEP 1 (Squat):** Sit in a wide squat, feet wide, toes out. **STEP 2 (Elbows):** Place your elbows on your inner thighs. **STEP 3 (Press):** Gently press your elbows outward to deepen the inner groin stretch. Hold 45 seconds.',
 '3 holds × 45 seconds.'),

('hi-003', ARRAY['hips'], 'relief', 'beginner', 'figure four hip stretch piriformis left',
 'left_hip', 'Left Hip Figure Four',
 'Stretches the left gluteus medius and external hip rotators to relieve lateral hip socket pain.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Cross):** Cross your left ankle over your right knee. **STEP 3 (Pull):** Reach through and pull the right thigh toward your chest. Hold 45 seconds.',
 '3 holds × 45 seconds per side.'),

('hi-004', ARRAY['hips'], 'relief', 'beginner', 'figure four hip stretch piriformis right',
 'right_hip', 'Right Hip Figure Four',
 'Stretches the right gluteus medius and hip external rotators to relieve right hip socket pain.',
 '**STEP 1 (Lie):** Lie on your back, knees bent. **STEP 2 (Cross):** Cross your right ankle over your left knee. **STEP 3 (Pull):** Pull the left thigh toward your chest. Hold 45 seconds.',
 '3 holds × 45 seconds.'),

('hi-005', ARRAY['hips'], 'relief', 'intermediate', 'iliopsoas thomas stretch hip flexor',
 'hip_flexor', 'Thomas Stretch — Hip Flexor',
 'Isolates the iliopsoas by locking the pelvis, providing a deeper and more targeted hip flexor release than a standing lunge.',
 '**STEP 1 (Edge):** Sit on the edge of a table. **STEP 2 (Lie):** Lie back and bring both knees to your chest. **STEP 3 (Lower):** Let the right leg drop over the edge. Feel the stretch in the right hip flexor. Hold 45 seconds.',
 '3 holds × 45 seconds per side.'),

('hi-006', ARRAY['hips'], 'warmup', 'beginner', 'hip circle warmup iliopsoas tensor',
 NULL, 'Hip Circle Warm-Up',
 'Lubricate the hip socket through full circumduction to raise temperature and synovial fluid before lower-body exercise.',
 '**STEP 1 (Stand):** Stand on one leg. **STEP 2 (Circle):** Make a large circle with the opposite knee — 10 forward. **STEP 3 (Reverse):** 10 backward. Switch legs.',
 '10 circles each direction per leg.'),

('hi-007', ARRAY['hips'], 'yoga', 'beginner', 'pigeon pose hip yoga iliopsoas',
 NULL, 'Pigeon Pose',
 'The most effective single pose for releasing the entire hip complex — opens the hip flexors, rotators, and joint capsule.',
 '**STEP 1 (Dog):** Start in a downward dog. **STEP 2 (Swing):** Bring your right knee forward to your right wrist, shin angled across. **STEP 3 (Lower):** Lower your hips toward the floor. Hold 2 minutes.',
 '2 minutes per side.'),

('hi-008', ARRAY['hips'], 'strength', 'beginner', 'clamshell hip abductor tensor Exercise',
 NULL, 'Clamshell',
 'Isolates the gluteus medius — the primary stabiliser of the hip that, when weak, causes hip labrum overload and lateral pain.',
 '**STEP 1 (Side):** Lie on your side, hips and knees bent 45°, band above knees. **STEP 2 (Open):** Keeping feet together, lift the top knee like a clamshell opening. **STEP 3 (Control):** Lower slowly without letting the pelvis rock.',
 '15 reps per side, 3 sets.'),

('hi-009', ARRAY['hips'], 'posture', 'beginner', 'posterior pelvic tilt hip posture iliopsoas',
 NULL, 'Posterior Pelvic Tilt Stand',
 'Teaches the pelvis to rest in neutral against a wall, correcting the anterior pelvic tilt that shortens hip flexors chronically.',
 '**STEP 1 (Wall):** Stand with your back against a wall, feet 5 cm away. **STEP 2 (Flatten):** Gently tighten your glutes and press your lower back flat to the wall. **STEP 3 (Hold):** Hold 10 seconds, release, repeat.',
 '10 reps × 2 sets.'),

-- ── GLUTES ──────────────────────────────────────────────────
('g-001', ARRAY['glutes'], 'relief', 'beginner', 'figure four gluteus glute stretch left',
 'left_glute', 'Left Glute Figure Four',
 'Deep stretch of the left gluteus maximus and external hip rotators — relieves the dull, spreading ache of the left buttock.',
 '**STEP 1 (Lie):** Back on floor, knees bent. **STEP 2 (Cross):** Cross left ankle over right knee. **STEP 3 (Pull):** Pull right thigh to chest. Hold 45 seconds.',
 '3 holds × 45 seconds.'),

('g-002', ARRAY['glutes'], 'relief', 'beginner', 'figure four gluteus glute stretch right',
 'right_glute', 'Right Glute Figure Four',
 'Deeply stretches the right gluteus maximus and hip external rotators.',
 '**STEP 1 (Lie):** Back on floor, knees bent. **STEP 2 (Cross):** Cross right ankle over left knee. **STEP 3 (Pull):** Pull left thigh to chest. Hold 45 seconds.',
 '3 holds × 45 seconds.'),

('g-003', ARRAY['glutes'], 'relief', 'beginner', 'piriformis stretch deep glute sciatic',
 'piriformis', 'Piriformis Seated Stretch',
 'Targets the deep piriformis muscle which, when tight, compresses the sciatic nerve causing deep glute and leg pain.',
 '**STEP 1 (Sit):** Sit in a chair. Cross your right ankle over your left knee. **STEP 2 (Hinge):** Gently hinge forward from the hips, keeping your back straight. **STEP 3 (Hold):** Hold when you feel the deep ache in the right buttock. Hold 45 seconds.',
 '3 holds × 45 seconds per side.'),

('g-004', ARRAY['glutes'], 'relief', 'beginner', 'supine coccyx tilt tailbone coccydynia glute',
 'tailbone', 'Supine Coccyx Relief Tilt',
 'Gently mobilises the coccyx through posterior tilt, decompressing the inflamed coccygeal joint — the primary source of tailbone pain.',
 '**STEP 1 (Lie):** Lie on your back, knees bent, feet flat. **STEP 2 (Tilt):** Gently tilt your pelvis backward — your tailbone presses lightly into the floor, then lifts. **STEP 3 (Rock):** Slowly rock the tailbone down and up, 15 gentle repetitions.',
 '15–20 gentle rocks, 2–3 times daily. Stop if sharp pain occurs.'),

('g-005', ARRAY['glutes', 'lower_back'], 'relief', 'beginner', 'happy baby pose glute coccyx tailbone',
 'tailbone', 'Happy Baby — Tailbone Relief',
 'Opens the sacro-iliac joints and lifts the coccyx free of compressive forces — excellent after long periods of sitting.',
 '**STEP 1 (Lie):** Lie on your back. Draw knees toward your chest. **STEP 2 (Grab):** Reach inside your legs and hold the outer edges of your feet (or shins). **STEP 3 (Open):** Gently pull your knees toward the floor beside your torso. Hold 1–2 minutes.',
 '1–2 minutes. Rock gently side to side to massage the sacrum.'),

('g-006', ARRAY['glutes'], 'relief', 'intermediate', 'prone piriformis stretch deep glute sciatic',
 'piriformis', 'Prone Piriformis Stretch',
 'The prone position fully internally rotates the hip, providing a more complete piriformis stretch than the seated version.',
 '**STEP 1 (Prone):** Lie face down. **STEP 2 (Bend):** Bend your right knee to 90° and drop it outward so the shin is across your back. **STEP 3 (Hold):** Place a folded blanket under the right hip for support. Hold 1 minute.',
 '1 minute per side.'),

('g-007', ARRAY['glutes'], 'warmup', 'beginner', 'glute bridge warmup gluteus maximus',
 NULL, 'Glute Bridge Warm-Up',
 'Activates the glutes and warms the hip extensors through a full range — primes the posterior chain before exercise.',
 '**STEP 1 (Lie):** On your back, knees bent, feet flat. **STEP 2 (Press):** Press through your heels and lift your hips until they form a straight line with your knees. **STEP 3 (Squeeze):** Squeeze glutes at the top 1 second. Lower slowly.',
 '15 reps, 2 sets.'),

('g-008', ARRAY['glutes'], 'yoga', 'beginner', 'pigeon pose glute yoga gluteus',
 NULL, 'Yin Pigeon Pose',
 'Long-held pigeon pose releases the deep fascia of the glutes and external rotators for lasting softening.',
 '**STEP 1 (Dog):** Downward dog. **STEP 2 (Bring):** Bring right knee to right wrist, shin angled. **STEP 3 (Sink):** Lower hips to the floor and fold forward over the front shin. Hold 3 minutes.',
 '3 minutes per side — this is a yin (passive) hold.'),

('g-009', ARRAY['glutes'], 'strength', 'beginner', 'glute bridge strength gluteus maximus',
 NULL, 'Glute Bridge',
 'Rebuilds gluteus maximus strength which, when weak, causes chronic low back, SI joint, and tailbone loading.',
 '**STEP 1 (Lie):** Back on floor, knees bent. **STEP 2 (Drive):** Press heels into floor, drive hips to ceiling, squeezing glutes. **STEP 3 (Hold):** Hold 2 seconds at top. Lower with control.',
 '15 reps × 3 sets.'),

('g-010', ARRAY['glutes'], 'strength', 'intermediate', 'single leg glute bridge gluteus hip thrust',
 NULL, 'Single-Leg Glute Bridge',
 'Progresses glute strength unilaterally — identifies and corrects the side-to-side imbalance driving asymmetric buttock or tailbone pain.',
 '**STEP 1 (Lie):** Back on floor, one knee bent, one leg straight. **STEP 2 (Drive):** Drive through the planted heel and lift hips high. **STEP 3 (Hold):** Keep straight leg elevated throughout. Hold 2 seconds at top.',
 '12 reps per side, 3 sets.'),

-- ── THIGHS ──────────────────────────────────────────────────
('th-001', ARRAY['thighs'], 'relief', 'beginner', 'quadriceps standing quad stretch front thigh femor',
 'front_thigh', 'Standing Quad Stretch',
 'Lengthens the rectus femoris from hip to knee — relieves anterior thigh tightness and referred knee pain from quadriceps overuse.',
 '**STEP 1 (Stand):** Stand on your left leg, holding a wall for balance. **STEP 2 (Bend):** Bend your right knee and hold your ankle behind you. **STEP 3 (Tuck):** Gently tuck your pelvis (tighten glutes) to increase the stretch. Hold 30 seconds.',
 '3 holds × 30 seconds per leg.'),

('th-002', ARRAY['thighs'], 'relief', 'beginner', 'hamstring stretch back thigh seated',
 'back_thigh', 'Seated Hamstring Stretch',
 'Lengthens the hamstrings from the ischial tuberosity to the knee, relieving the posterior thigh aching caused by sitting.',
 '**STEP 1 (Sit):** Sit on the edge of a chair, one leg extended, heel on the floor. **STEP 2 (Hinge):** Hinge forward from your hips — keep your back straight, not rounded. **STEP 3 (Hold):** Feel the pull along the back of the extended thigh. Hold 30 seconds.',
 '3 holds × 30 seconds per leg.'),

('th-003', ARRAY['thighs'], 'relief', 'beginner', 'adductor inner thigh stretch groin femor',
 'inner_thigh', 'Inner Thigh Adductor Stretch',
 'Lengthens all five adductors running along the inner thigh — relieves groin-referred inner thigh pain from hip tightness.',
 '**STEP 1 (Wide):** Stand with feet wide apart, toes turned out 45°. **STEP 2 (Shift):** Shift your weight to the right, bending the right knee, keeping left leg straight. **STEP 3 (Hold):** Feel the pull along the left inner thigh. Hold 30 seconds per side.',
 '3 holds × 30 seconds per side.'),

('th-004', ARRAY['thighs'], 'relief', 'beginner', 'IT band tensor outer thigh stretch',
 'outer_thigh', 'IT Band Outer Thigh Stretch',
 'Stretches the iliotibial band and outer quad (vastus lateralis) to relieve the tight, burning sensation along the outer thigh.',
 '**STEP 1 (Cross):** Stand and cross your right leg behind your left. **STEP 2 (Lean):** Lean to the left, pushing your right hip outward. **STEP 3 (Hold):** Feel the pull along the outer right thigh. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('th-005', ARRAY['thighs'], 'relief', 'beginner', 'supine hamstring stretch back thigh femor',
 'back_thigh', 'Supine Hamstring Stretch',
 'Lying hamstring stretch that relaxes the entire posterior chain — more effective than standing for tight or painful thighs.',
 '**STEP 1 (Lie):** Lie on your back. **STEP 2 (Lift):** Raise your right leg and hold behind the thigh or calf. **STEP 3 (Straighten):** Gently straighten the knee as far as comfortable. Hold 30 seconds.',
 '3 holds × 30 seconds per leg.'),

('th-006', ARRAY['thighs'], 'warmup', 'beginner', 'leg swing hamstring quadriceps thigh warmup',
 NULL, 'Leg Swing Warm-Up',
 'Dynamically moves the hip through its flexion/extension arc to warm quadriceps and hamstrings before running or sport.',
 '**STEP 1 (Hold):** Stand next to a wall for support. **STEP 2 (Swing):** Swing your outer leg forward and back like a pendulum — loose and relaxed. **STEP 3 (Increase):** Gradually increase the arc over 10 swings.',
 '15 swings per leg, 2 planes (front-back and across body).'),

('th-007', ARRAY['thighs'], 'yoga', 'beginner', 'warrior one quadriceps front thigh yoga',
 'front_thigh', 'Warrior I — Quad Focus',
 'Deeply opens the hip flexor and rectus femoris of the back leg in a grounded, stable stance.',
 '**STEP 1 (Step):** Step your right foot forward, left foot back at 45°. **STEP 2 (Sink):** Bend the right knee to 90°. **STEP 3 (Lift):** Raise arms overhead. Tuck your pelvis under to increase the quad stretch. Hold 45 seconds.',
 '3 holds × 45 seconds per side.'),

('th-008', ARRAY['thighs'], 'yoga', 'beginner', 'seated forward fold hamstring back thigh yoga',
 'back_thigh', 'Seated Forward Fold — Hamstrings',
 'Yin-style passive stretch of the entire hamstring chain from sit bone to knee — excellent for chronic back-thigh tightness.',
 '**STEP 1 (Sit):** Straight-leg sit on the floor. **STEP 2 (Hinge):** Hinge forward from the hips with a flat back as far as comfortable. **STEP 3 (Hold):** Rest hands on shins, calves, or feet. Hold 2 minutes.',
 '2 minutes. Breathe into the back of your thighs.'),

('th-009', ARRAY['thighs'], 'yoga', 'intermediate', 'frog pose adductor inner thigh yoga',
 'inner_thigh', 'Frog Pose — Inner Thigh',
 'The most complete inner thigh stretch — opens both hip joints simultaneously in external rotation with deep adductor lengthening.',
 '**STEP 1 (Tabletop):** From hands and knees. **STEP 2 (Widen):** Slowly walk knees wide apart, feet flexed beside each knee. **STEP 3 (Hold):** Lower to forearms, hold 2 minutes.',
 '2 minutes. Use a folded blanket under each knee if needed.'),

('th-010', ARRAY['thighs'], 'strength', 'beginner', 'bodyweight squat quadriceps thigh femor',
 NULL, 'Bodyweight Squat',
 'Rebuilds quad, hamstring, and glute strength — the most functional exercise for thigh health and pain prevention.',
 '**STEP 1 (Feet):** Stand feet shoulder-width, toes out 15°. **STEP 2 (Sink):** Hinge hips back and bend knees — lower until thighs parallel floor. **STEP 3 (Rise):** Drive through heels to stand. Squeeze glutes at top.',
 '15 reps × 3 sets.'),

('th-011', ARRAY['thighs'], 'posture', 'beginner', 'hip flexor reset quad front thigh posture',
 'front_thigh', 'Hip Flexor Length Reset',
 'Recalibrates the resting length of the hip flexors — when short, they tilt the pelvis forward, creating chronic anterior thigh tightness.',
 '**STEP 1 (Lie):** Lie on your back. **STEP 2 (Hug):** Draw one knee to your chest and hold it. **STEP 3 (Extend):** Let the other leg rest flat on the floor. Feel if the flat leg''s heel stays down — if it lifts, your hip flexor is short.',
 '2 minutes per side, daily. Focus on letting the straight leg relax fully.'),

('th-012', ARRAY['thighs'], 'strength', 'intermediate', 'hamstring curl thigh back femor resistance',
 'back_thigh', 'Resistance Band Hamstring Curl',
 'Directly strengthens the hamstrings to correct the weakness that leads to posterior thigh strains.',
 '**STEP 1 (Lie):** Lie face down, band looped around your ankle anchored beneath a door. **STEP 2 (Curl):** Bend your knee, curling the heel toward your glutes. **STEP 3 (Lower):** Lower slowly against the band resistance.',
 '12 reps × 3 sets per leg.');
