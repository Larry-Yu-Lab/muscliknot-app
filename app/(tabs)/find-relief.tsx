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

// ─── Helpers ───────────────────────────────────────────────────────────────

function parseSteps(instructions: string): { number: string; label: string; content: string }[] {
    const stepRegex = /\*\*STEP\s*(\d+)\s*\(([^)]+)\):\*\*/g;
    const parts = instructions.split(stepRegex);
    const steps: { number: string; label: string; content: string }[] = [];
    for (let i = 1; i < parts.length; i += 3) {
        if (parts[i] && parts[i + 1] && parts[i + 2] !== undefined) {
            steps.push({ number: parts[i], label: parts[i + 1], content: parts[i + 2].trim() });
        }
    }
    return steps;
}

// ─── Exercise Card ─────────────────────────────────────────────────────────

function ExerciseCard({ ex, index, colors, language }: { ex: any; index: number; colors: any; language: any }) {
    const [expanded, setExpanded] = useState(index === 0); // First card expanded by default
    const isLocal = !!ex.title && !ex.solution_stretch;
    const title = ex.solution_stretch || ex.title || ex.common_name || 'Exercise';
    const subtitle = ex.common_name && !isLocal ? ex.common_name : ex.duration;
    const steps = ex.instructions ? parseSteps(ex.instructions) : [];

    return (
        <View style={[cardStyles.card, { backgroundColor: 'rgba(30,30,35,0.95)', borderColor: expanded ? colors.accent : 'rgba(255,255,255,0.08)' }]}>
            {/* Card header — always visible */}
            <TouchableOpacity style={cardStyles.header} onPress={() => setExpanded(v => !v)} activeOpacity={0.7}>
                <View style={[cardStyles.indexBadge, { backgroundColor: colors.accent }]}>
                    <Text style={cardStyles.indexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[cardStyles.title, { color: '#fff' }]}>{title}</Text>
                    {subtitle ? <Text style={[cardStyles.subtitle, { color: 'rgba(255,255,255,0.5)' }]}>{subtitle}</Text> : null}
                </View>
                {ex.difficulty_level && (
                    <View style={[cardStyles.difBadge, {
                        backgroundColor: ex.difficulty_level === 'beginner' ? 'rgba(34,197,94,0.15)' :
                            ex.difficulty_level === 'intermediate' ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)'
                    }]}>
                        <Text style={[cardStyles.difText, {
                            color: ex.difficulty_level === 'beginner' ? '#22c55e' :
                                ex.difficulty_level === 'intermediate' ? '#f97316' : '#ef4444'
                        }]}>{ex.difficulty_level}</Text>
                    </View>
                )}
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>

            {/* Expanded content */}
            {expanded && (
                <View style={cardStyles.body}>
                    {ex.why ? (
                        <View style={cardStyles.section}>
                            <View style={cardStyles.sectionHeader}>
                                <Ionicons name="bulb-outline" size={16} color={colors.accent} />
                                <Text style={[cardStyles.sectionTitle, { color: colors.accent }]}>{getTranslation(language, 'whyThisWorks')}</Text>
                            </View>
                            <Text style={cardStyles.bodyText}>{ex.why}</Text>
                        </View>
                    ) : null}

                    {ex.description && isLocal ? (
                        <View style={cardStyles.section}>
                            <View style={cardStyles.sectionHeader}>
                                <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                                <Text style={[cardStyles.sectionTitle, { color: colors.accent }]}>{getTranslation(language, 'instructions')}</Text>
                            </View>
                            <Text style={cardStyles.bodyText}>{ex.description}</Text>
                        </View>
                    ) : null}

                    {steps.length > 0 ? (
                        <View style={cardStyles.section}>
                            <Text style={[cardStyles.sectionTitle, { color: colors.accent, marginBottom: 10 }]}>{getTranslation(language, 'instructions')}</Text>
                            {steps.map((s, i) => (
                                <View key={i} style={cardStyles.step}>
                                    <View style={[cardStyles.stepNum, { backgroundColor: colors.accent }]}>
                                        <Text style={cardStyles.stepNumText}>{s.number}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={cardStyles.stepLabel}>{s.label}</Text>
                                        <Text style={cardStyles.bodyText}>{s.content}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : ex.instructions && steps.length === 0 ? (
                        <View style={cardStyles.section}>
                            <Text style={[cardStyles.sectionTitle, { color: colors.accent, marginBottom: 6 }]}>{getTranslation(language, 'instructions')}</Text>
                            <Text style={cardStyles.bodyText}>{ex.instructions}</Text>
                        </View>
                    ) : null}

                    {ex.process ? (
                        <View style={[cardStyles.section, cardStyles.processBox]}>
                            <Ionicons name="timer-outline" size={15} color={colors.accent} />
                            <Text style={[cardStyles.bodyText, { flex: 1 }]}>{ex.process}</Text>
                        </View>
                    ) : null}
                </View>
            )}
        </View>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    indexBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indexText: { color: '#000', fontWeight: '800', fontSize: 15 },
    title: { fontSize: 15, fontWeight: '700' },
    subtitle: { fontSize: 12, marginTop: 2 },
    difBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 4 },
    difText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
    body: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
    section: { gap: 6 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    sectionTitle: { fontSize: 13, fontWeight: '700' },
    bodyText: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 22 },
    step: { flexDirection: 'row', gap: 12, marginBottom: 10 },
    stepNum: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    stepNumText: { color: '#000', fontWeight: '800', fontSize: 13 },
    stepLabel: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 2 },
    processBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 12 },
});

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function FindReliefScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    const x = Number(params.x) || 0;
    const y = Number(params.y) || 0;
    const width = Number(params.width) || 40;
    const height = Number(params.height) || 40;
    const view = (params.view as 'Front' | 'Back') || 'Front';
    const size = (params.size as string) || 'medium';
    const muscleId = (params.muscleId as string) || 'unknown';
    const activityType = (params.activityType as string) || 'relief';
    // Sub-location selected in pain-assessment (e.g. 'tailbone', 'kneecap')
    const painLocation = params.assessment_location !== 'unknown' ? (params.assessment_location as string) : undefined;

    const assessment: AssessmentData = {
        activityType,
        painLevel: params.assessment_slider ? Number(params.assessment_slider) : undefined,
        duration: params.assessment_q1 !== 'unknown' ? (params.assessment_q1 as string) : undefined,
        location: painLocation,
        cause: params.assessment_note !== 'unknown' ? (params.assessment_note as string) : undefined,
        q1: params.assessment_q1 !== 'unknown' ? (params.assessment_q1 as string) : undefined,
        q2: params.assessment_q2 !== 'unknown' ? (params.assessment_q2 as string) : undefined,
    };

    const recommendation: RecommendationResult = React.useMemo(
        () => getExerciseRecommendation(assessment),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activityType, assessment.painLevel, assessment.q1, assessment.q2]
    );

    assessment.recommendationCategory = recommendation.category;
    assessment.recommendationAdvisory = recommendation.advisory;

    const [exercises, setExercises] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);

    React.useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);
            const data = await fetchExercisesByMuscleAndSize(
                muscleId,
                size,
                activityType,
                recommendation.difficultyFilter,
                painLocation          // ← Pass 0 sub-location filter
            );
            if (data && data.length > 0) {
                setExercises(data);
            } else {
                setExercises(getExercisesByActivityType(activityType, y, view));
            }
            setIsLoading(false);
        };
        fetchExercises();
    }, [muscleId, size, y, view, activityType, recommendation.difficultyFilter, painLocation]);

    const targetMuscle = React.useMemo(() => {
        if (exercises.length === 0) return muscleId.replace(/_/g, ' ');
        const ex = exercises[0];
        if (ex.muscleGroup) return ex.muscleGroup;
        if (Array.isArray(ex.muscle_id) && ex.muscle_id.length > 0) return ex.muscle_id[0].replace(/_/g, ' ');
        if (typeof ex.muscle_id === 'string') return ex.muscle_id.replace(/_/g, ' ');
        return muscleId.replace(/_/g, ' ');
    }, [exercises, muscleId]);

    const targetMuscleTrans = React.useMemo(() => {
        if (targetMuscle === 'fullBody') return t('fullBody');
        const mgKey = `mg${targetMuscle.charAt(0).toUpperCase()}${targetMuscle.slice(1).replace(/\s/g, '')}` as any;
        const trans = t(mgKey);
        return trans !== mgKey ? trans : targetMuscle;
    }, [targetMuscle, t]);

    const locationLabel = painLocation ? painLocation.replace(/_/g, ' ') : null;
    const titleLine = React.useMemo(() => {
        const target = locationLabel
            ? locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1)
            : targetMuscleTrans;

        const patternKey = `title${activityType.charAt(0).toUpperCase()}${activityType.slice(1)}` as any;
        const pattern = t(patternKey);

        if (pattern && pattern.includes('{{muscle}}')) {
            return pattern.replace('{{muscle}}', target);
        }
        return `${target} ${activityType}`;
    }, [locationLabel, targetMuscleTrans, activityType, t]);

    const handleComplete = async () => {
        const item = { date: Date.now(), muscleGroup: targetMuscle, exercises, assessment };
        await saveToHistory(item);
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
            { text: 'OK', onPress: () => router.navigate('/(tabs)') }
        ]);
    };

    const totalMinutes = exercises.length * 4;

    const renderAdvisoryBanner = () => {
        if (!recommendation.advisory) return null;
        return (
            <View style={[styles.advisoryBanner, { borderColor: recommendation.accentColor, backgroundColor: `${recommendation.accentColor}18` }]}>
                <Ionicons
                    name={recommendation.showRestWarning ? 'warning-outline' : 'information-circle-outline'}
                    size={20} color={recommendation.accentColor} style={{ marginTop: 2 }}
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{titleLine}</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Video placeholder */}
                <View style={styles.videoContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQvExJHNf-gPBvV9mafHYX_QH4RDM2a10DReFfan-2uta-tGIgoYLy2YcqV88Fw966WlK2bhvku-3_4e5f88wGpuO0qaD_Yr1qPxSQtigGhxM0Sq6uOtWbw-JV0RDp_0RmODacO147g0dvAY693HSe3XPVdm2eTzs6ER9VAKERpdSDpdD1MgVcJ8HJCDesjsxF-hhw0aRZc-sY0sB3sHox58BbJ7vYjkyyLq8KDnpbu4x0PolLYeNnsL3Q3fcRFHU5BkgY0KWaZ8NP' }}
                        style={styles.videoThumbnail} contentFit="cover"
                    />
                    <View style={styles.videoOverlay} />
                    <TouchableOpacity style={styles.playButton}>
                        <Ionicons name="play" size={32} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Info badges */}
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: colors.cardBackground, borderColor: recommendation.advisory ? recommendation.accentColor : colors.cardBorder }]}>
                        <Ionicons name="fitness-outline" size={18} color={recommendation.advisory ? recommendation.accentColor : colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.text }]}>
                            {isLoading ? '…' : `${exercises.length} ${t(exercises.length === 1 ? 'shortRelief' : 'shortRelief')}`}
                        </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Ionicons name="timer-outline" size={18} color={colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.text }]}>~{totalMinutes} min</Text>
                    </View>
                    {!isLoading && (
                        <View style={[styles.badge, { backgroundColor: `${recommendation.accentColor}18`, borderColor: recommendation.accentColor }]}>
                            <Ionicons name="shield-checkmark-outline" size={18} color={recommendation.accentColor} />
                            <Text style={[styles.badgeText, { color: recommendation.accentColor }]}>
                                {categoryLabel(recommendation.category)}
                            </Text>
                        </View>
                    )}
                    {locationLabel && (
                        <View style={[styles.badge, { backgroundColor: 'rgba(99,102,241,0.12)', borderColor: '#6366f1' }]}>
                            <Ionicons name="location-outline" size={18} color="#6366f1" />
                            <Text style={[styles.badgeText, { color: '#6366f1' }]}>{locationLabel}</Text>
                        </View>
                    )}
                </View>

                {/* Advisory banner */}
                <View style={styles.advisoryContainer}>
                    {renderAdvisoryBanner()}
                </View>

                {/* Exercise list */}
                <View style={styles.exerciseSection}>
                    <Text style={[styles.sectionTitle, { color: '#fff' }]}>
                        {isLoading ? (t('loadingRelief') || 'Loading...') :
                            activityType === 'warmup' ? (t('warmUpTitle') || 'Warm-up Exercises') :
                                activityType === 'yoga' ? (t('yogaTitle') || 'Yoga Poses') :
                                    activityType === 'posture' ? (t('fixPostureTitle') || 'Posture Corrections') :
                                        activityType === 'strength' ? (t('strengthenTitle') || 'Strengthening Exercises') :
                                            `${locationLabel ? locationLabel.charAt(0).toUpperCase() + locationLabel.slice(1) + ' ' : ''}${t('relief')}`}
                    </Text>

                    {isLoading ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>{t('loadingRelief') || 'Loading…'}</Text>
                    ) : exercises.length === 0 ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>
                            {t('noRelief') || 'No exercises found for this area. Try a different selection.'}
                        </Text>
                    ) : (
                        <View>
                            {/* Show only the first exercise initially */}
                            <ExerciseCard ex={exercises[0]} index={0} colors={colors} language={language} />

                            {/* Show more button if there are more exercises */}
                            {exercises.length > 1 && !showMore && (
                                <TouchableOpacity
                                    style={[styles.moreButton, { borderColor: colors.accent }]}
                                    onPress={() => setShowMore(true)}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
                                    <Text style={[styles.moreButtonText, { color: colors.accent }]}>
                                        {t('moreStretches')} ({exercises.length - 1} {t('similarStretches')})
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Remaining exercises */}
                            {showMore && exercises.slice(1).map((ex, i) => (
                                <ExerciseCard key={ex.id ?? i + 1} ex={ex} index={i + 1} colors={colors} language={language} />
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky complete button */}
            <View style={[styles.bottomBar, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.accent }]} onPress={handleComplete}>
                    <Text style={styles.completeBtnText}>{t('markAsComplete')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 110 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12,
    },
    backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
    headerSpacer: { width: 44 },
    videoContainer: {
        marginHorizontal: 16, marginTop: 8, aspectRatio: 16 / 9,
        borderRadius: 16, overflow: 'hidden', backgroundColor: '#18181b',
        position: 'relative',
    },
    videoThumbnail: { width: '100%', height: '100%' },
    videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    playButton: {
        position: 'absolute', top: '50%', left: '50%',
        transform: [{ translateX: -28 }, { translateY: -28 }],
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF9D42',
    },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginTop: 14 },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 11, borderWidth: 1,
    },
    badgeText: { fontSize: 13, fontWeight: '700' },
    advisoryContainer: { paddingHorizontal: 16, marginTop: 10 },
    advisoryBanner: {
        flexDirection: 'row', gap: 12, padding: 14,
        borderRadius: 13, borderWidth: 1.5, alignItems: 'flex-start',
    },
    advisoryTitle: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 3 },
    advisoryText: { fontSize: 13, lineHeight: 19, fontWeight: '500' },
    exerciseSection: { paddingHorizontal: 16, marginTop: 18 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, borderTopWidth: 1,
    },
    completeBtn: {
        height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    },
    completeBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
    moreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginTop: 4,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    moreButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
