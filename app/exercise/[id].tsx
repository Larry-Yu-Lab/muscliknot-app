import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ExerciseDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { language, theme } = usePreferences();
    const colors = Colors[theme];
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    // Destructure params. Note: expo-router passes params as strings or arrays of strings.
    // We expect the caller to pass these.
    const {
        id,
        title,
        duration,
        target,
        image,
        why,
        process,
        instructions,
        muscleGroup
    } = params as Record<string, string>;

    const renderList = (text: string) => {
        if (!text) return null;
        // Split by newlines or bullet points if present, for now just text
        return <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{text}</Text>;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                        contentFit="cover"
                        transition={1000}
                    />
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.targetText, { color: colors.accent }]}>
                                {(() => {
                                    const rawMg = target || muscleGroup;
                                    if (!rawMg) return '';
                                    const mgKey = `mg${rawMg.charAt(0).toUpperCase()}${rawMg.slice(1).replace(/\s/g, '')}` as any;
                                    const trans = t(mgKey);
                                    return trans !== mgKey ? trans : rawMg;
                                })()}
                            </Text>
                            <Text style={[styles.title, { color: colors.text }]}>
                                {(() => {
                                    const titleKey = `ex_${id}_title` as any;
                                    const trans = t(titleKey);
                                    return trans !== titleKey ? trans : title;
                                })()}
                            </Text>
                        </View>
                        <View style={styles.durationBadge}>
                            <Ionicons name="timer-outline" size={16} color={colors.text} />
                            <Text style={[styles.durationText, { color: colors.text }]}>{duration}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Why Section */}
                    {why && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('benefits')}</Text>
                            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{why}</Text>
                        </View>
                    )}

                    {/* Instructions Section */}
                    {instructions && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('instructions')}</Text>
                            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{instructions}</Text>
                        </View>
                    )}

                    {/* Process/How-to Section (if distinct from instructions) */}
                    {process && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('process')}</Text>
                            <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{process}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 40, // Adjust for safe area if needed
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: 24,
        marginTop: -20, // Overlap image slightly
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: 'inherit', // Let view background handle it
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    targetText: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 32,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
    },
});
