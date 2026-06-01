import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { requestHealthKitPermission, setHealthKitEnabled } from '@/utils/healthKit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AppleHealthScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [loading, setLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.6)).current;
    const labelAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const connectorAnim = useRef(new Animated.Value(0)).current;

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    useEffect(() => {
        // Logo entrance
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 5,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(connectorAnim, {
                toValue: 1,
                duration: 800,
                delay: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();

        // Staggered labels — fade in one by one
        labelAnims.forEach((anim, i) => {
            Animated.timing(anim, {
                toValue: 1,
                duration: 450,
                delay: 400 + i * 150,
                easing: Easing.out(Easing.back(1.4)),
                useNativeDriver: true,
            }).start();
        });

        // Gentle breathing pulse on logos
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.04,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

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

    const renderLabel = (text: string, index: number, style: object) => (
        <Animated.View
            key={text}
            style={[
                styles.labelPill,
                style,
                {
                    opacity: labelAnims[index],
                    transform: [
                        {
                            translateY: labelAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, 0],
                            }),
                        },
                        {
                            scale: labelAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.7, 1],
                            }),
                        },
                    ],
                },
            ]}
        >
            <Text style={styles.labelText}>{text}</Text>
        </Animated.View>
    );

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
                {/* ─── Illustration: Labels + Icons + Connector ─── */}
                <Animated.View
                    style={[
                        styles.illustrationWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    {/* Floating labels arranged in a semi-circle arc */}
                    {renderLabel('Walking', 0, { position: 'absolute', top: 0, left: 20 })}
                    {renderLabel('Running', 1, { position: 'absolute', top: -20, left: SCREEN_WIDTH * 0.28 })}
                    {renderLabel('Yoga', 2, { position: 'absolute', top: -10, right: 20 })}
                    {renderLabel('Sleep', 3, { position: 'absolute', top: 60, right: 0 })}

                    {/* Logos Row */}
                    <View style={styles.logosRow}>
                        {/* Apple Health Icon */}
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <View style={styles.iconBox}>
                                <Image
                                    source={require('@/assets/images/apple-health-icon.png')}
                                    style={styles.iconImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </Animated.View>

                        {/* Curved dotted arc connector */}
                        <Animated.View style={[styles.arcContainer, { opacity: connectorAnim }]}>
                            <Svg width={90} height={56} viewBox="0 0 90 56">
                                <Path
                                    d="M 4 50 Q 45 -10 86 50"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth={1.8}
                                    strokeDasharray="4,4"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </Svg>
                        </Animated.View>

                        {/* MuscliKnot Icon */}
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                            <View style={styles.iconBox}>
                                <Image
                                    source={require('@/assets/images/muscliknot-logo.png')}
                                    style={styles.iconImageContain}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>
                    </View>
                </Animated.View>

                {/* ─── Text ─── */}
                <Animated.View
                    style={[
                        styles.textBlock,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.title}>
                        Connect to{'\n'}Apple Health
                    </Text>
                    <Text style={styles.subtitle}>
                        Sync your daily activity between MuscliKnot and the Health app to have the most thorough data.
                    </Text>
                </Animated.View>
            </View>

            {/* ─── Bottom Actions ─── */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleConnect}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.continueText}>Continue</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                    disabled={loading}
                    activeOpacity={0.6}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    /* ── Layout ── */
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    /* ── Illustration area ── */
    illustrationWrapper: {
        width: '100%',
        height: 220,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 44,
    },

    /* ── Labels (pill chips) ── */
    labelPill: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 9,
        zIndex: 10,
    },
    labelText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.2,
    },

    /* ── Logo icons row ── */
    logosRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        // subtle shadow
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    iconImage: {
        width: '100%',
        height: '100%',
    },
    iconImageContain: {
        width: '85%',
        height: '85%',
    },

    /* ── Curved dotted connector ── */
    arcContainer: {
        marginHorizontal: 6,
        marginBottom: 14,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    /* ── Text block ── */
    textBlock: {
        alignItems: 'center',
        paddingHorizontal: 8,
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
        color: 'rgba(255,255,255,0.55)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 310,
    },

    /* ── Bottom actions ── */
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    continueButton: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    continueText: {
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
