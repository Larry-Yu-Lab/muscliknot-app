import { fetchExercisesByMuscleAndSize } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getExercisesForPosition } from '@/data/exercises';
import { getTranslation } from '@/utils/i18n';
import { saveToHistory } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FindReliefScreen() {
    const router = useRouter();
    const params = useLocalSearchParams(); // { x, y, view, timestamp, size, muscleId }
    const [painLevel, setPainLevel] = useState(6);
    const [isSliderActive, setIsSliderActive] = useState(false);
    const trackWidth = useRef(0);

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

    const [exercises, setExercises] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    console.log('FindReliefScreen Params:', { muscleId, size, y });

    React.useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);

            // Use the new function to fetch by muscleId and size
            const data = await fetchExercisesByMuscleAndSize(muscleId, size);

            if (data && data.length > 0) {
                setExercises(data);
            } else {
                // Fallback to local data if nothing returned
                setExercises(getExercisesForPosition(y, view));
            }
            setIsLoading(false);
        };

        fetchExercises();
    }, [muscleId, size, y, view]);

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
        const key = `mg${name.replace(/\s/g, '')}` as any;
        // Try to find if key exists in current language via getTranslation, 
        // but getTranslation is strict on keys. 
        // For now, let's simplistic check or just display raw name if not mapped.
        // Given complexity, valid keys are: mgNeck, mgShoulders, etc.
        const mappedKey = `mg${name.replace(/\s+/g, '')}`;
        // We can try to fetch it, if it returns key itself (fallback), we show name.
        // Actually getTranslation returns key if missing/fallback. 
        // Let's rely on standard names matching keys carefully.
        // "Neck" -> "mgNeck", "Upper Back" -> "mgUpperBack"
        return t(mappedKey as any) !== mappedKey ? t(mappedKey as any) : name;
    };

    const displayTarget = getMuscleName(targetMuscle);

    const handleComplete = async () => {
        const item = {
            date: Date.now(),
            muscleGroup: targetMuscle,
            exercises: exercises,
        };
        await saveToHistory(item);
        Alert.alert(t('planCompletedTitle'), t('planCompletedMessage'), [
            { text: "OK", onPress: () => router.navigate('/(tabs)') }
        ]);
    };

    const handleSliderTouch = (event: any) => {
        setIsSliderActive(true);
        const touchX = event.nativeEvent.locationX;
        if (trackWidth.current > 0) {
            const percent = touchX / trackWidth.current;
            // Use Math.round with a slight bias to make it feel more "snappy" and sensitive
            const newValue = Math.max(1, Math.min(10, Math.round(percent * 10)));
            setPainLevel(newValue);
        }
    };

    const totalMinutes = exercises.length * 3; // Approx duration

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                scrollEnabled={!isSliderActive}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{displayTarget} {t('relief')}</Text>
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
                    <View style={[styles.badge, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Ionicons name="fitness-outline" size={20} color={colors.accent} />
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
                </View>

                {/* Pain Assessment */}
                <View style={[styles.assessmentCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.assessmentHeader}>
                        <Ionicons name="analytics-outline" size={24} color={colors.accent} />
                        <Text style={[styles.assessmentTitle, { color: colors.text }]}>{t('painAssessment')}</Text>
                    </View>
                    <View style={styles.assessmentContent}>
                        <View style={styles.scaleHeader}>
                            <Text style={styles.scaleLabel}>{t('rateIntensity')}</Text>
                            <View style={styles.scaleBadge}>
                                <Text style={styles.scaleBadgeText}>{t('scale1to10')}</Text>
                            </View>
                        </View>
                        <View style={styles.sliderContainer}>
                            <View
                                style={styles.sliderTrack}
                                hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                                onLayout={(e) => {
                                    trackWidth.current = e.nativeEvent.layout.width;
                                }}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => true}
                                onResponderGrant={handleSliderTouch}
                                onResponderMove={handleSliderTouch}
                                onResponderRelease={() => setIsSliderActive(false)}
                                onResponderTerminate={() => setIsSliderActive(false)}
                            >
                                <View pointerEvents="none" style={[styles.sliderFill, { width: `${painLevel * 10}%` }]} />
                                <View pointerEvents="none" style={[styles.sliderThumb, { left: `${painLevel * 10}%` }]} />
                            </View>
                            <Text style={styles.painNumber}>{painLevel}</Text>
                        </View>
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabel}>{t('mild')}</Text>
                            <Text style={styles.sliderLabel}>{t('moderate')}</Text>
                            <Text style={styles.sliderLabel}>{t('severe')}</Text>
                        </View>
                    </View>
                </View>

                {/* Single Exercise with Detailed Instructions */}
                <View style={styles.instructionsSection}>
                    <Text style={styles.instructionsTitle}>{t('stretchInstructions')}</Text>

                    {isLoading ? (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>Loading...</Text>
                    ) : exercises.length === 0 ? (
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>No exercises found for this area.</Text>
                    ) : (
                        // Display the FIRST matched exercise with detailed instructions
                        (() => {
                            const ex = exercises[0];
                            // Parse instructions into steps (split by newlines or periods)
                            const instructionSteps = ex.instructions
                                ? ex.instructions.split(/\n|(?<=\.)\s+/).filter((s: string) => s.trim().length > 0)
                                : [];

                            return (
                                <View>
                                    {/* Exercise Title Card */}
                                    <View style={[styles.instructionCard, { marginBottom: 16 }]}>
                                        <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                                            <Ionicons name="fitness-outline" size={20} color="#000" />
                                        </View>
                                        <View style={styles.stepContent}>
                                            <Text style={styles.stepTitle}>
                                                {ex.solution_stretch || ex.common_name || 'Relief Exercise'}
                                            </Text>
                                            {ex.common_name && ex.solution_stretch && (
                                                <Text style={[styles.stepDescription, { marginTop: 4 }]}>
                                                    Target: {ex.common_name}
                                                </Text>
                                            )}
                                            {ex.why && (
                                                <Text style={[styles.stepDescription, { marginTop: 8, color: colors.accent, fontWeight: '600' }]}>
                                                    Why: {ex.why}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Step-by-step Instructions */}
                                    {instructionSteps.length > 0 ? (
                                        instructionSteps.map((step: string, index: number) => (
                                            <View key={index} style={styles.instructionCard}>
                                                <View style={styles.stepNumber}>
                                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                                </View>
                                                <View style={styles.stepContent}>
                                                    <Text style={styles.stepDescription}>{step.trim()}</Text>
                                                </View>
                                            </View>
                                        ))
                                    ) : ex.process ? (
                                        // Fallback to process if no instructions
                                        <View style={styles.instructionCard}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>1</Text>
                                            </View>
                                            <View style={styles.stepContent}>
                                                <Text style={styles.stepDescription}>{ex.process}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
                                            No detailed instructions available.
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
        </SafeAreaView>
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
        // Gradient effect simulated
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
        gap: 12,
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    badgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    assessmentCard: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    assessmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },
    assessmentTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    assessmentContent: {
        gap: 20,
    },
    scaleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scaleLabel: {
        color: '#71717a',
        fontSize: 16,
        fontWeight: '500',
    },
    scaleBadge: {
        backgroundColor: 'rgba(255, 107, 0, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 0, 0.2)',
    },
    scaleBadgeText: {
        color: '#FF9D42',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    sliderTrack: {
        flex: 1,
        height: 16,
        backgroundColor: '#27272a',
        borderRadius: 8,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: '#FF9D42',
        borderRadius: 8,
    },
    sliderThumb: {
        position: 'absolute',
        top: -8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 6,
        borderColor: '#FF9D42',
        marginLeft: -16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    painNumber: {
        color: '#FF9D42',
        fontSize: 32,
        fontWeight: '900',
        width: 40,
        textAlign: 'right',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    sliderLabel: {
        color: '#52525b',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 2,
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
