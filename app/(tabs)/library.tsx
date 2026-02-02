import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePreferences } from '../context/PreferencesContext';
import { EXERCISES } from '../data/exercises';
import { getTranslation } from '../utils/i18n';

const categories = ['All', 'Relief', 'Warm-ups', 'Yoga', 'Posture', 'Strength'];
const reliefMuscleGroups = ['All', 'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Glutes', 'Legs'];

type ExerciseCardProps = {
    id: string;
    title: string;
    duration: string;
    target: string;
    image: string;
    t: (key: string) => string; // Pass t function or translated target string? Let's generic it.
};

// Helper for mapped muscle group translation inside card
const getMuscleKey = (name: string) => {
    if (name === 'All') return 'catAll';
    return `mg${name.replace(/\s/g, '')}` as any;
};

const ExerciseCard = ({ id, title, duration, target, image, t }: ExerciseCardProps) => {
    const titleKey = `ex_${id}_title` as any;
    const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : title;

    return (
        <TouchableOpacity style={styles.exerciseCard}>
            <View style={styles.exerciseImageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.exerciseImage}
                    contentFit="cover"
                />
            </View>
            <View style={styles.exerciseContent}>
                <Text style={styles.exerciseTitle}>{translatedTitle}</Text>
                <View style={styles.exerciseMeta}>
                    <View style={styles.durationContainer}>
                        <Ionicons name="timer-outline" size={14} color="#9ca3af" />
                        <Text style={styles.durationText}>{duration}</Text>
                    </View>
                    <View style={styles.targetBadge}>
                        <Text style={styles.targetText}>{t('target').replace('${target}', t(getMuscleKey(target)) !== getMuscleKey(target) ? t(getMuscleKey(target)) : target)}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default function LibraryScreen() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeMuscleGroup, setActiveMuscleGroup] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { language } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const filteredExercises = useMemo(() => {
        return EXERCISES.filter(ex => {
            // 1. Search Query
            if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            // 2. Category Filter
            if (activeCategory !== 'All' && ex.category !== activeCategory) return false;

            // 3. Sub-category (Muscle Group) for Relief
            if (activeCategory === 'Relief' && activeMuscleGroup !== 'All') {
                if (ex.muscleGroup !== activeMuscleGroup) return false;
            }

            return true;
        });
    }, [activeCategory, activeMuscleGroup, searchQuery]);

    const isFiltering = activeCategory !== 'All' || searchQuery.length > 0;

    // Helpers for dynamic keys
    const getCategoryKey = (cat: string) => {
        if (cat === 'All') return 'catAll';
        // 'Warm-ups' -> 'catWarmups'
        return `cat${cat.replace(/[-\s]/g, '')}` as any;
    };

    // getMuscleKey defined above, but we need it here too or reuse logic
    const getMuscleDisplay = (name: string) => {
        const key = name === 'All' ? 'catAll' : `mg${name.replace(/\s/g, '')}` as any;
        const trans = t(key);
        return trans !== key ? trans : name;
    };

    const getCategoryDisplay = (name: string) => {
        const key = getCategoryKey(name);
        const trans = t(key);
        return trans !== key ? trans : name;
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>{t('library')}</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={22} color="#ff6a00" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#ff6a00" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('searchExercises')}
                        placeholderTextColor="#6b7280"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Main Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesContainer}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                activeCategory === category && styles.categoryButtonActive,
                            ]}
                            onPress={() => {
                                setActiveCategory(category);
                                setActiveMuscleGroup('All'); // Reset sub-filter
                            }}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    activeCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {getCategoryDisplay(category)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Sub-Category (Muscle Group) - Only visible for Relief */}
                {activeCategory === 'Relief' && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[styles.categoriesContainer, { paddingTop: 0, paddingBottom: 16 }]}
                    >
                        {reliefMuscleGroups.map((group) => (
                            <TouchableOpacity
                                key={group}
                                style={[
                                    styles.subCategoryButton,
                                    activeMuscleGroup === group && styles.subCategoryButtonActive,
                                ]}
                                onPress={() => setActiveMuscleGroup(group)}
                            >
                                <Text
                                    style={[
                                        styles.subCategoryText,
                                        activeMuscleGroup === group && styles.subCategoryTextActive,
                                    ]}
                                >
                                    {getMuscleDisplay(group)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Content */}
                {isFiltering ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {filteredExercises.length} {t('results')}
                        </Text>
                        <View style={styles.exerciseList}>
                            {filteredExercises.map((exercise) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    id={exercise.id}
                                    title={exercise.title}
                                    duration={exercise.duration}
                                    target={exercise.muscleGroup}
                                    image={exercise.image}
                                    t={t as any}
                                />
                            ))}
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Recommended Section (Default View) */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t('recommendedForYou')}</Text>
                                <TouchableOpacity onPress={() => setActiveCategory('Relief')}>
                                    <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseList}>
                                {EXERCISES.slice(0, 3).map((exercise) => (
                                    <ExerciseCard
                                        key={exercise.id}
                                        id={exercise.id}
                                        title={exercise.title}
                                        duration={exercise.duration}
                                        target={exercise.muscleGroup}
                                        image={exercise.image}
                                        t={t as any}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* New Routines Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{t('newRoutines')}</Text>
                                <TouchableOpacity onPress={() => setActiveCategory('All')}>
                                    <Text style={styles.seeAllText}>{t('explore')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseList}>
                                {EXERCISES.slice(3, 6).map((exercise) => (
                                    <ExerciseCard
                                        key={exercise.id}
                                        id={exercise.id}
                                        title={exercise.title}
                                        duration={exercise.duration}
                                        target={exercise.muscleGroup}
                                        image={exercise.image}
                                        t={t as any}
                                    />
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 106, 0, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        borderWidth: 2,
        borderColor: '#ff6a00',
        borderRadius: 28,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    categoryButton: {
        height: 40,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 106, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryButtonActive: {
        backgroundColor: 'rgba(255, 106, 0, 0.1)',
        borderColor: '#ff6a00',
    },
    categoryText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    categoryTextActive: {
        fontWeight: '700',
        color: '#fff',
    },
    subCategoryButton: {
        height: 32,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    subCategoryButtonActive: {
        backgroundColor: '#ff6a00',
        borderColor: '#ff6a00',
    },
    subCategoryText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    subCategoryTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    section: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    seeAllText: {
        color: '#ff6a00',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    exerciseList: {
        gap: 16,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(39, 39, 42, 0.5)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 106, 0, 0.3)',
    },
    exerciseImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#ff6a00',
        overflow: 'hidden',
    },
    exerciseImage: {
        width: '100%',
        height: '100%',
    },
    exerciseContent: {
        flex: 1,
        marginLeft: 16,
    },
    exerciseTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    exerciseMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '500',
    },
    targetBadge: {
        backgroundColor: 'rgba(255, 106, 0, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 106, 0, 0.2)',
    },
    targetText: {
        color: '#ff6a00',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    favoriteButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
