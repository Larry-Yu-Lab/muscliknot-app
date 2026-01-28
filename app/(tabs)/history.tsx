import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const historyData = [
    {
        id: 1,
        icon: 'body-outline',
        title: 'Lower Back Relief',
        date: 'Today • 10:30 AM',
        duration: '15 min',
        type: 'Deep Stretch',
        typeIcon: 'fitness-outline',
        isToday: true,
        completed: true,
    },
    {
        id: 2,
        icon: 'accessibility-outline',
        title: 'Full Body Yoga',
        date: 'Yesterday • 6:15 PM',
        duration: '30 min',
        type: 'Vitality Flow',
        typeIcon: 'leaf-outline',
        isToday: false,
        opacity: 0.9,
    },
    {
        id: 3,
        icon: 'barbell-outline',
        title: 'Shoulder Mobility',
        date: 'Oct 22 • 08:00 AM',
        duration: '10 min',
        type: 'Post-Workout Recovery',
        typeIcon: 'refresh-outline',
        isToday: false,
        opacity: 0.8,
    },
    {
        id: 4,
        icon: 'walk-outline',
        title: 'Hamstring Stretch',
        date: 'Oct 20 • 09:45 PM',
        duration: '20 min',
        type: null,
        typeIcon: null,
        isToday: false,
        opacity: 0.7,
    },
];

export default function HistoryScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Recovery History</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="calendar-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={[styles.statItem, styles.statBorder]}>
                        <Text style={styles.statLabel}>SESSIONS</Text>
                        <Text style={styles.statValue}>42</Text>
                    </View>
                    <View style={[styles.statItem, styles.statBorder]}>
                        <Text style={styles.statLabel}>STREAK</Text>
                        <Text style={styles.statValue}>7d</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>TARGETED</Text>
                        <Text style={styles.statValueSmall}>Lower Back</Text>
                    </View>
                </View>

                {/* Weekly Report Card */}
                <View style={styles.reportCard}>
                    <View style={styles.reportContent}>
                        <Text style={styles.reportTitle}>Weekly Vitality Report</Text>
                        <Text style={styles.reportDescription}>
                            Your recovery efficiency increased by 12% this week. Keep the momentum!
                        </Text>
                        <TouchableOpacity style={styles.reportButton}>
                            <Text style={styles.reportButtonText}>View My Insights</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.reportIconBg}>
                        <Ionicons name="analytics-outline" size={80} color="#FF9900" />
                    </View>
                </View>

                {/* Progress Journey */}
                <Text style={styles.sectionTitle}>Your Progress Journey</Text>

                <View style={styles.timelineContainer}>
                    {/* Timeline line */}
                    <View style={styles.timelineLine} />

                    {historyData.map((item) => (
                        <View key={item.id} style={[styles.timelineItem, { opacity: item.opacity || 1 }]}>
                            {/* Timeline dot */}
                            <View style={styles.timelineDotContainer}>
                                <View style={[styles.timelineDot, item.isToday && styles.timelineDotActive]}>
                                    <Ionicons
                                        name={item.icon as any}
                                        size={20}
                                        color={item.isToday ? '#000' : '#FF9900'}
                                    />
                                </View>
                            </View>

                            {/* Card */}
                            <View style={styles.historyCard}>
                                <View style={styles.cardHeader}>
                                    <View>
                                        <Text style={[styles.cardDate, item.isToday && styles.cardDateActive]}>
                                            {item.date}
                                        </Text>
                                        <Text style={styles.cardTitle}>{item.title}</Text>
                                    </View>
                                    {item.completed ? (
                                        <View style={styles.completedBadge}>
                                            <Text style={styles.completedBadgeText}>COMPLETED</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.durationBadge}>
                                            <Text style={styles.durationBadgeText}>{item.duration}</Text>
                                        </View>
                                    )}
                                </View>
                                {item.type && (
                                    <View style={styles.cardMeta}>
                                        {item.completed && (
                                            <>
                                                <Ionicons name="timer-outline" size={14} color="#a39587" />
                                                <Text style={styles.metaText}>{item.duration}</Text>
                                                <Text style={styles.metaDot}>•</Text>
                                            </>
                                        )}
                                        <Ionicons name={item.typeIcon as any} size={14} color="#a39587" />
                                        <Text style={styles.metaText}>{item.type}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0908',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        color: '#fff',
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
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 153, 0, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
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
        backgroundColor: 'rgba(255, 153, 0, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 153, 0, 0.3)',
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
});
