-- ============================================================
-- MuscliKnot: Update Pain Area Sub-locations
-- Run this in your Supabase SQL Editor to enable specific filtering
-- ============================================================

-- ── HANDS ────────────────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'fingertips' 
WHERE muscle_id @> ARRAY['hands'] AND common_name ILIKE '%fingertip%';

UPDATE recovery_knowledge_base SET area_of_pain = 'thumb_side' 
WHERE muscle_id @> ARRAY['hands'] AND (area_of_pain = 'thumb' OR common_name ILIKE '%thumb%');

UPDATE recovery_knowledge_base SET area_of_pain = 'pinky_side' 
WHERE muscle_id @> ARRAY['hands'] AND (area_of_pain = 'pinky' OR common_name ILIKE '%pinky%');

UPDATE recovery_knowledge_base SET area_of_pain = 'wrist_front' 
WHERE (muscle_id @> ARRAY['hands'] OR muscle_id @> ARRAY['forearms']) 
AND (area_of_pain = 'wrist' OR common_name ILIKE '%wrist%') 
AND (common_name ILIKE '%flexor%' OR common_name ILIKE '%prayer%' OR common_name ILIKE '%palm%');

UPDATE recovery_knowledge_base SET area_of_pain = 'wrist_back' 
WHERE (muscle_id @> ARRAY['hands'] OR muscle_id @> ARRAY['forearms']) 
AND (area_of_pain = 'wrist' OR common_name ILIKE '%wrist%') 
AND (common_name ILIKE '%extensor%' OR common_name ILIKE '%back%');

UPDATE recovery_knowledge_base SET area_of_pain = 'knuckles' 
WHERE muscle_id @> ARRAY['hands'] AND common_name ILIKE '%knuckle%';

-- ── FOREARMS ──────────────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'medial_elbow' 
WHERE muscle_id @> ARRAY['forearms'] AND (common_name ILIKE '%medial%' OR common_name ILIKE '%golfer%' OR common_name ILIKE '%inner%elbow%');

UPDATE recovery_knowledge_base SET area_of_pain = 'lateral_elbow' 
WHERE muscle_id @> ARRAY['forearms'] AND (common_name ILIKE '%lateral%' OR common_name ILIKE '%tennis%' OR common_name ILIKE '%outer%elbow%');

-- ── NECK ──────────────────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'upper_neck' 
WHERE muscle_id @> ARRAY['neck'] AND (common_name ILIKE '%upper%' OR common_name ILIKE '%suboccipital%' OR common_name ILIKE '%skull%');

UPDATE recovery_knowledge_base SET area_of_pain = 'lower_neck' 
WHERE muscle_id @> ARRAY['neck'] AND (common_name ILIKE '%lower%' OR common_name ILIKE '%base%neck%');

UPDATE recovery_knowledge_base SET area_of_pain = 'side_neck' 
WHERE muscle_id @> ARRAY['neck'] AND (common_name ILIKE '%side%' OR common_name ILIKE '%scm%' OR common_name ILIKE '%scalene%');

-- ── BACK ──────────────────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'l4_l5' 
WHERE muscle_id @> ARRAY['lower_back'] AND (common_name ILIKE '%l4%' OR common_name ILIKE '%l5%' OR common_name ILIKE '%lumbar%');

UPDATE recovery_knowledge_base SET area_of_pain = 'si_joint' 
WHERE muscle_id @> ARRAY['lower_back'] AND (common_name ILIKE '%si joint%' OR common_name ILIKE '%sacroiliac%');

-- ── GLUTES ────────────────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'piriformis' 
WHERE muscle_id @> ARRAY['glutes'] AND (common_name ILIKE '%piriformis%' OR common_name ILIKE '%deep%');

-- ── THIGHS / KNEES ──────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'it_band' 
WHERE muscle_id @> ARRAY['thighs'] AND (common_name ILIKE '%it band%' OR common_name ILIKE '%outer%');

UPDATE recovery_knowledge_base SET area_of_pain = 'patella' 
WHERE muscle_id @> ARRAY['knees'] AND (common_name ILIKE '%patella%' OR common_name ILIKE '%front%');

-- ── CALVES / ANKLES ─────────────────────────────────────────
UPDATE recovery_knowledge_base SET area_of_pain = 'achilles' 
WHERE (muscle_id @> ARRAY['calves'] OR muscle_id @> ARRAY['ankles']) AND common_name ILIKE '%achilles%';

UPDATE recovery_knowledge_base SET area_of_pain = 'shin' 
WHERE muscle_id @> ARRAY['calves'] AND (common_name ILIKE '%shin%' OR common_name ILIKE '%tibialis%');

-- Final Verification
SELECT area_of_pain, COUNT(*) FROM recovery_knowledge_base WHERE area_of_pain IS NOT NULL GROUP BY area_of_pain;
