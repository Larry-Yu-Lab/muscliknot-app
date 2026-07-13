import { fetchExercisesByMuscleAndSize } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getExercisesByActivityType, EXERCISES } from '@/data/exercises';
import { getTranslation } from '@/utils/i18n';
import { saveToHistory } from '@/utils/storage';
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

// ─── Exercise Card ─────────────────────────────────────────────────────────

function ExerciseCard({ ex, index, colors, language, expanded, onExpand }: { ex: any; index: number; colors: any; language: any; expanded: boolean; onExpand: () => void }) {
    const router = useRouter();
    const isLocal = !!ex.title && !ex.solution_stretch;
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const title = ex.solution_stretch || ex.title || ex.common_name || 'Exercise';
    const subtitle = ex.common_name && !isLocal ? ex.common_name : ex.duration;
    const steps = ex.instructions ? parseSteps(ex.instructions) : [];

    const transTitleKey = `ex_${ex.id}_title` as any;
    const transDescKey = `ex_${ex.id}_desc` as any;
    
    const translatedTitle = t(transTitleKey);
    const translatedDesc = t(transDescKey);

    const displayTitle = translatedTitle !== transTitleKey ? translatedTitle : title;
    const displayDescription = translatedDesc !== transDescKey ? translatedDesc : (ex.description || ex.instructions);
    
    const accentColor = '#06b6d4'; // Cyan for Posture

    return (
        <View style={[cardStyles.card, { backgroundColor: 'rgba(30,30,35,0.95)', borderColor: expanded ? accentColor : 'rgba(255,255,255,0.08)' }]}>
            <TouchableOpacity style={cardStyles.header} onPress={onExpand} activeOpacity={0.7}>
                <View style={[cardStyles.indexBadge, { backgroundColor: accentColor }]}>
                    <Text style={cardStyles.indexText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[cardStyles.title, { color: '#fff' }]}>{displayTitle}</Text>
                    {subtitle ? <Text style={[cardStyles.subtitle, { color: 'rgba(255,255,255,0.5)' }]}>{subtitle}</Text> : null}
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>

            {expanded && (
                <View style={cardStyles.body}>
                    {steps.length > 0 ? (
                        <View style={cardStyles.section}>
                            <Text style={[cardStyles.sectionTitle, { color: accentColor, marginBottom: 10 }]}>{t('instructions')}</Text>
                            {steps.map((s, i) => (
                                <View key={i} style={cardStyles.step}>
                                    <View style={[cardStyles.stepNum, { backgroundColor: accentColor }]}>
                                        <Text style={cardStyles.stepNumText}>{s.number}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={cardStyles.stepLabel}>{s.label}</Text>
                                        <Text style={cardStyles.bodyText}>{s.content}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={cardStyles.section}>
                            <Text style={[cardStyles.sectionTitle, { color: accentColor, marginBottom: 6 }]}>{t('instructions')}</Text>
                            <Text style={cardStyles.bodyText}>{displayDescription}</Text>
                        </View>
                    )}

                    {/* Play demo full screen button */}
                    <TouchableOpacity
                        style={[cardStyles.videoButton, { backgroundColor: colors.accent || accentColor }]}
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
                                    why: ex.why || '',
                                    process: ex.process || '',
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
    card: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
    indexBadge: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    indexText: { color: '#000', fontWeight: '800', fontSize: 15 },
    title: { fontSize: 15, fontWeight: '700' },
    subtitle: { fontSize: 12, marginTop: 2 },
    body: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
    section: { gap: 6 },
    sectionTitle: { fontSize: 13, fontWeight: '700' },
    bodyText: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 22 },
    step: { flexDirection: 'row', gap: 12, marginBottom: 10 },
    stepNum: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    stepNumText: { color: '#000', fontWeight: '800', fontSize: 13 },
    stepLabel: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 2 },
    videoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, marginTop: 12 },
    videoButtonText: { color: '#000', fontWeight: '700', fontSize: 13 },
});

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function FixPostureScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { width: windowWidth } = Dimensions.get('window');
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];
    const accentColor = '#06b6d4';

    const muscleId = (params.muscleId as string) || 'unknown';
    const size = (params.size as string) || 'medium';
    const activityType = 'posture';

    const [exercises, setExercises] = useState<any[]>([]);
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(1);

    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    React.useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);
            try {
                const data = await fetchExercisesByMuscleAndSize(muscleId, size, activityType);
                if (data && data.length > 0) {
                    setExercises(data);
                } else {
                    const fallbackData = getExercisesByActivityType(activityType, 500, 'Front');
                    setExercises(fallbackData.slice(0, 3));
                }
            } catch (error) {
                const fallbackData = getExercisesByActivityType(activityType, 500, 'Front');
                setExercises(fallbackData.slice(0, 3));
            } finally {
                setIsLoading(false);
            }
        };
        fetchExercises();
    }, [muscleId, size]);

    const getBestVideoUrl = () => {
        if (!exercises || exercises.length === 0) return null;
        const activeEx = exercises[activeVideoIndex] || exercises[0];
        let url = activeEx.video_url;
        if (!url) {
            const firstTitle = activeEx.solution_stretch || activeEx.title || activeEx.common_name || '';
            const match = EXERCISES.find(e => 
                (activeEx.id && e.id === activeEx.id) || 
                (firstTitle && e.title.toLowerCase() === firstTitle.toLowerCase())
            );
            if (match && match.video_url) url = match.video_url;
            else {
                const backupMatch = EXERCISES.find(e => e.video_url && e.category === 'Posture');
                url = backupMatch ? backupMatch.video_url : 'https://youtube.com/watch?v=1UU4VvklQ44';
            }
        }
        return url;
    };

    const bestUrl = getBestVideoUrl();
    const videoId = bestUrl ? extractYoutubeId(bestUrl) : null;

    const buttonScale = useSharedValue(1);
    const successAnim = useSharedValue(0);

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
        backgroundColor: interpolateColor(successAnim.value, [0, 1], [accentColor, '#22c55e'])
    }));

    const handleComplete = async () => {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        buttonScale.value = withSequence(withSpring(0.95), withSpring(1.05), withSpring(1));
        successAnim.value = withTiming(1, { duration: 400 });

        await saveToHistory({ date: Date.now(), muscleGroup: muscleId, exercises, assessment: { activityType } });
        
        setTimeout(() => {
            Alert.alert(t('planCompletedTitle'), t('planCompletedMessage'), [
                { text: 'OK', onPress: () => router.navigate('/(tabs)') }
            ]);
        }, 600);
    };

    const targetMuscleTrans = React.useMemo(() => {
        const locKey = `loc${muscleId.charAt(0).toUpperCase()}${muscleId.slice(1).replace(/_/g, '')}` as any;
        const trans = t(locKey);
        return trans !== locKey ? trans : muscleId;
    }, [muscleId, t]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('fixPostureTitle')} ({targetMuscleTrans})</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {videoId && !isLoading ? (
                    <View style={styles.videoContainer}>
                        <YoutubePlayer height={windowWidth * (9/16)} width="100%" play={false} videoId={videoId} />
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

                <View style={styles.exerciseSection}>
                    <Text style={[styles.sectionTitle, { color: '#fff' }]}>{t('fixPostureTitle')}</Text>
                    {isLoading ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>{t('loadingPosture') || 'Loading…'}</Text>
                    ) : exercises.length === 0 ? (
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: 24 }}>{t('noPosture') || 'No exercises found.'}</Text>
                    ) : (
                        <View>
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
                            {visibleCount < exercises.length && (
                                <TouchableOpacity
                                    style={[styles.moreButton, { borderColor: accentColor }]}
                                    onPress={() => setVisibleCount(v => v + 1)}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color={accentColor} />
                                    <Text style={[styles.moreButtonText, { color: accentColor }]}>
                                        {t('moreStretches')} ({exercises.length - visibleCount} {t('similarStretches')})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <Animated.View style={[{ flex: 1 }, animatedButtonStyle, { borderRadius: 12 }]}>
                    <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                        <Text style={styles.completeBtnText}>{t('markAsComplete')}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 110 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
    backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
    headerSpacer: { width: 44 },
    videoContainer: { marginHorizontal: 16, marginTop: 8, aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden', backgroundColor: '#18181b', position: 'relative' },
    videoThumbnail: { width: '100%', height: '100%' },
    videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    playButton: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -28 }, { translateY: -28 }], width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FACC15' },
    exerciseSection: { paddingHorizontal: 16, marginTop: 18 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, borderTopWidth: 1, flexDirection: 'row' },
    completeBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: '100%' },
    completeBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
    moreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', marginTop: 4, backgroundColor: 'rgba(255,255,255,0.02)' },
    moreButtonText: { fontSize: 14, fontWeight: '700' },
});
