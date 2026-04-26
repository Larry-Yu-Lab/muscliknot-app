import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { EXERCISES } from '@/data/exercises';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ExerciseDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { language, theme } = usePreferences();
    const colors = Colors[theme];
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const {
        id,
        title,
        duration,
        target,
        image,
        why,
        process,
        instructions,
        muscleGroup,
        video_url
    } = params as Record<string, string>;

    const extractYoutubeId = (url?: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    
    // Fallback: If no video_url provided, search for it in local EXERCISES by title
    const resolvedVideoUrl = video_url ? decodeURIComponent(video_url) : EXERCISES.find(e => e.title === title || e.id === id)?.video_url;
    const videoId = extractYoutubeId(resolvedVideoUrl);

    const renderInstructions = (text: string) => {
        if (!text) return null;
        
        // Try parsing numerical steps
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const isStepBased = lines.every(l => /^\d+\./.test(l));
        
        if (isStepBased) {
            return (
                <View style={styles.stepsContainer}>
                    {lines.map((line, index) => {
                        const match = line.match(/^(\d+)\.\s*(.*)$/);
                        const num = match ? match[1] : (index + 1).toString();
                        const content = match ? match[2] : line;
                        
                        return (
                            <View key={index} style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={[styles.stepNumberContainer, { backgroundColor: colors.accent + '15' }]}>
                                    <Text style={[styles.stepNumber, { color: colors.accent }]}>{num}</Text>
                                </View>
                                <Text style={[styles.stepText, { color: colors.text }]}>{content}</Text>
                            </View>
                        );
                    })}
                </View>
            );
        }

        return <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{t(text as any) !== text ? t(text as any) : text}</Text>;
    };

    const targetMuscle = (() => {
        const rawMg = target || muscleGroup;
        if (!rawMg) return '';
        const mgKey = `mg${rawMg.charAt(0).toUpperCase()}${rawMg.slice(1).replace(/\s/g, '')}` as any;
        const trans = t(mgKey);
        return trans !== mgKey ? trans : t(rawMg as any) !== rawMg ? t(rawMg as any) : rawMg;
    })();

    const displayTitle = (() => {
        const titleKey = `ex_${id}_title` as any;
        const trans = t(titleKey);
        
        // Dynamic DB exercise title fallback
        if (title === 'Neck Release & Stretch') return t('db_neck_title' as any);
        if (title === 'Lower Back Decompression') return t('db_lower_back_title' as any);
        if (title === 'Full Leg Flush') return t('db_leg_title' as any);
        
        return trans !== titleKey ? trans : title;
    })();

    const displayWhy = (() => {
        if (!why) return null;
        const whyKey = `ex_${id}_why` as any;
        const trans = t(whyKey);
        return trans !== whyKey ? trans : why;
    })();

    const displayProcess = (() => {
        if (!process) return null;
        const processKey = `ex_${id}_process` as any;
        const trans = t(processKey);
        return trans !== processKey ? trans : process;
    })();

    const displayInstructions = (() => {
        if (!instructions) return null;
        
        // Handle DB exercise raw instructions mappings from their descriptions
        if (instructions === 'Gentle neck stretches to relieve tension from looking down at screens.') return t('db_neck_desc' as any);
        if (instructions === 'Relieve pressure in the lower back with these gentle movements.') return t('db_lower_back_desc' as any);
        if (instructions === 'Improve circulation and reduce soreness in the legs.') return t('db_leg_desc' as any);

        const instKey = `ex_${id}_instructions` as any;
        const trans = t(instKey);
        if (trans !== instKey) return trans;
        
        // Local exercise repetitive instruction parser
        if (instructions.includes('1. Get into a comfortable starting position.')) {
            const descKey = `ex_${id}_desc` as any;
            const translatedDesc = t(descKey) !== descKey ? t(descKey) : instructions.split('\n')[1].substring(3);
            return `1. ${t('inst_step1' as any)}\n2. ${translatedDesc}\n3. ${t('inst_step3' as any)}\n4. ${t('inst_step4' as any)}`;
        }
        return instructions;
    })();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
                {videoId ? (
                    <View style={{ width: width, height: width * (9/16) + 40, backgroundColor: '#000', paddingTop: 40 }}>
                        <SafeAreaView style={[styles.headerSafeArea, { zIndex: 10 }]}>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                        <YoutubePlayer
                            height={width * (9/16)}
                            play={false}
                            videoId={videoId}
                        />
                    </View>
                ) : (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: image }}
                            style={styles.image}
                            contentFit="cover"
                            transition={1000}
                        />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.5)', 'transparent', colors.background]}
                            locations={[0, 0.4, 1]}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <SafeAreaView style={styles.headerSafeArea}>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                                >
                                    <Ionicons name="heart-outline" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>
                )}

                {/* Content */}
                <View style={[styles.content, videoId ? { marginTop: 24 } : {}]}>
                    <View style={styles.headerRow}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <View style={[styles.targetBadge, { backgroundColor: colors.accent + '15' }]}>
                                <Text style={[styles.targetText, { color: colors.accent }]}>{targetMuscle}</Text>
                            </View>
                            <Text style={[styles.title, { color: colors.text }]}>{displayTitle}</Text>
                        </View>
                        <View style={[styles.durationBadge, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Ionicons name="timer-outline" size={18} color={colors.accent} />
                            <Text style={[styles.durationText, { color: colors.text }]}>{duration}</Text>
                        </View>
                    </View>

                    {displayWhy && (
                        <View style={[styles.whyCard, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
                            <View style={styles.whyHeader}>
                                <Ionicons name="bulb" size={20} color={colors.accent} />
                                <Text style={[styles.sectionTitle, { color: colors.accent, marginBottom: 0, marginLeft: 8 }]}>{t('benefits')}</Text>
                            </View>
                            <Text style={[styles.whyText, { color: colors.textSecondary }]}>{displayWhy}</Text>
                        </View>
                    )}

                    {displayInstructions && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>{t('instructions')}</Text>
                            {renderInstructions(displayInstructions)}
                        </View>
                    )}

                    {displayProcess && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('process')}</Text>
                            <View style={[styles.processCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>{displayProcess}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 60,
    },
    imageContainer: {
        width: width,
        height: width * 1.1, // Tall, premium aspect ratio
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerSafeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12, // For android padding within safe area
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)', // web
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: -40, // Overlap the deep gradient
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    targetBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 12,
    },
    targetText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 38,
    },
    durationBadge: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        minWidth: 70,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 4,
        textAlign: 'center',
    },
    whyCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 32,
    },
    whyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    whyText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    stepsContainer: {
        gap: 12,
    },
    stepCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    stepNumberContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '800',
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    processCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 16,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 26,
    },
});
