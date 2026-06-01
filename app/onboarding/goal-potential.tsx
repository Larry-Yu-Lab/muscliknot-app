import { Colors, Fonts } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';

export default function GoalPotentialScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const colors = Colors[theme];
    const [goalId, setGoalId] = useState<string | null>(null);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        const loadGoal = async () => {
            const storedGoal = await AsyncStorage.getItem('user_goal');
            setGoalId(storedGoal);
        };
        loadGoal();

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleContinue = () => {
        router.push('/onboarding/thank-you');
    };

    const getCardTitle = () => {
        if (goalId === 'relieve_pain') return 'Your pain projection';
        if (goalId === 'improve_mobility') return 'Your mobility projection';
        if (goalId === 'daily_maintenance') return 'Your wellness trajectory';
        return 'Your recovery trajectory';
    };

    const getCardDesc = () => {
        if (goalId === 'relieve_pain') {
            return "Based on MuscliKnot's historical data, pain relief is usually gradual at first, but after 7 days of consistency, you can significantly reduce soreness!";
        }
        if (goalId === 'improve_mobility') {
            return "Based on MuscliKnot's historical data, mobility gains are usually subtle at first, but after 7 days of consistency, you will feel noticeably looser and more flexible!";
        }
        if (goalId === 'daily_maintenance') {
            return "Based on MuscliKnot's historical data, habit building is usually slow at first, but after 7 days of consistency, your routine becomes second nature!";
        }
        return "Based on MuscliKnot's historical data, muscle relief is usually gradual at first, but after 7 days of consistency, your dedication will help you crush your goal!";
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
                        <View style={[styles.progressBarFill, { width: '78.3%' }]} />
                    </View>
                </View>
            </View>

            <Animated.View 
                style={[
                    styles.content, 
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                {/* Headline left-aligned matching reference image */}
                <Text style={styles.title}>
                    You have great potential{'\n'}to crush your goal
                </Text>

                {/* Transition Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{getCardTitle()}</Text>

                    {/* Chart Container */}
                    <View style={styles.chartContainer}>
                        <Svg width={260} height={100} viewBox="0 0 260 100">
                            <Defs>
                                <LinearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                                    <Stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                                </LinearGradient>
                            </Defs>

                            {/* Horizontal Grid lines */}
                            <Line x1="10" y1="45" x2="250" y2="45" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4,4" strokeWidth={1} />
                            <Line x1="10" y1="75" x2="250" y2="75" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4,4" strokeWidth={1} />

                            {/* Filled area under curve */}
                            <Path
                                d="M 20 95 L 20 80 C 50 80, 70 79, 80 78 C 110 76, 125 60, 140 50 C 170 35, 190 22, 220 20 L 220 95 Z"
                                fill="url(#graphGradient)"
                            />

                            {/* Baseline */}
                            <Line x1="10" y1="95" x2="250" y2="95" stroke="rgba(255, 255, 255, 0.12)" strokeWidth={1.5} />

                            {/* Glow behind the Curve Line */}
                            <Path
                                d="M 20 80 C 50 80, 70 79, 80 78 C 110 76, 125 60, 140 50 C 170 35, 190 22, 220 20"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth={5}
                                opacity={0.15}
                                strokeLinecap="round"
                            />

                            {/* Curve Line */}
                            <Path
                                d="M 20 80 C 50 80, 70 79, 80 78 C 110 76, 125 60, 140 50 C 170 35, 190 22, 220 20"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                            />

                            {/* Circles/Dots on curve */}
                            <Circle cx={20} cy={80} r={4.5} fill="#fff" stroke="#f97316" strokeWidth={2} />
                            <Circle cx={80} cy={78} r={4.5} fill="#fff" stroke="#f97316" strokeWidth={2} />
                            <Circle cx={140} cy={50} r={4.5} fill="#fff" stroke="#f97316" strokeWidth={2} />
                        </Svg>

                        {/* Trophy badge absolute positioned relative to chartContainer */}
                        <View style={styles.trophyBadge}>
                            <Ionicons name="trophy" size={11} color="#fff" />
                        </View>

                        {/* X-Axis labels absolute positioned relative to chartContainer */}
                        <Text style={[styles.axisLabel, { left: 4 }]}>Start</Text>
                        <Text style={[styles.axisLabel, { left: 66 }]}>3 Days</Text>
                        <Text style={[styles.axisLabel, { left: 126 }]}>7 Days</Text>
                        <Text style={[styles.axisLabel, { left: 202 }]}>30 Days</Text>
                    </View>

                    {/* Explanatory text under chart */}
                    <Text style={styles.cardDesc}>
                        {getCardDesc()}
                    </Text>
                </View>
            </Animated.View>

            {/* Bottom Button */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                >
                    <Text style={styles.buttonText}>{t('continue')}</Text>
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
        marginBottom: 20,
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.rounded,
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'left',
        lineHeight: 40,
        marginBottom: 28,
        alignSelf: 'stretch',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
        width: '100%',
        maxWidth: 328,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    cardTitle: {
        fontFamily: Fonts.rounded,
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        alignSelf: 'flex-start',
        paddingLeft: 6,
    },
    chartContainer: {
        width: 260,
        height: 120,
        position: 'relative',
        marginBottom: 16,
    },
    trophyBadge: {
        position: 'absolute',
        top: 8,
        left: 208,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f97316',
        borderWidth: 1.5,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    axisLabel: {
        position: 'absolute',
        bottom: 0,
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: Fonts.rounded,
    },
    cardDesc: {
        fontFamily: Fonts.rounded,
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.65)',
        lineHeight: 19,
        textAlign: 'center',
        paddingHorizontal: 6,
        marginTop: 8,
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
        fontFamily: Fonts.rounded,
    },
});
