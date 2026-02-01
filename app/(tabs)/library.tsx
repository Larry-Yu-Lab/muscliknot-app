import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EXERCISES } from '../data/exercises';

const categories = ['All', 'Relief', 'Warm-ups', 'Yoga', 'Posture', 'Strength'];
const reliefMuscleGroups = ['All', 'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Glutes', 'Legs'];

type ExerciseCardProps = {
    title: string;
    duration: string;
    target: string;
    image: string;
};

const ExerciseCard = ({ title, duration, target, image }: ExerciseCardProps) => (
    <TouchableOpacity style={styles.exerciseCard}>
        <View style={styles.exerciseImageContainer}>
            <Image
                source={{ uri: image }}
                style={styles.exerciseImage}
                contentFit="cover"
            />
        </View>
        <View style={styles.exerciseContent}>
            <Text style={styles.exerciseTitle}>{title}</Text>
            <View style={styles.exerciseMeta}>
                <View style={styles.durationContainer}>
                    <Ionicons name="timer-outline" size={14} color="#9ca3af" />
                    <Text style={styles.durationText}>{duration}</Text>
                </View>
                <View style={styles.targetBadge}>
                    <Text style={styles.targetText}>Target: {target}</Text>
                </View>
            </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
    </TouchableOpacity>
);

export default function LibraryScreen() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeMuscleGroup, setActiveMuscleGroup] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

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

    // Split into "Recommended" (random subset) and "All Results" for better UX?
    // Or just show one list since filtering is active. Let's show one consolidated list when filtering.
    // But initially show the split sections if 'All' is selected.

    const isFiltering = activeCategory !== 'All' || searchQuery.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Library</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={22} color="#ff6a00" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#ff6a00" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
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
                                {category}
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
                                    {group}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Content */}
                {isFiltering ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {filteredExercises.length} Result{filteredExercises.length !== 1 ? 's' : ''}
                        </Text>
                        <View style={styles.exerciseList}>
                            {filteredExercises.map((exercise) => (
                                <ExerciseCard
                                    key={exercise.id}
                                    title={exercise.title}
                                    duration={exercise.duration}
                                    target={exercise.muscleGroup}
                                    image={exercise.image}
                                />
                            ))}
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Recommended Section (Default View) */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Recommended for You</Text>
                                <TouchableOpacity onPress={() => setActiveCategory('Relief')}>
                                    <Text style={styles.seeAllText}>SEE ALL</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseList}>
                                {EXERCISES.slice(0, 3).map((exercise) => (
                                    <ExerciseCard
                                        key={exercise.id}
                                        title={exercise.title}
                                        duration={exercise.duration}
                                        target={exercise.muscleGroup}
                                        image={exercise.image}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* New Routines Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>New Routines</Text>
                                <TouchableOpacity onPress={() => setActiveCategory('All')}>
                                    <Text style={styles.seeAllText}>EXPLORE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.exerciseList}>
                                {EXERCISES.slice(3, 6).map((exercise) => (
                                    <ExerciseCard
                                        key={exercise.id}
                                        title={exercise.title}
                                        duration={exercise.duration}
                                        target={exercise.muscleGroup}
                                        image={exercise.image}
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
