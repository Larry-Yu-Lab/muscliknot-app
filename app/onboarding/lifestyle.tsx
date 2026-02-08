import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LifestyleOption {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
}

const OPTIONS: LifestyleOption[] = [
    { id: 'sedentary', title: 'Sedentary', subtitle: 'Little to no exercise, desk job', icon: 'desktop-classic' },
    { id: 'active', title: 'Active', subtitle: 'Regular exercise 3-5 times a week', icon: 'run' },
    { id: 'athlete', title: 'Athlete', subtitle: 'Intensive training or professional sports', icon: 'weight-lifter' },
];

export default function LifestyleScreen() {
    const router = useRouter();
    const { theme } = usePreferences();
    const colors = Colors[theme];
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 2 of 5</Text>
                <View style={styles.backButton} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressSegment} />
                <View style={[styles.progressSegment, styles.progressActive]} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
            </View>

            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>Tell us about your{'\n'}lifestyle.</Text>
                <Text style={styles.subtitle}>
                    This helps us calculate your daily calorie and recovery needs.
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
                                <View style={styles.iconCircle}>
                                    <MaterialCommunityIcons
                                        name={option.icon as any}
                                        size={24}
                                        color="#fff"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.optionTitle}>{option.title}</Text>
                                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
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
                    onPress={() => selected && router.push('/onboarding/goals')}
                    disabled={!selected}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <Text style={styles.stepIndicator}>STEP 2 OF 5</Text>
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
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 32,
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
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
    stepIndicator: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 2,
    },
});
