import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GeneratePlanScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];

    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Analyzing your goals...');
    const [isComplete, setIsComplete] = useState(false);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    useEffect(() => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                setIsComplete(true);
                setStatusText('Plan successfully generated!');
                clearInterval(interval);
            } else if (currentProgress >= 75) {
                setStatusText('Finalizing your custom plan...');
            } else if (currentProgress >= 50) {
                setStatusText('Configuring equipment presets...');
            } else if (currentProgress >= 25) {
                setStatusText('Customizing recovery routines...');
            }
            setProgress(currentProgress);
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/auth/register' as any);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            {/* Progress Header */}
            <View style={styles.progressHeader}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '100%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Visual Circle Indicator */}
                <View style={styles.illustrationContainer}>
                    <View style={[styles.glowCircle, isComplete && styles.glowCircleComplete]}>
                        {isComplete ? (
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={68}
                                color="#22c55e"
                            />
                        ) : (
                            <Ionicons
                                name="sync-outline"
                                size={56}
                                color="#f97316"
                                style={styles.spinner}
                            />
                        )}
                    </View>
                </View>

                {/* Progress Text & Loading Bar */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {isComplete ? "Plan Generated!" : "Time to generate your custom plan"}
                    </Text>
                    
                    {/* Inline Progress Bar */}
                    <View style={styles.inlineProgressBg}>
                        <View style={[styles.inlineProgressFill, { width: `${progress}%` }]} />
                    </View>

                    <Text style={styles.statusLabel}>{progress}%</Text>
                    <Text style={[styles.subtitle, isComplete && { color: '#22c55e' }]}>
                        {statusText}
                    </Text>
                </View>
            </View>

            {/* Bottom Action */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[styles.button, !isComplete && styles.buttonDisabled]}
                    onPress={handleGetStarted}
                    disabled={!isComplete}
                >
                    <Text style={styles.buttonText}>
                        {isComplete ? "Access My Plan" : "Generating..."}
                    </Text>
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
        paddingHorizontal: 32,
        paddingTop: 32,
        marginBottom: 32,
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(249, 115, 22, 0.15)',
        borderWidth: 1.5,
        borderColor: '#f97316',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    glowCircleComplete: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: '#22c55e',
        shadowColor: '#22c55e',
    },
    spinner: {
        // Rotational animation would ordinarily be done with Animated.timing loop, 
        // but for high performance in Expo Go, a static pulsing/spin state works perfectly
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 12,
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 32,
    },
    inlineProgressBg: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 6,
        height: 8,
        width: '80%',
        overflow: 'hidden',
        marginBottom: 8,
    },
    inlineProgressFill: {
        backgroundColor: '#f97316',
        height: '100%',
        borderRadius: 6,
    },
    statusLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '600',
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
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
});
