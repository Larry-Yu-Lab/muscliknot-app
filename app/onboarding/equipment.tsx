import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const EQUIPMENT_LIST = [
    { id: 'foam_roller', icon: 'settings-input-component' },
    { id: 'lacrosse_ball', icon: 'lens' },
    { id: 'resistance_band', icon: 'vibration' },
    { id: 'yoga_block', icon: 'crop-square' },
    { id: 'dumbbells', icon: 'fitness-center' },
    { id: 'kettlebell', icon: 'album' },
    { id: 'massage_gun', icon: 'bolt' },
    { id: 'stability_ball', icon: 'radio-button-checked' },
];

export default function OnboardingEquipmentScreen() {
    const router = useRouter();
    const { theme, language, equipment, toggleEquipment } = usePreferences();
    const colors = Colors[theme];
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleNext = () => {
        router.push('/onboarding/goals');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '83%' }]} />
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('onboardingEquipmentTitle')}
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('onboardingEquipmentDesc')}
                    </Text>
                </Animated.View>

                <View style={styles.grid}>
                    {EQUIPMENT_LIST.map((item, index) => {
                        const isSelected = equipment.includes(item.id);
                        return (
                            <Animated.View
                                key={item.id}
                                entering={FadeInDown.duration(600).delay(300 + index * 50)}
                                style={styles.gridItemContainer}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.gridItem,
                                        { backgroundColor: isSelected ? `${colors.accent}20` : 'rgba(255,255,255,0.05)' },
                                        { borderColor: isSelected ? colors.accent : 'rgba(255,255,255,0.1)' }
                                    ]}
                                    onPress={() => toggleEquipment(item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[
                                        styles.iconCircle,
                                        { backgroundColor: isSelected ? colors.accent : 'rgba(255,255,255,0.08)' }
                                    ]}>
                                        <MaterialIcons
                                            name={item.icon as any}
                                            size={24}
                                            color={isSelected ? '#000' : 'rgba(255,255,255,0.6)'}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.itemLabel,
                                        { color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)' }
                                    ]}>
                                        {t(`eq_${item.id}` as any)}
                                    </Text>
                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.skipButton]}
                    onPress={() => router.push('/onboarding/goals')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>{t('eq_none')}</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: colors.accent }]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.nextText}>{t('continueButton').toUpperCase()}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        marginBottom: 8,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    progressContainer: {
        flex: 1,
        height: 4,
    },
    progressBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#f97316',
        borderRadius: 2,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    gridItemContainer: {
        width: '50%',
        padding: 8,
    },
    gridItem: {
        borderRadius: 24,
        padding: 20,
        height: 140,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    itemLabel: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    skipButton: {
        marginTop: 24,
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    nextButton: {
        flexDirection: 'row',
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    nextText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
