/**
 * Local Coach Engine
 *
 * A comprehensive, deterministic response engine that provides intelligent
 * physical-therapy-grade coaching responses WITHOUT requiring any external
 * API. Works entirely offline by analyzing user messages against recovery
 * context (target muscle, phase, pain trend, session history).
 *
 * This is the primary fallback when Gemini API is unavailable, and is
 * designed to feel conversational and medically informed.
 */

import { RecoveryRoadmap } from './recoveryRoadmap';
import { HistoryItem } from './storage';
import { formatLabel } from './i18n';

// ─── Types ─────────────────────────────────────────────────────────────────

interface CoachContext {
    muscle: string;
    phase: string;
    painTrend: string;
    avgPain: number;
    sessionsThisWeek: number;
    totalSessions: number;
    dayNumber: number;
    fitnessLevel: string;
}

interface MatchRule {
    keywords: string[];
    /** If true, ALL keywords must match. If false (default), ANY keyword matches. */
    matchAll?: boolean;
    response: (ctx: CoachContext) => string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildContext(roadmap: RecoveryRoadmap, fitnessLevel: string): CoachContext {
    return {
        muscle: formatLabel(roadmap.targetMuscle) || 'your muscles',
        phase: roadmap.currentPhase || 'mobility',
        painTrend: roadmap.painTrend || 'stable',
        avgPain: roadmap.avgPainLevel ?? 0,
        sessionsThisWeek: roadmap.weeklyProgress?.sessionsThisWeek ?? 0,
        totalSessions: roadmap.totalSessions ?? 0,
        dayNumber: roadmap.dayNumber ?? 1,
        fitnessLevel: fitnessLevel || 'beginner',
    };
}

function textContainsAny(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}

function phaseAdvice(phase: string): string {
    switch (phase) {
        case 'acute':
            return 'Since you\'re in the acute phase, keep everything gentle — no deep stretching or resistance work yet. Focus on pain-free range of motion and ice therapy.';
        case 'mobility':
            return 'You\'re in the mobility phase, which means your body is ready for controlled stretches and light movement. Focus on restoring your full range of motion gradually.';
        case 'strengthening':
            return 'You\'ve progressed to the strengthening phase — great work! You can start adding light resistance and stability exercises to build resilience.';
        case 'maintenance':
            return 'You\'re in maintenance mode. Keep up your routine with regular stretching and warm-ups to prevent recurrence.';
        default:
            return 'Focus on listening to your body and progressing gradually through your recovery.';
    }
}

function painTrendMessage(ctx: CoachContext): string {
    if (ctx.painTrend === 'improving') {
        return `Your pain has been trending downward (currently averaging ${ctx.avgPain}/10), which is a great sign of progress!`;
    } else if (ctx.painTrend === 'worsening') {
        return `I notice your pain has been increasing (avg ${ctx.avgPain}/10). Let's dial back the intensity and focus on gentle recovery today.`;
    }
    return `Your pain level has been stable around ${ctx.avgPain}/10.`;
}

// ─── Response Rules ────────────────────────────────────────────────────────

const RULES: MatchRule[] = [
    // ── Greetings ──
    {
        keywords: ['hello', 'hey', 'hi', 'good morning', 'good evening', 'good afternoon', 'sup', 'what\'s up', 'howdy'],
        response: (ctx) =>
            `Hey there! 👋 I'm your recovery coach. You're on day ${ctx.dayNumber} of recovery for your ${ctx.muscle}, currently in the ${ctx.phase} phase. ${painTrendMessage(ctx)} How can I help you today?`,
    },

    // ── Sharp / Acute / Stinging Pain ──
    {
        keywords: ['sting', 'sharp', 'stab', 'shooting', 'electric', 'pinch', 'sudden pain', 'acute pain'],
        response: (ctx) =>
            `Sharp or stinging pain in your ${ctx.muscle} could indicate acute tissue strain or nerve irritation. Here's what to do right now:\n\n` +
            `1. **Stop** any current exercise immediately\n` +
            `2. **Apply ice** for 10-15 minutes (wrapped in cloth)\n` +
            `3. **Rest** the area — avoid stretching or massaging the painful spot\n` +
            `4. **Gentle breathing** and relaxation to reduce muscle guarding\n\n` +
            `If sharp pain persists for more than 48 hours, or if you experience numbness or tingling, please consult a healthcare professional.`,
    },

    // ── Burning Pain ──
    {
        keywords: ['burn', 'burning', 'on fire', 'hot'],
        response: (ctx) =>
            `A burning sensation in your ${ctx.muscle} often comes from overworked muscle fibers or mild nerve irritation. Try these steps:\n\n` +
            `1. **Cool down** — apply a cold compress for 10 minutes\n` +
            `2. **Hydrate** — dehydration can intensify that burning feeling\n` +
            `3. **Gentle movement** — very light, pain-free range of motion to increase blood flow\n` +
            `4. **Avoid heat packs** on actively burning areas\n\n` +
            `${phaseAdvice(ctx.phase)}`,
    },

    // ── Neck / Cervical ──
    {
        keywords: ['neck', 'cervical', 'text neck', 'neck strain', 'stiff neck', 'wry neck', 'torticollis'],
        response: (ctx) =>
            `Neck tension is one of the most common issues, especially with desk work and phone use. Here's your targeted relief plan:\n\n` +
            `**Chin Tucks** (nerve glide): Sit tall, gently draw your chin back creating a "double chin." Hold 5 seconds, repeat 10 times.\n\n` +
            `**Levator Scapulae Stretch**: Turn your head 45° to one side, look down toward your armpit, and gently pull with your hand. Hold 20-30 seconds each side.\n\n` +
            `**Upper Trap Release**: Drop your ear to your shoulder (don't force it), hold 20 seconds. You can gently press with your hand for more stretch.\n\n` +
            `⚠️ Avoid forceful neck rotations or "cracking" your neck.`,
    },

    // ── Shoulders / Traps ──
    {
        keywords: ['shoulder', 'trap', 'trapezius', 'rotator cuff', 'deltoid', 'frozen shoulder', 'shoulder blade', 'scapula'],
        response: (ctx) =>
            `Shoulder and trapezius tension builds up from stress, poor posture, and overhead activities. Here's what I recommend:\n\n` +
            `**Wall Slides**: Stand with your back flat against a wall, arms in a "W" position. Slowly slide arms up to "Y" and back down. 10 reps.\n\n` +
            `**Cross-Body Stretch**: Bring one arm across your chest, use the other hand to gently press at the elbow. Hold 20 seconds each side.\n\n` +
            `**Doorway Chest Opener**: Place forearms on a doorframe, step forward gently to open your chest. Hold 30 seconds.\n\n` +
            `**Trigger Point Release**: Use a lacrosse ball against a wall on your upper traps. Apply gentle pressure and hold on tender spots for 30-60 seconds.\n\n` +
            `${phaseAdvice(ctx.phase)}`,
    },

    // ── Lower Back / Lumbar ──
    {
        keywords: ['lower back', 'lumbar', 'spine', 'spinal', 'l4', 'l5', 'disc', 'sciatica', 'sciatic'],
        response: (ctx) =>
            `Lower back issues need careful, measured recovery. Here's a safe approach for your ${ctx.phase} phase:\n\n` +
            `**Cat-Cow**: On hands and knees, slowly arch and round your spine. 10 cycles with deep breathing.\n\n` +
            `**Child's Pose**: Sit back on your heels, arms extended forward. Hold 30-60 seconds — great for spinal decompression.\n\n` +
            `**Pelvic Tilts**: Lie on your back, knees bent. Gently flatten your lower back against the floor, then release. 15 reps.\n\n` +
            `**Bird-Dog** (if pain is mild): From all fours, extend opposite arm and leg. Hold 5 seconds, alternate. 8 reps per side.\n\n` +
            `⚠️ Avoid sitting for more than 30 minutes at a time. Stand, walk, and reset your posture regularly.`,
    },

    // ── Upper Back / Thoracic ──
    {
        keywords: ['upper back', 'thoracic', 'between shoulder blades', 'rhomboid', 'mid back', 'middle back'],
        response: (ctx) =>
            `Upper back and thoracic pain often stems from rounded posture and weak mid-back muscles. Try these:\n\n` +
            `**Foam Roller Thoracic Extension**: Lie with a foam roller across your upper back, arms crossed over chest. Gently extend backwards over the roller. Hold 5 seconds, move roller slightly and repeat.\n\n` +
            `**Thread the Needle**: On all fours, reach one arm under your body and rotate your thoracic spine. Hold 15 seconds each side.\n\n` +
            `**Band Pull-Aparts** (strengthening phase): Hold a resistance band at shoulder width, pull apart squeezing your shoulder blades together. 15 reps.\n\n` +
            `${phaseAdvice(ctx.phase)}`,
    },

    // ── Glutes / Hips / Piriformis ──
    {
        keywords: ['glute', 'piriformis', 'hip', 'hip flexor', 'psoas', 'it band', 'iliotibial', 'groin', 'adductor'],
        response: (ctx) =>
            `Hip and glute tightness is extremely common, especially if you sit for extended periods. Here's your plan:\n\n` +
            `**Figure-4 Stretch** (piriformis): Lie on your back, cross one ankle over the opposite knee, pull the bottom knee toward your chest. Hold 30 seconds each side.\n\n` +
            `**Hip Flexor Lunge**: Half-kneeling position, gently push your hips forward keeping your torso upright. Hold 30 seconds.\n\n` +
            `**Foam Roll IT Band**: Lie on your side with the roller under your outer thigh. Roll slowly from hip to just above the knee. 60 seconds per side.\n\n` +
            `**Clamshells** (strengthening): Side-lying, knees bent, open and close your top knee. 15 reps per side.\n\n` +
            `${painTrendMessage(ctx)}`,
    },

    // ── Hamstrings / Quads / Legs ──
    {
        keywords: ['hamstring', 'quad', 'quadricep', 'thigh', 'leg', 'calf', 'calves', 'shin', 'achilles', 'ankle'],
        response: (ctx) =>
            `For lower body recovery, here's what works well in the ${ctx.phase} phase:\n\n` +
            `**Standing Hamstring Stretch**: Place your heel on a low surface, hinge forward at the hips with a flat back. Hold 30 seconds.\n\n` +
            `**Quad Stretch**: Stand and pull your heel toward your glute, keeping knees together. Use a wall for balance. Hold 30 seconds.\n\n` +
            `**Calf Raises** (strengthening): Stand on the edge of a step, slowly lower your heels below the step, then rise up. 15 slow reps.\n\n` +
            `**Foam Roll Quads**: Face down with roller under your thighs, slowly roll from hip to just above knee. 60 seconds per leg.\n\n` +
            `Stay hydrated — dehydrated muscles cramp more easily!`,
    },

    // ── Knots / Trigger Points ──
    {
        keywords: ['knot', 'trigger point', 'tender spot', 'lump', 'hard spot', 'nodule', 'referred pain'],
        response: (ctx) =>
            `Muscle knots (myofascial trigger points) in your ${ctx.muscle} respond well to targeted pressure release:\n\n` +
            `**Self-Myofascial Release**: Use a tennis/lacrosse ball against a wall or on the floor. Find the tender spot and apply steady, tolerable pressure for 60-90 seconds until you feel the tension release.\n\n` +
            `**Pressure Scale**: Aim for 6-7/10 discomfort — uncomfortable but not painful. If it's making you tense up or hold your breath, ease off.\n\n` +
            `**Follow with Gentle Stretching**: After releasing a knot, gently stretch the muscle through its full range to prevent it from re-tightening.\n\n` +
            `**Hydrate**: Drink water after trigger point work — it helps flush metabolic waste from the released tissue.\n\n` +
            `Tip: Knots often take multiple sessions to fully release. Be patient and consistent.`,
    },

    // ── Tightness / Stiffness / Soreness ──
    {
        keywords: ['tight', 'tightness', 'stiff', 'stiffness', 'sore', 'soreness', 'ache', 'aching', 'dull pain', 'discomfort'],
        response: (ctx) =>
            `Muscle tightness and soreness in your ${ctx.muscle} during the ${ctx.phase} phase is normal and manageable. Here's how to address it:\n\n` +
            `**Active Recovery**: Light movement (walking, gentle yoga) increases blood flow and speeds recovery better than complete rest.\n\n` +
            `**Contrast Therapy**: Alternate 2 minutes warm / 1 minute cold on the area. Repeat 3 cycles. This pumps blood flow in and out of the tissue.\n\n` +
            `**Gentle Foam Rolling**: Slow, controlled passes over the tight area. Spend extra time on spots that feel especially dense — 30-60 seconds per spot.\n\n` +
            `**Sleep**: Quality sleep is when your muscles do most of their repair work. Aim for 7-9 hours.\n\n` +
            `${painTrendMessage(ctx)}`,
    },

    // ── Numbness / Tingling / Nerve ──
    {
        keywords: ['numb', 'numbness', 'tingling', 'pins and needles', 'nerve', 'radiating', 'weakness'],
        response: (ctx) =>
            `⚠️ Numbness, tingling, or radiating sensations can indicate nerve involvement and should be taken seriously.\n\n` +
            `**Immediate steps**:\n` +
            `1. Stop any exercise that triggers these symptoms\n` +
            `2. Note the exact location and whether it radiates\n` +
            `3. Try gentle nerve glide exercises (if not painful)\n\n` +
            `**Nerve Glide for Upper Body**: Extend your arm to the side, palm up, gently tilt your head away. Hold 5 seconds, release. 5-8 gentle reps.\n\n` +
            `**Important**: If numbness is persistent, worsening, or accompanied by muscle weakness, please see a healthcare professional. This is beyond what stretching alone can address.`,
    },

    // ── Exercise / Workout Requests ──
    {
        keywords: ['exercise', 'workout', 'routine', 'what should i do', 'what exercises', 'recommend', 'plan', 'program'],
        response: (ctx) => {
            const plans: Record<string, string> = {
                acute:
                    `For your ${ctx.muscle} in the **acute phase**, here's today's gentle recovery plan:\n\n` +
                    `1. **Breathing & Relaxation** — 2 min diaphragmatic breathing\n` +
                    `2. **Gentle Range of Motion** — slow, pain-free movements, 10 reps\n` +
                    `3. **Ice Application** — 10-15 min on the affected area\n` +
                    `4. **Posture Reset** — check your sitting/standing posture\n\n` +
                    `Keep intensity very low. If any movement increases pain, stop and rest.`,
                mobility:
                    `For your ${ctx.muscle} in the **mobility phase**, here's today's plan:\n\n` +
                    `1. **Light Warm-up** — 2-3 min gentle movement (walking, arm circles)\n` +
                    `2. **Dynamic Stretching** — 5 min controlled stretches, 20-30 sec holds\n` +
                    `3. **Foam Rolling** — 3-5 min on tight spots, 30 sec per area\n` +
                    `4. **Cool-down Stretch** — 2 min static stretching\n\n` +
                    `Total time: ~12-15 minutes. Aim for "comfortably uncomfortable" — stretch should feel productive, not painful.`,
                strengthening:
                    `For your ${ctx.muscle} in the **strengthening phase**, here's today's plan:\n\n` +
                    `1. **Warm-up** — 3 min light cardio or dynamic stretching\n` +
                    `2. **Activation Exercises** — 2 sets of 12 reps, light resistance\n` +
                    `3. **Strengthening** — 3 sets of 10-12 reps with controlled tempo\n` +
                    `4. **Cool-down** — 5 min foam rolling + static stretches\n\n` +
                    `Focus on slow, controlled movements. If you feel any sharp pain, drop the intensity immediately.`,
                maintenance:
                    `For your ${ctx.muscle} in **maintenance mode**, keep it consistent:\n\n` +
                    `1. **Daily Mobility** — 5 min stretching and foam rolling\n` +
                    `2. **Strength Training** — 2-3x per week, moderate intensity\n` +
                    `3. **Warm-ups Before Activity** — never skip these!\n` +
                    `4. **Listen to Your Body** — back off if old symptoms resurface\n\n` +
                    `You've done great work getting here! The key now is consistency over intensity.`,
            };
            return plans[ctx.phase] || plans.mobility;
        },
    },

    // ── Stretching ──
    {
        keywords: ['stretch', 'stretching', 'flexibility', 'range of motion', 'rom', 'how long to hold', 'hold time'],
        response: (ctx) =>
            `Here are evidence-based stretching guidelines for your ${ctx.muscle} recovery:\n\n` +
            `**Static Stretching**: Hold each stretch for **20-30 seconds**, repeat 2-3 times. Best done after warm-up or at end of day.\n\n` +
            `**Dynamic Stretching**: Controlled movements through full range — 10-15 reps. Best before activity.\n\n` +
            `**PNF Stretching** (advanced): Contract the muscle for 5 seconds, then relax and stretch deeper. Effective but requires some experience.\n\n` +
            `**Key Rules**:\n` +
            `• Never bounce during stretches\n` +
            `• Breathe deeply — exhale as you deepen the stretch\n` +
            `• Pain-free zone only — stretch to tension, not pain\n` +
            `• Consistency > intensity — daily 10 min beats weekly 60 min`,
    },

    // ── Foam Rolling / Massage ──
    {
        keywords: ['foam roll', 'foam roller', 'massage', 'massage ball', 'lacrosse ball', 'tennis ball', 'self massage', 'myofascial', 'release'],
        response: (ctx) =>
            `Self-myofascial release is excellent for your ${ctx.muscle}! Here's how to do it right:\n\n` +
            `**Foam Roller Technique**:\n` +
            `• Roll slowly — about 1 inch per second\n` +
            `• When you find a tender spot, pause and hold for 30-60 seconds\n` +
            `• Apply enough pressure to feel "good pain" (6/10) but not sharp pain\n` +
            `• Cover the full length of the muscle, then focus on problem areas\n\n` +
            `**Lacrosse/Tennis Ball** (for precision):\n` +
            `• Best for smaller muscles, between shoulder blades, glutes, feet\n` +
            `• Pin the ball between your body and a wall/floor\n` +
            `• Apply pressure and make small circular movements\n\n` +
            `**Timing**: 1-2 minutes per muscle group. Do it before stretching for best results.`,
    },

    // ── Posture ──
    {
        keywords: ['posture', 'sitting', 'desk', 'computer', 'ergonomic', 'slouch', 'hunched', 'forward head', 'rounded shoulders'],
        response: (ctx) =>
            `Poor posture is a major contributor to ${ctx.muscle} tension. Here's how to fix it:\n\n` +
            `**Desk Setup**:\n` +
            `• Screen at eye level, arm's length away\n` +
            `• Feet flat on floor, knees at 90°\n` +
            `• Elbows at 90°, wrists neutral\n\n` +
            `**Posture Reset (every 30 min)**:\n` +
            `1. Stand up and walk for 1-2 minutes\n` +
            `2. Roll your shoulders back 10 times\n` +
            `3. Do 5 chin tucks\n` +
            `4. Stretch your chest in a doorway for 15 seconds\n\n` +
            `**Strengthening**: Rows, face pulls, and wall angels strengthen the postural muscles that keep you upright.\n\n` +
            `Tip: Set a timer on your phone to remind you to reset every 30 minutes.`,
    },

    // ── Sleep / Recovery ──
    {
        keywords: ['sleep', 'rest', 'recovery', 'how long to recover', 'healing', 'recovery time', 'night', 'insomnia'],
        response: (ctx) =>
            `Recovery and sleep are where the real healing happens for your ${ctx.muscle}:\n\n` +
            `**Sleep Quality Tips**:\n` +
            `• Aim for 7-9 hours — muscle repair peaks during deep sleep\n` +
            `• Sleep on your back or side with proper support\n` +
            `• Avoid screens 30 min before bed (blue light disrupts melatonin)\n\n` +
            `**Active Recovery Days**:\n` +
            `• Light walking, gentle yoga, or swimming\n` +
            `• Keep intensity below 50% of normal effort\n` +
            `• Focus on blood flow, not performance\n\n` +
            `**Recovery Timeline** (general):\n` +
            `• Acute phase: 3-7 days\n` +
            `• Mobility restoration: 1-3 weeks\n` +
            `• Full strengthening: 3-6 weeks\n` +
            `• Maintenance: ongoing\n\n` +
            `You're on day ${ctx.dayNumber} — ${ctx.phase} phase. ${painTrendMessage(ctx)}`,
    },

    // ── How am I doing / Progress ──
    {
        keywords: ['progress', 'how am i doing', 'how\'s my recovery', 'getting better', 'improvement', 'stats', 'summary', 'update', 'status'],
        response: (ctx) => {
            const sessionMsg = ctx.sessionsThisWeek > 0
                ? `You've completed ${ctx.sessionsThisWeek} session${ctx.sessionsThisWeek !== 1 ? 's' : ''} this week (${ctx.totalSessions} total).`
                : `You haven't logged any sessions this week yet — try to fit one in today!`;
            return `Here's your recovery update for ${ctx.muscle}:\n\n` +
                `📊 **Day ${ctx.dayNumber}** of recovery\n` +
                `🎯 **Phase**: ${ctx.phase.charAt(0).toUpperCase() + ctx.phase.slice(1)}\n` +
                `📈 **Pain Trend**: ${ctx.painTrend} (avg ${ctx.avgPain}/10)\n` +
                `💪 **Sessions**: ${sessionMsg}\n` +
                `🏃 **Fitness Level**: ${ctx.fitnessLevel}\n\n` +
                `${ctx.painTrend === 'improving'
                    ? 'You\'re making great progress! Keep up the consistency.'
                    : ctx.painTrend === 'worsening'
                        ? 'Your pain has been increasing — let\'s ease off the intensity and focus on gentle recovery.'
                        : 'Your pain is stable — consistency with your recovery routine will help push it further down.'
                }`;
        },
    },

    // ── Warm-up / Before Exercise ──
    {
        keywords: ['warm up', 'warmup', 'warm-up', 'before exercise', 'before workout', 'prepare', 'activation'],
        response: (ctx) =>
            `A proper warm-up is critical for your ${ctx.muscle}, especially during the ${ctx.phase} phase:\n\n` +
            `**5-Minute Pre-Activity Warm-Up**:\n` +
            `1. **Light Cardio** (1 min) — marching in place, light jogging\n` +
            `2. **Joint Circles** (1 min) — neck, shoulders, hips, ankles\n` +
            `3. **Dynamic Stretches** (2 min) — leg swings, arm circles, torso twists\n` +
            `4. **Muscle Activation** (1 min) — light squats, band pull-aparts\n\n` +
            `Never skip your warm-up — cold muscles are significantly more prone to strain and re-injury.`,
    },

    // ── Yoga ──
    {
        keywords: ['yoga', 'yoga pose', 'downward dog', 'warrior', 'sun salutation', 'pigeon pose', 'child\'s pose'],
        response: (ctx) =>
            `Yoga is excellent for your ${ctx.muscle} recovery! Here are poses matched to your ${ctx.phase} phase:\n\n` +
            `**Gentle** (acute/mobility):\n` +
            `• Child's Pose — spinal decompression, 60 sec\n` +
            `• Cat-Cow — spinal mobility, 10 cycles\n` +
            `• Supine Twist — rotational release, 30 sec each side\n\n` +
            `**Moderate** (mobility/strengthening):\n` +
            `• Downward Dog — full posterior chain stretch, 30 sec\n` +
            `• Pigeon Pose — deep hip opener, 45 sec each side\n` +
            `• Warrior II — hip and leg strengthening, 30 sec each side\n\n` +
            `**Key Tips**:\n` +
            `• Breathe deeply into each pose\n` +
            `• Never force a stretch — work with your body\n` +
            `• Modify with props (blocks, straps) if needed`,
    },

    // ── When to see a doctor ──
    {
        keywords: ['doctor', 'physio', 'physiotherapist', 'medical', 'emergency', 'urgent', 'serious', 'worried', 'concerned', 'injury'],
        response: (_ctx) =>
            `That's a great question. Here's when you should consult a healthcare professional:\n\n` +
            `**See a doctor if you experience**:\n` +
            `• Pain that persists beyond 2 weeks despite rest\n` +
            `• Numbness, tingling, or loss of sensation\n` +
            `• Muscle weakness that doesn't improve\n` +
            `• Swelling, bruising, or visible deformity\n` +
            `• Pain that wakes you from sleep\n` +
            `• Pain after a specific injury or trauma\n\n` +
            `**For immediate attention**:\n` +
            `• Sudden severe pain with a "pop" sound\n` +
            `• Inability to bear weight or move a joint\n` +
            `• Signs of infection (redness, warmth, fever)\n\n` +
            `I can help with general muscle recovery guidance, but I'm not a substitute for professional medical diagnosis. When in doubt, always consult a professional. 🩺`,
    },

    // ── How to use the app ──
    {
        keywords: ['how to use', 'how does this work', 'what can you do', 'help me', 'features', 'what is this', 'tutorial', 'guide'],
        response: (ctx) =>
            `I'm your MuscliKnot Recovery Coach! Here's what I can help with:\n\n` +
            `💬 **Ask me about**:\n` +
            `• Pain relief for specific muscles (neck, back, shoulders, etc.)\n` +
            `• Stretching techniques and hold times\n` +
            `• Foam rolling and trigger point release\n` +
            `• Exercise recommendations for your ${ctx.phase} phase\n` +
            `• Posture improvement tips\n` +
            `• Your recovery progress and stats\n` +
            `• When to see a doctor\n\n` +
            `🎯 **Your current focus**: ${ctx.muscle} (${ctx.phase} phase, day ${ctx.dayNumber})\n\n` +
            `Just type your question naturally — I'll tailor my advice to your recovery data!`,
    },

    // ── Motivation / Frustration ──
    {
        keywords: ['frustrated', 'not working', 'give up', 'tired of', 'discouraged', 'slow', 'taking too long', 'no progress', 'why isn\'t', 'motivation'],
        response: (ctx) =>
            `I hear you, and your frustration is completely valid. Recovery isn't always a straight line — here's some perspective:\n\n` +
            `📊 **Your journey so far**: Day ${ctx.dayNumber}, ${ctx.totalSessions} total sessions completed. That's real effort!\n\n` +
            `**Remember**:\n` +
            `• Recovery has ups and downs — setbacks are normal, not failures\n` +
            `• Even small improvements compound over time\n` +
            `• Pain going from 8/10 to ${ctx.avgPain}/10 IS meaningful progress\n` +
            `• Consistency matters more than intensity\n\n` +
            `**What you can do right now**:\n` +
            `1. Do a single gentle session (even 5 minutes counts)\n` +
            `2. Focus on what IS better compared to day 1\n` +
            `3. Adjust expectations — healing takes time\n\n` +
            `You've already shown commitment by being here. Keep going — your body is healing even when it doesn't feel like it. 💪`,
    },

    // ── Hydration / Nutrition ──
    {
        keywords: ['water', 'hydration', 'dehydrated', 'nutrition', 'food', 'diet', 'supplement', 'protein', 'magnesium', 'cramp', 'cramping'],
        response: (ctx) =>
            `Nutrition and hydration play a huge role in muscle recovery:\n\n` +
            `**Hydration**:\n` +
            `• Aim for 2-3 liters of water daily\n` +
            `• Dehydrated muscles are tighter and more prone to cramping\n` +
            `• Increase intake on workout days and hot weather\n\n` +
            `**Recovery-Boosting Foods**:\n` +
            `• **Protein** — supports muscle repair (lean meats, eggs, legumes)\n` +
            `• **Omega-3s** — reduce inflammation (salmon, walnuts, flaxseed)\n` +
            `• **Magnesium** — helps muscle relaxation (dark greens, nuts, bananas)\n` +
            `• **Vitamin C** — supports collagen repair (citrus, berries, peppers)\n\n` +
            `**Timing**: Try to eat protein within 1-2 hours of any exercise session for optimal muscle recovery.`,
    },

    // ── Heat vs Ice ──
    {
        keywords: ['ice', 'heat', 'cold', 'hot pack', 'ice pack', 'heating pad', 'warm', 'compress', 'thermal'],
        response: (ctx) =>
            `Great question! Here's when to use heat vs. ice for your ${ctx.muscle}:\n\n` +
            `❄️ **ICE** (acute phase, first 48-72 hours):\n` +
            `• Reduces inflammation and swelling\n` +
            `• Apply 10-15 minutes, with a cloth barrier\n` +
            `• Best for: sharp pain, recent injury, post-exercise soreness\n\n` +
            `🔥 **HEAT** (after acute phase):\n` +
            `• Increases blood flow and relaxes tight muscles\n` +
            `• Apply 15-20 minutes\n` +
            `• Best for: chronic tightness, stiffness, before stretching\n\n` +
            `🔄 **CONTRAST** (mobility/strengthening phase):\n` +
            `• Alternate 2 min warm / 1 min cold, 3 cycles\n` +
            `• Creates a "pumping" effect that flushes waste and brings nutrients\n\n` +
            `For your current ${ctx.phase} phase: ${ctx.phase === 'acute' ? 'stick with ice for now.' : 'heat before stretching, ice after if sore.'}`,
    },

    // ── General back pain (catch broader queries) ──
    {
        keywords: ['back', 'back pain', 'my back'],
        response: (ctx) =>
            `Back discomfort is very common and highly treatable with the right approach. For your ${ctx.phase} phase:\n\n` +
            `**Quick Relief**:\n` +
            `• Knee-to-chest stretch — lie on your back, pull one knee to chest. 30 sec each side.\n` +
            `• Supine twist — knees bent, drop both knees to one side. 30 sec each.\n` +
            `• Cat-cow — on all fours, alternate arching and rounding. 10 slow reps.\n\n` +
            `**Prevention**:\n` +
            `• Strengthen your core — even gentle planks and bridges help stabilize the spine\n` +
            `• Don't sit for more than 30 minutes without moving\n` +
            `• Sleep with a pillow between or under your knees\n\n` +
            `${painTrendMessage(ctx)}`,
    },

    // ── Pain / Hurts (generic) ──
    {
        keywords: ['hurt', 'hurts', 'pain', 'painful', 'ouch', 'it hurts', 'in pain'],
        response: (ctx) =>
            `I'm sorry you're in pain. Let me help with your ${ctx.muscle} discomfort.\n\n` +
            `**Immediate relief steps**:\n` +
            `1. ${ctx.phase === 'acute' ? 'Apply ice for 10-15 minutes' : 'Try gentle movement to increase blood flow'}\n` +
            `2. Deep breathing — 4 counts in, 6 counts out (helps relax muscle guarding)\n` +
            `3. Gentle self-massage or foam rolling on the area\n\n` +
            `**Tell me more** so I can give better advice:\n` +
            `• Where exactly does it hurt? (specific muscle or area)\n` +
            `• What type of pain? (sharp, dull, aching, burning, tingling)\n` +
            `• What triggered it? (exercise, sitting, sleeping, sudden movement)\n` +
            `• How long has it been going on?\n\n` +
            `The more detail you share, the more targeted my guidance can be!`,
    },

    // ── Thank you / Positive ──
    {
        keywords: ['thank', 'thanks', 'awesome', 'great', 'helpful', 'appreciate', 'amazing', 'perfect', 'love it', 'good advice'],
        response: (ctx) =>
            `You're welcome! I'm glad I could help. 😊\n\n` +
            `Remember, consistency is key for your ${ctx.muscle} recovery. Even short daily sessions make a big difference over time.\n\n` +
            `Feel free to check back anytime — I'm here whenever you need guidance, stretching advice, or just want to track your progress!`,
    },
];

// ─── Main Engine ───────────────────────────────────────────────────────────

/**
 * Generate an intelligent, context-aware response to a user's message
 * without requiring any external API.
 */
export function generateLocalResponse(
    userMessage: string,
    roadmap: RecoveryRoadmap,
    history: HistoryItem[],
    fitnessLevel: string,
): string {
    const ctx = buildContext(roadmap, fitnessLevel);
    const text = userMessage.toLowerCase().trim();

    // Empty message
    if (!text) {
        return `What would you like to know about your ${ctx.muscle} recovery? I can help with stretching, pain management, exercises, and more!`;
    }

    // Check each rule in priority order
    for (const rule of RULES) {
        if (textContainsAny(text, rule.keywords)) {
            return rule.response(ctx);
        }
    }

    // ── Catch-all contextual response ──
    return `I'm here to help with your ${ctx.muscle} recovery! You're on day ${ctx.dayNumber} in the ${ctx.phase} phase. ${painTrendMessage(ctx)}\n\n` +
        `Here are some things you can ask me about:\n` +
        `• "My neck hurts" — targeted pain relief\n` +
        `• "Give me exercises" — a workout plan for today\n` +
        `• "How am I doing?" — your recovery progress\n` +
        `• "How to foam roll" — self-massage techniques\n` +
        `• "When should I see a doctor?" — medical guidance\n\n` +
        `Just describe what you're feeling and I'll tailor my advice!`;
}
