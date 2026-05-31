import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RatingScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [rating, setRating] = useState<number>(0);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleRate = async () => {
        try {
            // Mock Apple App Store link for MuscliKnot
            await Linking.openURL('https://apps.apple.com/app/id6449191000');
        } catch (error) {
            console.warn('Could not open App Store URL:', error);
        }
        router.push('/onboarding/notifications');
    };

    const handleSkip = () => {
        router.push('/onboarding/notifications');
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
                        <View style={[styles.progressBarFill, { width: '84%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* Visual Icon Group */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.glowCircle}>
                        <Ionicons
                            name="star-outline"
                            size={56}
                            color="#f97316"
                        />
                    </View>
                </View>

                {/* Rating Message */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        Enjoying MuscliKnot?
                    </Text>
                    <Text style={styles.subtitle}>
                        Support our team by giving us a 5-star rating on the App Store! It takes less than a minute.
                    </Text>
                </View>

                {/* Star Selector */}
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => {
                                setRating(num);
                                // Brief delay then navigate
                                setTimeout(() => {
                                    router.push('/onboarding/notifications');
                                }, 800);
                            }}
                            activeOpacity={0.7}
                            style={styles.starTouch}
                        >
                            <Ionicons
                                name={num <= rating ? "star" : "star-outline"}
                                size={36}
                                color={num <= rating ? "#f97316" : "rgba(255,255,255,0.3)"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {rating > 0 && (
                    <Text style={styles.thankYouNote}>
                        Thank you for your support!
                    </Text>
                )}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleRate}
                >
                    <Text style={styles.buttonText}>Rate on App Store</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.skipButton}
                    onPress={handleSkip}
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
    starsRow: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    starTouch: {
        padding: 6,
    },
    thankYouNote: {
        color: '#f97316',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 16,
        textAlign: 'center',
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
