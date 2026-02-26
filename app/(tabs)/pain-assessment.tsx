import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { painLevelColor } from '@/utils/assessmentEngine';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Configuration for Questions ---

export default function AssessmentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    // --- Translated Options ---
    const DURATION_OPTIONS = [
        { id: 'today', label: t('optToday') },
        { id: 'this_week', label: t('optThisWeek') },
        { id: 'this_month', label: t('optThisMonth') },
        { id: 'longer', label: t('optLonger') },
    ];

    const WARMUP_GOAL_OPTIONS = [
        { id: 'workout', label: t('optWorkout') },
        { id: 'sports', label: t('optSports') },
        { id: 'daily', label: t('optDaily') },
        { id: 'other', label: t('optOther') },
    ];

    const WARMUP_FEEL_OPTIONS = [
        { id: 'cold', label: t('optCold') },
        { id: 'stiff', label: t('optStiff') },
        { id: 'normal', label: t('optNormal') },
        { id: 'warm', label: t('optAlreadyWarm') },
    ];

    const YOGA_MOBILITY_OPTIONS = [
        { id: 'yes', label: t('optYesFully') },
        { id: 'limited', label: t('optLimitedRange') },
        { id: 'no', label: t('optNoPainful') },
    ];

    const STRENGTH_EXP_OPTIONS = [
        { id: 'beginner', label: t('optBeginner') },
        { id: 'intermediate', label: t('optIntermediate') },
        { id: 'advanced', label: t('optAdvanced') },
    ];

    const POSTURE_DURATION_OPTIONS = [
        { id: 'short', label: t('optLess1Hr') },
        { id: 'medium', label: t('opt1to4Hr') },
        { id: 'long', label: t('opt4PlusHr') },
        { id: 'all_day', label: t('optAllDay') },
    ];

    const PAIN_LOCATION_MAP: Record<string, { id: string; label: string }[]> = {
        hands: [
            { id: 'fingertips', label: t('locFingertips') },
            { id: 'knuckles', label: t('locKnuckles') },
            { id: 'front_hand', label: t('locFrontHand') },
            { id: 'back_hand', label: t('locBackHand') },
            { id: 'thumb_side', label: t('locThumbSide') },
            { id: 'pinky_side', label: t('locPinkySide') },
            { id: 'wrist_front', label: t('locWristFront') },
            { id: 'wrist_back', label: t('locWristBack') }
        ],
        forearms: [
            { id: 'inner_forearm', label: t('locInnerForearm') },
            { id: 'outer_forearm', label: t('locOuterForearm') },
            { id: 'medial_elbow', label: t('locMedialElbow') },
            { id: 'lateral_elbow', label: t('locLateralElbow') },
            { id: 'wrist_front', label: t('locWristFront') },
            { id: 'wrist_back', label: t('locWristBack') }
        ],
        arms: [
            { id: 'bicep', label: t('locBicep') },
            { id: 'tricep', label: t('locTricep') },
            { id: 'deltoid_front', label: t('locDeltoidFront') },
            { id: 'deltoid_back', label: t('locDeltoidBack') },
            { id: 'elbow_crease', label: t('locElbowCrease') }
        ],
        traps: [
            { id: 'neck_junction', label: t('locNeckJunction') },
            { id: 'shoulder_top', label: t('locShoulderTop') },
            { id: 'upper_trap_blade', label: t('locUpperTrapBlade') }
        ],
        neck: [
            { id: 'upper_neck', label: t('locUpperNeck') },
            { id: 'lower_neck', label: t('locLowerNeck') },
            { id: 'side_neck', label: t('locSideNeck') },
            { id: 'front_neck', label: t('locFrontNeck') }
        ],
        head: [
            { id: 'temples', label: t('locTemples') },
            { id: 'forehead', label: t('locForehead') },
            { id: 'back_head_base', label: t('locBackHeadBase') },
            { id: 'jaw', label: t('locJaw') }
        ],
        chest: [
            { id: 'upper_chest', label: t('locUpperChest') },
            { id: 'sternum', label: t('locSternum') },
            { id: 'collarbone', label: t('locCollarbone') },
            { id: 'outer_chest', label: t('locOuterChest') }
        ],
        upper_back: [
            { id: 'between_blades', label: t('locBetweenBlades') },
            { id: 'top_blade', label: t('locTopBlade') },
            { id: 'mid_spine', label: t('locMidSpine') }
        ],
        lower_back: [
            { id: 'l4_l5', label: t('locL4L5') },
            { id: 'si_joint', label: t('locSIJoint') },
            { id: 'tailbone', label: t('locTailbone') },
            { id: 'sacrum', label: t('locSacrum') }
        ],
        abdomen: [
            { id: 'upper_abs', label: t('locUpperAbs') },
            { id: 'lower_abs', label: t('locLowerAbs') },
            { id: 'obliques', label: t('locObliques') }
        ],
        hips: [
            { id: 'hip_flexor', label: t('locHipFlexor') },
            { id: 'groin', label: t('locGroin') },
            { id: 'outer_hip', label: t('locOuterHip') }
        ],
        glutes: [
            { id: 'piriformis', label: t('locPiriformis') },
            { id: 'upper_glute', label: t('locUpperGlute') },
            { id: 'lower_glute', label: t('locLowerGlute') }
        ],
        thighs: [
            { id: 'front_thigh', label: t('locFrontThigh') },
            { id: 'back_thigh', label: t('locBackThigh') },
            { id: 'inner_thigh', label: t('locInnerThigh') },
            { id: 'it_band', label: t('locITBand') }
        ],
        knees: [
            { id: 'kneecap', label: t('locKneecap') },
            { id: 'inner_knee', label: t('locInnerKnee') },
            { id: 'outer_knee', label: t('locOuterKnee') },
            { id: 'behind_knee', label: t('locBehindKnee') }
        ],
        calves: [
            { id: 'upper_calf', label: t('locUpperCalf') },
            { id: 'lower_calf', label: t('locLowerCalf') },
            { id: 'achilles', label: t('locAchilles') },
            { id: 'shin', label: t('locShin') }
        ],
        ankles: [
            { id: 'inner_ankle', label: t('locInnerAnkle') },
            { id: 'outer_ankle', label: t('locOuterAnkle') },
            { id: 'front_ankle', label: t('locFrontAnkle') }
        ],
        feet: [
            { id: 'heel', label: t('locHeel') },
            { id: 'arch', label: t('locArch') },
            { id: 'ball_foot', label: t('locBallFoot') },
            { id: 'toes', label: t('locToes') }
        ],
    };

    // Form state (Generic)
    const [q1Answer, setQ1Answer] = useState<string | null>(null); // e.g., Duration / Goal
    const [q2Answer, setQ2Answer] = useState<string | null>(null); // e.g., Cause / Feel
    const [sliderValue, setSliderValue] = useState(5); // e.g., Pain / Tension
    const [textInput, setTextInput] = useState('');
    const [painLocation, setPainLocation] = useState<string | null>(null); // Specific body part
    const [validationError, setValidationError] = useState<string | null>(null);

    const [isSliderActive, setIsSliderActive] = useState(false);
    const trackWidth = useRef(0);

    // Params
    const { x, y, width, height, rotation, view, size, muscleId, activityType = 'relief' } = params;

    // Derived live pain/tension colour for the slider
    const liveSliderColor = painLevelColor(sliderValue);

    // ─── Inline hints (non-blocking; shown live to inform the user) ──────────
    const getInlineHint = (): string | null => {
        if (activityType === 'relief') {
            if (sliderValue >= 8) {
                return t('hintHighPain');
            }
            if (sliderValue >= 5) {
                return t('hintModeratePain');
            }
        }
        if (activityType === 'yoga' && q1Answer === 'no') {
            return t('hintPainfulJoint');
        }
        if (activityType === 'warmup' && (q2Answer === 'cold' || q2Answer === 'stiff')) {
            return t('hintColdStiff');
        }
        if (activityType === 'strength' && q1Answer) {
            const labels: Record<string, string> = {
                beginner: t('hintBeginner'),
                intermediate: t('hintIntermediate'),
                advanced: t('hintAdvanced'),
            };
            return labels[q1Answer] ?? null;
        }
        if (activityType === 'posture' && (q1Answer === 'long' || q1Answer === 'all_day')) {
            return t('hintLongSitting');
        }
        return null;
    };

    const inlineHint = getInlineHint();

    // Returns an error string if required fields are missing, null if valid
    const getValidationError = (): string | null => {
        switch (activityType) {
            case 'warmup':
                if (!q1Answer) return t('validationWarmup1');
                if (!q2Answer) return t('validationWarmup2');
                return null;
            case 'yoga':
                if (!q1Answer) return t('validationYoga');
                return null;
            case 'strength':
                if (!q1Answer) return t('validationStrength');
                return null;
            case 'posture':
                if (!q1Answer) return t('validationPosture');
                return null;
            case 'relief':
            default: {
                if (!q1Answer) return t('validationRelief1');
                const locationOptions = PAIN_LOCATION_MAP[muscleId as string] ?? [];
                if (locationOptions.length > 0 && !painLocation) return t('validationRelief2');
                return null;
            }
        }
    };

    const handleSliderTouch = (event: any) => {
        setIsSliderActive(true);
        const { locationX } = event.nativeEvent;
        const percentage = Math.max(0, Math.min(1, locationX / trackWidth.current));
        const newValue = Math.round(percentage * 9) + 1;
        setSliderValue(newValue);
    };

    const handleContinue = () => {
        const error = getValidationError();
        if (error) {
            setValidationError(error);
            return;
        }
        setValidationError(null);

        // Route everything to the main Activity page (Find Relief)
        const targetPath = '/(tabs)/find-relief';

        router.push({
            pathname: targetPath as any,
            params: {
                x, y, width, height, rotation, view, size, muscleId, activityType,
                assessment_q1: q1Answer || 'unknown',
                assessment_q2: q2Answer || 'unknown',
                assessment_slider: sliderValue,
                assessment_note: textInput || 'unknown',
                assessment_location: painLocation || 'unknown',
                timestamp: Date.now()
            }
        });
    };

    // --- Render Helpers ---

    const renderOption = (id: string, label: string, selectedId: string | null, onSelect: (id: string) => void) => (
        <TouchableOpacity
            key={id}
            style={[
                styles.optionButton,
                { borderColor: colors.cardBorder },
                selectedId === id && { backgroundColor: colors.accent, borderColor: colors.accent }
            ]}
            onPress={() => onSelect(id)}
        >
            <Text style={[
                styles.optionText,
                { color: colors.text },
                selectedId === id && { color: '#000', fontWeight: '700' }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    // ─── Slider — dynamic colour based on value ─────────────────
    const renderSlider = (label: string, subLabel: string, lowLabel: string, highLabel: string) => (
        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.questionHeader}>
                <Ionicons name="analytics-outline" size={24} color={liveSliderColor} />
                <Text style={[styles.questionTitle, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.assessmentContent}>
                <View style={styles.scaleHeader}>
                    <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>{subLabel}</Text>
                    <View style={[styles.scaleBadge, { backgroundColor: liveSliderColor }]}>
                        <Text style={styles.scaleBadgeText}>{t('scale1to10')}</Text>
                    </View>
                </View>
                <View style={styles.sliderContainer}>
                    <View
                        style={[styles.sliderTrack, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                        hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
                        onStartShouldSetResponder={() => true}
                        onMoveShouldSetResponder={() => true}
                        onResponderGrant={handleSliderTouch}
                        onResponderMove={handleSliderTouch}
                        onResponderRelease={() => setIsSliderActive(false)}
                    >
                        <View pointerEvents="none" style={[styles.sliderFill, { width: `${sliderValue * 10}%`, backgroundColor: liveSliderColor }]} />
                        <View pointerEvents="none" style={[styles.sliderThumb, { left: `${sliderValue * 10}%`, backgroundColor: liveSliderColor }]} />
                    </View>
                    <Text style={[styles.painNumber, { color: liveSliderColor }]}>{sliderValue}</Text>
                </View>
                <View style={styles.sliderLabels}>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{lowLabel}</Text>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{highLabel}</Text>
                </View>
                {/* Live inline hint beneath slider */}
                {inlineHint && activityType === 'relief' && (
                    <View style={[styles.inlineHint, { backgroundColor: `${liveSliderColor}18`, borderColor: liveSliderColor }]}>
                        <Ionicons
                            name={sliderValue >= 8 ? 'warning-outline' : 'information-circle-outline'}
                            size={16}
                            color={liveSliderColor}
                        />
                        <Text style={[styles.inlineHintText, { color: liveSliderColor }]}>{inlineHint}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    // --- Content Logic ---

    const renderContent = () => {
        switch (activityType) {
            case 'warmup':
                return (
                    <>
                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="flame-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>{t('warmupQuestion1')}</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {WARMUP_GOAL_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                        </View>

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="thermometer-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>{t('warmupQuestion2')}</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {WARMUP_FEEL_OPTIONS.map(opt => renderOption(opt.id, opt.label, q2Answer, setQ2Answer))}
                            </View>
                            {/* Inline hint for cold/stiff warmup */}
                            {inlineHint && (q2Answer === 'cold' || q2Answer === 'stiff') && (
                                <View style={[styles.inlineHint, { backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: colors.accent, marginTop: 12 }]}>
                                    <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                                    <Text style={[styles.inlineHintText, { color: colors.accent }]}>{inlineHint}</Text>
                                </View>
                            )}
                        </View>
                    </>
                );

            case 'yoga':
                return (
                    <>
                        {renderSlider(t('tensionAssessment'), t('rateTension'), t('mild'), t('severe'))}

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="body-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>{t('yogaQuestion1')}</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {YOGA_MOBILITY_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                            {/* Inline hint for painful joints */}
                            {inlineHint && q1Answer === 'no' && (
                                <View style={[styles.inlineHint, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', marginTop: 12 }]}>
                                    <Ionicons name="warning-outline" size={16} color="#ef4444" />
                                    <Text style={[styles.inlineHintText, { color: '#ef4444' }]}>{inlineHint}</Text>
                                </View>
                            )}
                        </View>
                    </>
                );

            case 'strength':
                return (
                    <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.questionHeader}>
                            <Ionicons name="barbell-outline" size={24} color={colors.accent} />
                            <Text style={[styles.questionTitle, { color: colors.text }]}>{t('strengthQuestion1')}</Text>
                        </View>
                        <View style={styles.optionsContainer}>
                            {STRENGTH_EXP_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                        </View>
                        {/* Inline hint for selected experience */}
                        {inlineHint && q1Answer && (
                            <View style={[styles.inlineHint, { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: '#22c55e', marginTop: 12 }]}>
                                <Ionicons name="shield-checkmark-outline" size={16} color="#22c55e" />
                                <Text style={[styles.inlineHintText, { color: '#22c55e' }]}>{inlineHint}</Text>
                            </View>
                        )}
                    </View>
                );

            case 'posture':
                return (
                    <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.questionHeader}>
                            <Ionicons name="time-outline" size={24} color={colors.accent} />
                            <Text style={[styles.questionTitle, { color: colors.text }]}>{t('postureQuestion1')}</Text>
                        </View>
                        <View style={styles.optionsContainer}>
                            {POSTURE_DURATION_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                        </View>
                        {/* Inline hint for long/all-day sitting */}
                        {inlineHint && (q1Answer === 'long' || q1Answer === 'all_day') && (
                            <View style={[styles.inlineHint, { backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: colors.accent, marginTop: 12 }]}>
                                <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                                <Text style={[styles.inlineHintText, { color: colors.accent }]}>{inlineHint}</Text>
                            </View>
                        )}
                    </View>
                );

            case 'relief':
            default:
                // Default Pain Assessment
                return (
                    <>
                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="time-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>{t('reliefQuestion1')}</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {DURATION_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                        </View>

                        {(PAIN_LOCATION_MAP[muscleId as string] ?? []).length > 0 && (
                            <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={styles.questionHeader}>
                                    <Ionicons name="location-outline" size={24} color={colors.accent} />
                                    <Text style={[styles.questionTitle, { color: colors.text }]}>{t('reliefQuestion2')}</Text>
                                </View>
                                <View style={styles.optionsContainer}>
                                    {(PAIN_LOCATION_MAP[muscleId as string] ?? []).map((opt: { id: string; label: string }) => renderOption(opt.id, opt.label, painLocation, setPainLocation))}
                                </View>
                            </View>
                        )}

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="help-circle-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>{t('reliefQuestion3')}</Text>
                            </View>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.cardBorder }]}
                                placeholder={t('placeholderCause')}
                                placeholderTextColor={colors.textSecondary}
                                value={textInput}
                                onChangeText={setTextInput}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Pain intensity slider with live colour + hint */}
                        {renderSlider(t('painAssessment'), t('rateIntensity'), t('mild'), t('severe'))}
                    </>
                );
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {activityType === 'relief' ? t('painAssessment') : t('assessmentCheckin')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {renderContent()}

            </ScrollView>

            {/* Continue Button */}
            <View style={[styles.bottomContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                {validationError && (
                    <Text style={styles.validationError}>{validationError}</Text>
                )}
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        { backgroundColor: colors.accent },
                        !!getValidationError() && { opacity: 0.5 }
                    ]}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>{t('continueButton')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    questionCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        marginBottom: 16,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 14,
    },
    textInput: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    assessmentContent: {
        gap: 16,
    },
    scaleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scaleLabel: {
        fontSize: 14,
    },
    scaleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    scaleBadgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    sliderTrack: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        position: 'relative',
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#f97316',
        borderRadius: 4,
    },
    sliderThumb: {
        position: 'absolute',
        top: -8,
        marginLeft: -12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f97316',
        borderWidth: 3,
        borderColor: '#fff',
    },
    painNumber: {
        fontSize: 24,
        fontWeight: '800',
        minWidth: 30,
        textAlign: 'center',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 12,
    },
    inlineHint: {
        flexDirection: 'row',
        gap: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    inlineHintText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '500',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
    },
    continueButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    validationError: {
        color: '#ef4444',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 10,
    },
});
