-- ============================================================
-- MuscliKnot: Fix Exercise Accuracy
-- Paste into Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- STEP 1: Update all existing rows with correct muscle_ids
-- (all existing rows have muscle_id = null, breaking Pass 1 matching)
UPDATE recovery_knowledge_base SET muscle_id = ARRAY['head'] WHERE common_name ILIKE '%temporalis%' OR common_name ILIKE '%frontalis%' OR common_name ILIKE '%occipitalis%' OR common_name ILIKE '%masseter%' OR common_name ILIKE '%orbicularis%' OR common_name ILIKE '%zygomaticus%' OR common_name ILIKE '%buccinator%' OR common_name ILIKE '%mentalis%' OR common_name ILIKE '%platysma%' OR common_name ILIKE '%mylohyoid%' OR common_name ILIKE '%geniohyoid%' OR common_name ILIKE '%stylohyoid%' OR common_name ILIKE '%digastric%' OR common_name ILIKE '%omohyoid%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['neck'] WHERE common_name ILIKE '%trapezius%' OR common_name ILIKE '%levator%' OR common_name ILIKE '%sternocleidomastoid%' OR common_name ILIKE '%scalene%' OR common_name ILIKE '%splenius%' OR common_name ILIKE '%cervical%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['arms'] WHERE common_name ILIKE '%bicep%' OR common_name ILIKE '%tricep%' OR common_name ILIKE '%deltoid%' OR common_name ILIKE '%brachialis%' OR common_name ILIKE '%brachioradialis%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['forearms'] WHERE common_name ILIKE '%forearm%' OR common_name ILIKE '%pronator%' OR common_name ILIKE '%supinator%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['chest'] WHERE common_name ILIKE '%pectoral%' OR common_name ILIKE '%serratus%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['upper_back'] WHERE common_name ILIKE '%rhomboid%' OR common_name ILIKE '%infraspinatus%' OR common_name ILIKE '%teres%' OR common_name ILIKE '%supraspinatus%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['lower_back'] WHERE common_name ILIKE '%lumbar%' OR common_name ILIKE '%erector%' OR common_name ILIKE '%multifidus%' OR common_name ILIKE '%quadratus lumborum%' OR common_name ILIKE '%iliocostalis%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['abdomen'] WHERE common_name ILIKE '%rectus abdominis%' OR common_name ILIKE '%oblique%' OR common_name ILIKE '%transverse%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['hips'] WHERE common_name ILIKE '%iliopsoas%' OR common_name ILIKE '%tensor fasciae%' OR common_name ILIKE '%hip flexor%' OR common_name ILIKE '%sartorius%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['glutes'] WHERE common_name ILIKE '%gluteus%' OR common_name ILIKE '%piriformis%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['thighs'] WHERE common_name ILIKE '%hamstring%' OR common_name ILIKE '%quadriceps%' OR common_name ILIKE '%adductor%' OR common_name ILIKE '%gracilis%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['calves'] WHERE common_name ILIKE '%gastrocnemius%' OR common_name ILIKE '%soleus%' OR common_name ILIKE '%tibialis%' OR common_name ILIKE '%achilles%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['ankles'] WHERE common_name ILIKE '%peroneal%' OR common_name ILIKE '%fibularis%';

UPDATE recovery_knowledge_base SET muscle_id = ARRAY['feet'] WHERE common_name ILIKE '%plantar%' OR common_name ILIKE '%intrinsic%' OR common_name ILIKE '%flexor digitorum%' OR common_name ILIKE '%extensor digitorum%';

-- STEP 2: Insert new targeted exercises for hands, forearms, wrists + all 5 activity types
-- ──────────────────────── HANDS / WRISTS ─────────────────────────
INSERT INTO recovery_knowledge_base (muscle_id, common_name, exercise_type, solution_stretch, why, instructions, process) VALUES
(ARRAY['hands'], 'wrist flexor', 'relief', 'Wrist Flexor Stretch', 'Tight wrist flexors from typing and gripping cause carpal tunnel symptoms and elbow pain.', '**STEP 1 (Setup):** Extend your right arm in front, palm facing up.
**STEP 2 (Pull):** Use your left hand to gently pull fingers back toward you.
**STEP 3 (Hold):** Hold the stretch for 20-30 seconds.
**STEP 4 (Switch):** Repeat on the left wrist.', '3 holds of 20-30 seconds per wrist. Do every hour.'),

(ARRAY['hands'], 'wrist extensor', 'relief', 'Wrist Extensor Stretch', 'Releases the wrist extensors to combat mouse-arm syndrome and tennis elbow.', '**STEP 1 (Setup):** Extend arm in front, palm facing DOWN.
**STEP 2 (Pull):** Use the other hand to pull fingers DOWN toward the floor.
**STEP 3 (Hold):** Hold 20-30 seconds.
**STEP 4 (Switch):** Repeat on the other wrist.', '3 holds per side.'),

(ARRAY['hands'], 'finger', 'relief', 'Finger Tendon Glides', 'Prevents trigger finger and reduces stiffness from repetitive gripping.', '**STEP 1 (Straight):** Start with fingers fully extended.
**STEP 2 (Hook):** Curl fingertips to form a hook fist.
**STEP 3 (Full fist):** Make a full fist, thumb outside.
**STEP 4 (Open):** Open fully. Repeat sequence 10 times.', '10 full sequences per hand. Excellent relief for typing strain.'),

(ARRAY['hands'], 'grip', 'warmup', 'Hand Warmup Sequence', 'Warms up intrinsic hand muscles before sport or gym work.', '**STEP 1 (Shake):** Shake both hands loosely for 10 seconds.
**STEP 2 (Spread):** Spread fingers wide, hold 3 seconds.
**STEP 3 (Make fist):** Close into tight fist, hold 3 seconds.
**STEP 4 (Repeat):** Alternate 10 times.', '10 open-close cycles then wrist circles.'),

(ARRAY['hands'], 'wrist', 'warmup', 'Wrist Circle Warmup', 'Lubricates the wrist joint surfaces before lifting or racket sports.', '**STEP 1 (Setup):** Extend both arms in front with loose fists.
**STEP 2 (Clockwise):** Rotate both wrists clockwise 10 times.
**STEP 3 (Counter):** Rotate counter-clockwise 10 times.
**STEP 4 (Flex):** Add wrist flex and extend 10 times.', '2 sets in each direction.'),

(ARRAY['hands'], 'hand', 'yoga', 'Prayer Hands Wrist Yoga', 'A classic yoga hand stretch that releases all wrist muscles simultaneously.', '**STEP 1 (Prayer):** Press palms together in front of chest.
**STEP 2 (Lower):** Slowly lower joined hands toward the waist, keeping palms pressed.
**STEP 3 (Hold):** Feel the wrist flexor stretch at 30 seconds.
**STEP 4 (Reverse):** Flip hands (back of hands together), raise toward chest.', '30 seconds each direction. 3 rounds.'),

(ARRAY['hands'], 'thumb', 'yoga', 'Reverse Prayer Stretch', 'Deeply opens the wrists, fingers, and forearms — excellent for rock climbers and pianists.', '**STEP 1 (Setup):** Put backs of hands together behind your back.
**STEP 2 (Slide):** Slide hands up your back as high as comfortable.
**STEP 3 (Hold):** Hold 20-30 seconds.
**STEP 4 (Release):** Lower and shake out hands.', '3 holds.'),

(ARRAY['hands'], 'wrist', 'posture', 'Wrist Alignment Hold', 'Teaches neutral wrist position to prevent repetitive strain injury.', '**STEP 1 (Setup):** Rest forearm on a desk, wrist hanging off the edge.
**STEP 2 (Neutral):** Bring wrist to perfectly neutral (not flexed or extended).
**STEP 3 (Hold):** Hold this neutral position for 30 seconds.
**STEP 4 (Awareness):** Notice what neutral feels like.', '5 holds of 30 seconds. Builds body awareness for desk posture.'),

(ARRAY['hands'], 'finger', 'strength', 'Fingertip Push-Up', 'Builds tendon strength in the fingers — key for grip sports and musicians.', '**STEP 1 (Setup):** In push-up position, elevate onto FINGERTIPS only.
**STEP 2 (Lower):** Lower chest slowly toward floor.
**STEP 3 (Push):** Push back up through fingertips.
**STEP 4 (Progress):** Start on knees if necessary.', '3 sets of 5-8. Progress slowly — high tendon injury risk if rushed.'),

(ARRAY['hands'], 'grip', 'strength', 'Towel Wringing Drill', 'Builds rotational grip strength used in racket sports and climbing.', '**STEP 1 (Setup):** Hold a rolled towel with both hands.
**STEP 2 (Wring):** Twist the towel as if wringing out water — one hand each direction.
**STEP 3 (Reverse):** Reverse the wring direction.
**STEP 4 (Repeat):** 10 wring cycles.', '3 sets of 10 wring cycles.'),

-- ──────────────────────── FOREARMS ──────────────────────────────
(ARRAY['forearms'], 'forearm', 'relief', 'Forearm Flexor Roll', 'A self-massage that breaks up adhesions in overworked forearm flexors from typing.', '**STEP 1 (Setup):** Sit with forearm resting on your lap, palm up.
**STEP 2 (Press):** Use thumb of the other hand to press along the muscle belly.
**STEP 3 (Roll):** Slowly roll thumb along the forearm from wrist to elbow.
**STEP 4 (Repeat):** 3 passes each forearm.', '3 passes per forearm. 30-60 seconds each pass.'),

(ARRAY['forearms'], 'brachioradialis', 'relief', 'Cross-Arm Forearm Stretch', 'Targets the brachioradialis, which tightens from repeated elbow bending.', '**STEP 1 (Setup):** Extend one arm across your body.
**STEP 2 (Grip):** Grip the wrist with your other hand.
**STEP 3 (Pull):** Gently pull arm across and slightly down.
**STEP 4 (Hold):** Hold 20 seconds, switch.', '3 holds per side.'),

(ARRAY['forearms'], 'forearm', 'warmup', 'Forearm Rotation Warmup', 'Prepares the pronator/supinator muscles before racket sports or climbing.', '**STEP 1 (Setup):** Hold arm out, elbow at 90 degrees.
**STEP 2 (Pronate):** Rotate forearm so palm faces down (pronate).
**STEP 3 (Supinate):** Rotate so palm faces up (supinate).
**STEP 4 (Continue):** Alternate quickly 20 times.', '3 sets of 20 alternating rotations.'),

(ARRAY['forearms'], 'forearm', 'yoga', 'Table Top Wrist Yoga', 'Yoga-based wrist and forearm stretch targeting both flexors and extensors.', '**STEP 1 (Setup):** On hands and knees, fingers pointing TOWARD your knees.
**STEP 2 (Rock):** Gently rock back, loading the wrist extensors.
**STEP 3 (Hold):** Hold any stretch position for 5 breaths.
**STEP 4 (Circles):** Make slow wrist circles while weight-bearing.', '5 breath cycles in each position.'),

(ARRAY['forearms'], 'forearm', 'posture', 'Supination Correction Drill', 'Restores balanced forearm rotation often lost from mouse use (pronated posture).', '**STEP 1 (Setup):** Elbow at 90, forearm resting on table.
**STEP 2 (Supinate):** Rotate palm to face FULLY up.
**STEP 3 (Hold):** Hold 5 seconds.
**STEP 4 (Relax):** Lower and repeat.', '3 sets of 12 supination holds.'),

(ARRAY['forearms'], 'forearm', 'strength', 'Reverse Curl', 'Strengthens brachioradialis and wrist extensors, preventing tennis elbow.', '**STEP 1 (Setup):** Hold dumbbells with OVERHAND grip (palms down).
**STEP 2 (Curl):** Curl weights to shoulder height.
**STEP 3 (Squeeze):** Hold 1 second at top.
**STEP 4 (Lower):** Lower slowly over 3 seconds.', '3 sets of 12 reps. Use lighter weight than regular curls.'),

-- ──────────────────────── ARMS (upper) extra types ────────────────
(ARRAY['arms'], 'deltoid', 'relief', 'Cross-Body Shoulder Stretch', 'Releases the posterior deltoid and external rotators from repetitive pressing.', '**STEP 1 (Setup):** Bring one arm straight across your chest.
**STEP 2 (Hook):** Hook the other hand behind your elbow.
**STEP 3 (Pull):** Gently pull toward your body.
**STEP 4 (Hold):** Hold 30 seconds, switch.', '3 holds per side.'),

(ARRAY['arms'], 'bicep', 'warmup', 'Band Bicep Warmup', 'Activates the bicep with light resistance before heavier lifting.', '**STEP 1 (Setup):** Stand on a resistance band, handles in hands.
**STEP 2 (Curl):** Curl both arms to shoulder height.
**STEP 3 (Lower):** Lower slowly over 3 seconds.
**STEP 4 (Repeat):** Light and controlled.', '2 sets of 15 reps.'),

(ARRAY['arms'], 'tricep', 'yoga', 'Overhead Tricep Yoga Stretch', 'Classic yoga arm stretch targeting the long head of the tricep.', '**STEP 1 (Setup):** Raise right arm overhead, bend at elbow.
**STEP 2 (Reach):** Let right hand drop behind your head.
**STEP 3 (Assist):** Use left hand to gently push right elbow down further.
**STEP 4 (Hold):** Hold 30 seconds, switch.', '3 holds per side.'),

(ARRAY['arms'], 'deltoid', 'posture', 'External Rotation Side-Lying', 'Corrects internal rotation dominance causing shoulder impingement.', '**STEP 1 (Setup):** Lie on side, top arm at 90 degrees, elbow on waist.
**STEP 2 (Rotate):** Rotate top forearm up toward ceiling.
**STEP 3 (Hold):** Hold 2 seconds at top.
**STEP 4 (Lower):** Lower slowly.', '3 sets of 15 per side. Critical for shoulder health.'),

-- ──────────────────────── Extra precision rows for other areas ────
(ARRAY['knees'], 'knee', 'relief', 'Quad Foam Roll', 'Releases quad tension that compresses the patella and causes knee pain.', '**STEP 1 (Setup):** Lie face down with foam roller under one quad.
**STEP 2 (Roll):** Slowly roll from hip crease to just above the knee.
**STEP 3 (Pause):** Pause on any tender spots for 30 seconds.
**STEP 4 (Switch):** Roll the other quad.', '60-90 seconds per quad.'),

(ARRAY['calves'], 'soleus', 'relief', 'Bent-Knee Calf Stretch', 'Targets the soleus (the deep calf) specifically — critical for Achilles rehab.', '**STEP 1 (Setup):** Stand facing wall, both hands on wall.
**STEP 2 (Position):** Place one foot back, bend the BACK knee.
**STEP 3 (Press):** Press BENT back heel toward floor.
**STEP 4 (Hold):** Hold 30 seconds, switch.', '3 holds per side. Targets the soleus, different from straight-leg stretch.'),

(ARRAY['hips'], 'hip flexor', 'strength', 'Standing Hip Circle', 'Builds hip mobility and strength through full range of motion.', '**STEP 1 (Setup):** Stand on one leg near a wall for balance.
**STEP 2 (Raise):** Lift bent knee to hip height.
**STEP 3 (Circle):** Draw a slow circle with your knee.
**STEP 4 (Reverse):** Complete set then reverse direction.', '3 sets of 10 circles each direction per leg.'),

(ARRAY['chest'], 'pec', 'relief', 'Pec Minor Stretch on Roller', 'Targets the deep, often-missed pec minor that causes shoulder rounding.', '**STEP 1 (Setup):** Lie lengthwise on a foam roller along your spine.
**STEP 2 (Open):** Let both arms fall wide to sides, palms up.
**STEP 3 (Breathe):** Take 10 deep breaths, expanding chest each time.
**STEP 4 (Hold):** Stay 1-2 minutes.', '1-2 minute hold. Excellent daily reset after desk work.'),

(ARRAY['abdomen'], 'core', 'strength', 'Ab Wheel Rollout', 'Most effective core stability exercise — engages the entire anterior core.', '**STEP 1 (Setup):** Kneel behind an ab wheel.
**STEP 2 (Roll):** Roll wheel forward, keeping core braced and back flat.
**STEP 3 (Extend):** Extend as far as you can control.
**STEP 4 (Pull back):** Pull wheel back to start using your core.', '3 sets of 8-10. Start with limited range and build.'),

(ARRAY['glutes'], 'gluteus', 'strength', 'Sumo Deadlift', 'Wide-stance pattern maximally activates gluteus medius and maximus.', '**STEP 1 (Setup):** Wide stance, toes out 45 degrees, bar over feet.
**STEP 2 (Grip):** Grip bar inside your legs, chest up.
**STEP 3 (Drive):** Drive through heels, squeeze glutes to lockout.
**STEP 4 (Lower):** Lower with control.', '3 sets of 6-8 reps.'),

(ARRAY['lower_back'], 'lumbar', 'relief', 'Child''s Pose with Side Reach', 'Decompresses each side of the lumbar spine individually — better than regular child''s pose.', '**STEP 1 (Setup):** Start in Child''s Pose (arms forward).
**STEP 2 (Walk right):** Walk both hands to the RIGHT.
**STEP 3 (Hold):** Hold 30 seconds — feel left side of back lengthen.
**STEP 4 (Switch):** Walk to the LEFT for 30 seconds.', '3 holds per side.'),

(ARRAY['thighs'], 'hamstring', 'strength', 'Nordic Hamstring Curl', 'Most effective hamstring injury prevention exercise — used by elite athletes.', '**STEP 1 (Setup):** Anchor feet under couch or have someone hold them. Kneel tall.
**STEP 2 (Lower):** Slowly fall forward, controlling the descent with hamstrings.
**STEP 3 (Catch):** Catch yourself with hands when you can no longer control.
**STEP 4 (Push back):** Push back to starting position.', '3 sets of 5-6. Extremely demanding — progress slowly.'),

(ARRAY['ankles'], 'ankle', 'strength', 'Banded Ankle Inversion', 'Strengthens the tibialis anterior, preventing inward ankle rolling.', '**STEP 1 (Setup):** Resistance band around foot, anchored to outside.
**STEP 2 (Invert):** Pull foot INWARD against band resistance.
**STEP 3 (Hold):** Hold 2 seconds at end range.
**STEP 4 (Return):** Return slowly.', '3 sets of 15 per ankle.'),

(ARRAY['neck'], 'cervical', 'relief', 'Suboccipital Release', 'Releases the tiny muscles at the skull base that cause tension headaches.', '**STEP 1 (Setup):** Lie on back. Place two towel-wrapped tennis balls under skull base.
**STEP 2 (Rest):** Let head weight slowly relax onto the balls.
**STEP 3 (Nod):** Make tiny yes-nod movements.
**STEP 4 (Hold):** Stay 2-3 minutes.', '2-3 minute hold. Best headache relief technique.'),

(ARRAY['traps'], 'trapezius', 'relief', 'Doorway Traps Stretch', 'Specifically targets the mid and lower trapezius through shoulder elevation and retraction.', '**STEP 1 (Setup):** Stand in doorway, both arms raised to 90 degrees on frame.
**STEP 2 (Grow tall):** Actively elongate your spine — reach the crown upward.
**STEP 3 (Retract):** Gently pull shoulder blades down and in.
**STEP 4 (Hold):** Hold 30 second sets.', '3 holds of 30 seconds.'),

(ARRAY['feet'], 'plantar', 'strength', 'Marble Pickup', 'Builds intrinsic foot arch muscles — the foundation of healthy arches.', '**STEP 1 (Setup):** Place marbles in a bowl on the floor.
**STEP 2 (Pickup):** Use ONLY your toes to pick up one marble at a time.
**STEP 3 (Drop):** Drop into another bowl.
**STEP 4 (Repeat):** Pick up all marbles, then return them.', '3 rounds. Excellent arch-builder for flat fleet.');

-- STEP 3: Verify counts
SELECT exercise_type, COUNT(*) as count FROM recovery_knowledge_base GROUP BY exercise_type ORDER BY count DESC;
SELECT UNNEST(muscle_id) as muscle, COUNT(*) as count FROM recovery_knowledge_base WHERE muscle_id IS NOT NULL GROUP BY muscle ORDER BY count DESC;
