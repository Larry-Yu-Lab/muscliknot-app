import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResultsScreen() {
    const router = useRouter();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];
    const params = useLocalSearchParams();

    // Parse the exercise object passed via params
    const exercise = params.exercise ? JSON.parse(params.exercise as string) : null;

    if (!exercise) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.text }]}>{t('noExerciseData')}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>{t('goBack')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('results')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={[styles.exerciseTitle, { color: colors.accent }]}>
                        {(() => {
                            if (!exercise.id) return exercise.name || t('tensionAssessment');
                            const titleKey = `ex_${exercise.id}_title` as any;
                            const trans = t(titleKey);
                            return trans !== titleKey ? trans : (exercise.name || t('tensionAssessment'));
                        })()}
                    </Text>
                    <View style={[styles.sizeBadge, { backgroundColor: colors.accent + '20' }]}>
                        <Text style={[styles.sizeBadgeText, { color: colors.accent }]}>
                            {exercise.target_area_size ? (t(`size${exercise.target_area_size.charAt(0).toUpperCase()}${exercise.target_area_size.slice(1)}` as any) || exercise.target_area_size.toUpperCase()) : ''}
                        </Text>
                    </View>
                </View>

                {/* Why Section */}
                <View style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.accent }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="help-circle-outline" size={22} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('whyThisWorks')}</Text>
                    </View>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        {exercise.why || t('fallbackWhy')}
                    </Text>
                </View>

                {/* Process Section */}
                <View style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.accent }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="repeat-outline" size={22} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('process')}</Text>
                    </View>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        {exercise.process || t('fallbackProcess')}
                    </Text>
                </View>

                {/* Instructions Section */}
                <View style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.accent }]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="list-outline" size={22} color={colors.accent} />
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('instructions')}</Text>
                    </View>
                    <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                        {exercise.instructions || t('fallbackInstructions')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.doneButton, { backgroundColor: colors.accent }]}
                    onPress={() => router.push('/(tabs)/history')}
                >
                    <Text style={styles.doneButtonText}>{t('finishSession')}</Text>
                </TouchableOpacity>
            </ScrollView>
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
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 5,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f96b06',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    titleSection: {
        marginBottom: 24,
        alignItems: 'center',
    },
    exerciseTitle: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    sizeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    sizeBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,

        borderLeftWidth: 4,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardText: {
        fontSize: 16,
        lineHeight: 24,
    },
    doneButton: {
        marginTop: 20,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',

        ...Platform.select({
            web: {
                boxShadow: '0px 4px 12px rgba(249,107,6,0.4)',
            },
            default: {
                shadowColor: '#f96b06',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8,
            },
        }),
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
