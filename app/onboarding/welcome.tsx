import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons'; // Added Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // Added useState
import {
    Dimensions,
    Modal, // Added Modal
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg'; // Re-added Svg imports

const { width, height } = Dimensions.get('window');

const BodyFigure = () => (
    <View style={styles.figureWrapper}>
        <Image 
            source={require('@/assets/images/onboarding_frame.png')} 
            style={styles.frameImage} 
            contentFit="contain" 
        />
        <Image 
            source={require('@/assets/images/onboarding_muscle.png')} 
            style={styles.muscleImage} 
            contentFit="contain" 
        />
    </View>
);

export default function WelcomeScreen() {
    const router = useRouter();
    const { theme, language, setLanguage } = usePreferences();
    const colors = Colors[theme];
    const [showLangModal, setShowLangModal] = useState(false);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleSkip = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/auth/login' as any);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            {/* Skip Button */}
            {/* Header with Language Selector & Skip */}
            <View style={[styles.header, { justifyContent: 'flex-end' }]}>
                <TouchableOpacity
                    style={styles.langButton}
                    onPress={() => setShowLangModal(true)}
                >
                    <Ionicons name="globe-outline" size={20} color="#fff" />
                    <Text style={styles.langButtonText}>{language.toUpperCase()}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Body Figure */}
                <View style={styles.figureContainer}>
                    <BodyFigure />
                </View>

                {/* Title */}
                <Text style={styles.title}>Muscle care made easy</Text>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={[styles.button, { marginBottom: 16 }]}
                    onPress={() => router.push('/onboarding/gender')}
                >
                    <Text style={styles.buttonText}>{t('getStarted')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.replace('/auth/login' as any)} style={{ marginBottom: 32 }}>
                    <Text style={styles.signInText}>Already have an account? <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text></Text>
                </TouchableOpacity>
            </View>
            {/* Language Selection Modal */}
            <Modal
                visible={showLangModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLangModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowLangModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('language')}</Text>
                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.langOption,
                                    language === lang.code && styles.langOptionSelected
                                ]}
                                onPress={() => {
                                    setLanguage(lang.code);
                                    setShowLangModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.langOptionText,
                                    language === lang.code && styles.langOptionTextSelected
                                ]}>
                                    {lang.label}
                                </Text>
                                {language === lang.code && (
                                    <Ionicons name="checkmark" size={20} color="#f97316" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
        paddingHorizontal: 20,
        paddingVertical: 12,
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    figureContainer: {
        marginBottom: 48,
        height: 450,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    figureWrapper: {
        width: 300,
        height: 450,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameImage: {
        position: 'absolute',
        width: 260,
        height: 440,
        opacity: 0.8,
    },
    muscleImage: {
        width: 220,
        height: 380,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginBottom: 48,
    },
    button: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        marginBottom: 32,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    signInText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        backgroundColor: '#f9d423',
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    langButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        width: '80%',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    langOptionSelected: {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    langOptionText: {
        fontSize: 16,
        color: '#ccc',
    },
    langOptionTextSelected: {
        color: '#f97316',
        fontWeight: 'bold',
    },
});
