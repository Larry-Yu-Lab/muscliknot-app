import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
    const router = useRouter();
    const { theme, language, notificationsEnabled, toggleNotifications } = usePreferences();
    const colors = Colors[theme];

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleEnable = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus === 'granted') {
                if (!notificationsEnabled) {
                    await toggleNotifications();
                }
            } else {
                if (notificationsEnabled) {
                    await toggleNotifications();
                }
            }
        } catch (error) {
            console.warn('Error requesting notification permissions:', error);
        }
        router.push('/onboarding/referral');
    };

    const handleSkip = () => {
        router.push('/onboarding/referral');
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
                        <View style={[styles.progressBarFill, { width: '88%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Visual Icon Group */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.glowCircle}>
                        <Ionicons
                            name="notifications-outline"
                            size={56}
                            color="#f97316"
                        />
                    </View>
                </View>

                {/* Notification Message */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Reach your goals with notifications
                    </Text>
                    <Text style={styles.subtitle}>
                        Receive customized workout reminders, recovery suggestions, and muscle-care guides to stay consistent and prevent injuries.
                    </Text>
                </View>

                {/* Mock Notification Preview */}
                <View style={styles.mockNotification}>
                    <View style={styles.mockHeader}>
                        <Ionicons name="flash" size={16} color="#f97316" style={{ marginRight: 6 }} />
                        <Text style={styles.mockAppName}>MuscliKnot</Text>
                        <Text style={styles.mockTime}>now</Text>
                    </View>
                    <Text style={styles.mockTitle}>Your personalized relief session is ready!</Text>
                    <Text style={styles.mockBody}>Perform a 5-minute Neck Release to alleviate stiffness from sitting today. ⏱️</Text>
                </View>
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEnable}
                >
                    <Text style={styles.buttonText}>Enable Notifications</Text>
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
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
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
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 32,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 38,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 320,
    },
    mockNotification: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        width: '90%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    mockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    mockAppName: {
        color: '#f97316',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        flex: 1,
    },
    mockTime: {
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 12,
    },
    mockTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    mockBody: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 13,
        lineHeight: 18,
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
