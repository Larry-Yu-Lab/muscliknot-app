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
    View
} from 'react-native';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.85, 330);
const RADIUS = WHEEL_SIZE / 2;

export interface WheelSlice {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    iconType: 'ion' | 'mci';
    color: string;
    textColor: string;
    isLoser?: boolean;
    discountPlan?: 'annual' | 'monthly' | 'trial';
    discountMultiplier?: number; // e.g. 0.5 for 50% off
}

const SLICES: WheelSlice[] = [
    {
        id: 'slice_50_annual',
        title: '50% OFF',
        subtitle: 'Annual Plan',
        icon: 'crown',
        iconType: 'mci',
        color: '#f97316',
        textColor: '#ffffff',
        discountPlan: 'annual',
        discountMultiplier: 0.5
    },
    {
        id: 'slice_7d_trial',
        title: '7-DAY VIP',
        subtitle: 'Free Trial',
        icon: 'flash',
        iconType: 'ion',
        color: '#eab308',
        textColor: '#1c1917',
        discountPlan: 'trial'
    },
    {
        id: 'slice_30_monthly',
        title: '30% OFF',
        subtitle: 'Monthly Plan',
        icon: 'flame',
        iconType: 'ion',
        color: '#3b82f6',
        textColor: '#ffffff',
        discountPlan: 'monthly',
        discountMultiplier: 0.7
    },
    {
        id: 'slice_1m_free',
        title: '1 MO FREE',
        subtitle: 'With Annual',
        icon: 'gift',
        iconType: 'ion',
        color: '#10b981',
        textColor: '#ffffff',
        discountPlan: 'annual'
    },
    {
        id: 'slice_zero_luck',
        title: 'ZERO LUCK!',
        subtitle: 'Try Again Next Time',
        icon: 'skull',
        iconType: 'mci',
        color: '#374151',
        textColor: '#9ca3af',
        isLoser: true // GUARANTEED TO NEVER BE PICKED
    },
    {
        id: 'slice_3d_pass',
        title: '3-DAY VIP',
        subtitle: 'Free Pass',
        icon: 'star',
        iconType: 'ion',
        color: '#8b5cf6',
        textColor: '#ffffff',
        discountPlan: 'trial'
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

interface SpinWheelModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ visible, onClose }) => {
    const { theme } = usePreferences();
    const colors = Colors[theme];
    const { updateUser } = useUser();

    const [isSpinning, setIsSpinning] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [wonSlice, setWonSlice] = useState<WheelSlice | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
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
                    Animated.timing(pulseAnim, { toValue: 1.06, duration: 800, useNativeDriver: true }),
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

        // Rigged Selection: Pick randomly among the winning slices (Index 0, 1, 2, 3, or 5)
        // Strictly exclude slice 4 ("Zero Luck")!
        const validWinningIndices = [0, 1, 2, 3, 5];
        // Weight 50% OFF Annual (index 0) and 7-Day Trial (index 1) highest
        const weightedPool = [0, 0, 1, 1, 2, 3, 5];
        const winningIndex = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        const selectedSlice = SLICES[winningIndex];

        // Calculate target rotation angle
        // The pointer is at the TOP (0 degrees).
        // To have slice `i` land under the pointer, we rotate such that slice `i` center lands at top.
        const sliceCenterAngle = winningIndex * ANGLE_PER_SLICE + ANGLE_PER_SLICE / 2;
        const baseSpins = 5 * 360; // 5 full rotations for drama
        const targetStopAngle = baseSpins + (360 - sliceCenterAngle);

        // Haptic feedback tick interval
        let lastHapticStep = 0;
        const spinListener = spinAnim.addListener(({ value }) => {
            const currentStep = Math.floor(value / (ANGLE_PER_SLICE / 2));
            if (currentStep !== lastHapticStep) {
                lastHapticStep = currentStep;
                if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            }
        });

        Animated.timing(spinAnim, {
            toValue: targetStopAngle,
            duration: 4500,
            easing: Easing.bezier(0.15, 0.9, 0.2, 1), // Realistic decelerating physics
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

            // Animate win card entrance
            Animated.spring(popAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }).start();

            // Save in AsyncStorage so they don't get spammed
            await AsyncStorage.setItem('has_spun_welcome_wheel', 'true');
        });
    };

    const handleClaimReward = async () => {
        try {
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }

            // Attempt in-app purchase for the discounted package
            const packages = await getOfferings();
            if (packages.length > 0) {
                const packageToBuy = packages.find(p => p.packageType === 'ANNUAL') || packages[0];
                const res = await purchasePackage(packageToBuy);
                if (res.success) {
                    await updateUser({ isPremium: true });
                    Alert.alert('🎉 Reward Claimed!', 'Your Elite Membership has been successfully activated!');
                    onClose();
                    return;
                }
            }

            // Dev mode / fallback simulation
            await updateUser({ isPremium: true });
            Alert.alert('🎉 Reward Claimed!', 'Your VIP Access has been activated!');
            onClose();
        } catch (e: any) {
            console.error('Error claiming wheel reward:', e);
            Alert.alert('Claim Error', 'Could not complete claim. Please try again.');
        }
    };

    const spinInterpolate = spinAnim.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={[styles.modalCard, { backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)' }]}>
                    
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerBadge}>
                            <Ionicons name="sparkles" size={14} color="#f97316" />
                            <Text style={styles.headerBadgeText}>LIMITED TIME WELCOME GIFT</Text>
                        </View>
                        {!isSpinning && (
                            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                                <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!hasWon ? (
                        <>
                            <Text style={styles.mainTitle}>Spin The Lucky Wheel!</Text>
                            <Text style={styles.subTitle}>
                                As a new athlete, spin once to unlock exclusive discounts & VIP trial access.
                            </Text>

                            {/* Wheel Container */}
                            <View style={styles.wheelWrapper}>
                                {/* Top Pointer Needle */}
                                <View style={styles.pointerContainer}>
                                    <View style={styles.pointerShadow} />
                                    <View style={styles.pointerTriangle} />
                                    <View style={styles.pointerDot} />
                                </View>

                                {/* Rotating Wheel */}
                                <Animated.View
                                    style={[
                                        styles.wheelCircle,
                                        { transform: [{ rotate: spinInterpolate }] },
                                    ]}
                                >
                                    <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
                                        <Circle
                                            cx={RADIUS}
                                            cy={RADIUS}
                                            r={RADIUS - 2}
                                            fill="#1e1e24"
                                            stroke="#f97316"
                                            strokeWidth="4"
                                        />

                                        {SLICES.map((slice, index) => {
                                            const startAngle = index * ANGLE_PER_SLICE;
                                            const endAngle = (index + 1) * ANGLE_PER_SLICE;
                                            const path = createSlicePath(RADIUS, RADIUS, RADIUS - 4, startAngle, endAngle);

                                            // Calculate text position along the slice ray
                                            const midAngle = startAngle + ANGLE_PER_SLICE / 2;
                                            const midRad = ((midAngle - 90) * Math.PI) / 180;
                                            const textRadius = RADIUS * 0.65;
                                            const textX = RADIUS + textRadius * Math.cos(midRad);
                                            const textY = RADIUS + textRadius * Math.sin(midRad);

                                            return (
                                                <G key={slice.id}>
                                                    <Path
                                                        d={path}
                                                        fill={slice.color}
                                                        stroke="#18181b"
                                                        strokeWidth="2"
                                                    />
                                                    <SvgText
                                                        x={textX}
                                                        y={textY - 6}
                                                        fill={slice.textColor}
                                                        fontSize="12"
                                                        fontWeight="800"
                                                        textAnchor="middle"
                                                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                                                    >
                                                        {slice.title}
                                                    </SvgText>
                                                    <SvgText
                                                        x={textX}
                                                        y={textY + 8}
                                                        fill={slice.textColor}
                                                        fontSize="8"
                                                        fontWeight="600"
                                                        opacity={0.85}
                                                        textAnchor="middle"
                                                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                                                    >
                                                        {slice.subtitle}
                                                    </SvgText>
                                                </G>
                                            );
                                        })}

                                        {/* Center Cap */}
                                        <Circle cx={RADIUS} cy={RADIUS} r={28} fill="#18181b" stroke="#f97316" strokeWidth="3" />
                                        <Circle cx={RADIUS} cy={RADIUS} r={14} fill="#f97316" />
                                    </Svg>
                                </Animated.View>
                            </View>

                            {/* Spin CTA Button */}
                            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%', marginTop: 24 }}>
                                <TouchableOpacity
                                    style={[styles.spinButton, isSpinning && { opacity: 0.7 }]}
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
                        /* Winner Card Celebration */
                        <Animated.View
                            style={[
                                styles.winnerContainer,
                                {
                                    opacity: popAnim,
                                    transform: [
                                        {
                                            scale: popAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.7, 1],
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

                            <View style={[styles.prizeCard, { borderColor: wonSlice?.color || '#f97316' }]}>
                                <Text style={[styles.prizeTitle, { color: wonSlice?.color || '#f97316' }]}>
                                    {wonSlice?.title}
                                </Text>
                                <Text style={styles.prizeSub}>{wonSlice?.subtitle}</Text>
                                <View style={styles.timerBadge}>
                                    <Ionicons name="time-outline" size={14} color="#f59e0b" />
                                    <Text style={styles.timerText}>Claim before: {formatTime(timeLeft)}</Text>
                                </View>
                            </View>

                            {/* Claim Button */}
                            <TouchableOpacity
                                style={[styles.claimButton, { backgroundColor: wonSlice?.color || '#f97316' }]}
                                onPress={handleClaimReward}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.claimButtonText}>CLAIM MY REWARD NOW</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>

                            {/* Dismiss */}
                            <TouchableOpacity style={styles.declineBtn} onPress={onClose}>
                                <Text style={styles.declineText}>Maybe Later</Text>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.82)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1.5,
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
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
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 6,
    },
    subTitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
        paddingHorizontal: 8,
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
        top: -12,
        zIndex: 20,
        alignItems: 'center',
    },
    pointerTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 22,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#f97316',
    },
    pointerDot: {
        position: 'absolute',
        top: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    pointerShadow: {
        position: 'absolute',
        top: 2,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 13,
        borderRightWidth: 13,
        borderTopWidth: 24,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(0,0,0,0.5)',
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
        shadowOpacity: 0.4,
        shadowRadius: 12,
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
        paddingVertical: 8,
    },
    trophyGlow: {
        marginBottom: 14,
    },
    trophyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        shadowColor: '#f97316',
    },
    congratsTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
    },
    winnerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 16,
    },
    prizeCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1.5,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    prizeTitle: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 2,
    },
    prizeSub: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(245,158,11,0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    timerText: {
        color: '#f59e0b',
        fontSize: 12,
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
        marginBottom: 12,
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    declineBtn: {
        paddingVertical: 6,
    },
    declineText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        fontWeight: '600',
    },
});
