import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { requestHealthKitPermission, setHealthKitEnabled } from '@/utils/healthKit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppleHealthScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [loading, setLoading] = useState(false);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleConnect = async () => {
        try {
            setLoading(true);
            const granted = await requestHealthKitPermission();
            await setHealthKitEnabled(granted);
        } catch (error) {
            console.error('Failed to request HealthKit permissions:', error);
        } finally {
            setLoading(false);
            router.push('/onboarding/rating');
        }
    };

    const handleSkip = async () => {
        try {
            await setHealthKitEnabled(false);
        } catch (error) {
            console.error('Failed to disable HealthKit preference:', error);
        }
        router.push('/onboarding/rating');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            {/* Progress Header */}
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '82%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Visual Icon Group */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.glowCircle}>
                        <Ionicons
                            name="pulse-outline"
                            size={56}
                            color="#ef4444"
                        />
                    </View>
                </View>

                {/* Health Sync Message */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Connect Apple Health
                    </Text>
                    <Text style={styles.subtitle}>
                        Sync your activity, active calories, and steps to get accurate muscle care recommendations that match your real-time fatigue levels.
                    </Text>
                </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleConnect}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>Connect Health Data</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={handleSkip}
                    disabled={loading}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
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
        paddingTop: 32,
        marginBottom: 32,
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
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderWidth: 1.5,
        borderColor: '#ef4444',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 6,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
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
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    skipButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    skipText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
