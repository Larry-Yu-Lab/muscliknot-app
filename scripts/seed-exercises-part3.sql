-- ============================================================
-- MuscliKnot Exercise Database — Part 3
-- Muscle groups: knees, calves, ankles, feet
-- APPEND this after Part 2 in the Supabase SQL editor.
-- ============================================================

INSERT INTO recovery_knowledge_base
  (id, muscle_id, exercise_type, difficulty_level, common_name, area_of_pain, solution_stretch, why, instructions, process)
VALUES

-- ── KNEES ───────────────────────────────────────────────────
('k-001', ARRAY['knees'], 'relief', 'beginner', 'quad set contraction patella kneecap VMO',
 'kneecap', 'Quad Set — Patellar Tracking',
 'Isometrically activates the VMO (inner quad) to correct kneecap tracking without joint loading — the safest first step for kneecap pain.',
 '**STEP 1 (Sit/Lie):** Sit or lie with your leg straight. Place a rolled towel under your knee. **STEP 2 (Tighten):** Tighten your quadriceps, pressing the back of your knee into the towel. **STEP 3 (Hold):** Hold 10 seconds, fully relax for 5 seconds.',
 '15 reps × 3 sets. Do this before any kneecap exercise.'),

('k-002', ARRAY['knees'], 'relief', 'beginner', 'straight leg raise knee patella kneecap',
 'kneecap', 'Straight Leg Raise',
 'Builds VMO and quad strength with zero knee bend — safe even in acute kneecap pain or patellar tendinopathy.',
 '**STEP 1 (Lie):** Lie on your back. Bend one knee, keep the other straight. **STEP 2 (Tighten):** Tighten the straight leg''s quad (pull toes toward you). **STEP 3 (Lift):** Raise the straight leg to the height of the bent knee. Hold 3 seconds. Lower slowly.',
 '15 reps × 3 sets per leg.'),

('k-003', ARRAY['knees'], 'relief', 'beginner', 'medial VMO inner knee isometric strengthening',
 'inner_knee', 'VMO Inner Knee Isometric Press',
 'Isolates the vastus medialis oblique (inner quad) which stabilises the inner knee and medial collateral ligament.',
 '**STEP 1 (Sit):** Sit in a chair, knees bent 90°. Place a ball between your inner thighs. **STEP 2 (Squeeze):** Squeeze the ball with your thighs — focus on feeling the inner knee area work. **STEP 3 (Hold):** Hold 10 seconds. Relax.',
 '15 squeezes × 3 sets.'),

('k-004', ARRAY['knees'], 'relief', 'beginner', 'IT band outer knee stretch iliotibial',
 'outer_knee', 'IT Band Outer Knee Stretch',
 'Reduces tension in the iliotibial band at its insertion on the outer knee (Gerdy''s tubercle) — primary cause of lateral knee pain.',
 '**STEP 1 (Cross):** Stand and cross your right leg behind your left. **STEP 2 (Lean):** Push your right hip out to the side and lean your upper body left. **STEP 3 (Hold):** Feel the pull along the outer right knee and thigh. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('k-005', ARRAY['knees'], 'relief', 'beginner', 'hamstring stretch behind knee popliteus',
 'behind_knee', 'Behind-Knee Hamstring Stretch',
 'Lengthens the hamstrings and popliteus at the back of the knee — relieves the tightness and pain behind the knee common after kneeling or squatting.',
 '**STEP 1 (Stand):** Stand, place your heel on a low step. **STEP 2 (Hinge):** Hinge forward from the hips with a flat back. **STEP 3 (Hold):** Feel the pull at the back of the knee. Hold 30 seconds.',
 '3 holds × 30 seconds per leg.'),

('k-006', ARRAY['knees'], 'relief', 'intermediate', 'patellar mobilisation kneecap glide patella',
 'kneecap', 'Patellar Glide Mobilisation',
 'Manually moves the kneecap in all four directions to break adhesions and restore smooth patellar tracking — directly reduces kneecap catching and grinding.',
 '**STEP 1 (Relax):** Sit with leg straight, quadriceps completely relaxed. **STEP 2 (Grip):** Place fingertips on outer edges of kneecap. **STEP 3 (Glide):** Gently push the kneecap medially (inward) 10 times, then laterally 10 times, then up and down.',
 '10 glides each direction. 2–3 sets daily.'),

('k-007', ARRAY['knees'], 'relief', 'beginner', 'supine hamstring popliteus behind knee stretch',
 'behind_knee', 'Supine Popliteus Stretch',
 'The popliteus unlocks the knee — stretching it reduces the aching tightness and clicking that presents behind the knee.',
 '**STEP 1 (Lie):** Lie on your back. Loop a towel or band around one foot. **STEP 2 (Lift):** Use the towel to lift the leg, straightening the knee as much as comfortable. **STEP 3 (Hold):** Hold 30 seconds. Slightly internally rotate the foot for added popliteus focus.',
 '3 holds × 30 seconds per leg.'),

('k-008', ARRAY['knees'], 'relief', 'intermediate', 'lateral foam roll IT band outer knee',
 'outer_knee', 'IT Band Foam Roll — Outer Knee',
 'Reduces adhesions and friction in the distal IT band at the outer knee, where repetitive-use inflammation concentrates.',
 '**STEP 1 (Side lie):** Lie on your side, foam roller under your outer thigh. **STEP 2 (Roll):** Slowly roll from your outer hip to just above the outer knee. **STEP 3 (Pause):** Stop on tender spots for 20–30 seconds.',
 '2 minutes each side.'),

('k-009', ARRAY['knees'], 'warmup', 'beginner', 'knee circle warmup patella popliteus',
 NULL, 'Knee Circle Warm-Up',
 'Gently mobilises the tibiofemoral and patellofemoral joints to increase synovial fluid before loading.',
 '**STEP 1 (Stand):** Stand with feet together, hands on knees. **STEP 2 (Circle):** Make slow, large circles with your knees — 10 clockwise. **STEP 3 (Reverse):** 10 counter-clockwise.',
 '10 each direction. Start small, build to full range.'),

('k-010', ARRAY['knees'], 'strength', 'beginner', 'terminal knee extension VMO patella kneecap',
 'kneecap', 'Terminal Knee Extension',
 'The most precise VMO exercise — trains only the last 15° of knee extension where the VMO is most active for kneecap control.',
 '**STEP 1 (Band):** Anchor a band behind you at knee height. Loop it around the back of your knee. **STEP 2 (Bend):** Bend your knee slightly (15°). **STEP 3 (Extend):** Fully straighten your knee against the band. Hold 2 seconds.',
 '15 reps × 3 sets per leg.'),

('k-011', ARRAY['knees'], 'strength', 'intermediate', 'step up knee patella quad femor',
 NULL, 'Step-Up',
 'Functional knee strengthener that trains the quad and glutes in a stair-climbing pattern — directly improves kneecap tracking under load.',
 '**STEP 1 (Step):** Place right foot on a low step. **STEP 2 (Press):** Push through the right heel to step up, bringing left foot up. **STEP 3 (Control):** Lower the left foot back slowly. Focus on the knee tracking over the second toe.',
 '12 reps per leg, 3 sets.'),

('k-012', ARRAY['knees'], 'yoga', 'beginner', 'hero pose knee patella yoga reclined',
 'kneecap', 'Reclining Hero Pose',
 'Gently stretches the quadriceps in a passive position, reducing the compressive forces on the kneecap by lengthening the patellar tendon.',
 '**STEP 1 (Kneel):** Kneel on a soft surface, shins down. **STEP 2 (Sit):** Sit back between your heels. **STEP 3 (Recline):** Only if comfortable, lean back on your hands. Hold 1 minute.',
 '1 minute hold. Place a folded blanket under knees if painful.'),

('k-013', ARRAY['knees'], 'posture', 'beginner', 'knee tracking squat patella kneecap posture',
 'kneecap', 'Knee Tracking Box Squat',
 'Retrains the kneecap to track straight over the second toe during bending — corrects the inward-knee collapse that strains the inner structures.',
 '**STEP 1 (Box):** Stand in front of a low chair. **STEP 2 (Squat):** Slowly lower to the chair, watching that your kneecap stays over your second toe. **STEP 3 (Rise):** Press through the heel to rise without the knee caving inward.',
 '15 slow reps × 2 sets. Use a mirror to check knee alignment.'),

-- ── CALVES ──────────────────────────────────────────────────
('ca-001', ARRAY['calves'], 'relief', 'beginner', 'standing calf gastrocnemius stretch',
 NULL, 'Standing Calf Stretch',
 'Lengthens the gastrocnemius from the knee to the heel — relieves the cramping tightness and post-exercise calf aching.',
 '**STEP 1 (Wall):** Stand facing a wall. Place your right foot back, leg straight, heel down. **STEP 2 (Lean):** Lean body forward through the front leg until you feel the pull in the middle of the right calf. **STEP 3 (Hold):** Hold 30–45 seconds.',
 '3 holds × 30–45 seconds per leg.'),

('ca-002', ARRAY['calves'], 'relief', 'beginner', 'seated soleus lower calf stretch ankle',
 'lower_calf', 'Seated Soleus Stretch',
 'Stretches the soleus (deeper calf) which only opens when the knee is bent — relieves lower calf and Achilles tightness.',
 '**STEP 1 (Sit):** Sit on a chair and place one foot flat on the floor. **STEP 2 (Lean):** Lean your knee forward over your toes — keep the heel on the floor. **STEP 3 (Hold):** Feel the stretch deep in the lower calf and above the heel. Hold 30 seconds.',
 '3 holds × 30 seconds per leg.'),

('ca-003', ARRAY['calves', 'ankles'], 'relief', 'beginner', 'eccentric heel drop achilles calf tendon',
 'achilles', 'Eccentric Heel Drop — Achilles Relief',
 'The clinically proven first intervention for Achilles tendinopathy — eccentric loading reduces inflammation and remodels the tendon safely.',
 '**STEP 1 (Edge):** Stand with the ball of your foot on a step edge, heel over the edge. **STEP 2 (Rise):** Use both legs to rise up onto tiptoes. **STEP 3 (Lower):** Shift weight to the affected leg and SLOWLY lower the heel below the step level. Take 3 full seconds to lower.',
 '15 reps × 3 sets, TWICE daily. Mild pain (≤5/10) is acceptable during eccentric phase.'),

('ca-004', ARRAY['calves', 'ankles'], 'relief', 'beginner', 'towel achilles stretch calf towel',
 'achilles', 'Towel Achilles Stretch',
 'Gentle passive Achilles and calf stretch using a towel — safe for acute Achilles pain where full weight-bearing stretch is too painful.',
 '**STEP 1 (Sit):** Sit with your leg straight. Loop a towel around the ball of your foot. **STEP 2 (Pull):** Gently pull the towel toward you to bring your foot upward (dorsiflexion). **STEP 3 (Hold):** Hold 30 seconds. No bouncing.',
 '3 holds × 30 seconds per foot.'),

('ca-005', ARRAY['calves'], 'relief', 'beginner', 'dorsiflexion calf ankle stretch',
 'upper_calf', 'Dorsiflexion Wall Stretch',
 'Specifically targets the tight upper gastrocnemius and increases ankle dorsiflexion range — reduces strain on the upper calf.',
 '**STEP 1 (Wall):** Stand 1 metre from a wall, right foot back, toes elevated on the wall at knee height. **STEP 2 (Lean):** Lean your body into the wall, keeping the right heel on the floor. **STEP 3 (Hold):** Feel the intense stretch at the upper calf. Hold 30 seconds.',
 '3 holds × 30 seconds per side.'),

('ca-006', ARRAY['calves'], 'warmup', 'beginner', 'calf raise gastrocnemius warmup soleus',
 NULL, 'Calf Raise Warm-Up',
 'Progressively warms the calf-Achilles unit through full plantar flexion before running, jumping, or sport.',
 '**STEP 1 (Stand):** Stand on both feet, hands on a wall. **STEP 2 (Rise):** Rise up onto the balls of your feet as high as you can. **STEP 3 (Lower):** Lower slowly and controlled.',
 '20 reps × 2 sets. Build pace gradually.'),

('ca-007', ARRAY['calves'], 'yoga', 'beginner', 'downward dog calf gastrocnemius yoga stretch',
 NULL, 'Downward Dog — Calf Focus',
 'The classic yoga inversion that passively loads and lengthens both calves simultaneously using body weight.',
 '**STEP 1 (Plank):** Start in a high plank. **STEP 2 (Push):** Push hips up and back into an inverted V shape. **STEP 3 (Press):** Actively press one heel at a time down toward the floor. Alternate slowly.',
 '1 minute. "Dog walk" by alternating heel presses.'),

('ca-008', ARRAY['calves'], 'strength', 'beginner', 'calf raise gastrocnemius soleus strength',
 NULL, 'Calf Raise — Strength',
 'Builds calf strength and Achilles tendon load capacity — the primary preventive measure for calf strains and Achilles injuries.',
 '**STEP 1 (Stand):** Stand on the edge of a step or flat floor. **STEP 2 (Rise):** Rise to full tiptoe range. **STEP 3 (Lower):** Lower slowly (3 seconds). Add load by going single-leg as you progress.',
 '20 reps × 3 sets. Progress to single-leg × 15 reps.'),

('ca-009', ARRAY['calves', 'ankles'], 'strength', 'intermediate', 'single leg calf raise achilles soleus',
 'achilles', 'Single-Leg Calf Raise — Achilles Load',
 'Progressive Achilles tendon loading — builds the collagen remodelling needed to resolve chronic Achilles tendinopathy.',
 '**STEP 1 (Step):** Stand on the edge of a step, one foot only. **STEP 2 (Rise):** Rise up to full tiptoe. **STEP 3 (Lower):** Lower SLOWLY over 3–4 seconds below the step level.',
 '15 reps × 3 sets per foot, twice daily.'),

-- ── ANKLES ──────────────────────────────────────────────────
('an-001', ARRAY['ankles'], 'relief', 'beginner', 'ankle circle tibialis fibular relief',
 NULL, 'Ankle Circle Relief',
 'Full circumduction of the ankle joint mobilises all four ankle ligaments and promotes synovial fluid circulation after a sprain or prolonged immobility.',
 '**STEP 1 (Sit/Lie):** Sit or lie with your leg elevated. **STEP 2 (Circle):** Make large, slow circles with your ankle — 10 clockwise. **STEP 3 (Reverse):** 10 counter-clockwise.',
 '10 circles each direction, 2–3 times daily.'),

('an-002', ARRAY['ankles'], 'relief', 'beginner', 'inner ankle medial tibialis stretch',
 'inner_ankle', 'Inner Ankle Medial Stretch',
 'Stretches the medial deltoid ligament and tibialis posterior — relieves inner ankle tightness after over-pronation or a medial sprain.',
 '**STEP 1 (Sit):** Sit with your foot crossed over the opposite knee. **STEP 2 (Hold):** Hold your heel with one hand. **STEP 3 (Evert):** Use the other hand to gently push the sole of the foot outward (eversion). Hold 20 seconds.',
 '5 reps × 20 seconds per ankle.'),

('an-003', ARRAY['ankles'], 'relief', 'beginner', 'outer ankle peroneal fibular stretch',
 'outer_ankle', 'Outer Ankle Peroneal Stretch',
 'Stretches the peroneal muscles on the outer ankle — relieves the soreness after a lateral ankle sprain or peroneal tendinitis.',
 '**STEP 1 (Sit):** Sit with your foot on the opposite knee. **STEP 2 (Invert):** Gently cup your heel and turn the sole of your foot inward (inversion). **STEP 3 (Hold):** Feel the stretch on the outer ankle. Hold 20 seconds.',
 '5 reps × 20 seconds per ankle.'),

('an-004', ARRAY['ankles'], 'relief', 'beginner', 'front ankle tibialis anterior stretch',
 'front_ankle', 'Front Ankle Tibialis Stretch',
 'Stretches the tibialis anterior along the shin and front ankle — relieves shin splints and front-of-ankle impingement pain.',
 '**STEP 1 (Kneel):** Kneel on a soft surface, tops of feet flat. **STEP 2 (Sit):** Slowly sit back onto your heels. **STEP 3 (Hold):** Feel the stretch across the tops of your feet and front ankles. Hold 30 seconds.',
 '3 holds × 30 seconds.'),

('an-005', ARRAY['ankles', 'calves'], 'relief', 'beginner', 'achilles ankle towel stretch gentle',
 'achilles', 'Achilles Ankle Towel Stretch',
 'Non-weight-bearing Achilles stretch — ideal for acute ankle Achilles pain where standing is too painful.',
 '**STEP 1 (Sit):** Sit with legs extended. Loop a towel around the ball of your foot. **STEP 2 (Pull):** Pull the towel toward you, bringing the foot toward your shin. **STEP 3 (Hold):** Hold when you feel a gentle pull above the heel. Hold 30 seconds.',
 '3 holds × 30 seconds per foot.'),

('an-006', ARRAY['ankles'], 'warmup', 'beginner', 'ankle pump warmup tibialis peroneal',
 NULL, 'Ankle Pump Warm-Up',
 'Rapidly cycles the ankle through flexion and extension to pump blood into the foot and warm the ankle stabilisers before activity.',
 '**STEP 1 (Sit):** Sit with legs extended. **STEP 2 (Flex):** Point your toes away — hold 1 second. **STEP 3 (Pull):** Pull your toes toward you — hold 1 second. Alternate rapidly.',
 '30 pumps per ankle, 2–3 sets.'),

('an-007', ARRAY['ankles'], 'strength', 'beginner', 'resistance band ankle eversion peroneal outer',
 'outer_ankle', 'Band Ankle Eversion — Outer Ankle',
 'Strengthens the peroneal muscles to prevent repeat lateral ankle sprains — the most important outer ankle rehab exercise.',
 '**STEP 1 (Band):** Sit with a resistance band looped around your foot anchored to the opposite leg. **STEP 2 (Evert):** Push the sole of your foot outward against the band. **STEP 3 (Return):** Slowly return to neutral.',
 '15 reps × 3 sets per ankle.'),

('an-008', ARRAY['ankles'], 'strength', 'beginner', 'resistance band ankle inversion tibialis inner',
 'inner_ankle', 'Band Ankle Inversion — Inner Ankle',
 'Strengthens the tibialis posterior and medial stabilisers — prevents flat-foot collapse and inner ankle rolling.',
 '**STEP 1 (Band):** Sit with a band around your foot, anchored outward. **STEP 2 (Invert):** Pull the sole of your foot inward (like you''re rolling onto the outer edge). **STEP 3 (Return):** Slowly return.',
 '15 reps × 3 sets per ankle.'),

('an-009', ARRAY['ankles'], 'strength', 'beginner', 'single leg balance ankle tibialis peroneal',
 NULL, 'Single-Leg Balance',
 'Rebuilds the proprioceptive (balance) system in the ankle joint — the most important factor in preventing repeated ankle sprains.',
 '**STEP 1 (Stand):** Stand on one foot. **STEP 2 (Focus):** Keep the ankle steady — resist wobbling. **STEP 3 (Progress):** Close your eyes, or stand on a pillow, once you can hold 30 seconds easily.',
 '30 seconds × 3 sets per leg. Daily.'),

-- ── FEET ────────────────────────────────────────────────────
('ft-001', ARRAY['feet'], 'relief', 'beginner', 'plantar fascia heel stretch foot',
 'heel', 'Plantar Fascia Heel Stretch',
 'Directly stretches the plantar fascia at its most common pain point — the calcaneal insertion at the heel — dramatically reducing plantar fasciitis morning pain.',
 '**STEP 1 (Sit):** Before getting out of bed, sit on the edge. Cross right foot over left knee. **STEP 2 (Pull):** Use your right hand to pull all five toes back toward your shin. **STEP 3 (Hold):** Feel the tight band along the arch and deep heel. Hold 30 seconds.',
 '3 holds × 30 seconds per foot — especially BEFORE first steps in the morning.'),

('ft-002', ARRAY['feet'], 'relief', 'beginner', 'frozen bottle heel roll plantar fascia foot',
 'heel', 'Frozen Bottle Heel Roll',
 'The cold reduces local inflammation at the heel while the rolling provides plantar fascia massage — highly effective for acute heel pain.',
 '**STEP 1 (Freeze):** Freeze a water bottle. **STEP 2 (Roll):** Sitting in a chair, place the frozen bottle under your foot. **STEP 3 (Focus):** Slowly roll it along the arch and concentrate pressure at the painful heel area. Roll 5 minutes.',
 '5 minutes per foot. 2–3 times daily for acute pain.'),

('ft-003', ARRAY['feet'], 'relief', 'beginner', 'tennis ball arch roll plantar foot',
 'arch', 'Tennis Ball Arch Roll',
 'Provides deep tissue massage to the entire plantar fascia from arch to toe — breaks adhesions and reduces the morning stiffness of plantar fasciitis.',
 '**STEP 1 (Stand/Sit):** Place a tennis ball under your foot. **STEP 2 (Roll):** Apply comfortable downward pressure and slowly roll the ball from heel to the base of toes. **STEP 3 (Hold):** Pause for 20–30 seconds on any tender spots.',
 '3–5 minutes per foot daily. Do standing for stronger pressure.'),

('ft-004', ARRAY['feet'], 'relief', 'beginner', 'towel scrunch arch intrinsic foot',
 'arch', 'Towel Scrunch — Arch',
 'Strengthens the intrinsic foot muscles that form the arch — reduces arch fatigue and the collapsing that leads to plantar fasciitis.',
 '**STEP 1 (Towel):** Place a small towel flat on the floor. **STEP 2 (Scrunch):** Using only your toes, scrunch the towel toward you. **STEP 3 (Release):** Straighten the toes to push it back. Repeat.',
 '3 × 1-minute sscrunching sessions per foot.'),

('ft-005', ARRAY['feet'], 'relief', 'beginner', 'metatarsal ball foot press massage',
 'ball_foot', 'Metatarsal Ball-of-Foot Massage',
 'Releases the tight interosseous muscles and reduces metatarsalgia pain across the ball of the foot.',
 '**STEP 1 (Cross):** Sit and cross your foot over the opposite knee. **STEP 2 (Thumbs):** Place both thumbs under the ball of the foot. **STEP 3 (Press):** Apply firm circular pressure, working across all five metatarsal heads.',
 '2–3 minutes per foot.'),

('ft-006', ARRAY['feet'], 'relief', 'beginner', 'toe stretch big toe extension plantar foot',
 'toes', 'Toe Extension Stretch',
 'Stretches the long toe flexors and plantar fascia simultaneously — relieves hammertoe tension and the tight-toe sensation from walking.',
 '**STEP 1 (Sit):** Sit with your foot on your knee. **STEP 2 (Extend):** Use your hand to pull all toes back (toward your shin) as far as comfortable. **STEP 3 (Hold):** Hold 20 seconds. Then pull each toe back individually.',
 '3 holds × 20 seconds together, then 10 seconds each toe.'),

('ft-007', ARRAY['feet'], 'relief', 'intermediate', 'intrinsic foot dome arch strengthening plantar',
 'arch', 'Short Foot — Arch Dome',
 'The most specific arch-strengthening exercise — contracts the intrinsic muscles to lift the arch without curling the toes.',
 '**STEP 1 (Sit):** Sit with foot flat on the floor. **STEP 2 (Shorten):** Try to shorten your foot by pulling the ball of your foot toward your heel WITHOUT curling your toes. Feel your arch lift. **STEP 3 (Hold):** Hold 5 seconds.',
 '15 reps × 3 sets per foot. This takes practice — persevere.'),

('ft-008', ARRAY['feet'], 'relief', 'beginner', 'standing heel drop calcaneal plantar heel',
 'heel', 'Standing Heel Drop — Plantar',
 'Eccentrically loads the plantar fascia and Achilles at the heel, prompting tissue remodelling to resolve chronic heel pain.',
 '**STEP 1 (Step):** Stand with toes only on a step edge, heels over the edge. **STEP 2 (Rise):** Rise up on tiptoe. **STEP 3 (Lower):** Slowly lower BOTH heels below the step level. Take 4 seconds.',
 '15 reps × 3 sets. Daily.'),

('ft-009', ARRAY['feet'], 'warmup', 'beginner', 'toe tap warmup foot plantar toe',
 NULL, 'Toe Tap Warm-Up',
 'Activates the intrinsic foot muscles and dorsiflexors, warming the foot before running or prolonged standing.',
 '**STEP 1 (Stand):** Stand tall. **STEP 2 (Tap):** Rapidly tap your toes on the floor, one foot at a time — like drumming. **STEP 3 (Both):** Progress to tapping both feet alternately.',
 '30 seconds of rapid tapping, 2 sets.'),

('ft-010', ARRAY['feet'], 'yoga', 'beginner', 'toe spread yoga foot intrinsic plantar',
 'toes', 'Toe Opening Spread',
 'Reawakens the intrinsic foot muscles and corrects toe crowding caused by narrow shoes — reduces bunion and hammertoe pain.',
 '**STEP 1 (Sit):** Sit comfortably. **STEP 2 (Spread):** Try to spread all five toes as wide apart as possible. **STEP 3 (Hold):** Hold the spread for 5 seconds. Relax fully.',
 '10–15 reps per foot. Do this barefoot daily.'),

('ft-011', ARRAY['feet'], 'yoga', 'beginner', 'hero pose foot plantar yoga ankle',
 NULL, 'Hero Pose — Foot Stretch',
 'Simultaneously stretches the plantar fascia, toe extensors, and ankle — one of the best full-foot restoration poses.',
 '**STEP 1 (Kneel):** Kneel on a soft surface, toes tucked under. **STEP 2 (Sit):** Sit back onto your heels, letting your weight stretch the plantar fascia. **STEP 3 (Hold):** Hold 1 minute. Rise slowly.',
 '1 minute. Build gradually over weeks if very tight.'),

('ft-012', ARRAY['feet'], 'strength', 'beginner', 'marble pickup toe intrinsic foot strength',
 'toes', 'Marble Pickup',
 'Challenges the toe flexors individually — rebuilds the fine motor strength needed to prevent toe cramping and plantar pain.',
 '**STEP 1 (Scatter):** Scatter 10 marbles (or small objects) on the floor. **STEP 2 (Pick):** Using ONLY your toes, pick up one marble and drop it into a cup beside you. **STEP 3 (Repeat):** Pick up all 10.',
 '1–2 sets per foot daily.'),

('ft-013', ARRAY['feet'], 'strength', 'intermediate', 'short foot arch dome strengthening intrinsic',
 'arch', 'Arch Dome — Loaded',
 'Progresses the short foot exercise by adding a calf raise — trains the arch under dynamic load for lasting plantar fascia health.',
 '**STEP 1 (Stand):** Stand barefoot. Activate your short foot arch dome. **STEP 2 (Hold dome):** While maintaining the arch dome, slowly rise onto tiptoe. **STEP 3 (Lower):** Lower slowly, keeping the arch dome active throughout.',
 '15 reps × 3 sets. Progress to single-leg.'),

('ft-014', ARRAY['feet'], 'posture', 'beginner', 'foot tripod alignment posture arch plantar',
 NULL, 'Foot Tripod Alignment',
 'Teaches proper foot weight distribution (heel, first and fifth metatarsal heads) — corrects flat foot or high arch that drives plantar pain.',
 '**STEP 1 (Stand):** Stand barefoot. **STEP 2 (Find):** Feel pressure at three points: your heel, the base of your big toe, and the base of your little toe. **STEP 3 (Equal):** Adjust your weight until all three points feel equally loaded.',
 'Hold the tripod position for 30 seconds × 5 reps. Check this every time you stand barefoot.');
