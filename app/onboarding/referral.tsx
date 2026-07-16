import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReferralScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [code, setCode] = useState('');

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleContinue = async () => {
        const trimmedCode = code.trim().toUpperCase();
        
        const tiers: Record<string, string> = {
            'KNOTFREE': 'Lifetime',
            'FREEKNOT': '1-Month',
            'GIFT2026': '3-Month',
            'COACH100': '1-Year',
            'VIPRECOVERY': '1-Year'
        };

        if (trimmedCode) {
            if (tiers[trimmedCode]) {
                const tierName = tiers[trimmedCode];
                await AsyncStorage.setItem('user_referral_code', trimmedCode);
                Alert.alert(
                    "Code Accepted!",
                    `Valid referral code. ${tierName} Premium Access has been unlocked for your account!`,
                    [
                        { 
                            text: "Awesome", 
                            onPress: () => router.push('/onboarding/equipment') 
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Invalid Code",
                    "The code you entered is invalid. Please check the spelling or enter a different code.",
                    [
                        { text: "Try Again" }
                    ]
                );
            }
        } else {
            router.push('/onboarding/equipment');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Progress Header */}
                <View style={styles.progressHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: '92%' }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Visual Icon Group */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.glowCircle}>
                            <Ionicons
                                name="gift-outline"
                                size={56}
                                color="#f97316"
                            />
                        </View>
                    </View>

                    {/* Title & Description */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            Enter referral code
                        </Text>
                        <Text style={styles.subtitle}>
                            If you were referred by a friend, coach, or gym partner, enter their code here (optional).
                        </Text>
                    </View>

                    {/* Input Field */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="pricetag-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter Code"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                            value={code}
                            onChangeText={setCode}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.bottom}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleContinue}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        height: 60,
        paddingHorizontal: 16,
        width: '100%',
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
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
