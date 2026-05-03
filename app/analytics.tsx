import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { AnalyticsData, DailyDetail, processAnalytics } from '@/utils/analytics';
import { getTranslation } from '@/utils/i18n';
import { getHistory } from '@/utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
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
    const [selectedPoint, setSelectedPoint] = useState<DailyDetail | null>(null);

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
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.textSecondary }}>{t('loadingRelief')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!data || data.totalSessions === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Stack.Screen options={{ headerShown: false }} />
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
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('analyticsDashboard')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Highlights Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('sessions')}</Text>
                        <Text style={[styles.gridValue, { color: colors.text }]}>{data.totalSessions}</Text>
                    </View>
                    <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('streak')}</Text>
                        <Text style={[styles.gridValue, { color: colors.accent }]}>{data.streakDays}d</Text>
                    </View>
                    <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('averagePainLevel')}</Text>
                        <Text style={[styles.gridValue, { color: colors.text }]}>{data.avgPainLevel}</Text>
                    </View>
                    <View style={[styles.gridCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>{t('recoveryScore')}</Text>
                        <Text style={[styles.gridValue, { color: colors.accent }]}>{data.recoveryScore}%</Text>
                    </View>
                </View>

                {/* ── Weekly Summary ─────────────────────────────────── */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('weeklySummary' as any) || 'This Week'}</Text>
                        <Ionicons name="calendar-outline" size={18} color={colors.accent} />
                    </View>
                    <View style={styles.weeklyRow}>
                        <View style={styles.weeklyItem}>
                            <Text style={[styles.weeklyValue, { color: colors.text }]}>{data.weeklyComparison.thisWeek.sessions}</Text>
                            <Text style={[styles.weeklyLabel, { color: colors.textSecondary }]}>{t('sessions')}</Text>
                            {data.weeklyComparison.lastWeek.sessions > 0 && (
                                <View style={styles.weeklyDelta}>
                                    <Ionicons
                                        name={data.weeklyComparison.thisWeek.sessions >= data.weeklyComparison.lastWeek.sessions ? 'trending-up' : 'trending-down'}
                                        size={12}
                                        color={data.weeklyComparison.thisWeek.sessions >= data.weeklyComparison.lastWeek.sessions ? '#22c55e' : '#ef4444'}
                                    />
                                    <Text style={[styles.weeklyDeltaText, {
                                        color: data.weeklyComparison.thisWeek.sessions >= data.weeklyComparison.lastWeek.sessions ? '#22c55e' : '#ef4444'
                                    }]}>
                                        {data.weeklyComparison.thisWeek.sessions >= data.weeklyComparison.lastWeek.sessions ? '+' : ''}
                                        {data.weeklyComparison.thisWeek.sessions - data.weeklyComparison.lastWeek.sessions}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={[styles.weeklyDivider, { backgroundColor: colors.cardBorder }]} />
                        <View style={styles.weeklyItem}>
                            <Text style={[styles.weeklyValue, { color: colors.text }]}>{data.weeklyComparison.thisWeek.minutes}</Text>
                            <Text style={[styles.weeklyLabel, { color: colors.textSecondary }]}>{t('minutesLabel' as any) || 'min'}</Text>
                        </View>
                        <View style={[styles.weeklyDivider, { backgroundColor: colors.cardBorder }]} />
                        <View style={styles.weeklyItem}>
                            <Text style={[styles.weeklyValue, { color: data.weeklyComparison.thisWeek.avgPain <= data.weeklyComparison.lastWeek.avgPain ? '#22c55e' : colors.text }]}>
                                {data.weeklyComparison.thisWeek.avgPain || '—'}
                            </Text>
                            <Text style={[styles.weeklyLabel, { color: colors.textSecondary }]}>{t('avgPain' as any) || 'Avg Pain'}</Text>
                        </View>
                    </View>
                    {data.weeklyComparison.lastWeek.sessions > 0 && (
                        <Text style={[styles.weeklyComparison, { color: colors.textSecondary }]}>
                            {t('vsLastWeek' as any) || 'vs last week'}: {data.weeklyComparison.lastWeek.sessions} {t('sessions')}, {data.weeklyComparison.lastWeek.avgPain} avg pain
                        </Text>
                    )}
                </View>

                {/* ── Body Heatmap ───────────────────────────────────── */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('bodyHeatmap' as any) || 'Body Heatmap'}</Text>
                        <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{t('last30Days' as any) || 'Last 30 days'}</Text>
                    </View>
                    <View style={styles.heatmapContainer}>
                        {data.muscleFrequency.length > 0 ? (
                            <View style={styles.heatmapGrid}>
                                {data.muscleFrequency.slice(0, 10).map((item, idx) => {
                                    const intensity = Math.min(item.count / 6, 1); // 0 to 1
                                    const bgColor = intensity >= 0.8 ? '#ef4444'
                                        : intensity >= 0.5 ? '#f97316'
                                        : intensity >= 0.3 ? '#eab308'
                                        : '#22c55e30';
                                    const muscleKey = `mg${item.muscle.replace(/\s/g, '')}` as any;
                                    const translatedMuscle = t(muscleKey) !== muscleKey ? t(muscleKey) : item.muscle;
                                    return (
                                        <View key={idx} style={[styles.heatmapTile, { backgroundColor: bgColor + '25', borderColor: bgColor + '60' }]}>
                                            <Text style={[styles.heatmapCount, { color: bgColor }]}>{item.count}</Text>
                                            <Text style={[styles.heatmapMuscle, { color: colors.textSecondary }]} numberOfLines={1}>{translatedMuscle}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text style={[styles.notEnoughData, { color: colors.textSecondary }]}>{t('noAnalyticsData')}</Text>
                        )}
                        <View style={styles.heatmapLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#22c55e30' }]} />
                                <Text style={[styles.legendText, { color: colors.textSecondary }]}>1-2</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#eab308' }]} />
                                <Text style={[styles.legendText, { color: colors.textSecondary }]}>3-4</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#f97316' }]} />
                                <Text style={[styles.legendText, { color: colors.textSecondary }]}>5-6</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                                <Text style={[styles.legendText, { color: colors.textSecondary }]}>7+</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Insights Section */}
                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>Insights</Text>
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={colors.accent} />
                    </View>
                    <View style={styles.insightsList}>
                        {data.insights.map((insight, idx) => {
                            const params = { ...insight.params };
                            if (params.muscle) {
                                const mgKey = `mg${(params.muscle as string).replace(/\s/g, '')}` as any;
                                const trans = t(mgKey);
                                params.muscle = trans !== mgKey ? trans : params.muscle;
                            }
                            return (
                                <View key={idx} style={styles.insightItem}>
                                    <View style={[styles.insightDot, { backgroundColor: colors.accent }]} />
                                    <Text style={[styles.insightText, { color: colors.text }]}>
                                        {t(insight.key as any, params as any)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('painTrends')}</Text>
                    </View>
                    <View style={styles.chartContainer}>
                        {data.painTrends.length > 1 ? (
                            <PainTrendsSvg
                                trends={data.painTrends}
                                color={colors.accent}
                                textColor={colors.textSecondary}
                                dailyBreakdown={data.dailyBreakdown}
                                onPointPress={(detail) => setSelectedPoint(detail)}
                            />
                        ) : (
                            <Text style={[styles.notEnoughData, { color: colors.textSecondary }]}>{t('noAnalyticsData')}</Text>
                        )}
                    </View>
                    {/* Interactive tooltip */}
                    {selectedPoint && (
                        <View style={[styles.tooltipCard, { backgroundColor: isDark ? '#2a2a2e' : '#f1f5f9', borderColor: colors.cardBorder }]}>
                            <TouchableOpacity
                                style={styles.tooltipClose}
                                onPress={() => setSelectedPoint(null)}
                            >
                                <Ionicons name="close" size={14} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <View style={styles.tooltipRow}>
                                <Ionicons name="calendar-outline" size={14} color={colors.accent} />
                                <Text style={[styles.tooltipText, { color: colors.text }]}>
                                    {new Date(selectedPoint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </View>
                            <View style={styles.tooltipRow}>
                                <Ionicons name="analytics-outline" size={14} color={colors.accent} />
                                <Text style={[styles.tooltipText, { color: colors.text }]}>
                                    Pain: {selectedPoint.painLevel}/10
                                </Text>
                            </View>
                            <View style={styles.tooltipRow}>
                                <Ionicons name="body-outline" size={14} color={colors.accent} />
                                <Text style={[styles.tooltipText, { color: colors.text }]}>
                                    {selectedPoint.muscle} • {selectedPoint.activityType}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Activity Distribution */}
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
                                <View style={styles.activityRowRight}>
                                    <View style={[styles.miniBarBg, { backgroundColor: isDark ? '#333' : '#eee' }]}>
                                        <View
                                            style={[
                                                styles.miniBarFill,
                                                {
                                                    backgroundColor: getActivityColor(item.type, colors.accent),
                                                    width: `${(item.count / data.totalSessions) * 100}%`
                                                }
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.activityCount, { color: colors.textSecondary }]}>{item.count}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Muscle Frequency */}
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

const PainTrendsSvg = ({ trends, color, textColor, dailyBreakdown, onPointPress }: {
    trends: any[]; color: string; textColor: string;
    dailyBreakdown?: DailyDetail[];
    onPointPress?: (detail: DailyDetail) => void;
}) => {
    const chartWidth = width - 64;
    const chartHeight = 180;
    const maxPain = 10;
    const padding = 30;

    const points = trends.map((entry, idx) => {
        const x = (idx / (trends.length - 1)) * (chartWidth - padding * 2) + padding;
        const y = chartHeight - (entry.painLevel / maxPain) * (chartHeight - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    const pathData = `M ${points}`;

    return (
        <View>
            <Svg width={chartWidth} height={chartHeight}>
                {/* Grid Lines */}
                {[0, 2.5, 5, 7.5, 10].map((val) => (
                    <React.Fragment key={val}>
                        <Line
                            x1={padding}
                            y1={chartHeight - (val / maxPain) * (chartHeight - padding * 2) - padding}
                            x2={chartWidth - padding}
                            y2={chartHeight - (val / maxPain) * (chartHeight - padding * 2) - padding}
                            stroke="rgba(148, 163, 184, 0.1)"
                            strokeWidth="1"
                        />
                        <SvgText
                            x="5"
                            y={chartHeight - (val / maxPain) * (chartHeight - padding * 2) - padding + 4}
                            fill={textColor}
                            fontSize="8"
                        >
                            {val}
                        </SvgText>
                    </React.Fragment>
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

                {/* Data Points and Date Labels */}
                {trends.map((entry, idx) => {
                    const x = (idx / (trends.length - 1)) * (chartWidth - padding * 2) + padding;
                    const y = chartHeight - (entry.painLevel / maxPain) * (chartHeight - padding * 2) - padding;
                    const dateObj = new Date(entry.date);
                    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

                    const showLabel = trends.length < 7 || idx === 0 || idx === trends.length - 1 || idx % Math.floor(trends.length / 3) === 0;

                    return (
                        <React.Fragment key={idx}>
                            {/* Larger invisible tap target */}
                            <Circle
                                cx={x} cy={y} r="12" fill="transparent"
                                onPress={() => {
                                    if (onPointPress && dailyBreakdown && dailyBreakdown[idx]) {
                                        onPointPress(dailyBreakdown[idx]);
                                    }
                                }}
                            />
                            <Circle cx={x} cy={y} r="4" fill={color} />
                            {showLabel && (
                                <SvgText
                                    x={x}
                                    y={chartHeight - 5}
                                    fill={textColor}
                                    fontSize="8"
                                    textAnchor="middle"
                                >
                                    {dateStr}
                                </SvgText>
                            )}
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );
};

const MuscleFreqChart = ({ data, color, textColor, t }: { data: any[], color: string, textColor: string, t: any }) => {
    const chartWidth = width - 64;
    const barHeight = 20;
    const spacing = 12;
    const chartHeight = data.slice(0, 6).length * (barHeight + spacing);
    const maxCount = Math.max(...data.map(d => d.count));

    return (
        <Svg width={chartWidth} height={chartHeight}>
            {data.slice(0, 6).map((item, idx) => {
                const barMaxWidth = chartWidth - 110;
                const barWidth = (item.count / maxCount) * barMaxWidth;
                const y = idx * (barHeight + spacing);

                const muscleKey = `mg${item.muscle.replace(/\s/g, '')}` as any;
                const translatedMuscle = t(muscleKey) !== muscleKey ? t(muscleKey) : item.muscle;

                return (
                    <React.Fragment key={idx}>
                        <SvgText
                            x="0"
                            y={y + barHeight / 2 + 4}
                            fill={textColor}
                            fontSize="9"
                            fontWeight="800"
                        >
                            {translatedMuscle.toUpperCase()}
                        </SvgText>
                        <Rect
                            x="90"
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="10"
                            fill={color}
                            opacity={0.8}
                        />
                        <SvgText
                            x={90 + barWidth + 8}
                            y={y + barHeight / 2 + 4}
                            fill={textColor}
                            fontSize="11"
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 12,
        marginBottom: 20,
    },
    gridCard: {
        width: (width - 32 - 10) / 2,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridLabel: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    gridValue: {
        fontSize: 22,
        fontWeight: '900',
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
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    insightsList: {
        gap: 12,
    },
    insightItem: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    insightDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    insightText: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
        flex: 1,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        width: '100%',
    },
    notEnoughData: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    activityList: {
        gap: 14,
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
        width: 80,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityName: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    activityRowRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    miniBarBg: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    miniBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    activityCount: {
        fontSize: 14,
        fontWeight: '900',
        width: 20,
        textAlign: 'right',
    },
    cardSubtitle: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    // ── Weekly Summary ───────────────────────────────────────────────
    weeklyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    weeklyItem: {
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    weeklyValue: {
        fontSize: 28,
        fontWeight: '900',
    },
    weeklyLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    weeklyDelta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 2,
    },
    weeklyDeltaText: {
        fontSize: 11,
        fontWeight: '800',
    },
    weeklyDivider: {
        width: 1,
        height: 40,
    },
    weeklyComparison: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
    },

    // ── Body Heatmap ─────────────────────────────────────────────────
    heatmapContainer: {
        gap: 16,
    },
    heatmapGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    heatmapTile: {
        width: (width - 80 - 40) / 5, // ~5 per row
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
    },
    heatmapCount: {
        fontSize: 18,
        fontWeight: '900',
    },
    heatmapMuscle: {
        fontSize: 8,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    heatmapLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 3,
    },
    legendText: {
        fontSize: 10,
        fontWeight: '700',
    },

    // ── Interactive Tooltip ──────────────────────────────────────────
    tooltipCard: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
        position: 'relative',
    },
    tooltipClose: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    tooltipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tooltipText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
