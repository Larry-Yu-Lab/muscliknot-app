import { fetchExercisesByMuscleAndSize } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getExercisesByActivityType } from '@/data/exercises';
import { categoryLabel, getExerciseRecommendation, RecommendationResult } from '@/utils/assessmentEngine';
import { getTranslation } from '@/utils/i18n';
import { AssessmentData, savePainSession, saveToHistory } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FindReliefScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];
    const isDark = theme === 'dark';

    const x = Number(params.x) || 0;
    const y = Number(params.y) || 0;
    const width = Number(params.width) || 40;
    const height = Number(params.height) || 40;
    const view = (params.view as 'Front' | 'Back') || 'Front';
    const size = (params.size as string) || 'medium';
    const muscleId = (params.muscleId as string) || 'unknown';
    const activityType = (params.activityType as string) || 'relief';

    // Assessment data from pain-assessment screen
    const assessment: AssessmentData = {
        activityType,
        painLevel: params.assessment_slider ? Number(params.assessment_slider) : undefined,
        duration: params.assessment_q1 !== 'unknown' ? (params.assessment_q1 as string) : undefined,
        location: params.assessment_location !== 'unknown' ? (params.assessment_location as string) : undefined,
        cause: params.assessment_note !== 'unknown' ? (params.assessment_note as string) : undefined,
        q1: params.assessment_q1 !== 'unknown' ? (params.assessment_q1 as string) : undefined,
        q2: params.assessment_q2 !== 'unknown' ? (params.assessment_q2 as string) : undefined,
    };

    // ─── Assessment Engine ───────────────────────────────────────
    const recommendation: RecommendationResult = React.useMemo(
        () => getExerciseRecommendation(assessment),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activityType, assessment.painLevel, assessment.q1, assessment.q2, assessment.duration]
    );

    // Store recommendation outputs back into assessment for history
    assessment.recommendationCategory = recommendation.category;
    assessment.recommendationAdvisory = recommendation.advisory;

    const [exercises, setExercises] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    console.log('FindReliefScreen Params:', { muscleId, size, y });
    console.log('Recommendation:', { category: recommendation.category, advisory: recommendation.advisory, filter: recommendation.difficultyFilter });

    React.useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);

            // Fetch with difficulty filter derived from assessment
            const data = await fetchExercisesByMuscleAndSize(
                muscleId,
                size,
                activityType,
                recommendation.difficultyFilter
            );

            if (data && data.length > 0) {
                setExercises(data);
            } else {
                // Fallback to local data filtered by activityType
                setExercises(getExercisesByActivityType(activityType, y, view));
            }
            setIsLoading(false);
        };

        fetchExercises();
    }, [muscleId, size, y, view, activityType, recommendation.difficultyFilter]);

    const targetMuscle = React.useMemo(() => {
        if (exercises.length === 0) return 'General';
        const ex = exercises[0];
        if (ex.muscleGroup) return ex.muscleGroup;
        if (Array.isArray(ex.muscle_id) && ex.muscle_id.length > 0) return ex.muscle_id[0];
        if (typeof ex.muscle_id === 'string') return ex.muscle_id;
        return 'General';
    }, [exercises]);

    // Helper to get translated muscle name if available, else fallback to English name
    const getMuscleName = (name: string) => {
        const mappedKey = `mg${name.replace(/\s+/g, '')}`;
        return t(mappedKey as any) !== mappedKey ? t(mappedKey as any) : name;
    };

    const displayTarget = getMuscleName(targetMuscle);

    const handleComplete = async () => {
        const item = {
            date: Date.now(),
            muscleGroup: targetMuscle,
            exercises: exercises,
            assessment,
        };
        await saveToHistory(item);

        // Also save detailed session to pain_sessions table
        await savePainSession({
            activityType,
            muscleGroup: targetMuscle,
            painLevel: assessment.painLevel,
            painDuration: assessment.duration,
            painLocation: assessment.location,
            causeNote: assessment.cause,
            q1: assessment.q1,
            q2: assessment.q2,
            recommendationCategory: recommendation.category,
            recommendationAdvisory: recommendation.advisory,
            exercisesShown: exercises,
        });

        Alert.alert(t('planCompletedTitle'), t('planCompletedMessage'), [
            { text: "OK", onPress: () => router.navigate('/(tabs)') }
        ]);
    };

    const totalMinutes = exercises.length * 3; // Approx duration

    // ─── Advisory Banner ────────────────────────────────────────
    const renderAdvisoryBanner = () => {
        if (!recommendation.advisory) return null;
        return (
            <View style={[styles.advisoryBanner, { borderColor: recommendation.accentColor, backgroundColor: `${recommendation.accentColor}18` }]}>
                <Ionicons
                    name={recommendation.showRestWarning ? 'warning-outline' : 'information-circle-outline'}
                    size={20}
                    color={recommendation.accentColor}
                    style={{ marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={[styles.advisoryTitle, { color: recommendation.accentColor }]}>
                        {categoryLabel(recommendation.category)}
                    </Text>
                    <Text style={[styles.advisoryText, { color: recommendation.accentColor }]}>
                        {recommendation.advisory}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {displayTarget} {activityType === 'relief' ? t('relief') : activityType.charAt(0).toUpperCase() + activityType.slice(1)}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Video Player */}
                <View style={styles.videoContainer}>
                    <Image
                        source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQvExJHNf-gPBvV9mafHYX_QH4RDM2a10DReFfan-2uta-tGIgoYLy2YcqV88Fw966WlK2bhvku-3_4e5f88wGpuO0qaD_Yr1qPxSQtigGhxM0Sq6uOtWbw-JV0RDp_0RmODacO147g0dvAY693HSe3XPVdm2eTzs6ER9VAKERpdSDpdD1MgVcJ8HJCDesjsxF-hhw0aRZc-sY0sB3sHox58BbJ7vYjkyyLq8KDnpbu4x0PolLYeNnsL3Q3fcRFHU5BkgY0KWaZ8NP" }}
                        style={styles.videoThumbnail}
                        contentFit="cover"
                    />
                    <View style={styles.videoOverlay} />
                    <TouchableOpacity style={styles.playButton}>
                        <Ionicons name="play" size={32} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                            <View style={styles.progressThumb} />
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>0:00</Text>
                            <Text style={styles.timeText}>{t('totalMin').replace('${min}', totalMinutes.toString())}</Text>
                        </View>
                    </View>
                </View>

                {/* Exercise Info Badges */}
                <View style={styles.badgeContainer}>
                    <View style={[
                        styles.badge,
                        { backgroundColor: colors.cardBackground, borderColor: recommendation.advisory ? recommendation.accentColor : colors.cardBorder }
                    ]}>
                        <Ionicons name="fitness-outline" size={20} color={recommendation.advisory ? recommendation.accentColor : colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.text }]}>
                            {isLoading ? '...' : t('exercisesCount').replace('${count}', (exercises?.length || 0).toString())}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Ionicons name="timer-outline" size={20} color={colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.text }]}>
                            {isLoading ? '...' : t('approxMins').replace('${min}', String((exercises?.length || 0) * 4))}
                        </Text>
                    </View>
                    {/* Recommendation category badge */}
                    {!isLoading && (
                        <View style={[styles.badge, { backgroundColor: `${recommendation.accentColor}18`, borderColor: recommendation.accentColor }]}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color={recommendation.accentColor}
                            />
                            <Text style={[styles.badgeText, { color: recommendation.accentColor }]}>
                                {categoryLabel(recommendation.category)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Advisory Banner — shown before exercises when non-null */}
                <View style={styles.advisoryContainer}>
                    {renderAdvisoryBanner()}
                </View>

                {/* Organized Exercise Instructions */}
                <View style={styles.instructionsSection}>
                    <Text style={[styles.instructionsTitle, { color: '#fff' }]}>
                        {activityType === 'warmup' ? 'Warm-up Exercises' :
                            activityType === 'yoga' ? 'Yoga Poses' :
                                activityType === 'posture' ? 'Posture Corrections' :
                                    activityType === 'strength' ? 'Strengthening Exercises' :
                                        t('stretchInstructions')}
                    </Text>

                    {isLoading ? (
                        <Text style={{ color: '#fff', textAlign: 'center', padding: 20 }}>Loading...</Text>
                    ) : exercises.length === 0 ? (
                        <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: 20 }}>No exercises found for this area.</Text>
                    ) : (
                        (() => {
                            const ex = exercises[0];
                            const isLocal = !!ex.title && !ex.solution_stretch;
                            const exerciseTitle = ex.solution_stretch || ex.title || ex.common_name || 'Exercise';
                            const exerciseSubtitle = ex.common_name && !isLocal
                                ? `Target Muscle: ${ex.common_name}`
                                : ex.duration || null;

                            return (
                                <View>
                                    {/* Exercise Header Card */}
                                    <View style={[styles.instructionCard, { backgroundColor: 'rgba(249, 115, 22, 0.15)', borderColor: colors.accent, borderWidth: 1, marginBottom: 12 }]}>
                                        <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                            <Ionicons name="fitness-outline" size={20} color="#000" />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
                                                {exerciseTitle}
                                            </Text>
                                            {exerciseSubtitle ? (
                                                <Text style={{ marginTop: 4, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                                                    {exerciseSubtitle}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>

                                    {/* Local Exercise: show description */}
                                    {isLocal && ex.description ? (
                                        <View style={[styles.instructionCard, { backgroundColor: 'rgba(30, 30, 35, 0.9)', borderRadius: 16, marginBottom: 16 }]}>
                                            <View style={[styles.stepNumber, { backgroundColor: 'transparent' }]}>
                                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.2)', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
                                                </View>
                                            </View>
                                            <View style={styles.stepContent}>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent, marginBottom: 8 }}>How to do it</Text>
                                                <Text style={{ color: '#fff', lineHeight: 24, fontSize: 15 }}>{ex.description}</Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    {/* Supabase Exercise: Why This Helps */}
                                    {!isLocal && ex.why ? (
                                        <View style={[styles.instructionCard, { backgroundColor: 'rgba(30, 30, 35, 0.9)', borderRadius: 16, marginBottom: 16 }]}>
                                            <View style={[styles.stepNumber, { backgroundColor: 'transparent' }]}>
                                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.2)', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Ionicons name="bulb-outline" size={20} color={colors.accent} />
                                                </View>
                                            </View>
                                            <View style={styles.stepContent}>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent, marginBottom: 8 }}>Why This Helps</Text>
                                                <Text style={{ color: '#fff', lineHeight: 24, fontSize: 15 }}>{ex.why}</Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    {/* Supabase Exercise: Step-by-step instructions */}
                                    {!isLocal && ex.instructions ? (() => {
                                        const stepRegex = /\*\*STEP\s*(\d+)\s*\(([^)]+)\):\*\*/g;
                                        const parts = ex.instructions.split(stepRegex);
                                        const steps: { number: string; label: string; content: string }[] = [];
                                        for (let i = 1; i < parts.length; i += 3) {
                                            if (parts[i] && parts[i + 1] && parts[i + 2] !== undefined) {
                                                steps.push({ number: parts[i], label: parts[i + 1], content: parts[i + 2].trim() });
                                            }
                                        }
                                        return steps.length > 0 ? (
                                            <>
                                                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.accent, marginBottom: 12, marginTop: 8 }}>Instructions</Text>
                                                {steps.map((step, idx) => (
                                                    <View key={idx} style={[styles.instructionCard, { backgroundColor: 'rgba(30, 30, 35, 0.9)', borderRadius: 16, marginBottom: 16 }]}>
                                                        <View style={[styles.stepNumber, { backgroundColor: '#f97316', borderRadius: 8, alignSelf: 'flex-start' }]}>
                                                            <Text style={[styles.stepNumberText, { color: '#000', fontWeight: '800' }]}>{step.number}</Text>
                                                        </View>
                                                        <View style={styles.stepContent}>
                                                            <Text style={{ color: '#fff', lineHeight: 24, fontSize: 15 }}>{step.content}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </>
                                        ) : (
                                            <View style={[styles.instructionCard, { backgroundColor: 'rgba(30, 30, 35, 0.9)', borderRadius: 16, marginBottom: 16 }]}>
                                                <View style={[styles.stepNumber, { backgroundColor: '#f97316', borderRadius: 8, alignSelf: 'flex-start' }]}>
                                                    <Text style={[styles.stepNumberText, { color: '#000', fontWeight: '800' }]}>1</Text>
                                                </View>
                                                <View style={styles.stepContent}>
                                                    <Text style={{ color: '#fff', lineHeight: 24, fontSize: 15 }}>{ex.instructions}</Text>
                                                </View>
                                            </View>
                                        );
                                    })() : null}

                                    {/* Supabase Exercise: Process */}
                                    {!isLocal && ex.process ? (
                                        <View style={[styles.instructionCard, { backgroundColor: 'rgba(30, 30, 35, 0.9)', borderRadius: 16, marginBottom: 16 }]}>
                                            <View style={[styles.stepNumber, { backgroundColor: 'transparent' }]}>
                                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(249, 115, 22, 0.2)', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Ionicons name="settings-outline" size={20} color={colors.accent} />
                                                </View>
                                            </View>
                                            <View style={styles.stepContent}>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent, marginBottom: 8 }}>Process</Text>
                                                <Text style={{ color: '#fff', lineHeight: 24, fontSize: 15 }}>{ex.process}</Text>
                                            </View>
                                        </View>
                                    ) : null}

                                    {/* Nothing available */}
                                    {!isLocal && !ex.why && !ex.instructions && !ex.process && (
                                        <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: 20 }}>
                                            No detailed instructions available for this exercise.
                                        </Text>
                                    )}
                                </View>
                            );
                        })()
                    )}
                </View>
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View style={[styles.bottomContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity style={[styles.completeButton, { backgroundColor: colors.accent }]} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>{t('markAsComplete')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 48,
    },
    videoContainer: {
        marginHorizontal: 16,
        marginTop: 8,
        aspectRatio: 16 / 9,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#18181b',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -32 }, { translateY: -32 }],
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9D42',
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 24,
        backgroundColor: 'transparent',
    },
    progressBar: {
        height: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressFill: {
        width: '33%',
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF9D42',
    },
    progressThumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginLeft: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    badgeText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    advisoryContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    advisoryBanner: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        alignItems: 'flex-start',
    },
    advisoryTitle: {
        fontSize: 13,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    advisoryText: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
    },
    instructionsSection: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    instructionsTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },
    instructionCard: {
        flexDirection: 'row',
        gap: 16,
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    stepNumber: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9D42',
    },
    stepNumberText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
    },
    stepContent: {
        flex: 1,
        gap: 6,
    },
    stepTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    stepDescription: {
        color: '#71717a',
        fontSize: 14,
        lineHeight: 22,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16,
        borderTopWidth: 1,
    },
    completeButton: {
        height: 44,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9D42',
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    completeButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
