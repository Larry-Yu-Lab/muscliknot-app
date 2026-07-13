import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// ─── Animated Background Orbs ──────────────────────────────────────────
const BackgroundOrbs = ({ step }: { step: number }) => {
    const pulse = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 0.8, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const orbColor = step === 0 ? 'rgba(249,116,21,0.12)' : step === 1 ? 'rgba(250,204,21,0.10)' : 'rgba(34,197,94,0.10)';

    return (
        <View style={styles.orbsContainer} pointerEvents="none">
            <Animated.View style={[styles.orb, styles.orbTopLeft, { backgroundColor: orbColor, transform: [{ scale: pulse }] }]} />
            <Animated.View style={[styles.orb, styles.orbBottomRight, { backgroundColor: orbColor, transform: [{ scale: pulse }] }]} />
        </View>
    );
};

// ─── Animated Icon ─────────────────────────────────────────────────────
const AnimatedIcon = ({ step, fadeAnim, slideAnim }: { step: number; fadeAnim: Animated.Value; slideAnim: Animated.Value }) => {
    const glowPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, { toValue: 1.2, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(glowPulse, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const configs = [
        { icon: 'gift-outline' as const, iconType: 'mci', color: '#f97316', glowColor: 'rgba(249,116,21,0.25)', iconColor: '#fff', size: 52 },
        { icon: 'notifications' as const, iconType: 'ion', color: '#facc15', glowColor: 'rgba(250,204,21,0.22)', iconColor: '#23170f', size: 48 },
        { icon: 'shield-check' as const, iconType: 'mci', color: '#22c55e', glowColor: 'rgba(34,197,94,0.22)', iconColor: '#fff', size: 52 },
    ];

    const c = configs[step];

    return (
        <Animated.View style={[styles.iconWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Pulsing glow */}
            <Animated.View style={[styles.iconGlow, { backgroundColor: c.glowColor, transform: [{ scale: glowPulse }] }]} />
            {/* Outer glass ring */}
            <View style={styles.iconGlassRing}>
                {/* Inner colored circle */}
                <View style={[styles.iconInner, { backgroundColor: c.color, shadowColor: c.color }]}>
                    {c.iconType === 'mci' ? (
                        <MaterialCommunityIcons name={c.icon as any} size={c.size} color={c.iconColor} />
                    ) : (
                        <Ionicons name={c.icon as any} size={c.size} color={c.iconColor} />
                    )}
                </View>
            </View>
        </Animated.View>
    );
};

// ─── Feature Card (Screen 1) ───────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) => {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideIn = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(slideIn, { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            ]).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[styles.featureCard, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
            <View style={styles.featureCardIcon}>
                <Ionicons name={icon as any} size={22} color="#f97316" />
            </View>
            <View style={styles.featureCardText}>
                <Text style={styles.featureCardTitle}>{title}</Text>
                <Text style={styles.featureCardDesc}>{desc}</Text>
            </View>
        </Animated.View>
    );
};

// ─── Checklist Item (Screen 3) ─────────────────────────────────────────
const CheckItem = ({ text, delay }: { text: string; delay: number }) => {
    const fadeIn = useRef(new Animated.Value(0)).current;
    const slideIn = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeIn, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.timing(slideIn, { toValue: 0, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            ]).start();
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[styles.checkRow, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
            <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.checkText}>{text}</Text>
        </Animated.View>
    );
};

// ─── Timeline (Screen 3) ──────────────────────────────────────────────
const Timeline = ({ t }: { t: (key: any) => string }) => (
    <View style={styles.timelineContainer}>
        <View style={styles.timelineRow}>
            {/* Today */}
            <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: '#22c55e' }]}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
                <Text style={styles.timelineLabel}>{t('trialToday' as any)}</Text>
                <Text style={styles.timelineSub}>{t('trialFree' as any)}</Text>
            </View>

            {/* Line */}
            <View style={styles.timelineLine}>
                <View style={styles.timelineLineFill} />
            </View>

            {/* Reminder */}
            <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: '#facc15' }]}>
                    <Ionicons name="notifications" size={12} color="#23170f" />
                </View>
                <Text style={styles.timelineLabel}>Day 12</Text>
                <Text style={styles.timelineSub}>Reminder</Text>
            </View>

            {/* Line */}
            <View style={styles.timelineLine}>
                <View style={[styles.timelineLineFill, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
            </View>

            {/* Day 14 */}
            <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' }]}>
                    <Ionicons name="flag" size={12} color="rgba(255,255,255,0.5)" />
                </View>
                <Text style={styles.timelineLabel}>{t('trialDay14' as any)}</Text>
                <Text style={styles.timelineSub}>{t('trialEnds' as any)}</Text>
            </View>
        </View>
    </View>
);

// ─── Main Component ────────────────────────────────────────────────────

export default function SignupSuccessScreen() {
    const router = useRouter();
    const { language } = usePreferences();
    const { user } = useAuth();
    const [step, setStep] = useState(0);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const contentFade = useRef(new Animated.Value(1)).current;
    const contentSlide = useRef(new Animated.Value(0)).current;

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const animateTransition = (nextStep: number) => {
        // Fade out + slide up
        Animated.parallel([
            Animated.timing(contentFade, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(contentSlide, { toValue: -20, duration: 200, useNativeDriver: true }),
        ]).start(() => {
            setStep(nextStep);
            // Reset position below and fade in
            contentSlide.setValue(30);
            Animated.parallel([
                Animated.timing(contentFade, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.timing(contentSlide, { toValue: 0, duration: 350, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            ]).start();
        });
    };

    const STRIPE_TRIAL_URL = 'https://buy.stripe.com/14A28q1Az27p1jcdIx9oc00';

    const handleNext = async () => {
        if (step < 2) {
            animateTransition(step + 1);
        } else {
            // Pass the user's ID as a client_reference_id in the URL to associate the webhook event with this user
            const checkoutUrl = `${STRIPE_TRIAL_URL}?client_reference_id=${user?.id || ''}`;
            
            try {
                await WebBrowser.openBrowserAsync(checkoutUrl);
            } catch (err) {
                console.error('Failed to open web browser, falling back to Linking:', err);
                Linking.openURL(checkoutUrl);
            }
            
            router.replace('/(tabs)' as any);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)' as any);
    };

    // Entrance animation
    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(40);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        ]).start();
    }, []);

    // Button config per step
    const buttonStyles = [
        { bg: '#f97316', shadow: '#f97316' },
        { bg: 'rgba(255,255,255,0.08)', shadow: 'transparent' },
        { bg: '#22c55e', shadow: '#22c55e' },
    ];
    const currentButton = buttonStyles[step];

    return (
        <SafeAreaView style={styles.container}>
            <BackgroundOrbs step={step} />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 32 }} />
                <Text style={styles.headerTitle}>
                    {step === 0 ? t('successHeader') : step === 1 ? t('trialNoPay' as any) : ''}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                    <Ionicons name="close" size={12} color="rgba(255,255,255,0.1)" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Animated.View style={[styles.content, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>

                {/* Icon */}
                <AnimatedIcon step={step} fadeAnim={fadeAnim} slideAnim={slideAnim} />

                {/* Screen 1: Try for Free */}
                {step === 0 && (
                    <>
                        <View style={styles.textBlock}>
                            <Text style={styles.title}>{t('trialTitle1' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle1' as any)}</Text>
                        </View>

                        <View style={styles.featureCardsContainer}>
                            <FeatureCard
                                icon="fitness-outline"
                                title={t('trialFeature1' as any)}
                                desc="Personalized routines"
                                delay={200}
                            />
                            <FeatureCard
                                icon="body-outline"
                                title={t('trialFeature2' as any)}
                                desc="Target problem areas"
                                delay={350}
                            />
                            <FeatureCard
                                icon="analytics-outline"
                                title={t('trialFeature3' as any)}
                                desc="Track your progress"
                                delay={500}
                            />
                        </View>
                    </>
                )}

                {/* Screen 2: Reminder */}
                {step === 1 && (
                    <>
                        <View style={styles.textBlock}>
                            <Text style={styles.title}>{t('trialTitle2' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle2' as any)}</Text>
                        </View>

                        {/* Reassurance cards */}
                        <View style={styles.reassuranceContainer}>
                            <View style={styles.reassuranceCard}>
                                <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.6)" />
                                <Text style={styles.reassuranceText}>No charge today</Text>
                            </View>
                            <View style={styles.reassuranceCard}>
                                <Ionicons name="close-circle-outline" size={20} color="rgba(255,255,255,0.6)" />
                                <Text style={styles.reassuranceText}>Cancel anytime</Text>
                            </View>
                            <View style={styles.reassuranceCard}>
                                <Ionicons name="notifications-outline" size={20} color="rgba(255,255,255,0.6)" />
                                <Text style={styles.reassuranceText}>Reminder on Day 12</Text>
                            </View>
                        </View>
                    </>
                )}

                {/* Screen 3: Start Trial */}
                {step === 2 && (
                    <>
                        <View style={styles.textBlock}>
                            <Text style={styles.title}>{t('trialTitle3' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle3' as any)}</Text>
                        </View>

                        {/* Feature checklist */}
                        <View style={styles.checklistContainer}>
                            <CheckItem text={t('trialFeature1' as any)} delay={100} />
                            <CheckItem text={t('trialFeature2' as any)} delay={200} />
                            <CheckItem text={t('trialFeature3' as any)} delay={300} />
                        </View>

                        {/* Timeline */}
                        <Timeline t={t as any} />
                    </>
                )}
            </Animated.View>

            {/* Bottom */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: currentButton.bg,
                            shadowColor: currentButton.shadow,
                            borderWidth: step === 1 ? 1 : 0,
                            borderColor: step === 1 ? 'rgba(255,255,255,0.12)' : 'transparent',
                        },
                    ]}
                    onPress={handleNext}
                    activeOpacity={0.85}
                >
                    <Text style={[styles.buttonText, step === 2 && { letterSpacing: 0.5 }]}>
                        {step === 0 ? t('trialCta1' as any) : step === 1 ? t('trialCta2' as any) : t('trialCta3' as any)}
                    </Text>
                    {step === 2 && (
                        <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    )}
                </TouchableOpacity>

                {/* Subtle guarantees */}
                {step === 2 && (
                    <View style={styles.guaranteesRow}>
                        <View style={styles.guaranteeItem}>
                            <Ionicons name="lock-closed" size={11} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.guaranteeText}>Secure</Text>
                        </View>
                        <View style={styles.guaranteeDot} />
                        <View style={styles.guaranteeItem}>
                            <Ionicons name="shield-checkmark" size={11} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.guaranteeText}>Cancel anytime</Text>
                        </View>
                        <View style={styles.guaranteeDot} />
                        <View style={styles.guaranteeItem}>
                            <Ionicons name="card" size={11} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.guaranteeText}>No charge now</Text>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23170f',
    },

    // Background orbs
    orbsContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        overflow: 'hidden',
    },
    orb: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
    },
    orbTopLeft: {
        top: -100,
        left: -80,
    },
    orbBottomRight: {
        bottom: -100,
        right: -80,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        zIndex: 10,
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    closeButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Content
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 28,
        zIndex: 10,
    },

    // Icon
    iconWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    iconGlow: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    iconGlassRing: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconInner: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },

    // Text
    textBlock: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 38,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.55)',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 300,
    },

    // Feature Cards (Screen 1)
    featureCardsContainer: {
        width: '100%',
        gap: 10,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
    },
    featureCardIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(249,116,21,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureCardText: {
        flex: 1,
        gap: 2,
    },
    featureCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    featureCardDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },

    // Reassurance (Screen 2)
    reassuranceContainer: {
        width: '100%',
        gap: 10,
    },
    reassuranceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
    },
    reassuranceText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.75)',
    },

    // Checklist (Screen 3)
    checklistContainer: {
        width: '100%',
        gap: 12,
        paddingHorizontal: 4,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    checkCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    // Timeline
    timelineContainer: {
        width: '100%',
        paddingHorizontal: 8,
        marginTop: 4,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    timelineNode: {
        alignItems: 'center',
        gap: 5,
        width: 70,
    },
    timelineCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    timelineSub: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.35)',
        fontWeight: '500',
    },
    timelineLine: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginTop: 14,
        marginHorizontal: 2,
        borderRadius: 1,
        overflow: 'hidden',
    },
    timelineLineFill: {
        width: '100%',
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 1,
    },

    // Bottom
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 44,
        gap: 16,
        zIndex: 10,
    },

    // Button
    button: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },

    // Guarantees
    guaranteesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    guaranteeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    guaranteeText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.25)',
        fontWeight: '500',
    },
    guaranteeDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
});
