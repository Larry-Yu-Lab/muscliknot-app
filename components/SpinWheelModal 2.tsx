import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getOfferings, purchasePackage } from '@/utils/purchases';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Linking
} from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.82, 320);
const RADIUS = WHEEL_SIZE / 2;

export interface WheelSlice {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    textColor: string;
    isLoser?: boolean;
    discountPlan: 'annual' | 'monthly' | 'trial';
    priceDisplay: string;
    originalPrice: string;
    badgeText: string;
}

const SLICES: WheelSlice[] = [
    {
        id: 'slice_50_annual',
        title: '50% OFF',
        subtitle: 'Annual Plan',
        icon: 'crown',
        color: '#f97316',
        textColor: '#ffffff',
        discountPlan: 'annual',
        priceDisplay: '$17.99/yr ($1.49/mo)',
        originalPrice: '$35.88',
        badgeText: '🔥 SAVE 50% TODAY'
    },
    {
        id: 'slice_7d_trial',
        title: '7-DAY VIP',
        subtitle: 'Free Trial',
        icon: 'flash',
        color: '#eab308',
        textColor: '#1c1917',
        discountPlan: 'trial',
        priceDisplay: '$0.00 Due Today',
        originalPrice: '7 Days Free, then $35.88/yr',
        badgeText: '⚡ 100% FREE TRIAL'
    },
    {
        id: 'slice_30_monthly',
        title: '30% OFF',
        subtitle: 'Monthly Plan',
        icon: 'flame',
        color: '#3b82f6',
        textColor: '#ffffff',
        discountPlan: 'monthly',
        priceDisplay: '$2.79/month',
        originalPrice: '$3.99/mo',
        badgeText: '🎉 30% DISCOUNT'
    },
    {
        id: 'slice_1m_free',
        title: '1 MO FREE',
        subtitle: 'With Annual',
        icon: 'gift',
        color: '#10b981',
        textColor: '#ffffff',
        discountPlan: 'annual',
        priceDisplay: '13 Months for the Price of 12',
        originalPrice: '$35.88/yr',
        badgeText: '🎁 1 MONTH BONUS'
    },
    {
        id: 'slice_zero_luck',
        title: 'ZERO LUCK!',
        subtitle: 'No Reward',
        icon: 'skull',
        color: '#27272a',
        textColor: '#71717a',
        isLoser: true, // ⚠️ GUARANTEED 0% SELECTION IN WHEEL LOGIC
        discountPlan: 'annual',
        priceDisplay: '',
        originalPrice: '',
        badgeText: ''
    },
    {
        id: 'slice_3d_pass',
        title: '3-DAY VIP',
        subtitle: 'Free Pass',
        icon: 'star',
        color: '#8b5cf6',
        textColor: '#ffffff',
        discountPlan: 'trial',
        priceDisplay: '$0.00 Due Today',
        originalPrice: '3 Days Free Pass',
        badgeText: '✨ FREE ACCESS'
    }
];

const NUM_SLICES = SLICES.length;
const ANGLE_PER_SLICE = 360 / NUM_SLICES; // 60 degrees

// Helper to create an SVG pie slice path
function createSlicePath(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number) {
    const startRad = ((startAngleDeg - 90) * Math.PI) / 180;
    const endRad = ((endAngleDeg - 90) * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';

    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

// Confetti Particle Component
const ConfettiParticle = ({ index }: { index: number }) => {
    const animY = useRef(new Animated.Value(0)).current;
    const animX = useRef(new Animated.Value(0)).current;
    const animRotate = useRef(new Animated.Value(0)).current;
    const animOpacity = useRef(new Animated.Value(1)).current;

    const colors = ['#f97316', '#eab308', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
    const color = colors[index % colors.length];
    const initialX = (Math.random() - 0.5) * width * 0.8;
    const targetX = initialX + (Math.random() - 0.5) * 140;
    const targetY = -(Math.random() * 240 + 100);
    const size = Math.random() * 8 + 6;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animY, {
                toValue: targetY,
                duration: 1200 + Math.random() * 600,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.timing(animX, {
                toValue: targetX,
                duration: 1200 + Math.random() * 600,
                useNativeDriver: true,
            }),
            Animated.timing(animRotate, {
                toValue: Math.random() * 720 - 360,
                duration: 1500,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(900),
                Animated.timing(animOpacity, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const rotateInterpolate = animRotate.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    backgroundColor: color,
                    width: size,
                    height: size * (index % 2 === 0 ? 1 : 1.6),
                    borderRadius: index % 3 === 0 ? size / 2 : 2,
                    opacity: animOpacity,
                    transform: [
                        { translateX: animX },
                        { translateY: animY },
                        { rotate: rotateInterpolate },
                    ],
                },
            ]}
        />
    );
};

interface SpinWheelModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ visible, onClose }) => {
    const { theme } = usePreferences();
    const { updateUser } = useUser();

    const [isSpinning, setIsSpinning] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [wonSlice, setWonSlice] = useState<WheelSlice | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const needleAnim = useRef(new Animated.Value(0)).current;
    const popAnim = useRef(new Animated.Value(0)).current;
    const currentAngle = useRef(0);

    // Countdown Timer when reward is shown
    useEffect(() => {
        let interval: any;
        if (hasWon && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [hasWon, timeLeft]);

    // Button glowing pulse
    useEffect(() => {
        if (!isSpinning && !hasWon) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isSpinning, hasWon]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSpin = () => {
        if (isSpinning || hasWon) return;
        setIsSpinning(true);

        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // 🎯 Rigged Selection: Pick randomly among winning slices (Index 0, 1, 2, 3, or 5)
        // Strictly exclude slice 4 ("Zero Luck")!
        const validWinningIndices = [0, 1, 2, 3, 5];
        // Weight 50% OFF Annual (index 0) and 7-Day Trial (index 1) highest for maximum conversions
        const weightedPool = [0, 0, 1, 1, 2, 3, 5];
        const winningIndex = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        const selectedSlice = SLICES[winningIndex];

        // The pointer is at the TOP (0 degrees).
        // Slice `i` center is at (i * 60 + 30) degrees.
        const sliceCenterAngle = winningIndex * ANGLE_PER_SLICE + ANGLE_PER_SLICE / 2;
        const baseSpins = 6 * 360; // 6 dramatic rotations
        const targetStopAngle = baseSpins + (360 - sliceCenterAngle);

        // Needle bounce & haptic tick on every slice boundary
        let lastTickStep = 0;
        const spinListener = spinAnim.addListener(({ value }) => {
            const currentStep = Math.floor(value / ANGLE_PER_SLICE);
            if (currentStep !== lastTickStep) {
                lastTickStep = currentStep;
                
                // Needle bounce
                Animated.sequence([
                    Animated.timing(needleAnim, { toValue: -15, duration: 40, useNativeDriver: true }),
                    Animated.timing(needleAnim, { toValue: 0, duration: 70, useNativeDriver: true }),
                ]).start();

                if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            }
        });

        Animated.timing(spinAnim, {
            toValue: targetStopAngle,
            duration: 4800,
            easing: Easing.bezier(0.12, 0.95, 0.18, 1), // High initial speed with smooth deceleration
            useNativeDriver: true,
        }).start(async () => {
            spinAnim.removeListener(spinListener);
            currentAngle.current = targetStopAngle % 360;
            setIsSpinning(false);
            setWonSlice(selectedSlice);
            setHasWon(true);

            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            // Animate win card spring entrance
            Animated.spring(popAnim, {
                toValue: 1,
                friction: 6,
                tension: 45,
                useNativeDriver: true,
            }).start();

            // Save in AsyncStorage so it only shows once as the welcome gift
            await AsyncStorage.setItem('has_spun_welcome_wheel', 'true');
        });
    };

    const [availablePackages, setAvailablePackages] = useState<any[]>([]);
    const [isRestoring, setIsRestoring] = useState(false);

    // Preload offerings on mount
    useEffect(() => {
        if (visible) {
            getOfferings().then((pkgs) => {
                if (pkgs && pkgs.length > 0) {
                    setAvailablePackages(pkgs);
                }
            }).catch((err) => {
                console.log('[SpinWheel] Could not prefetch offerings:', err);
            });
        }
    }, [visible]);

    const handleClaimReward = async () => {
        if (isPurchasing || isRestoring) return;
        setIsPurchasing(true);

        try {
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }

            const packages = availablePackages.length > 0 ? availablePackages : await getOfferings();
            if (packages.length > 0) {
                // Find matching package based on discountPlan
                const isMonthly = wonSlice?.discountPlan === 'monthly';
                const packageToBuy = packages.find(p => {
                    const type = (p.packageType || '').toUpperCase();
                    const id = (p.identifier || '').toLowerCase();
                    const prodId = (p.product?.identifier || '').toLowerCase();
                    if (isMonthly) {
                        return type === 'MONTHLY' || id.includes('month') || prodId.includes('month');
                    }
                    return type === 'ANNUAL' || id.includes('annual') || id.includes('year') || prodId.includes('year');
                }) || packages[0];
                
                const res = await purchasePackage(packageToBuy);
                if (res.success) {
                    await updateUser({ isPremium: true });
                    Alert.alert(
                        '🎉 Welcome to Elite!',
                        'Your reward has been claimed and your VIP Access is now active!',
                        [{ text: 'Get Started', onPress: onClose }]
                    );
                    return;
                } else if (res.error && res.error !== 'User cancelled the purchase') {
                    Alert.alert('Purchase Note', res.error);
                }
                return;
            }

            Alert.alert(
                'Store Unavailable',
                'Unable to retrieve subscriptions from the App Store. Please check your connection and try again.'
            );
        } catch (e: any) {
            console.error('Error claiming wheel reward:', e);
            Alert.alert('Error', 'Could not complete purchase. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleRestorePurchases = async () => {
        if (isRestoring || isPurchasing) return;
        setIsRestoring(true);
        try {
            const { restorePurchases } = await import('@/utils/purchases');
            const result = await restorePurchases();
            if (result.success) {
                await updateUser({ isPremium: true });
                Alert.alert(
                    'Purchases Restored',
                    'Your active subscription was found and your VIP access has been restored!',
                    [{ text: 'Get Started', onPress: onClose }]
                );
            } else {
                Alert.alert(
                    'No Active Subscription',
                    'No active purchases were found for this Apple ID.',
                    [{ text: 'OK' }]
                );
            }
        } catch (e: any) {
            console.error('Error restoring purchases in spin wheel:', e);
            Alert.alert('Restore Failed', 'Unable to restore purchases at this time.');
        } finally {
            setIsRestoring(false);
        }
    };

    const openTerms = () => {
        Linking.openURL('https://muscliknot.com/terms').catch(() => {});
    };

    const openPrivacy = () => {
        Linking.openURL('https://muscliknot.com/privacy').catch(() => {});
    };

    const handleClose = async () => {
        try {
            await AsyncStorage.setItem('last_wheel_dismiss_timestamp', Date.now().toString());
        } catch (e) {
            console.error('Error recording wheel dismissal:', e);
        }
        onClose();
    };

    const spinInterpolate = spinAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    const needleRotate = needleAnim.interpolate({
        inputRange: [-30, 30],
        outputRange: ['-30deg', '30deg'],
    });

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    
                    {/* Confetti Explosion on Win */}
                    {hasWon && (
                        <View style={styles.confettiContainer} pointerEvents="none">
                            {Array.from({ length: 36 }).map((_, i) => (
                                <ConfettiParticle key={i} index={i} />
                            ))}
                        </View>
                    )}

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerBadge}>
                            <Ionicons name="sparkles" size={13} color="#f97316" />
                            <Text style={styles.headerBadgeText}>LIMITED TIME WELCOME GIFT</Text>
                        </View>
                        {!isSpinning && !isPurchasing && !isRestoring && (
                            <TouchableOpacity style={styles.closeBtn} onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close" size={18} color="rgba(255,255,255,0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!hasWon ? (
                        <>
                            <Text style={styles.mainTitle}>Spin The Lucky Wheel!</Text>
                            <Text style={styles.subTitle}>
                                Spin once to unlock your exclusive VIP trial & discount rewards.
                            </Text>

                            {/* Wheel Area */}
                            <View style={styles.wheelWrapper}>
                                
                                {/* Top Pointer Needle */}
                                <Animated.View style={[styles.pointerContainer, { transform: [{ rotate: needleRotate }] }]}>
                                    <View style={styles.pointerNeedle} />
                                    <View style={styles.pointerCap} />
                                </Animated.View>

                                {/* Rotating Wheel */}
                                <Animated.View
                                    style={[
                                        styles.wheelCircle,
                                        { transform: [{ rotate: spinInterpolate }] },
                                    ]}
                                >
                                    <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
                                        <Defs>
                                            <RadialGradient id="goldRim" cx="50%" cy="50%" rx="50%" ry="50%">
                                                <Stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                                                <Stop offset="100%" stopColor="#b45309" stopOpacity="1" />
                                            </RadialGradient>
                                        </Defs>

                                        {/* Outer Metallic Bezel */}
                                        <Circle
                                            cx={RADIUS}
                                            cy={RADIUS}
                                            r={RADIUS - 2}
                                            fill="#18181b"
                                            stroke="url(#goldRim)"
                                            strokeWidth="6"
                                        />

                                        {/* Slices */}
                                        {SLICES.map((slice, index) => {
                                            const startAngle = index * ANGLE_PER_SLICE;
                                            const endAngle = (index + 1) * ANGLE_PER_SLICE;
                                            const path = createSlicePath(RADIUS, RADIUS, RADIUS - 5, startAngle, endAngle);

                                            // Text position along slice radial center
                                            const midAngle = startAngle + ANGLE_PER_SLICE / 2;
                                            const midRad = ((midAngle - 90) * Math.PI) / 180;
                                            const textRadius = RADIUS * 0.63;
                                            const textX = RADIUS + textRadius * Math.cos(midRad);
                                            const textY = RADIUS + textRadius * Math.sin(midRad);

                                            return (
                                                <G key={slice.id}>
                                                    <Path
                                                        d={path}
                                                        fill={slice.color}
                                                        stroke="#18181b"
                                                        strokeWidth="2.5"
                                                    />
                                                    <SvgText
                                                        x={textX}
                                                        y={textY - 6}
                                                        fill={slice.textColor}
                                                        fontSize="12"
                                                        fontWeight="900"
                                                        textAnchor="middle"
                                                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                                                    >
                                                        {slice.title}
                                                    </SvgText>
                                                    <SvgText
                                                        x={textX}
                                                        y={textY + 7}
                                                        fill={slice.textColor}
                                                        fontSize="7.5"
                                                        fontWeight="700"
                                                        opacity={0.85}
                                                        textAnchor="middle"
                                                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                                                    >
                                                        {slice.subtitle}
                                                    </SvgText>
                                                </G>
                                            );
                                        })}

                                        {/* Outer LED Light Studs */}
                                        {Array.from({ length: 18 }).map((_, i) => {
                                            const angle = (i * 360) / 180 * (Math.PI / 180);
                                            const dotR = RADIUS - 3;
                                            const dotX = RADIUS + dotR * Math.cos(angle);
                                            const dotY = RADIUS + dotR * Math.sin(angle);
                                            return (
                                                <Circle
                                                    key={i}
                                                    cx={dotX}
                                                    cy={dotY}
                                                    r={2}
                                                    fill={i % 2 === 0 ? '#fef08a' : '#ffffff'}
                                                    opacity={0.9}
                                                />
                                            );
                                        })}

                                        {/* Center Glowing Hub */}
                                        <Circle cx={RADIUS} cy={RADIUS} r={28} fill="#18181b" stroke="#f97316" strokeWidth="3" />
                                        <Circle cx={RADIUS} cy={RADIUS} r={14} fill="#f97316" />
                                        <Circle cx={RADIUS} cy={RADIUS} r={6} fill="#ffffff" opacity={0.6} />
                                    </Svg>
                                </Animated.View>
                            </View>

                            {/* Spin CTA Button */}
                            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%', marginTop: 22 }}>
                                <TouchableOpacity
                                    style={[styles.spinButton, isSpinning && { opacity: 0.6 }]}
                                    onPress={handleSpin}
                                    disabled={isSpinning}
                                    activeOpacity={0.85}
                                >
                                    <Ionicons name="color-wand" size={20} color="#fff" />
                                    <Text style={styles.spinButtonText}>
                                        {isSpinning ? 'SPINNING...' : 'TAP TO SPIN!'}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </>
                    ) : (
                        /* Winner Prize Card Celebration */
                        <Animated.View
                            style={[
                                styles.winnerContainer,
                                {
                                    opacity: popAnim,
                                    transform: [
                                        {
                                            scale: popAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.6, 1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <View style={styles.trophyGlow}>
                                <View style={[styles.trophyCircle, { backgroundColor: wonSlice?.color || '#f97316' }]}>
                                    <MaterialCommunityIcons name="crown" size={44} color="#fff" />
                                </View>
                            </View>

                            <Text style={styles.congratsTitle}>🎉 CONGRATULATIONS!</Text>
                            <Text style={styles.winnerSubtitle}>You just unlocked an exclusive welcome deal:</Text>

                            {/* High-Converting Prize Card */}
                            <View style={[styles.prizeCard, { borderColor: wonSlice?.color || '#f97316' }]}>
                                <View style={[styles.dealBadge, { backgroundColor: wonSlice?.color || '#f97316' }]}>
                                    <Text style={styles.dealBadgeText}>{wonSlice?.badgeText}</Text>
                                </View>
                                
                                <Text style={[styles.prizeTitle, { color: wonSlice?.color || '#f97316' }]}>
                                    {wonSlice?.title}
                                </Text>
                                <Text style={styles.prizeSub}>{wonSlice?.subtitle}</Text>

                                {/* Price Anchoring */}
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceHighlight}>{wonSlice?.priceDisplay}</Text>
                                    {wonSlice?.originalPrice ? (
                                        <Text style={styles.originalPriceText}>{wonSlice.originalPrice}</Text>
                                    ) : null}
                                </View>

                                {/* Feature checklist */}
                                <View style={styles.featureList}>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                        <Text style={styles.featureRowText}>Unlimited Gemini AI Recovery Plans</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                        <Text style={styles.featureRowText}>Full Posture Correction & Warm-Ups</Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                        <Text style={styles.featureRowText}>Deep Health Vault & Pain Tracking</Text>
                                    </View>
                                </View>

                                {/* Urgency Timer Badge */}
                                <View style={styles.timerBadge}>
                                    <Ionicons name="time-outline" size={14} color="#f59e0b" />
                                    <Text style={styles.timerText}>Offer reserved for: {formatTime(timeLeft)}</Text>
                                </View>
                            </View>

                            {/* Claim CTA Button */}
                            <TouchableOpacity
                                style={[styles.claimButton, { backgroundColor: wonSlice?.color || '#f97316' }, isPurchasing && { opacity: 0.8 }]}
                                onPress={handleClaimReward}
                                disabled={isPurchasing}
                                activeOpacity={0.85}
                            >
                                {isPurchasing ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text style={styles.claimButtonText}>CLAIM MY REWARD NOW</Text>
                                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* Trust Guarantees */}
                            <View style={styles.guaranteesRow}>
                                <Ionicons name="shield-checkmark-outline" size={12} color="rgba(255,255,255,0.4)" />
                                <Text style={styles.guaranteeText}>Cancel anytime in Apple Settings • Secure 256-bit Checkout</Text>
                            </View>

                            {/* Restore Purchases & Legal Links */}
                            <View style={styles.legalRow}>
                                <TouchableOpacity onPress={handleRestorePurchases} disabled={isRestoring || isPurchasing} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Text style={styles.legalLink}>
                                        {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.legalDot}>•</Text>
                                <TouchableOpacity onPress={openTerms} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Text style={styles.legalLink}>Terms</Text>
                                </TouchableOpacity>
                                <Text style={styles.legalDot}>•</Text>
                                <TouchableOpacity onPress={openPrivacy} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Text style={styles.legalLink}>Privacy</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dismiss */}
                            {!isPurchasing && !isRestoring && (
                                <TouchableOpacity style={styles.declineBtn} onPress={handleClose}>
                                    <Text style={styles.declineText}>Maybe Later</Text>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.88)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalCard: {
        width: '100%',
        maxWidth: 375,
        backgroundColor: '#121215',
        borderRadius: 26,
        padding: 22,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 28,
        position: 'relative',
        overflow: 'hidden',
    },
    confettiContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confetti: {
        position: 'absolute',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(249,115,22,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    headerBadgeText: {
        color: '#f97316',
        fontSize: 10.5,
        fontWeight: '900',
        letterSpacing: 0.6,
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 23,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
    },
    subTitle: {
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 17,
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    wheelWrapper: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    wheelCircle: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
    },
    pointerContainer: {
        position: 'absolute',
        top: -14,
        zIndex: 30,
        alignItems: 'center',
    },
    pointerNeedle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 24,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#f97316',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    pointerCap: {
        position: 'absolute',
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#f97316',
    },
    spinButton: {
        backgroundColor: '#f97316',
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
    },
    spinButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    winnerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 4,
    },
    trophyGlow: {
        marginBottom: 10,
    },
    trophyCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 22,
        shadowColor: '#f97316',
    },
    congratsTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 3,
    },
    winnerSubtitle: {
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 12,
    },
    prizeCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderRadius: 18,
        padding: 16,
        alignItems: 'center',
        marginBottom: 14,
        position: 'relative',
    },
    dealBadge: {
        position: 'absolute',
        top: -12,
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 12,
    },
    dealBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    prizeTitle: {
        fontSize: 28,
        fontWeight: '900',
        marginTop: 4,
        marginBottom: 2,
    },
    prizeSub: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    priceContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    priceHighlight: {
        fontSize: 16,
        fontWeight: '800',
        color: '#22c55e',
    },
    originalPriceText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        textDecorationLine: 'line-through',
        marginTop: 2,
    },
    featureList: {
        width: '100%',
        gap: 6,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        marginBottom: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureRowText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
        fontWeight: '600',
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245,158,11,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    timerText: {
        color: '#f59e0b',
        fontSize: 11,
        fontWeight: '700',
    },
    claimButton: {
        width: '100%',
        height: 52,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    guaranteesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 6,
    },
    guaranteeText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10.5,
        fontWeight: '500',
    },
    legalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    legalLink: {
        color: 'rgba(255,255,255,0.45)',
        fontSize: 11,
        textDecorationLine: 'underline',
        fontWeight: '500',
    },
    legalDot: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 10,
    },
    declineBtn: {
        paddingVertical: 4,
    },
    declineText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12.5,
        fontWeight: '600',
    },
});
