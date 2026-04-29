import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { categoryLabelKey, getExerciseRecommendation, painLevelColor } from '@/utils/assessmentEngine';
import { getTranslation } from '@/utils/i18n';
import { getHistory, HistoryItem } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Human-readable labels for duration / q1 answers
const DURATION_KEY_MAP: Record<string, string> = {
    today: 'optToday',
    this_week: 'optThisWeek',
    this_month: 'optThisMonth',
    longer: 'optLonger',
    short: 'optLess1Hr',
    medium: 'opt1to4Hr',
    long: 'opt4PlusHr',
    all_day: 'optAllDay',
};

const ACTIVITY_KEY_MAP: Record<string, string> = {
    relief: 'shortRelief',
    warmup: 'shortWarmup',
    yoga: 'shortYoga',
    strength: 'shortStrength',
    posture: 'shortPosture',
};

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string>) => getTranslation(language, key, params);
    const colors = Colors[theme];

    useFocusEffect(
        useCallback(() => {
            getHistory().then(setHistory);
        }, [])
    );

    // Derived Stats
    const totalSessions = history.length;

    // Calculate most targeted muscle
    const muscleCounts: Record<string, number> = {};
    history.forEach(h => {
        const muscleKey = `mg${h.muscleGroup.charAt(0).toUpperCase()}${h.muscleGroup.slice(1).replace(/\s/g, '')}` as any;
        const translatedMuscle = t(muscleKey) !== muscleKey ? t(muscleKey) : h.muscleGroup;
        muscleCounts[translatedMuscle] = (muscleCounts[translatedMuscle] || 0) + 1;
    });
    const topTarget = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    // Format Date Helper - Simple dynamic locale
    const formatDate = (timestamp: number) => {
        const d = new Date(timestamp);
        const localeMap: Record<string, string> = {
            en: 'en-US',
            zh: 'zh-CN',
            fr: 'fr-FR',
            es: 'es-ES'
        };
        const locale = localeMap[language] || 'en-US';
        return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity>
                            <Ionicons name="chevron-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('recoveryHistory')}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="calendar-outline" size={22} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="ellipsis-horizontal" size={22} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Card */}
                <View style={[styles.statsCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={[styles.statItem, styles.statBorder, { borderRightColor: colors.cardBorder }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('sessions')}</Text>
                        <Text style={[styles.statValue, { color: colors.accent }]}>{totalSessions}</Text>
                    </View>
                    <View style={[styles.statItem, styles.statBorder, { borderRightColor: colors.cardBorder }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('streakUpper')}</Text>
                        <Text style={[styles.statValue, { color: colors.accent }]}>{totalSessions > 0 ? t('streakDays', { days: '1' }) : t('streakDays', { days: '0' })}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('targeted')}</Text>
                        <Text style={[styles.statValueSmall, { color: colors.accent }]}>{topTarget}</Text>
                    </View>
                </View>

                {/* Weekly Report Card */}
                <View style={[styles.reportCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.reportContent}>
                        <Text style={[styles.reportTitle, { color: colors.text }]}>{t('weeklyReportTitle')}</Text>
                        <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                            {t('weeklyReportDesc')}
                        </Text>
                        <TouchableOpacity style={[styles.reportButton, { backgroundColor: colors.accent }]}>
                            <Text style={styles.reportButtonText}>{t('viewInsights')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.reportIconBg}>
                        <Ionicons name="analytics-outline" size={80} color={colors.accent} />
                    </View>
                </View>

                {/* Progress Journey */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('progressJourney')}</Text>

                <View style={styles.timelineContainer}>
                    {/* Timeline line */}
                    <View style={[styles.timelineLine, { backgroundColor: colors.cardBorder }]} />

                    {history.map((item) => {
                        const a = item.assessment;
                        const actTranslation = a?.activityType ? t(ACTIVITY_KEY_MAP[a.activityType] as any) : null;
                        const durationTranslation = a?.duration ? t(DURATION_KEY_MAP[a.duration] as any) : null;

                        // Re-run recommendation to get localized category and advisory
                        const rec = a ? getExerciseRecommendation(a) : null;
                        const categoryTrans = rec?.category ? t(categoryLabelKey(rec.category) as any) : null;
                        const advisoryTrans = rec?.advisory ? t(rec.advisory as any) : null;

                        return (
                            <View key={item.id} style={[styles.timelineItem]}>
                                {/* Timeline dot */}
                                <View style={styles.timelineDotContainer}>
                                    <View style={[styles.timelineDot, styles.timelineDotActive, { backgroundColor: colors.background, borderColor: colors.accent }]}>
                                        <Ionicons
                                            name={'body-outline'}
                                            size={20}
                                            color={colors.accent}
                                        />
                                    </View>
                                </View>

                                {/* Card */}
                                <View style={[styles.historyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.cardDate, styles.cardDateActive, { color: colors.accent }]}>
                                                {formatDate(item.date)}
                                            </Text>
                                            <Text style={[styles.cardTitle, { color: colors.text }]}>
                                                {(() => {
                                                    const muscleKey = `mg${item.muscleGroup.replace(/\s/g, '')}` as any;
                                                    const translatedMuscle = t(muscleKey) !== muscleKey ? t(muscleKey) : item.muscleGroup;
                                                    return `${translatedMuscle} ${actTranslation || ''}`;
                                                })()}
                                            </Text>
                                        </View>
                                        <View style={[styles.completedBadge, { backgroundColor: colors.background, borderColor: colors.accent }]}>
                                            <Text style={[styles.completedBadgeText, { color: colors.accent }]}>{t('completed')}</Text>
                                        </View>
                                    </View>

                                    {/* Exercise count */}
                                    <View style={styles.cardMeta}>
                                        <Ionicons name="fitness-outline" size={14} color="#a39587" />
                                        <Text style={styles.metaText}>{t('exercisesCount', { count: item.exercises.length.toString() })}</Text>
                                    </View>

                                    {/* Assessment details */}
                                    {a && (
                                        <View style={styles.assessmentDetails}>
                                            {actTranslation && (
                                                <View style={styles.assessmentChip}>
                                                    <Ionicons name="pulse-outline" size={12} color="#a39587" />
                                                    <Text style={styles.assessmentChipText}>{actTranslation}</Text>
                                                </View>
                                            )}
                                            {a.painLevel !== undefined && a.activityType === 'relief' && (
                                                <View style={[styles.assessmentChip, { borderColor: `${painLevelColor(a.painLevel)}40`, backgroundColor: `${painLevelColor(a.painLevel)}12` }]}>
                                                    <View style={[styles.painDot, { backgroundColor: painLevelColor(a.painLevel) }]} />
                                                    <Ionicons name="analytics-outline" size={12} color={painLevelColor(a.painLevel)} />
                                                    <Text style={[styles.assessmentChipText, { color: painLevelColor(a.painLevel) }]}>{t('painLevelPrefix')}{a.painLevel}/10</Text>
                                                </View>
                                            )}
                                            {a.location && (
                                                <View style={styles.assessmentChip}>
                                                    <Ionicons name="location-outline" size={12} color="#a39587" />
                                                    <Text style={styles.assessmentChipText}>
                                                        {(() => {
                                                            const locKey = `loc${a.location.charAt(0).toUpperCase()}${a.location.slice(1).replace(/_/g, '')}` as any;
                                                            const trans = t(locKey);
                                                            return trans !== locKey ? trans : a.location.replace(/_/g, ' ');
                                                        })()}
                                                    </Text>
                                                </View>
                                            )}
                                            {durationTranslation && (
                                                <View style={styles.assessmentChip}>
                                                    <Ionicons name="time-outline" size={12} color="#a39587" />
                                                    <Text style={styles.assessmentChipText}>{durationTranslation}</Text>
                                                </View>
                                            )}
                                            {categoryTrans && (
                                                <View style={styles.assessmentChip}>
                                                    <Ionicons name="shield-checkmark-outline" size={12} color="#a39587" />
                                                    <Text style={styles.assessmentChipText}>{categoryTrans}</Text>
                                                </View>
                                            )}
                                            {a.cause && a.cause.trim().length > 0 && a.cause !== 'unknown' && (
                                                <Text style={styles.causeText} numberOfLines={2}>&quot;{a.cause}&quot;</Text>
                                            )}
                                            {advisoryTrans && (
                                                <Text style={styles.advisoryText} numberOfLines={2}>{advisoryTrans}</Text>
                                            )}
                                        </View>
                                    )}

                                </View>
                            </View>
                        );
                    })}
                    {history.length === 0 && (
                        <Text style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>{t('noHistory')}</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 16,
    },
    headerIcon: {
        padding: 4,
    },
    statsCard: {
        marginHorizontal: 16,
        marginTop: 24,
        flexDirection: 'row',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 153, 0, 0.15)',
    },
    statLabel: {
        color: '#a39587',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        color: '#FF9900',
        fontSize: 24,
        fontWeight: '800',
    },
    statValueSmall: {
        color: '#FF9900',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
    },
    reportCard: {
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    reportContent: {
        gap: 12,
        zIndex: 10,
    },
    reportTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    reportDescription: {
        color: '#a39587',
        fontSize: 14,
        lineHeight: 20,
    },
    reportButton: {
        backgroundColor: '#FF9900',
        borderRadius: 8,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    reportButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
    },
    reportIconBg: {
        position: 'absolute',
        right: -16,
        bottom: -16,
        opacity: 0.1,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        paddingHorizontal: 16,
        marginTop: 32,
        marginBottom: 16,
    },
    timelineContainer: {
        paddingHorizontal: 16,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 35,
        top: 16,
        bottom: 0,
        width: 2,
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    timelineDotContainer: {
        width: 40,
        alignItems: 'center',
        zIndex: 10,
    },
    timelineDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 153, 0, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 153, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineDotActive: {
        backgroundColor: '#FF9900',
        borderColor: '#FF9900',
        shadowColor: '#FF9900',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    historyCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 153, 0, 0.1)',
        gap: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardDate: {
        color: '#a39587',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    cardDateActive: {
        color: '#FF9900',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    completedBadge: {
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 153, 0, 0.3)',
    },
    completedBadgeText: {
        color: '#FF9900',
        fontSize: 10,
        fontWeight: '700',
    },
    durationBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    durationBadgeText: {
        color: '#a39587',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: '#a39587',
        fontSize: 14,
    },
    metaDot: {
        color: '#a39587',
        marginHorizontal: 2,
    },
    assessmentDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    assessmentChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,153,0,0.08)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,153,0,0.15)',
    },
    assessmentChipText: {
        color: '#a39587',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    causeText: {
        color: '#a39587',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
        width: '100%',
    },
    painDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    advisoryText: {
        color: '#a39587',
        fontSize: 11,
        fontStyle: 'italic',
        marginTop: 4,
        width: '100%',
        lineHeight: 16,
    },
});

