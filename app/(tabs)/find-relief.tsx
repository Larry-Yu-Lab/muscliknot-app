import { fetchExercisesByMuscleAndSize } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getExercisesByActivityType, EXERCISES, Exercise } from '@/data/exercises';
import { categoryLabelKey, getExerciseRecommendation, RecommendationResult } from '@/utils/assessmentEngine';
import { getTranslation, formatLabel } from '@/utils/i18n';
import { AssessmentData, savePainSession, saveToHistory } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

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

function translateProcessDetails(text: string, t: any) {
    if (!text) return text;
    const labels = ['duration', 'repetition', 'intensity', 'frequency', 'cue'];
    let result = text;
    labels.forEach(l => {
        const key = `${l}Label` as any;
        const trans = t(key);
        if (trans !== key) {
            const regex = new RegExp(`${l.toUpperCase()}:`, 'g');
            result = result.replace(regex, trans + ':');
        }
    });
    return result;
}

// ─── Exercise Card ─────────────────────────────────────────────────────────

function ExerciseCard({ ex, index, colors, language, expanded, onExpand }: { ex: any; index: number; colors: any; language: any; expanded: boolean; onExpand: () => void }) {
    const router = useRouter();
    const isLocal = !!ex.title && !ex.solution_stretch;
    const title = ex.solution_stretch || ex.title || ex.common_name || 'Exercise';
    const subtitle = ex.common_name && !isLocal ? ex.common_name : ex.duration;
    const steps = ex.instructions ? parseSteps(ex.instructions) : [];

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    // Attempt to translate title and subtitle
    const transTitleKey = `ex_${ex.id}_title` as any;
    const transDescKey = `ex_${ex.id}_desc` as any;
    const transWhyKey = `ex_${ex.id}_why` as any;
    const transProcessKey = `ex_${ex.id}_process` as any;

    const translatedTitle = t(transTitleKey);
    const translatedDesc = t(transDescKey);
    const translatedWhy = t(transWhyKey);
    const translatedProcess = t(transProcessKey);

    const displayTitle = translatedTitle !== transTitleKey ? translatedTitle : (ex.solution_stretch || ex.title || ex.common_name || 'Exercise');
    const displaySubtitle = ex.common_name && !isLocal ? ex.common_name : ex.duration;
    const displayDescription = translatedDesc !== transDescKey ? translatedDesc : (ex.description || ex.instructions);
    const displayWhy = translatedWhy !== transWhyKey ? translatedWhy : ex.why;

    // Use translated process if available, otherwise try dynamic label translation
    const rawProcess = ex.process || '';
    const displayProcess = translatedProcess !== transProcessKey
        ? translatedProcess
        : translateProcessDetails(rawProcess, t);

    return (
        <View style={[cardStyles.card, { backgroundColor: 'rgba(30,30,35,0.95)', borderColor: expanded ? colors.accent : 'rgba(255,255,255,0.08)' }]}>
            {/* Card header — always visible */}
            <TouchableOpacity style={cardStyles.header} onPress={onExpand} activeOpacity={0.7}>
                <View style={[cardStyles.indexBadge, { backgroundColor: colors.accent }]}>
                    <Text style={cardStyles.indexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[cardStyles.title, { color: '#fff' }]}>{displayTitle}</Text>
                    {displaySubtitle ? <Text style={[cardStyles.subtitle, { color: 'rgba(255,255,255,0.5)' }]}>{displaySubtitle}</Text> : null}
                </View>
                {ex.difficulty_level && (() => {
                    const diffColor = ex.difficulty_level === 'beginner' ? '#22c55e' : ex.difficulty_level === 'intermediate' ? '#f59e0b' : '#ef4444';
                    return (
                        <View style={[cardStyles.difBadge, { backgroundColor: diffColor + '20' }]}>
                            <Text style={[cardStyles.difText, { color: diffColor }]}>{(() => {
                                const diffKey = `opt${ex.difficulty_level.charAt(0).toUpperCase()}${ex.difficulty_level.slice(1)}` as any;
                                const trans = t(diffKey);
                                return trans !== diffKey ? trans : formatLabel(ex.difficulty_level);
                            })()}</Text>
                        </View>
                    );
                })()}
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
                            <Text style={cardStyles.bodyText}>{displayWhy}</Text>
                        </View>
                    ) : null}

                    {ex.description && isLocal ? (
                        <View style={cardStyles.section}>
                            <View style={cardStyles.sectionHeader}>
                                <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                                <Text style={[cardStyles.sectionTitle, { color: colors.accent }]}>{getTranslation(language, 'instructions')}</Text>
                            </View>
                            <Text style={cardStyles.bodyText}>{displayDescription}</Text>
                        </View>
                    ) : null}

                    {steps.length > 0 ? (
                        <View style={cardStyles.section}>
                            <Text style={[cardStyles.sectionTitle, { color: colors.accent, marginBottom: 10 }]}>{getTranslation(language, 'instructions')}</Text>
                            {steps.map((s, i) => {
                                const labelKey = s.label.toUpperCase() as any;
                                const translatedLabel = t(labelKey);
                                const displayLabel = translatedLabel !== labelKey ? translatedLabel : s.label;

                                const stepContentKey = `ex_${ex.id}_step_${s.number}_content` as any;
                                const translatedStepContent = t(stepContentKey);
                                const displayStepContent = translatedStepContent !== stepContentKey ? translatedStepContent : s.content;

                                return (
                                    <View key={i} style={cardStyles.step}>
                                        <View style={[cardStyles.stepNum, { backgroundColor: colors.accent }]}>
                                            <Text style={cardStyles.stepNumText}>{s.number}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={cardStyles.stepLabel}>{displayLabel}</Text>
                                            <Text style={cardStyles.bodyText}>{displayStepContent}</Text>
                                        </View>
                                    </View>
                                );
                            })}
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
                            <Text style={[cardStyles.bodyText, { flex: 1 }]}>{displayProcess}</Text>
                        </View>
                    ) : null}

                    {/* Play demo full screen button */}
                    <TouchableOpacity
                        style={[cardStyles.videoButton, { backgroundColor: colors.accent }]}
                        onPress={() => {
                            const extractYoutubeId = (u?: string) => {
                                if (!u) return null;
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                const m = u.match(regExp);
                                return (m && m[2].length === 11) ? m[2] : null;
                            };
                            const rawVideoUrl = ex.video_url || EXERCISES.find(e => e.title === title || e.id === ex.id)?.video_url;
                            const vidId = rawVideoUrl ? extractYoutubeId(rawVideoUrl) : null;
                            const image = vidId ? `https://img.youtube.com/vi/${vidId}/0.jpg` : 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400';
                            
                            router.push({
                                pathname: `/exercise/${ex.id || Math.random().toString()}` as any,
                                params: {
                                    id: ex.id,
                                    title: displayTitle,
                                    duration: ex.duration || '3-5 MINS',
                                    target: ex.common_name || ex.muscleGroup || 'General',
                                    image,
                                    why: displayWhy,
                                    process: displayProcess,
                                    instructions: ex.instructions || ex.description,
                                    muscleGroup: ex.muscleGroup || 'General',
                                    video_url: rawVideoUrl ? encodeURIComponent(rawVideoUrl) : undefined
                                }
                            });
                        }}
                    >
                        <Ionicons name="play-outline" size={18} color="#000" style={{ marginRight: 6 }} />
                        <Text style={cardStyles.videoButtonText}>{t('watchVideo' as any) || 'Watch Video Demo'}</Text>
                    </TouchableOpacity>
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
    videoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, marginTop: 12 },
    videoButtonText: { color: '#000', fontWeight: '700', fontSize: 13 },
});

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function FindReliefScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { width: windowWidth } = Dimensions.get('window');

    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const { language, theme } = usePreferences();
    const { user } = useUser();
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
        () => getExerciseRecommendation(assessment, user.attributes.fitnessLevel),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activityType, assessment.painLevel, assessment.q1, assessment.q2, user.attributes.fitnessLevel]
    );

    assessment.recommendationCategory = recommendation.category;
    assessment.recommendationAdvisory = recommendation.advisory;

    const [exercises, setExercises] = useState<any[]>([]);
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(1);

    React.useEffect(() => {
        setVisibleCount(1); // Reset "visibleCount" whenever parameters change
        const fetchExercises = async () => {
            setIsLoading(true);
            try {
                const data = await fetchExercisesByMuscleAndSize(
                    muscleId,
                    size,
                    activityType,
                    recommendation.difficultyFilter,
                    painLocation,
                    assessment.duration
                );
                if (data && data.length > 0) {
                    setExercises(data);
                } else {
                    // Load fallback based on activityType
                    const fallbackData = getExercisesByActivityType(activityType, y, view);
                    setExercises(fallbackData.slice(0, 3));
                }
            } catch (error) {
                console.log(error);
                const fallbackData = getExercisesByActivityType(activityType, y, view);
                setExercises(fallbackData.slice(0, 3));
            } finally {
                setIsLoading(false);
            }
            setIsLoading(false);
        };
        fetchExercises();
    }, [muscleId, size, y, view, activityType, recommendation.difficultyFilter, painLocation]);

    const targetMuscle = React.useMemo(() => {
        if (exercises.length === 0) return formatLabel(muscleId);
        const ex = exercises[0];
        if (ex.muscleGroup) return formatLabel(ex.muscleGroup);
        if (Array.isArray(ex.muscle_id) && ex.muscle_id.length > 0) return formatLabel(ex.muscle_id[0]);
        if (typeof ex.muscle_id === 'string') return formatLabel(ex.muscle_id);
        return formatLabel(muscleId);
    }, [exercises, muscleId]);

    const targetMuscleTrans = React.useMemo(() => {
        if (targetMuscle === 'fullBody') return t('fullBody');
        const mgKey = `mg${targetMuscle.charAt(0).toUpperCase()}${targetMuscle.slice(1).replace(/\s/g, '')}` as any;
        const trans = t(mgKey);
        return trans !== mgKey ? trans : targetMuscle;
    }, [targetMuscle, t]);

    const targetLocationTrans = React.useMemo(() => {
        if (!painLocation) return null;
        const locKey = `loc${painLocation.charAt(0).toUpperCase()}${painLocation.slice(1).replace(/_/g, '')}` as any;
        const trans = t(locKey);
        return trans !== locKey ? trans : painLocation.replace(/_/g, ' ');
    }, [painLocation, t]);

    const titleLine = React.useMemo(() => {
        const target = targetLocationTrans || targetMuscleTrans;

        const patternKey = `title${activityType.charAt(0).toUpperCase()}${activityType.slice(1)}` as any;
        const pattern = t(patternKey);

        if (pattern && pattern.includes('{{muscle}}')) {
            return pattern.replace('{{muscle}}', target);
        }
        return `${target} ${activityType}`;
    }, [targetLocationTrans, targetMuscleTrans, activityType, t]);

    const buttonScale = useSharedValue(1);
    const successAnim = useSharedValue(0);

    const animatedButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
            backgroundColor: interpolateColor(
                successAnim.value,
                [0, 1],
                [colors.accent, '#22c55e']
            )
        };
    });

    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    const handleComplete = async () => {
        // Haptic Feedback
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Animation Sequence
        buttonScale.value = withSequence(
            withSpring(0.95),
            withSpring(1.05),
            withSpring(1)
        );
        successAnim.value = withTiming(1, { duration: 400 });

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

        // Delay alert slightly to let animation finish
        setTimeout(() => {
            Alert.alert(t('planCompletedTitle'), t('planCompletedMessage'), [
                { text: 'OK', onPress: () => router.navigate('/(tabs)') }
            ]);
        }, 600);
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
                        {t(categoryLabelKey(recommendation.category) as any)}
                    </Text>
                    <Text style={[styles.advisoryText, { color: recommendation.accentColor }]}>
                        {t(recommendation.advisory as any)}
                    </Text>
                </View>
            </View>
        );
    };

    const mapToLocalMuscleGroup = (mId?: string): string => {
        if (!mId) return 'General';
        const mid = mId.toLowerCase();
        if (mid === 'neck' || mid === 'head') return 'Neck';
        if (mid === 'traps' || mid === 'shoulders') return 'Shoulders';
        if (mid === 'upper_back') return 'Upper Back';
        if (mid === 'lower_back') return 'Lower Back';
        if (mid === 'glutes') return 'Glutes';
        if (mid === 'thighs' || mid === 'knees' || mid === 'legs') return 'Legs';
        if (mid === 'hips') return 'Hips';
        if (mid === 'abdomen' || mid === 'chest') return 'Abdomen';
        if (mid === 'calves') return 'Calves';
        if (mid === 'ankles' || mid === 'feet') return 'Feet';
        return 'General';
    };

    const getBestVideoUrl = () => {
        if (!exercises || exercises.length === 0) return null;
        const activeEx = exercises[activeVideoIndex] || exercises[0];
        let url = activeEx.video_url;
        if (!url) {
            const firstTitle = activeEx.solution_stretch || activeEx.title || activeEx.common_name || '';
            const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanTarget = cleanStr(firstTitle);

            // 1. Fuzzy match by exact title inclusion
            let match = EXERCISES.find(e => {
                if (!e.video_url) return false;
                const cleanLocal = cleanStr(e.title);
                return cleanLocal.includes(cleanTarget) || cleanTarget.includes(cleanLocal);
            });

            if (match && match.video_url) {
                url = match.video_url;
            } else {
                // 2. Keyword overlap match
                const localMG = mapToLocalMuscleGroup(activeEx.muscleGroup || muscleId);
                const targetWords = firstTitle.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .split(/\s+/)
                    .filter((w: string) => w.length > 2 && w !== 'stretch' && w !== 'release' && w !== 'exercise' && w !== 'pose');

                let bestScore = 0;
                let bestMatch: Exercise | null = null;

                for (const e of EXERCISES) {
                    if (!e.video_url) continue;
                    if (e.muscleGroup.toLowerCase() !== localMG.toLowerCase()) continue;

                    const localTitleLower = e.title.toLowerCase();
                    const localWords = localTitleLower.split(/\s+/);
                    let score = 0;

                    for (const w of targetWords) {
                        if (localWords.includes(w) || localTitleLower.includes(w)) {
                            score += 1;
                        }
                    }

                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = e;
                    }
                }

                if (bestMatch && bestScore > 0) {
                    url = bestMatch.video_url;
                } else {
                    // 3. Muscle-specific fallback
                    const fallbackMatch = EXERCISES.find(e => 
                        e.video_url && 
                        e.muscleGroup.toLowerCase() === localMG.toLowerCase()
                    ) || EXERCISES.find(e => e.video_url);
                    url = fallbackMatch ? fallbackMatch.video_url : 'https://youtube.com/watch?v=WjMwXDgdgwI';
                }
            }
        }
        return url;
    };

    const bestUrl = getBestVideoUrl();
    const videoId = bestUrl ? extractYoutubeId(bestUrl) : null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('recommendedRoutine')}</Text>
                        <Text style={styles.headerSubtitle}>
                            {(() => {
                                const mgKey = `mg${targetMuscle.replace(/\s/g, '').replace(/_/g, '')}` as any;
                                const transMg = t(mgKey);
                                const muscleName = transMg !== mgKey ? transMg : formatLabel(targetMuscle);

                                if (painLocation && painLocation !== 'unknown') {
                                    const locKey = `loc${painLocation.charAt(0).toUpperCase()}${painLocation.slice(1)}` as any;
                                    const transLoc = t(locKey);
                                    const locName = transLoc !== locKey ? transLoc : formatLabel(painLocation);
                                    return `${muscleName} • ${locName}`;
                                }
                                return muscleName;
                            })()}
                        </Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Video Component */}
                {videoId && !isLoading ? (
                    <View style={styles.videoContainer}>
                        <YoutubePlayer
                            height={windowWidth * (9/16)}
                            width="100%"
                            play={false}
                            videoId={videoId}
                        />
                    </View>
                ) : (
                    <View style={styles.videoContainer}>
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQvExJHNf-gPBvV9mafHYX_QH4RDM2a10DReFfan-2uta-tGIgoYLy2YcqV88Fw966WlK2bhvku-3_4e5f88wGpuO0qaD_Yr1qPxSQtigGhxM0Sq6uOtWbw-JV0RDp_0RmODacO147g0dvAY693HSe3XPVdm2eTzs6ER9VAKERpdSDpdD1MgVcJ8HJCDesjsxF-hhw0aRZc-sY0sB3sHox58BbJ7vYjkyyLq8KDnpbu4x0PolLYeNnsL3Q3fcRFHU5BkgY0KWaZ8NP' }}
                            style={styles.videoThumbnail} contentFit="cover"
                        />
                        <View style={styles.videoOverlay} />
                        <TouchableOpacity style={styles.playButton} onPress={() => {}}>
                            <Ionicons name="play" size={32} color="#000" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Info badges */}
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: colors.cardBackground, borderColor: recommendation.advisory ? recommendation.accentColor : colors.cardBorder }]}>
                        <Ionicons name="fitness-outline" size={18} color={recommendation.advisory ? recommendation.accentColor : colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.text }]}>
                            {isLoading ? '…' : `${exercises.length} ${t(exercises.length === 1 ? 'exercisesSingle' : 'exercisesCount').replace('${count}', '')}`}
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
                                {t(categoryLabelKey(recommendation.category) as any)}
                            </Text>
                        </View>
                    )}
                    {targetLocationTrans && (
                        <View style={[styles.badge, { backgroundColor: 'rgba(99,102,241,0.12)', borderColor: '#6366f1' }]}>
                            <Ionicons name="location-outline" size={18} color="#6366f1" />
                            <Text style={[styles.badgeText, { color: '#6366f1' }]}>
                                {targetLocationTrans}
                            </Text>
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
                                            `${targetLocationTrans || targetMuscleTrans} ${t('relief')}`}
                    </Text>

                    {isLoading ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>{t('loadingRelief') || 'Loading…'}</Text>
                    ) : exercises.length === 0 ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>
                            {t('noRelief') || 'No exercises found for this area. Try a different selection.'}
                        </Text>
                    ) : (
                        <View>
                            {/* Show exercises incrementally */}
                             {exercises.slice(0, visibleCount).map((ex, i) => (
                                <ExerciseCard
                                    key={ex.id ?? i}
                                    ex={ex}
                                    index={i}
                                    colors={colors}
                                    language={language}
                                    expanded={expandedIndex === i}
                                    onExpand={() => {
                                        setExpandedIndex(expandedIndex === i ? -1 : i);
                                        setActiveVideoIndex(i);
                                    }}
                                />
                            ))}

                            {/* Show more button if there are more exercises */}
                            {visibleCount < exercises.length && (
                                <TouchableOpacity
                                    style={[styles.moreButton, { borderColor: colors.accent }]}
                                    onPress={() => setVisibleCount(v => v + 1)}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
                                    <Text style={[styles.moreButtonText, { color: colors.accent }]}>
                                        {t('moreStretches')} ({exercises.length - visibleCount} {t('similarStretches')})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky complete button */}
            <View style={[styles.bottomBar, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <View style={styles.bottomBarButtons}>
                    <TouchableOpacity
                        style={[styles.guidedBtn, { borderColor: colors.accent }]}
                        onPress={() => {
                            router.push({
                                pathname: '/guided-session' as any,
                                params: {
                                    exercises: JSON.stringify(exercises),
                                    muscleGroup: targetMuscle,
                                    activityType,
                                },
                            });
                        }}
                    >
                        <Ionicons name="play-circle-outline" size={20} color={colors.accent} />
                        <Text style={[styles.guidedBtnText, { color: colors.accent }]}>{t('guidedMode' as any) || 'Guided'}</Text>
                    </TouchableOpacity>
                    <AnimatedTouchableOpacity
                        style={[styles.completeBtn, { flex: 1 }, animatedButtonStyle]}
                        onPress={handleComplete}
                    >
                        <Text style={styles.completeBtnText}>{t('markAsComplete')}</Text>
                    </AnimatedTouchableOpacity>
                </View>
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
    headerTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
    headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 2 },
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
    bottomBarButtons: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    guidedBtn: {
        height: 48, borderRadius: 12, borderWidth: 1.5,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingHorizontal: 16,
    },
    guidedBtnText: { fontSize: 14, fontWeight: '800' },
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
