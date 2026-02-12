import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DURATION_OPTIONS = [
    { id: 'today', label: 'Today' },
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month' },
    { id: 'longer', label: 'More than a month' },
];

export default function PainAssessmentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    // Form state
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [injuryCause, setInjuryCause] = useState('');
    const [painLevel, setPainLevel] = useState(5);
    const [isSliderActive, setIsSliderActive] = useState(false);
    const trackWidth = useRef(0);

    // Pass through params from previous screen
    const x = params.x;
    const y = params.y;
    const width = params.width;
    const height = params.height;
    const rotation = params.rotation;
    const view = params.view;
    const size = params.size;
    const muscleId = params.muscleId;
    const activityType = params.activityType;

    const handleSliderTouch = (event: any) => {
        setIsSliderActive(true);
        const { locationX } = event.nativeEvent;
        const percentage = Math.max(0, Math.min(1, locationX / trackWidth.current));
        const newValue = Math.round(percentage * 9) + 1;
        setPainLevel(newValue);
    };

    const handleContinue = () => {
        router.push({
            pathname: '/(tabs)/find-relief',
            params: {
                x, y, width, height, rotation, view, size, muscleId, activityType,
                painLevel,
                duration: selectedDuration || 'unknown',
                cause: injuryCause || 'unknown',
                timestamp: Date.now()
            }
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Pain Assessment</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Question 1: Duration */}
                <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="time-outline" size={24} color={colors.accent} />
                        <Text style={[styles.questionTitle, { color: colors.text }]}>How long ago did this occur?</Text>
                    </View>
                    <View style={styles.optionsContainer}>
                        {DURATION_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.optionButton,
                                    { borderColor: colors.cardBorder },
                                    selectedDuration === option.id && { backgroundColor: colors.accent, borderColor: colors.accent }
                                ]}
                                onPress={() => setSelectedDuration(option.id)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    { color: colors.text },
                                    selectedDuration === option.id && { color: '#000', fontWeight: '700' }
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Question 2: Cause */}
                <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="help-circle-outline" size={24} color={colors.accent} />
                        <Text style={[styles.questionTitle, { color: colors.text }]}>Do you know what caused this?</Text>
                    </View>
                    <TextInput
                        style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.cardBorder }]}
                        placeholder="e.g., Slept wrong, lifted heavy object, exercise..."
                        placeholderTextColor={colors.textSecondary}
                        value={injuryCause}
                        onChangeText={setInjuryCause}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Pain Scale */}
                <View style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="analytics-outline" size={24} color={colors.accent} />
                        <Text style={[styles.questionTitle, { color: colors.text }]}>{t('painAssessment')}</Text>
                    </View>
                    <View style={styles.assessmentContent}>
                        <View style={styles.scaleHeader}>
                            <Text style={[styles.scaleLabel, { color: colors.textSecondary }]}>{t('rateIntensity')}</Text>
                            <View style={[styles.scaleBadge, { backgroundColor: colors.accent }]}>
                                <Text style={styles.scaleBadgeText}>{t('scale1to10')}</Text>
                            </View>
                        </View>
                        <View style={styles.sliderContainer}>
                            <View
                                style={styles.sliderTrack}
                                hitSlop={{ top: 20, bottom: 20, left: 10, right: 10 }}
                                onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => true}
                                onResponderGrant={handleSliderTouch}
                                onResponderMove={handleSliderTouch}
                                onResponderRelease={() => setIsSliderActive(false)}
                            >
                                <View pointerEvents="none" style={[styles.sliderFill, { width: `${painLevel * 10}%` }]} />
                                <View pointerEvents="none" style={[styles.sliderThumb, { left: `${painLevel * 10}%` }]} />
                            </View>
                            <Text style={[styles.painNumber, { color: colors.accent }]}>{painLevel}</Text>
                        </View>
                        <View style={styles.sliderLabels}>
                            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{t('mild')}</Text>
                            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{t('moderate')}</Text>
                            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>{t('severe')}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View style={[styles.bottomContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity
                    style={[styles.continueButton, { backgroundColor: colors.accent }]}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    questionCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        marginBottom: 16,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 14,
    },
    textInput: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        fontSize: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    assessmentContent: {
        gap: 16,
    },
    scaleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scaleLabel: {
        fontSize: 14,
    },
    scaleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    scaleBadgeText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    sliderTrack: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        position: 'relative',
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#f97316',
        borderRadius: 4,
    },
    sliderThumb: {
        position: 'absolute',
        top: -8,
        marginLeft: -12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f97316',
        borderWidth: 3,
        borderColor: '#fff',
    },
    painNumber: {
        fontSize: 24,
        fontWeight: '800',
        minWidth: 30,
        textAlign: 'center',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        fontSize: 12,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 16,
    },
    continueButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
