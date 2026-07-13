import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── Floating Particles ────────────────────────────────────────────────
const FloatingParticles = () => (
    <View style={styles.particlesContainer}>
        <View style={[styles.particle, { top: '12%', left: '8%', width: 20, height: 20, backgroundColor: 'rgba(249,116,21,0.25)' }]} />
        <View style={[styles.particle, { top: '22%', right: '12%', width: 14, height: 14, backgroundColor: 'rgba(250,204,21,0.2)' }]} />
        <View style={[styles.particle, { top: '45%', left: '5%', width: 28, height: 28, backgroundColor: 'rgba(239,68,68,0.15)' }]} />
        <View style={[styles.particle, { top: '55%', right: '8%', width: 10, height: 10, backgroundColor: 'rgba(249,116,21,0.35)' }]} />
        <View style={[styles.particle, { bottom: '25%', left: '20%', width: 18, height: 18, backgroundColor: 'rgba(250,204,21,0.15)' }]} />
        <View style={[styles.particle, { bottom: '35%', right: '18%', width: 36, height: 36, backgroundColor: 'rgba(220,38,38,0.12)' }]} />
        <View style={[styles.particle, { top: '8%', left: '55%', width: 8, height: 8, backgroundColor: 'rgba(249,116,21,0.4)' }]} />
    </View>
);

// ─── Icon Components ───────────────────────────────────────────────────

const GiftIcon = () => (
    <View style={styles.iconContainer}>
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(249,116,21,0.2)' }]} />
        <View style={styles.glassCircle}>
            <View style={[styles.innerCircle, { backgroundColor: '#f97316' }]}>
                <MaterialCommunityIcons name="gift-outline" size={48} color="#fff" />
            </View>
        </View>
    </View>
);

const BellIcon = () => (
    <View style={styles.iconContainer}>
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(250,204,21,0.18)' }]} />
        <View style={styles.glassCircle}>
            <View style={[styles.innerCircle, { backgroundColor: '#facc15' }]}>
                <Ionicons name="notifications" size={44} color="#23170f" />
            </View>
        </View>
    </View>
);

const ShieldIcon = () => (
    <View style={styles.iconContainer}>
        <View style={[styles.iconGlow, { backgroundColor: 'rgba(34,197,94,0.18)' }]} />
        <View style={styles.glassCircle}>
            <View style={[styles.innerCircle, { backgroundColor: '#22c55e' }]}>
                <MaterialCommunityIcons name="shield-check" size={48} color="#fff" />
            </View>
        </View>
    </View>
);

// ─── Page Dots ─────────────────────────────────────────────────────────

const PageDots = ({ current, total }: { current: number; total: number }) => (
    <View style={styles.dotsContainer}>
        {Array.from({ length: total }).map((_, i) => (
            <View
                key={i}
                style={[
                    styles.dot,
                    i === current ? styles.dotActive : styles.dotInactive,
                ]}
            />
        ))}
    </View>
);

// ─── Feature Checklist Item ────────────────────────────────────────────

const FeatureItem = ({ text }: { text: string }) => (
    <View style={styles.featureRow}>
        <View style={styles.featureCheckCircle}>
            <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

// ─── Timeline ──────────────────────────────────────────────────────────

const Timeline = ({ t }: { t: (key: any) => string }) => (
    <View style={styles.timelineContainer}>
        <View style={styles.timelineRow}>
            {/* Today node */}
            <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: '#22c55e' }]}>
                    <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
                <Text style={styles.timelineLabel}>{t('trialToday' as any)}</Text>
                <Text style={styles.timelineSublabel}>{t('trialFree' as any)}</Text>
            </View>

            {/* Connecting line */}
            <View style={styles.timelineLine}>
                <View style={styles.timelineLineFill} />
                {/* Dashes */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <View key={i} style={[styles.timelineDash, { left: `${(i + 1) * 10}%` }]} />
                ))}
            </View>

            {/* Day 14 node */}
            <View style={styles.timelineNode}>
                <View style={[styles.timelineCircle, { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }]}>
                    <Ionicons name="flag" size={12} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.timelineLabel}>{t('trialDay14' as any)}</Text>
                <Text style={styles.timelineSublabel}>{t('trialEnds' as any)}</Text>
            </View>
        </View>
    </View>
);

// ─── Main Component ────────────────────────────────────────────────────

export default function SignupSuccessScreen() {
    const router = useRouter();
    const { language } = usePreferences();
    const [step, setStep] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const animateTransition = (nextStep: number) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setStep(nextStep);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
    };

    const STRIPE_TRIAL_URL = 'https://buy.stripe.com/14A28q1Az27p1jcdIx9oc00';

    const handleNext = () => {
        if (step < 2) {
            animateTransition(step + 1);
        } else {
            // Open Stripe payment link for free trial, then navigate to main app
            Linking.openURL(STRIPE_TRIAL_URL);
            router.replace('/(tabs)' as any);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FloatingParticles />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 48 }} />
                <Text style={styles.headerTitle}>
                    {step === 0 ? t('successHeader') : step === 1 ? t('trialNoPay' as any) : ''}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
                    <Ionicons name="close" size={18} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {step === 0 && (
                    <>
                        <GiftIcon />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{t('trialTitle1' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle1' as any)}</Text>
                        </View>
                    </>
                )}

                {step === 1 && (
                    <>
                        <BellIcon />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{t('trialTitle2' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle2' as any)}</Text>
                        </View>
                    </>
                )}

                {step === 2 && (
                    <>
                        <ShieldIcon />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{t('trialTitle3' as any)}</Text>
                            <Text style={styles.subtitle}>{t('trialSubtitle3' as any)}</Text>
                        </View>

                        {/* Feature Checklist */}
                        <View style={styles.featureList}>
                            <FeatureItem text={t('trialFeature1' as any)} />
                            <FeatureItem text={t('trialFeature2' as any)} />
                            <FeatureItem text={t('trialFeature3' as any)} />
                        </View>

                        {/* Timeline */}
                        <Timeline t={t as any} />
                    </>
                )}
            </Animated.View>

            {/* Bottom */}
            <View style={styles.bottom}>
                <PageDots current={step} total={3} />
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {step === 0 ? t('trialCta1' as any) : step === 1 ? t('trialCta2' as any) : t('trialCta3' as any)}
                    </Text>
                </TouchableOpacity>
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

    // Particles
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    particle: {
        position: 'absolute',
        borderRadius: 50,
        opacity: 0.6,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 10,
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Content
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
        gap: 32,
        zIndex: 10,
    },

    // Icon
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    iconGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    glassCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
    },

    // Text
    textContainer: {
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 320,
    },

    // Feature List
    featureList: {
        width: '100%',
        gap: 14,
        paddingHorizontal: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    featureCheckCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    // Timeline
    timelineContainer: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    timelineNode: {
        alignItems: 'center',
        gap: 6,
        width: 80,
    },
    timelineCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    timelineSublabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
    },
    timelineLine: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginTop: 15,
        marginHorizontal: 4,
        position: 'relative',
        borderRadius: 1,
    },
    timelineLineFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '30%',
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 1,
    },
    timelineDash: {
        position: 'absolute',
        top: -1,
        width: 2,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 1,
    },

    // Bottom
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 48,
        gap: 24,
        zIndex: 10,
    },

    // Page Dots
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 28,
        backgroundColor: '#f97316',
    },
    dotInactive: {
        width: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },

    // Button
    button: {
        backgroundColor: '#f97316',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
