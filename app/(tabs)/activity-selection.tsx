import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActivitySelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    // Pass through params
    const { x, y, width, height, rotation, view, size, muscleId, timestamp } = params;

    const handleSelection = (type: string) => {
        let pathname = '/(tabs)/pain-assessment'; // Default for relief

        switch (type) {
            case 'warmup':
                pathname = '/(tabs)/warm-up';
                break;
            case 'yoga':
                pathname = '/(tabs)/yoga';
                break;
            case 'posture':
                pathname = '/(tabs)/fix-posture';
                break;
            case 'strength':
                pathname = '/(tabs)/strengthen';
                break;
            case 'relief':
            default:
                pathname = '/(tabs)/pain-assessment';
                break;
        }

        router.push({
            pathname: pathname as any,
            params: {
                x, y, width, height, rotation, view, size, muscleId, timestamp,
                activityType: type
            }
        });
    };

    const activities = [
        {
            id: 'relief',
            title: t('activityRelief'),
            desc: t('activityReliefDesc'),
            icon: 'medical-bag',
            iconLib: MaterialCommunityIcons,
            color: '#ef4444' // red/orange
        },
        {
            id: 'warmup',
            title: t('activityWarmup'),
            desc: t('activityWarmupDesc'),
            icon: 'flame',
            iconLib: Ionicons,
            color: '#f97316' // orange
        },
        {
            id: 'yoga',
            title: t('activityYoga'),
            desc: t('activityYogaDesc'),
            icon: 'body',
            iconLib: Ionicons,
            color: '#8b5cf6' // violet
        },
        {
            id: 'posture',
            title: t('activityPosture'),
            desc: t('activityPostureDesc'),
            icon: 'human-male',
            iconLib: MaterialCommunityIcons,
            color: '#06b6d4' // cyan
        },
        {
            id: 'strength',
            title: t('activityStrength'),
            desc: t('activityStrengthDesc'),
            icon: 'arm-flex',
            iconLib: MaterialCommunityIcons,
            color: '#10b981' // emerald
        }
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('generatePlan')}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>{t('selectActivityType')}</Text>

                <View style={styles.grid}>
                    {activities.map((activity) => (
                        <TouchableOpacity
                            key={activity.id}
                            style={[
                                styles.card,
                                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }
                            ]}
                            onPress={() => handleSelection(activity.id)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: `${activity.color}20` }]}>
                                <activity.iconLib name={activity.icon as any} size={32} color={activity.color} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.cardTitle, { color: colors.text }]}>{activity.title}</Text>
                                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{activity.desc}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginTop: 8,
        marginBottom: 24,
    },
    grid: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        gap: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
});
