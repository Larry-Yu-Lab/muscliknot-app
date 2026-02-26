import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { AnalyticsData, processAnalytics } from '@/utils/analytics';
import { getTranslation } from '@/utils/i18n';
import { getHistory } from '@/utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string>) => getTranslation(language, key, params);

    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHistory().then(history => {
            const processed = processAnalytics(history);
            setData(processed);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.textSecondary }}>{t('loadingRelief')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data || data.totalSessions === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('analyticsDashboard')}</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={64} color={colors.cardBorder} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noAnalyticsData')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('analyticsDashboard')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Top Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.smallStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.smallStatLabel, { color: colors.textSecondary }]}>{t('sessions')}</Text>
                        <Text style={[styles.smallStatValue, { color: colors.text }]}>{data.totalSessions}</Text>
                    </View>
                    <View style={[styles.smallStatCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.smallStatLabel, { color: colors.textSecondary }]}>{t('averagePainLevel')}</Text>
                        <Text style={[styles.smallStatValue, { color: colors.accent }]}>{data.avgPainLevel}/10</Text>
                    </View>
                </View>

                {/* Recovery Score Card */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('recoveryScore')}</Text>
                        <MaterialCommunityIcons name="heart-pulse" size={20} color={colors.accent} />
                    </View>
                    <View style={styles.recoveryContainer}>
                        <Text style={[styles.recoveryValue, { color: colors.accent }]}>{data.recoveryScore}%</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#333' : '#eee' }]}>
                                <View style={[styles.progressBarFill, { backgroundColor: colors.accent, width: `${data.recoveryScore}%` }]} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Pain Trends Chart */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('painTrends')}</Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{t('last30Days')}</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        {data.painTrends.length > 1 ? (
                            <PainTrendsSvg trends={data.painTrends} color={colors.accent} textColor={colors.textSecondary} />
                        ) : (
                            <Text style={[styles.notEnoughData, { color: colors.textSecondary }]}>{t('noAnalyticsData')}</Text>
                        )}
                    </View>
                </View>

                {/* Activity Breakdown */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('activityBreakdown')}</Text>
                    </View>
                    <View style={styles.activityList}>
                        {data.activityDistribution.map((item, idx) => (
                            <View key={idx} style={styles.activityItem}>
                                <View style={styles.activityInfo}>
                                    <View style={[styles.activityDot, { backgroundColor: getActivityColor(item.type, colors.accent) }]} />
                                    <Text style={[styles.activityName, { color: colors.text }]}>
                                        {t(`short${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}` as any)}
                                    </Text>
                                </View>
                                <Text style={[styles.activityCount, { color: colors.textSecondary }]}>{item.count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Muscle Group Frequency */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('muscleFrequency')}</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        {data.muscleFrequency.length > 0 ? (
                            <MuscleFreqChart data={data.muscleFrequency} color={colors.accent} textColor={colors.textSecondary} t={t} />
                        ) : (
                            <Text style={[styles.notEnoughData, { color: colors.textSecondary }]}>{t('noAnalyticsData')}</Text>
                        )}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const getActivityColor = (type: string, accent: string) => {
    switch (type) {
        case 'relief': return accent;
        case 'warmup': return '#4ade80';
        case 'yoga': return '#a855f7';
        case 'strength': return '#f43f5e';
        case 'posture': return '#3b82f6';
        default: return '#94a3b8';
    }
};

const PainTrendsSvg = ({ trends, color, textColor }: { trends: any[], color: string, textColor: string }) => {
    const chartWidth = width - 64;
    const chartHeight = 150;
    const maxPain = 10;
    const padding = 20;

    const points = trends.map((entry, idx) => {
        const x = (idx / (trends.length - 1)) * (chartWidth - padding * 2) + padding;
        const y = chartHeight - (entry.painLevel / maxPain) * (chartHeight - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    const pathData = `M ${points}`;

    return (
        <Svg width={chartWidth} height={chartHeight}>
            {/* Grid Lines */}
            {[0, 2.5, 5, 7.5, 10].map((val) => (
                <Line
                    key={val}
                    x1={padding}
                    y1={chartHeight - (val / maxPain) * (chartHeight - padding * 2) - padding}
                    x2={chartWidth - padding}
                    y2={chartHeight - (val / maxPain) * (chartHeight - padding * 2) - padding}
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeWidth="1"
                />
            ))}

            {/* The Line */}
            <Path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data Points */}
            {trends.map((entry, idx) => {
                const x = (idx / (trends.length - 1)) * (chartWidth - padding * 2) + padding;
                const y = chartHeight - (entry.painLevel / maxPain) * (chartHeight - padding * 2) - padding;
                return (
                    <Circle key={idx} cx={x} cy={y} r="4" fill={color} />
                );
            })}
        </Svg>
    );
};

const MuscleFreqChart = ({ data, color, textColor, t }: { data: any[], color: string, textColor: string, t: any }) => {
    const chartWidth = width - 64;
    const barHeight = 30;
    const spacing = 10;
    const chartHeight = data.slice(0, 5).length * (barHeight + spacing);
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <Svg width={chartWidth} height={chartHeight}>
            {data.slice(0, 5).map((item, idx) => {
                const barWidth = (item.count / maxCount) * (chartWidth - 100);
                const y = idx * (barHeight + spacing);

                const muscleKey = `mg${item.muscle.replace(/\s/g, '')}` as any;
                const translatedMuscle = t(muscleKey) !== muscleKey ? t(muscleKey) : item.muscle;

                return (
                    <React.Fragment key={idx}>
                        <SvgText
                            x="0"
                            y={y + barHeight / 2 + 5}
                            fill={textColor}
                            fontSize="10"
                            fontWeight="bold"
                        >
                            {translatedMuscle.toUpperCase()}
                        </SvgText>
                        <Rect
                            x="80"
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="4"
                            fill={color}
                            opacity={0.8}
                        />
                        <SvgText
                            x={80 + barWidth + 10}
                            y={y + barHeight / 2 + 5}
                            fill={textColor}
                            fontSize="12"
                            fontWeight="bold"
                        >
                            {item.count}
                        </SvgText>
                    </React.Fragment>
                );
            })}
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        gap: 20,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
        marginBottom: 20,
    },
    smallStatCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    smallStatLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    smallStatValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    glassCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    cardSubtitle: {
        fontSize: 10,
        fontWeight: '600',
    },
    recoveryContainer: {
        alignItems: 'center',
    },
    recoveryValue: {
        fontSize: 48,
        fontWeight: '900',
        marginBottom: 10,
    },
    progressBarContainer: {
        width: '100%',
        marginTop: 10,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    notEnoughData: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    activityList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityName: {
        fontSize: 14,
        fontWeight: '600',
    },
    activityCount: {
        fontSize: 14,
        fontWeight: '700',
    },
});
