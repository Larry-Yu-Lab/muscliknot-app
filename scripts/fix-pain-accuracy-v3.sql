-- ============================================================
-- MuscliKnot: Pain Assessment Accuracy Fix (v3)
-- This script fixes "area_of_pain" tags and adds missing exercises
-- ============================================================

-- 1. Rename 'palm' to 'front_hand' for consistency with UI
UPDATE recovery_knowledge_base SET area_of_pain = 'front_hand' WHERE area_of_pain = 'palm';

-- 2. Map existing Hand exercises to specific sub-locations
UPDATE recovery_knowledge_base SET area_of_pain = 'fingertips' 
WHERE muscle_id @> ARRAY['hands'] AND (common_name ILIKE '%finger%' OR common_name ILIKE '%flicking%');

UPDATE recovery_knowledge_base SET area_of_pain = 'front_hand' 
WHERE muscle_id @> ARRAY['hands'] AND (common_name ILIKE '%palm%' OR common_name ILIKE '%prayer%');

UPDATE recovery_knowledge_base SET area_of_pain = 'thumb_side' 
WHERE muscle_id @> ARRAY['hands'] AND (common_name ILIKE '%thumb%' OR common_name ILIKE '%radial%');

UPDATE recovery_knowledge_base SET area_of_pain = 'pinky_side' 
WHERE muscle_id @> ARRAY['hands'] AND (common_name ILIKE '%pinky%' OR common_name ILIKE '%ulnar%');

UPDATE recovery_knowledge_base SET area_of_pain = 'wrist_front' 
WHERE (muscle_id @> ARRAY['hands'] OR muscle_id @> ARRAY['forearms']) 
AND (common_name ILIKE '%wrist flexor%' OR common_name ILIKE '%prayer%');

UPDATE recovery_knowledge_base SET area_of_pain = 'wrist_back' 
WHERE (muscle_id @> ARRAY['hands'] OR muscle_id @> ARRAY['forearms']) 
AND (common_name ILIKE '%wrist extensor%' OR common_name ILIKE '%back of wrist%');

-- 3. Add MISSING targeted exercises for specific hand areas
INSERT INTO recovery_knowledge_base (muscle_id, exercise_type, difficulty_level, common_name, area_of_pain, solution_stretch, why, instructions, process) VALUES

-- BACK OF HAND
(ARRAY['hands'], 'relief', 'beginner', 'back of hand extensor stretch metacarpal', 'back_hand', 'Dorsum Hand Stretch', 
 'Releases the interosseous muscles and extensor tendons on the back of the hand, often strained by over-typing.', 
 '**STEP 1 (Position):** Place your hand on a flat surface, palm DOWN. **STEP 2 (Lift):** Use your other hand to gently lift one finger at a time while keeping the palm flat. **STEP 3 (Stretch):** Feel the pull along the back of the hand. Hold 10 seconds per finger.', 
 '1 set per finger on both hands.'),

(ARRAY['hands'], 'relief', 'beginner', 'back of hand skin rolling fascia', 'back_hand', 'Back of Hand Fascial Release', 
 'Releases the thin fascial layer on the back of the hand which can become "glued" and cause stiffness.', 
 '**STEP 1 (Pinch):** Gently pinch the skin on the back of your hand between your thumb and index finger of the opposite hand. **STEP 2 (Roll):** Try to "roll" the skin fold across the hand. **STEP 3 (Move):** Cover the entire area from knuckles to wrist.', 
 '2 minutes per hand. Should feel like a deep skin stretch.'),

-- KNUCKLES
(ARRAY['hands'], 'relief', 'beginner', 'knuckle joint distraction hand', 'knuckles', 'Knuckle Joint Distraction', 
 'Relieves pressure in the MCP joints (knuckles) using gentle decompression.', 
 '**STEP 1 (Grip):** Grip the base of one finger firmly with your other hand. **STEP 2 (Pull):** Pull the finger gently away from the hand (distraction). **STEP 3 (Hold):** Hold for 5 seconds. Repeat for all knuckles.', 
 '3 sets of 5-second pulls per finger.'),

-- WRIST BACK (Targeted)
(ARRAY['hands'], 'relief', 'beginner', 'wrist back extension carpal', 'wrist_back', 'Wrist Back Relief Stretch', 
 'Specifically targets the dorsal carpal ligaments which are strained by prolonged wrist flexion.', 
 '**STEP 1 (Fist):** Make a gentle fist. **STEP 2 (Bend):** Bend your wrist downward as far as possible. **STEP 3 (Assist):** Use your other hand to gently push the fist further inward. Hold 30 seconds.', 
 '3 holds of 30 seconds.'),

-- FRONT OF HAND (Consolidated)
(ARRAY['hands'], 'relief', 'beginner', 'front of hand palm massage fascia', 'front_hand', 'Deep Palm Release', 
 'Targets the thick palmar fascia and thenar eminence (thumb pad).', 
 '**STEP 1 (Thumb):** Use your opposite thumb to press firmly into the center of your palm. **STEP 2 (Circles):** Make slow, deep outward circles. **STEP 3 (Pad):** Spend extra time on the meaty pads below the thumb and pinky.', 
 '2 minutes per hand.');

-- 4. Final mapping verify
SELECT area_of_pain, common_name FROM recovery_knowledge_base WHERE muscle_id @> ARRAY['hands'] ORDER BY area_of_pain;
