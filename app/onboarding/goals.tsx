import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GoalOption {
    id: string;
    titleKey: string;
    subtitleKey: string;
    icon: string;
    iconColor: string;
}

const OPTIONS: GoalOption[] = [
    {
        id: 'relieve_pain',
        titleKey: 'relievePain',
        subtitleKey: 'relievePainDesc',
        icon: 'puzzle-outline',
        iconColor: '#f97316'
    },
    {
        id: 'improve_mobility',
        titleKey: 'improveMobility',
        subtitleKey: 'improveMobilityDesc',
        icon: 'accessibility',
        iconColor: '#f97316'
    },
    {
        id: 'daily_maintenance',
        titleKey: 'dailyMaintenance',
        subtitleKey: 'dailyMaintenanceDesc',
        icon: 'heart-outline',
        iconColor: '#f97316'
    },
];

export default function GoalsScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [selected, setSelected] = useState<string | null>(null);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleSkip = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/auth/login' as any);
    };

    const handleComplete = async () => {
        if (!selected) return;

        // Get lifestyle from previous screen (stored in AsyncStorage)
        const lifestyle = await AsyncStorage.getItem('user_lifestyle');

        // Mark onboarding as complete and save selections to AsyncStorage
        await AsyncStorage.setItem('onboarding_complete', 'true');
        await AsyncStorage.setItem('user_goal', selected);
        if (lifestyle) {
            await AsyncStorage.setItem('user_lifestyle', lifestyle);
        }

        // Navigate to login - preferences will be synced to database after signup/login
        router.replace('/auth/login' as any);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.stepText}>{t('stepIndicator').replace('${step}', '3').replace('${total}', '3')}</Text>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>{t('skip')}</Text>
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
                <View style={[styles.progressSegment, styles.progressActive]} />
            </View>

            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>{t('goalsTitle')}</Text>
                <Text style={styles.subtitle}>
                    {t('goalsSubtitle')}
                </Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                selected === option.id && styles.optionCardSelected,
                            ]}
                            onPress={() => setSelected(option.id)}
                        >
                            <View style={styles.optionLeft}>
                                <View style={[styles.iconCircle, selected === option.id && styles.iconCircleSelected]}>
                                    <Ionicons
                                        name={option.icon as any}
                                        size={24}
                                        color={option.iconColor}
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.optionTitle}>{t(option.titleKey as any)}</Text>
                                    <Text style={styles.optionSubtitle}>{t(option.subtitleKey as any)}</Text>
                                </View>
                            </View>
                            <View style={[
                                styles.radio,
                                selected === option.id && styles.radioSelected,
                            ]}>
                                {selected === option.id && (
                                    <View style={styles.radioInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Bottom */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    onPress={handleComplete}
                    disabled={!selected}
                >
                    <Text style={styles.buttonText}>{t('nextStep')}</Text>
                </TouchableOpacity>
                <Text style={styles.note}>{t('youCanChangeLater')}</Text>
            </View>
        </SafeAreaView>
    );
}

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
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    skipText: {
        color: '#f97316',
        fontSize: 16,
        fontWeight: '500',
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 6,
        marginBottom: 32,
    },
    progressSegment: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
    },
    progressActive: {
        backgroundColor: '#f97316',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleSelected: {
        backgroundColor: 'rgba(249, 115, 22, 0.3)',
    },
    textContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    optionSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: '#f97316',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#f97316',
    },
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    button: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    note: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        textAlign: 'center',
        letterSpacing: 1,
    },
});
