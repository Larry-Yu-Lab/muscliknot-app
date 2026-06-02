import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { requestHealthKitPermission, setHealthKitEnabled } from '@/utils/healthKit';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Fixed scene size for the illustration — all child positions are absolute within this box
const SCENE = 280;

export default function AppleHealthScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleConnect = async () => {
        try {
            setLoading(true);
            const granted = await requestHealthKitPermission();
            await setHealthKitEnabled(granted);

            if (granted) {
                Alert.alert(
                    '✅ Connected!',
                    'MuscliKnot is now syncing with Apple Health. Your workouts and recovery sessions will automatically appear in the Health app.',
                    [{ text: 'Continue', onPress: () => router.push('/onboarding/rating') }]
                );
            } else {
                Alert.alert(
                    'Connection Skipped',
                    'Apple Health permissions were not granted. You can enable this later in your Profile settings.',
                    [{ text: 'OK', onPress: () => router.push('/onboarding/rating') }]
                );
            }
        } catch (error) {
            console.error('Failed to request HealthKit permissions:', error);
            router.push('/onboarding/rating');
        } finally {
            setLoading(false);
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
        <SafeAreaView style={styles.container}>
            {/* Progress Header */}
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '82%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                {/* ── Illustration ── */}
                <Animated.View style={[styles.scene, { opacity: fadeAnim }]}>
                    {/* Concentric rings for deep glow effect */}
                    <View style={styles.glowRing1} />
                    <View style={styles.glowRing2} />
                    {/* Large soft background circle */}
                    <View style={styles.bgCircle} />

                    {/* Dotted curved paths (SVG) */}
                    <View style={styles.svgLayer}>
                        <Svg width={SCENE} height={SCENE} viewBox={`0 0 ${SCENE} ${SCENE}`}>
                            {/* Health icon → checkmark */}
                            <Path
                                d="M 82 188 C 84 152, 108 132, 130 125"
                                stroke="rgba(249,115,22,0.35)"
                                strokeWidth={1.5}
                                strokeDasharray="5,4"
                                fill="none"
                                strokeLinecap="round"
                            />
                            {/* Checkmark → app icon */}
                            <Path
                                d="M 150 118 C 168 108, 182 92, 194 78"
                                stroke="rgba(249,115,22,0.5)"
                                strokeWidth={1.5}
                                strokeDasharray="5,4"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </Svg>
                    </View>

                    {/* Apple Health icon — lower-left */}
                    <View style={styles.healthPos}>
                        <View style={styles.healthBox}>
                            <Image
                                source={require('@/assets/images/apple-health-icon.png')}
                                style={styles.iconFill}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* MuscliKnot icon — upper-right */}
                    <View style={styles.appPos}>
                        <View style={styles.appBox}>
                            <Image
                                source={require('@/assets/images/muscliknot-logo.png')}
                                style={styles.iconContain}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Checkmark badge — center on the path */}
                    <View style={styles.checkPos}>
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={14} color="#fff" />
                        </View>
                    </View>

                    {/* Labels in mini widget boxes positioned around scene */}
                    <View style={[styles.widget, styles.posWorkouts]}>
                        <Ionicons name="barbell" size={12} color="#f97316" style={styles.widgetIcon} />
                        <Text style={styles.widgetTxt}>Workouts</Text>
                    </View>
                    <View style={[styles.widget, styles.posMobility]}>
                        <Ionicons name="body" size={12} color="#f97316" style={styles.widgetIcon} />
                        <Text style={styles.widgetTxt}>Mobility</Text>
                    </View>
                    <View style={[styles.widget, styles.posRecovery]}>
                        <Ionicons name="leaf" size={12} color="#f97316" style={styles.widgetIcon} />
                        <Text style={styles.widgetTxt}>Recovery</Text>
                    </View>
                    <View style={[styles.widget, styles.posVitals]}>
                        <Ionicons name="pulse" size={12} color="#f97316" style={styles.widgetIcon} />
                        <Text style={styles.widgetTxt}>Vitals</Text>
                    </View>
                </Animated.View>

                {/* ── Text ── */}
                <Animated.View
                    style={[
                        styles.textBlock,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <Text style={styles.title}>Connect to{'\n'}Apple Health</Text>
                    <Text style={styles.subtitle}>
                        Sync your daily activity between MuscliKnot and the Health app to have the most thorough data.
                    </Text>
                </Animated.View>
            </View>

            {/* ── Bottom ── */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={handleConnect}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.continueTxt}>Continue</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.skipBtn}
                    onPress={handleSkip}
                    disabled={loading}
                    activeOpacity={0.6}
                >
                    <Text style={styles.skipTxt}>Skip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

/* ────────────────────────────────────────────── */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },

    /* Header */
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
    progressContainer: { flex: 1, height: 4 },
    progressBarBg: {
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

    /* Content */
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    /* ── Scene (280 × 280 absolute-position canvas) ── */
    scene: {
        width: SCENE,
        height: SCENE,
        position: 'relative',
        marginBottom: 36,
    },
    glowRing1: {
        position: 'absolute',
        top: -15,
        left: -15,
        width: SCENE + 30,
        height: SCENE + 30,
        borderRadius: (SCENE + 30) / 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.015)',
        backgroundColor: 'transparent',
    },
    glowRing2: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCENE,
        height: SCENE,
        borderRadius: SCENE / 2,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.035)',
        backgroundColor: 'transparent',
    },
    bgCircle: {
        position: 'absolute',
        top: 15,
        left: 15,
        width: SCENE - 30,
        height: SCENE - 30,
        borderRadius: (SCENE - 30) / 2,
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    svgLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCENE,
        height: SCENE,
    },

    /* Apple Health icon — lower-left */
    healthPos: { position: 'absolute', top: 155, left: 40 },
    healthBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    iconFill: { width: '100%', height: '100%' },

    /* MuscliKnot icon — upper-right */
    appPos: { position: 'absolute', top: 42, right: 28 },
    appBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: 'rgba(249,115,22,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    iconContain: { width: '80%', height: '80%' },

    /* Checkmark badge */
    checkPos: { position: 'absolute', top: 112, left: 128 },
    checkBadge: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#f97316',
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    /* Widgets (Frosted Glass Chips) */
    widget: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.14)',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 2,
    },
    widgetIcon: {
        marginRight: 6,
    },
    widgetTxt: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    posWorkouts: { top: 54, left: 16 },
    posMobility: { top: 108, left: -12 },
    posRecovery: { top: 114, right: -4 },
    posVitals: { top: 164, right: 14 },

    /* Text */
    textBlock: { alignItems: 'center', paddingHorizontal: 8 },
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
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 310,
    },

    /* Bottom */
    bottom: { paddingHorizontal: 24, paddingBottom: 32 },
    continueBtn: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    continueTxt: { color: '#000', fontSize: 18, fontWeight: '600' },
    skipBtn: { marginTop: 16, alignItems: 'center' },
    skipTxt: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
