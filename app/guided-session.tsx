import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { saveToHistory, savePainSession } from '@/utils/storage';
import { isHealthKitAvailable, syncSessionToHealthKit } from '@/utils/healthKit';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolateColor,
    runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Countdown Circle ──────────────────────────────────────────────────────

function CountdownCircle({
    progress,
    timeLeft,
    size = 160,
    strokeWidth = 8,
    color,
}: {
    progress: number;
    timeLeft: number;
    size?: number;
    strokeWidth?: number;
    color: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <Text style={styles.timerText}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
        </View>
    );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function GuidedSessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    // Parse exercises from params
    const exercises = params.exercises ? JSON.parse(params.exercises as string) : [];
    const muscleGroup = (params.muscleGroup as string) || 'unknown';
    const activityType = (params.activityType as string) || 'relief';

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [totalElapsed, setTotalElapsed] = useState(0);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentExercise = exercises[currentIndex] || null;

    // Parse duration from exercise (e.g. "5 MINS" → 300 seconds, "3 min" → 180)
    const parseDuration = (dur: string | undefined): number => {
        if (!dur) return 120; // Default 2 minutes
        const match = dur.match(/(\d+)/);
        return match ? parseInt(match[1]) * 60 : 120;
    };

    const REST_DURATION = 5; // 5 second rest between exercises

    // Initialize timer when exercise changes
    useEffect(() => {
        if (!currentExercise) return;
        const duration = parseDuration(currentExercise.duration);
        setTimeLeft(duration);
        setIsPlaying(false);
        setIsResting(false);
    }, [currentIndex]);

    // Timer logic
    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        // Haptic at completion
                        if (Platform.OS !== 'web') {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }
                        return 0;
                    }
                    // Haptic countdown at 3, 2, 1
                    if (prev <= 4 && prev > 1 && Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                    return prev - 1;
                });
                setTotalElapsed(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, timeLeft]);

    // Handle timer reaching 0
    useEffect(() => {
        if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);

            if (isResting) {
                // Rest is over, move to next exercise
                setIsResting(false);
                if (currentIndex < exercises.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    handleSessionComplete();
                }
            } else {
                // Exercise finished, start rest or complete
                if (currentIndex < exercises.length - 1) {
                    setIsResting(true);
                    setTimeLeft(REST_DURATION);
                    setIsPlaying(true);
                } else {
                    handleSessionComplete();
                }
            }
        }
    }, [timeLeft, isPlaying]);

    // Voice guidance (stub — expo-speech would be called here)
    useEffect(() => {
        if (voiceEnabled && currentExercise && !isResting) {
            const text = currentExercise.description || currentExercise.title || '';
            // In full implementation:
            // Speech.speak(text, { language: language === 'zh' ? 'zh-CN' : language });
            console.log(`[Voice] Would speak: "${text}"`);
        }
    }, [currentIndex, voiceEnabled]);

    const handleSessionComplete = async () => {
        setIsCompleted(true);

        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Save to history
        try {
            await saveToHistory({
                date: Date.now(),
                muscleGroup,
                exercises,
                assessment: { activityType },
            });

            // Sync to HealthKit if available
            const durationMinutes = Math.ceil(totalElapsed / 60);
            if (isHealthKitAvailable()) {
                await syncSessionToHealthKit(durationMinutes, activityType, muscleGroup);
            }
        } catch (e) {
            console.error('Failed to save guided session:', e);
        }
    };

    const handlePlayPause = () => {
        if (timeLeft === 0) return;
        setIsPlaying(prev => !prev);
    };

    const handleSkip = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
        setIsResting(false);

        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSessionComplete();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            setIsResting(false);
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Extract YouTube video ID
    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = currentExercise ? extractYoutubeId(currentExercise.video_url) : null;
    const exerciseDuration = currentExercise ? parseDuration(currentExercise.duration) : 1;
    const progress = isResting
        ? (REST_DURATION - timeLeft) / REST_DURATION
        : (exerciseDuration - timeLeft) / exerciseDuration;

    // ── Completion Screen ────────────────────────────────────────────────
    if (isCompleted) {
        const totalMinutes = Math.ceil(totalElapsed / 60);
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.completionContainer}>
                    <View style={[styles.completionIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.accent} />
                    </View>
                    <Text style={[styles.completionTitle, { color: colors.text }]}>
                        {t('sessionComplete' as any) || 'Session Complete!'}
                    </Text>
                    <Text style={[styles.completionSubtitle, { color: colors.textSecondary }]}>
                        {t('greatWork' as any) || 'Great work on your recovery!'}
                    </Text>

                    <View style={styles.completionStats}>
                        <View style={[styles.completionStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Ionicons name="fitness-outline" size={24} color={colors.accent} />
                            <Text style={[styles.completionStatValue, { color: colors.text }]}>{exercises.length}</Text>
                            <Text style={[styles.completionStatLabel, { color: colors.textSecondary }]}>
                                {t('exercisesLabel' as any) || 'Exercises'}
                            </Text>
                        </View>
                        <View style={[styles.completionStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Ionicons name="timer-outline" size={24} color={colors.accent} />
                            <Text style={[styles.completionStatValue, { color: colors.text }]}>{totalMinutes}</Text>
                            <Text style={[styles.completionStatLabel, { color: colors.textSecondary }]}>
                                {t('minutesLabel' as any) || 'Minutes'}
                            </Text>
                        </View>
                        <View style={[styles.completionStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Ionicons name="flame-outline" size={24} color={colors.accent} />
                            <Text style={[styles.completionStatValue, { color: colors.text }]}>{totalMinutes * 3}</Text>
                            <Text style={[styles.completionStatLabel, { color: colors.textSecondary }]}>
                                {t('caloriesLabel' as any) || 'Cal'}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.doneButton, { backgroundColor: colors.accent }]}
                        onPress={() => router.navigate('/(tabs)/history')}
                    >
                        <Text style={styles.doneButtonText}>
                            {t('finishSession' as any) || 'View History'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeLink}
                        onPress={() => router.navigate('/(tabs)')}
                    >
                        <Text style={[styles.homeLinkText, { color: colors.textSecondary }]}>
                            {t('backToHome' as any) || 'Back to Home'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Active Session ───────────────────────────────────────────────────
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerProgress, { color: colors.accent }]}>
                        {currentIndex + 1} / {exercises.length}
                    </Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                        {t('guidedSession' as any) || 'Guided Session'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.voiceBtn, { backgroundColor: voiceEnabled ? colors.accent + '30' : 'transparent' }]}
                    onPress={() => setVoiceEnabled(v => !v)}
                >
                    <Ionicons
                        name={voiceEnabled ? 'mic' : 'mic-off'}
                        size={22}
                        color={voiceEnabled ? colors.accent : colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Overall progress bar */}
            <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1e1e1e' : '#e5e5e5' }]}>
                <View
                    style={[
                        styles.progressBarFill,
                        {
                            backgroundColor: colors.accent,
                            width: `${((currentIndex + progress) / exercises.length) * 100}%`,
                        },
                    ]}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {isResting ? (
                    /* Rest Interstitial */
                    <View style={styles.restContainer}>
                        <Text style={[styles.restLabel, { color: colors.textSecondary }]}>
                            {t('restPeriod' as any) || 'REST'}
                        </Text>
                        <CountdownCircle
                            progress={progress}
                            timeLeft={timeLeft}
                            size={180}
                            color={colors.accent}
                        />
                        <Text style={[styles.nextUpLabel, { color: colors.textSecondary }]}>
                            {t('nextUp' as any) || 'Next Up'}
                        </Text>
                        <Text style={[styles.nextExerciseName, { color: colors.text }]}>
                            {exercises[currentIndex + 1]?.title || exercises[currentIndex + 1]?.solution_stretch || ''}
                        </Text>
                    </View>
                ) : (
                    /* Active Exercise */
                    <View style={styles.exerciseContainer}>
                        {/* Video */}
                        {videoId ? (
                            <View style={styles.videoWrapper}>
                                <YoutubePlayer
                                    height={SCREEN_WIDTH * 0.5}
                                    play={false}
                                    videoId={videoId}
                                />
                            </View>
                        ) : null}

                        {/* Exercise Info */}
                        <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: colors.text }]}>
                                {currentExercise?.title || currentExercise?.solution_stretch || 'Exercise'}
                            </Text>
                            {currentExercise?.description && (
                                <Text style={[styles.exerciseDesc, { color: colors.textSecondary }]} numberOfLines={3}>
                                    {currentExercise.description}
                                </Text>
                            )}
                        </View>

                        {/* Timer */}
                        <View style={styles.timerContainer}>
                            <CountdownCircle
                                progress={progress}
                                timeLeft={timeLeft}
                                size={140}
                                strokeWidth={6}
                                color={colors.accent}
                            />
                        </View>
                    </View>
                )}
            </View>

            {/* Controls */}
            <View style={[styles.controls, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    <Ionicons
                        name="play-skip-back"
                        size={28}
                        color={currentIndex === 0 ? colors.cardBorder : colors.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.playPauseBtn, { backgroundColor: colors.accent }]}
                    onPress={handlePlayPause}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={36}
                        color="#000"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={handleSkip}
                >
                    <Ionicons name="play-skip-forward" size={28} color={colors.text} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerProgress: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    voiceBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        height: 3,
        marginHorizontal: 16,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    // Rest
    restContainer: {
        alignItems: 'center',
        gap: 24,
    },
    restLabel: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    nextUpLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 8,
    },
    nextExerciseName: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },

    // Exercise
    exerciseContainer: {
        alignItems: 'center',
        gap: 20,
    },
    videoWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    exerciseInfo: {
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    exerciseName: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
    },
    exerciseDesc: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        fontWeight: '500',
    },
    timerContainer: {
        marginTop: 8,
    },
    timerText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 2,
    },

    // Controls
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        paddingVertical: 20,
        paddingBottom: 32,
        borderTopWidth: 1,
    },
    controlBtn: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playPauseBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },

    // Completion
    completionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 16,
    },
    completionIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    completionTitle: {
        fontSize: 28,
        fontWeight: '800',
    },
    completionSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 24,
    },
    completionStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    completionStatCard: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
        minWidth: 90,
    },
    completionStatValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    completionStatLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    doneButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    doneButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    homeLink: {
        paddingVertical: 12,
    },
    homeLinkText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
