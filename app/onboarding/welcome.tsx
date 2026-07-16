import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const PulsePoint = ({ top, left, delay = 0 }: { top: number; left: number; delay?: number }) => {
    const pulseAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2400,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim, delay]);

    const scale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 2.2],
    });

    const opacity = pulseAnim.interpolate({
        inputRange: [0, 0.1, 0.7, 1],
        outputRange: [0, 0.8, 0.4, 0],
    });

    return (
        <View style={[styles.pulsePointContainer, { top, left }]}>
            {/* Pulsing ring */}
            <Animated.View
                style={[
                    styles.pulsePointRing,
                    {
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            />
        </View>
    );
};

const ScanLine = () => {
    const scanAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scanAnim]);

    const translateY = scanAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 360],
    });

    const opacity = scanAnim.interpolate({
        inputRange: [0, 0.05, 0.95, 1],
        outputRange: [0, 0.8, 0.8, 0],
    });

    return (
        <Animated.View
            style={[
                styles.scanLine,
                {
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={styles.scanGlow} />
        </Animated.View>
    );
};

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
        
        {/* Animated Scanner Sweep */}
        <ScanLine />

        {/* Pulsing trigger hotspot (shoulder) */}
        <PulsePoint top={98} left={114} delay={0} />
    </View>
);

export default function WelcomeScreen() {
    const router = useRouter();
    const { theme, language, setLanguage } = usePreferences();
    const colors = Colors[theme];
    const [showLangModal, setShowLangModal] = useState(false);

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 40,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleSkip = async () => {
        await AsyncStorage.setItem('onboarding_complete', 'true');
        router.replace('/auth/register' as any);
    };

    return (
        <LinearGradient 
            colors={['#0e1220', '#070a13', '#030508']} 
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header with Language Selector */}
                <Animated.View style={[styles.header, { justifyContent: 'flex-end', opacity: fadeAnim }]}>
                    <TouchableOpacity
                        style={styles.langButton}
                        onPress={() => setShowLangModal(true)}
                    >
                        <Ionicons name="globe-outline" size={18} color="#fff" />
                        <Text style={styles.langButtonText}>{language.toUpperCase()}</Text>
                        <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.4)" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.content, 
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* Haptic hologram block */}
                    <View style={styles.hologramGrid}>
                        {/* Ambient Glow pad behind Body Figure */}
                        <LinearGradient
                            colors={['rgba(249, 115, 22, 0.14)', 'rgba(249, 115, 22, 0)']}
                            style={styles.backgroundGlow}
                        />
                        {/* Body Figure */}
                        <View style={styles.figureContainer}>
                            <BodyFigure />
                        </View>
                    </View>

                    {/* Typography block */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            Muscle care{"\n"}
                            <Text style={styles.titleAccent}>made easy</Text>
                        </Text>
                        <Text style={styles.subtitle}>
                            Personalized recovery roadmaps & real-time fatigue scanning.
                        </Text>
                    </View>

                    {/* Premium CTA Button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.85}
                        onPress={() => router.push('/onboarding/gender')}
                    >
                        <LinearGradient
                            colors={['#ff7e29', '#f97316']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>{t('getStarted')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Inline Sign In Link */}
                    <TouchableOpacity 
                        onPress={() => router.replace('/auth/login' as any)} 
                        style={styles.signInWrapper}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.signInText}>
                            Already have an account? <Text style={styles.signInLink}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

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
        </LinearGradient>
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
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    hologramGrid: {
        width: 300,
        height: 400,
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundGlow: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        top: 70,
        alignSelf: 'center',
        zIndex: 1,
    },
    figureContainer: {
        zIndex: 2,
        height: 400,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    figureWrapper: {
        width: 300,
        height: 400,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameImage: {
        position: 'absolute',
        width: 240,
        height: 380,
        opacity: 0.6,
    },
    muscleImage: {
        width: 200,
        height: 340,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    title: {
        fontSize: 38,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 46,
        letterSpacing: -0.5,
    },
    titleAccent: {
        color: '#f97316',
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.55)',
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        width: '100%',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    buttonGradient: {
        paddingVertical: 17,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    signInWrapper: {
        paddingVertical: 8,
        marginBottom: 16,
    },
    signInText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 15,
        fontWeight: '500',
    },
    signInLink: {
        color: '#f97316',
        fontWeight: '700',
    },
    langButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    langButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1c1e26',
        width: '80%',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    langOptionSelected: {
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    langOptionText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    langOptionTextSelected: {
        color: '#f97316',
        fontWeight: 'bold',
    },
    pulsePointContainer: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    pulsePointRing: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 90,
        right: 90,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#f97316',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 6,
    },
    scanGlow: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: 'rgba(249, 115, 22, 0.06)',
        top: -14,
        borderRadius: 15,
    },
});
