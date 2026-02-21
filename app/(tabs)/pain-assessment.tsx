import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Configuration for Questions ---

const DURATION_OPTIONS = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'longer', label: 'More than a month' },
];

const WARMUP_GOAL_OPTIONS = [
    { id: 'workout', label: 'Workout' },
    { id: 'sports', label: 'Sports' },
    { id: 'daily', label: 'Daily Activity' },
    { id: 'other', label: 'Other' },
];

const WARMUP_FEEL_OPTIONS = [
    { id: 'cold', label: 'Cold' },
    { id: 'stiff', label: 'Stiff' },
    { id: 'normal', label: 'Normal' },
    { id: 'warm', label: 'Already Warm' },
];

const YOGA_MOBILITY_OPTIONS = [
    { id: 'yes', label: 'Yes, fully' },
    { id: 'limited', label: 'Limited range' },
    { id: 'no', label: 'No, painful' },
];

const STRENGTH_EXP_OPTIONS = [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
];

const POSTURE_DURATION_OPTIONS = [
    { id: 'short', label: '< 1 Hour' },
    { id: 'medium', label: '1 - 4 Hours' },
    { id: 'long', label: '4+ Hours' },
    { id: 'all_day', label: 'All Day' },
];

// Map each muscle zone → specific sub-location options shown to the user
const PAIN_LOCATION_MAP: Record<string, { id: string; label: string }[]> = {
    hands: [{ id: 'fingers', label: 'Fingers' }, { id: 'thumb', label: 'Thumb' }, { id: 'wrist', label: 'Wrist' }, { id: 'palm', label: 'Palm' }, { id: 'pinky', label: 'Pinky' }, { id: 'ring_finger', label: 'Ring Finger' }],
    forearms: [{ id: 'inner_forearm', label: 'Inner Forearm' }, { id: 'outer_forearm', label: 'Outer Forearm' }, { id: 'elbow', label: 'Elbow' }, { id: 'wrist', label: 'Wrist' }],
    arms: [{ id: 'bicep', label: 'Bicep' }, { id: 'tricep', label: 'Tricep' }, { id: 'shoulder', label: 'Shoulder' }, { id: 'elbow', label: 'Elbow' }],
    traps: [{ id: 'left_shoulder', label: 'Left Shoulder' }, { id: 'right_shoulder', label: 'Right Shoulder' }, { id: 'upper_traps', label: 'Upper Traps' }, { id: 'base_neck', label: 'Base of Neck' }],
    neck: [{ id: 'left_side', label: 'Left Side' }, { id: 'right_side', label: 'Right Side' }, { id: 'back_neck', label: 'Back of Neck' }, { id: 'front_neck', label: 'Front of Neck' }],
    head: [{ id: 'temples', label: 'Temples' }, { id: 'forehead', label: 'Forehead' }, { id: 'back_head', label: 'Back of Head' }, { id: 'jaw', label: 'Jaw' }],
    chest: [{ id: 'left_chest', label: 'Left Chest' }, { id: 'right_chest', label: 'Right Chest' }, { id: 'sternum', label: 'Sternum' }, { id: 'collarbone', label: 'Collarbone' }],
    upper_back: [{ id: 'left_blade', label: 'Left Shoulder Blade' }, { id: 'right_blade', label: 'Right Shoulder Blade' }, { id: 'between_blades', label: 'Between Blades' }, { id: 'mid_spine', label: 'Mid Spine' }],
    lower_back: [{ id: 'left_lower', label: 'Left Side' }, { id: 'right_lower', label: 'Right Side' }, { id: 'tailbone', label: 'Tailbone' }, { id: 'sacrum', label: 'Sacrum' }],
    abdomen: [{ id: 'upper_abs', label: 'Upper Abdomen' }, { id: 'lower_abs', label: 'Lower Abdomen' }, { id: 'left_side', label: 'Left Side' }, { id: 'right_side', label: 'Right Side' }],
    hips: [{ id: 'left_hip', label: 'Left Hip' }, { id: 'right_hip', label: 'Right Hip' }, { id: 'hip_flexor', label: 'Hip Flexor' }, { id: 'groin', label: 'Groin' }],
    glutes: [{ id: 'left_glute', label: 'Left Glute' }, { id: 'right_glute', label: 'Right Glute' }, { id: 'tailbone', label: 'Tailbone' }, { id: 'piriformis', label: 'Deep / Piriformis' }],
    thighs: [{ id: 'front_thigh', label: 'Front (Quad)' }, { id: 'back_thigh', label: 'Back (Hamstring)' }, { id: 'inner_thigh', label: 'Inner Thigh' }, { id: 'outer_thigh', label: 'Outer Thigh' }],
    knees: [{ id: 'kneecap', label: 'Kneecap' }, { id: 'inner_knee', label: 'Inner Knee' }, { id: 'outer_knee', label: 'Outer Knee' }, { id: 'behind_knee', label: 'Behind Knee' }],
    calves: [{ id: 'upper_calf', label: 'Upper Calf' }, { id: 'lower_calf', label: 'Lower Calf' }, { id: 'achilles', label: 'Achilles' }, { id: 'shin', label: 'Shin' }],
    ankles: [{ id: 'inner_ankle', label: 'Inner Ankle' }, { id: 'outer_ankle', label: 'Outer Ankle' }, { id: 'front_ankle', label: 'Front of Ankle' }, { id: 'achilles', label: 'Achilles' }],
    feet: [{ id: 'heel', label: 'Heel' }, { id: 'arch', label: 'Arch' }, { id: 'ball_foot', label: 'Ball of Foot' }, { id: 'toes', label: 'Toes' }],
};

export default function AssessmentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

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

    // Returns an error string if required fields are missing, null if valid
    const getValidationError = (): string | null => {
        switch (activityType) {
            case 'warmup':
                if (!q1Answer) return 'Please select what you are warming up for.';
                if (!q2Answer) return 'Please select how this area feels.';
                return null;
            case 'yoga':
                if (!q1Answer) return 'Please select your current joint mobility.';
                return null;
            case 'strength':
                if (!q1Answer) return 'Please select your experience level.';
                return null;
            case 'posture':
                if (!q1Answer) return 'Please select how long you were in a fixed position.';
                return null;
            case 'relief':
            default: {
                if (!q1Answer) return 'Please select how long ago this occurred.';
                const locationOptions = PAIN_LOCATION_MAP[muscleId as string] ?? [];
                if (locationOptions.length > 0 && !painLocation) return 'Please select where exactly it hurts.';
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

    const renderSlider = (label: string, subLabel: string, lowLabel: string, highLabel: string) => (
        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.questionHeader}>
                <Ionicons name="analytics-outline" size={24} color={colors.accent} />
                <Text style={[styles.questionTitle, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.assessmentContent}>
                <View style={styles.scaleHeader}>
                    <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>{subLabel}</Text>
                    <View style={[styles.scaleBadge, { backgroundColor: colors.accent }]}>
                        <Text style={styles.scaleBadgeText}>{t('scale1to10')}</Text>
                    </View>
                </View>
                <View style={styles.sliderContainer}>
                    <View
                        style={styles.sliderTrack}
                        hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
                        onStartShouldSetResponder={() => true}
                        onMoveShouldSetResponder={() => true}
                        onResponderGrant={handleSliderTouch}
                        onResponderMove={handleSliderTouch}
                        onResponderRelease={() => setIsSliderActive(false)}
                    >
                        <View pointerEvents="none" style={[styles.sliderFill, { width: `${sliderValue * 10}%` }]} />
                        <View pointerEvents="none" style={[styles.sliderThumb, { left: `${sliderValue * 10}%` }]} />
                    </View>
                    <Text style={[styles.painNumber, { color: colors.accent }]}>{sliderValue}</Text>
                </View>
                <View style={styles.sliderLabels}>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{lowLabel}</Text>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{highLabel}</Text>
                </View>
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
                                <Text style={[styles.questionTitle, { color: colors.text }]}>What are you warming up for?</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {WARMUP_GOAL_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                        </View>

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="thermometer-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>How does this area feel?</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {WARMUP_FEEL_OPTIONS.map(opt => renderOption(opt.id, opt.label, q2Answer, setQ2Answer))}
                            </View>
                        </View>
                    </>
                );

            case 'yoga':
                return (
                    <>
                        {renderSlider('Tension Assessment', 'Rate current tension', t('mild'), t('severe'))}

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="body-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>Can you move joints in this area?</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {YOGA_MOBILITY_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                        </View>
                    </>
                );

            case 'strength':
                return (
                    <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.questionHeader}>
                            <Ionicons name="barbell-outline" size={24} color={colors.accent} />
                            <Text style={[styles.questionTitle, { color: colors.text }]}>Experience level with this muscle?</Text>
                        </View>
                        <View style={styles.optionsContainer}>
                            {STRENGTH_EXP_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                        </View>
                    </View>
                );

            case 'posture':
                return (
                    <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <View style={styles.questionHeader}>
                            <Ionicons name="time-outline" size={24} color={colors.accent} />
                            <Text style={[styles.questionTitle, { color: colors.text }]}>How long were you in a fixed position?</Text>
                        </View>
                        <View style={styles.optionsContainer}>
                            {POSTURE_DURATION_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                        </View>
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
                                <Text style={[styles.questionTitle, { color: colors.text }]}>How long ago did this occur?</Text>
                            </View>
                            <View style={styles.optionsContainer}>
                                {DURATION_OPTIONS.map(opt => renderOption(opt.id, opt.label, q1Answer, setQ1Answer))}
                            </View>
                        </View>

                        {(PAIN_LOCATION_MAP[muscleId as string] ?? []).length > 0 && (
                            <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={styles.questionHeader}>
                                    <Ionicons name="location-outline" size={24} color={colors.accent} />
                                    <Text style={[styles.questionTitle, { color: colors.text }]}>Where exactly does it hurt?</Text>
                                </View>
                                <View style={styles.optionsContainer}>
                                    {(PAIN_LOCATION_MAP[muscleId as string] ?? []).map((opt: { id: string; label: string }) => renderOption(opt.id, opt.label, painLocation, setPainLocation))}
                                </View>
                            </View>
                        )}

                        <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.questionHeader}>
                                <Ionicons name="help-circle-outline" size={24} color={colors.accent} />
                                <Text style={[styles.questionTitle, { color: colors.text }]}>Do you know what caused this?</Text>
                            </View>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.cardBorder }]}
                                placeholder="e.g., Slept wrong, lifted heavy object..."
                                placeholderTextColor={colors.textSecondary}
                                value={textInput}
                                onChangeText={setTextInput}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

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
                        {activityType === 'relief' ? 'Pain Assessment' : 'Activity Check-in'}
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
                    <Text style={styles.continueButtonText}>Continue</Text>
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

