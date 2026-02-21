import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { EXERCISES } from '@/data/exercises';
import { getTranslation } from '@/utils/i18n';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { fetchSavedExercises, saveExercise, unsaveExercise } from '@/utils/savedExercises';

const categories = ['All', 'Saved', 'Relief', 'Warm-ups', 'Yoga', 'Posture', 'Strength'];
const reliefMuscleGroups = ['All', 'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Glutes', 'Legs'];

type ExerciseCardProps = {
    id: string;
    title: string;
    duration: string;
    target: string;
    image: string;
    t: (key: string) => string;
    colors: any;
    isSaved?: boolean;
    onToggleSave?: () => void;
};

// Helper for mapped muscle group translation inside card
const getMuscleKey = (name: string) => {
    if (name === 'All') return 'catAll';
    return `mg${name.replace(/\s/g, '')}` as any;
};

const ExerciseCard = ({ id, title, duration, target, image, t, colors, exercise, isSaved, onToggleSave }: ExerciseCardProps & { exercise: any }) => {
    const router = useRouter();
    const titleKey = `ex_${id}_title` as any;
    const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : title;

    const handlePress = () => {
        router.push({
            pathname: `/exercise/${id}` as any,
            params: {
                id,
                title: translatedTitle,
                duration,
                target,
                image,
                why: exercise.why,
                process: exercise.process,
                instructions: exercise.instructions,
                muscleGroup: exercise.muscleGroup
            }
        });
    };

    return (
        <TouchableOpacity
            style={[styles.exerciseCard, { backgroundColor: colors.cardBackground, borderColor: 'rgba(249, 107, 6, 0.3)' }]}
            onPress={handlePress}
        >
            <View style={[styles.exerciseImageContainer, { borderColor: colors.accent }]}>
                <Image
                    source={{ uri: image }}
                    style={styles.exerciseImage}
                    contentFit="cover"
                />
            </View>
            <View style={styles.exerciseContent}>
                <Text style={[styles.exerciseTitle, { color: colors.text }]}>{translatedTitle}</Text>
                <View style={styles.exerciseMeta}>
                    <View style={styles.durationContainer}>
                        <Ionicons name="timer-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.durationText, { color: colors.textSecondary }]}>{duration}</Text>
                    </View>
                    <View style={[styles.targetBadge, { backgroundColor: 'rgba(249, 107, 6, 0.1)', borderColor: 'rgba(249, 107, 6, 0.2)' }]}>
                        <Text style={[styles.targetText, { color: colors.accent }]}>{t('target').replace('${target}', t(getMuscleKey(target)) !== getMuscleKey(target) ? t(getMuscleKey(target)) : target)}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={onToggleSave}>
                <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={isSaved ? colors.accent : colors.textSecondary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};


export default function LibraryScreen() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeMuscleGroup, setActiveMuscleGroup] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [supabaseExercises, setSupabaseExercises] = useState<any[]>([]);
    const [savedExerciseIds, setSavedExerciseIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    // Fetch all exercises from Supabase
    useEffect(() => {
        const fetchAllExercises = async () => {
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('recovery_knowledge_base')
                    .select('*');

                if (error) {
                    console.error('Error fetching exercises:', error);
                } else if (data) {
                    // Map database exercise_type to app category names
                    const categoryMap: Record<string, string> = {
                        'relief': 'Relief',
                        'posture': 'Posture',
                        'warmup': 'Warm-ups',
                        'warmups': 'Warm-ups',
                        'yoga': 'Yoga',
                        'strength': 'Strength',
                    };

                    // Transform Supabase data to match local exercise format
                    const transformed = data.map((ex: any) => ({
                        id: ex.id?.toString() || String(Math.random()),
                        title: ex.solution_stretch || ex.common_name || 'Unknown Exercise',
                        duration: '3-5 min',
                        target: ex.common_name || 'General',
                        muscleGroup: ex.common_name?.split(' ')[0] || 'General',
                        category: categoryMap[ex.exercise_type?.toLowerCase()] || 'Relief',
                        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQvExJHNf-gPBvV9mafHYX_QH4RDM2a10DReFfan-2uta-tGIgoYLy2YcqV88wGpuO0qaD_Yr1qPxSQtigGhxM0Sq6uOtWbw-JV0RDp_0RmODacO147g0dvAY693HSe3XPVdm2eTzs6ER9VAKERpdSDpdD1MgVcJ8HJCDesjsxF-hhw0aRZc-sY0sB3sHox58BbJ7vYjkyyLq8KDnpbu4x0PolLYeNnsL3Q3fcRFHU5BkgY0KWaZ8NP',
                        instructions: ex.instructions,
                        why: ex.why,
                        process: ex.process,
                    }));
                    setSupabaseExercises(transformed);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllExercises();
    }, []);

    // Fetch saved exercises (AsyncStorage-backed, no auth required)
    useEffect(() => {
        const loadSaved = async () => {
            const saved = await fetchSavedExercises();
            setSavedExerciseIds(saved);
        };
        loadSaved();
    }, []);

    const toggleSave = async (exerciseId: string) => {
        const isSaved = savedExerciseIds.includes(exerciseId);
        // Optimistic update
        setSavedExerciseIds(prev =>
            isSaved ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]
        );

        // AsyncStorage-backed save (no auth required)
        if (isSaved) {
            await unsaveExercise('', exerciseId);
        } else {
            await saveExercise('', exerciseId);
        }
    };

    // Combine local exercises with Supabase exercises
    const allExercises = useMemo(() => {
        return [...EXERCISES, ...supabaseExercises];
    }, [supabaseExercises]);

    // Helpers for dynamic keys
    const getCategoryKey = (cat: string) => {
        if (cat === 'All') return 'catAll';
        // 'Warm-ups' -> 'catWarmups'
        return `cat${cat.replace(/[-\s]/g, '')}` as any;
    };

    const getCategoryDisplay = (name: string) => {
        const key = getCategoryKey(name);
        const trans = t(key);
        return trans !== key ? trans : name;
    };

    const getMuscleDisplay = (name: string) => {
        const key = name === 'All' ? 'catAll' : `mg${name.replace(/\s/g, '')}` as any;
        const trans = t(key);
        return trans !== key ? trans : name;
    };

    // Filtered list
    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex => {
            // 1. Saved filter — must run FIRST (exercises have no category 'Saved')
            if (activeCategory === 'Saved') {
                if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return savedExerciseIds.includes(ex.id);
            }

            // 2. Search Query
            if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            // 3. Category Filter
            if (activeCategory !== 'All' && ex.category !== activeCategory) return false;

            // 4. Sub-category (Muscle Group) for Relief
            if (activeCategory === 'Relief' && activeMuscleGroup !== 'All') {
                const muscleMatch = ex.muscleGroup?.toLowerCase().includes(activeMuscleGroup.toLowerCase()) ||
                    ex.target?.toLowerCase().includes(activeMuscleGroup.toLowerCase());
                if (!muscleMatch) return false;
            }

            return true;
        });
    }, [activeCategory, activeMuscleGroup, searchQuery, allExercises, savedExerciseIds]);

    const displayCategories = categories.filter(c => c !== 'All');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                <View style={styles.headerTop}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('library')}</Text>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.accent }]}>
                    <Ionicons name="search" size={20} color={colors.accent} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder={t('searchExercises')}
                        placeholderTextColor={colors.textSecondary}
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
                                { borderColor: 'rgba(249, 107, 6, 0.4)' },
                                activeCategory === category && { backgroundColor: 'rgba(249, 107, 6, 0.1)', borderColor: colors.accent },
                            ]}
                            onPress={() => {
                                setActiveCategory(category);
                                setActiveMuscleGroup('All'); // Reset sub-filter
                            }}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    { color: colors.text },
                                    activeCategory === category && { color: colors.text, fontWeight: '700' },
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
                                    { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                                    activeMuscleGroup === group && { backgroundColor: colors.accent, borderColor: colors.accent },
                                ]}
                                onPress={() => setActiveMuscleGroup(group)}
                            >
                                <Text
                                    style={[
                                        styles.subCategoryText,
                                        { color: colors.textSecondary },
                                        activeMuscleGroup === group && { color: '#fff', fontWeight: '700' },
                                    ]}
                                >
                                    {getMuscleDisplay(group)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Content Logic */}
                {searchQuery.length > 0 ? (
                    // Search Results
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
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
                                    colors={colors}
                                    exercise={exercise}
                                    isSaved={savedExerciseIds.includes(exercise.id)}
                                    onToggleSave={() => toggleSave(exercise.id)}
                                />
                            ))}
                        </View>
                    </View>
                ) : activeCategory !== 'All' ? (
                    // Filtered View (Single Category)
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {filteredExercises.length} {t('exercises' as any)}
                            </Text>
                        </View>
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
                                    colors={colors}
                                    exercise={exercise}
                                    isSaved={savedExerciseIds.includes(exercise.id)}
                                    onToggleSave={() => toggleSave(exercise.id)}
                                />
                            ))}
                        </View>
                        {filteredExercises.length === 0 && (
                            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
                                No exercises found.
                            </Text>
                        )}
                    </View>
                ) : (
                    // "All" View - Show Sections/Categories
                    displayCategories.map((category) => {
                        const categoryExercises = allExercises.filter(ex => ex.category === category);
                        if (categoryExercises.length === 0) return null;

                        return (
                            <View key={category} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                        {getCategoryDisplay(category)}
                                    </Text>
                                    <TouchableOpacity onPress={() => setActiveCategory(category)}>
                                        <Text style={[styles.seeAllText, { color: colors.accent }]}>{t('seeAll')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.exerciseList}>
                                    {categoryExercises.slice(0, 3).map((exercise) => (
                                        <ExerciseCard
                                            key={exercise.id}
                                            id={exercise.id}
                                            title={exercise.title}
                                            duration={exercise.duration}
                                            target={exercise.muscleGroup}
                                            image={exercise.image}
                                            t={t as any}
                                            colors={colors}
                                            exercise={exercise}
                                            isSaved={savedExerciseIds.includes(exercise.id)}
                                            onToggleSave={() => toggleSave(exercise.id)}
                                        />
                                    ))}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
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
        borderWidth: 2,
        borderRadius: 28,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    searchInput: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryButtonActive: {
        backgroundColor: 'rgba(255, 106, 0, 0.1)',
        borderColor: '#ff6a00',
    },
    categoryText: {
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
    subCategoryButtonActive: {},
    subCategoryText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '500',
    },
    subCategoryTextActive: {
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
        fontSize: 20,
        fontWeight: '700',
    },
    seeAllText: {
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
        borderRadius: 16,
        borderWidth: 1,
    },
    exerciseImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
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
        fontSize: 12,
        fontWeight: '500',
    },
    targetBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
    },
    targetText: {
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
