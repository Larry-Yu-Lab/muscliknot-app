import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = ['All', 'Warm-ups', 'Yoga', 'Posture', 'Strength'];

const recommendedExercises = [
    {
        id: 1,
        title: 'Hamstring Stretch',
        duration: '5 MINS',
        target: 'Hamstrings',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmeAwr9DErW8b1SJbhOy_7vOkuyzD9szCcnkCnS5_hQdiYY18gYWBg-ybjWbKnf9BYzCIpMnJT5KGr_gtAVZUgLupsvdtZPRrps4oxdLtcmpvY2OsfpZuFZdzL1kh8g-bh1yDNp_UJuGEbZA7g2yQkseD83VPnEWD61N_ClJaoZQLqFqjLSoirR39w5e8Cl3dsEnh4OcQ2KO8MMvNYiixjfKFytH0APyDlrxLaNUrMwqx5MN81VdxI-wDxOwg2-iUAVZcpuOGTNiAj',
    },
    {
        id: 2,
        title: 'Neck Release',
        duration: '3 MINS',
        target: 'Neck',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-cvLfeT_64S5TAWVYCGL4yHRDBy11G9w5fPmd1-7UdjR_j5DsMku5euS4m8OxTOvH0EC3kBpeNjxkEo21urp6uTAxHcaNz0ojdRG9KBomvi5Ru2jnPJQsLqOyVrbjhp46AikjoBNW0dyxk1wQo0GSoTx3HEMT_e6wPqs8SfOAiO6dTkfCRhAfE2x2dpxnE9tmkbI7d7P-_KzBheWdo2JkNsp6IALLTjzWVGtd0yJsoPa4b0PcFx1s-y96azg4I95f--GOqrXhxMiE',
    },
    {
        id: 3,
        title: 'Spine Alignment',
        duration: '8 MINS',
        target: 'Back',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJlSG1mDnHXrNaEFm7n9g1tl4akAzq_pH7O3yPYAjrqX9As7TnOilQPEoqcnW-k_zPRKr3HQfuBDiz8g1OGBoemezdvp2qgwIahgrC7EQ22OWHxdorFehBmgQyiZOpzeziUO2qAxoD8wkH1E3FC6p0zrTWn6eTJr1tkk3R7dA75jPHLvdcaiHCZ8PwraFJvhyiO1ArsJJPI8aah3EXeDvH7ucckugkh5fEobvxN64GqpIPrDpx3dbhGEP345AzA-41x9LBB9MMZXpH',
    },
];

const newRoutines = [
    {
        id: 4,
        title: 'Full Body Ignite',
        duration: '12 MINS',
        target: 'Full Body',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpbjcr40P4hU3Wby3mi2ZRmfk-Z1xJzlBo39RM8sJLYLPEp98bl7qCwG9vjdq_HnYO7FbRQdQoBKXlFGg4lV6gwns7C2sCY5BNMPX-rhJjfxznQjqe0jF2vYQEwnc0gnGjPcLWXecgQhdfZJGhqi1Ob6Oqh0DUCdv0Bh0lqluCfaFyRZsjhXlGJ8hC-cZyUw1ok5HhIa-OyYkO-CE09Ge3Qr04Q0qm8yoPMpHfykSD3fkmCfLbsoO65-mysFzw7rsJQfrTND292dzh',
    },
    {
        id: 5,
        title: 'Lumbar Relief',
        duration: '6 MINS',
        target: 'Lower Back',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ZC4z_qIswOlHm2pLlvmtALU4-MCb96ZbkV7DoXFH8GFQw_OQgp1RchwD0KMuRO5uav5Wyp0QNCH_volp7D22I7CZ6RAAQWnV9-IeqP7Dex2jeUWpRtbKhlNfm8EfTSXG0z9YXm21hsvQcT7SgzvsafAxHksF0__G1lIpiSRHCGkQdIInyWXmOAg-hiushIMKsEfznxLrcrmDEcSQD3Fm5ewUiDSpoIwMAQN0B64YHJK1Lu1ZlYLb8AYajA1ZgFLOeKIuGPtihb0Y',
    },
];

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
    const [searchQuery, setSearchQuery] = useState('');

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
                {/* Categories */}
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
                            onPress={() => setActiveCategory(category)}
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

                {/* Recommended Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recommended for You</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>SEE ALL</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.exerciseList}>
                        {recommendedExercises.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                title={exercise.title}
                                duration={exercise.duration}
                                target={exercise.target}
                                image={exercise.image}
                            />
                        ))}
                    </View>
                </View>

                {/* New Routines Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>New Routines</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>EXPLORE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.exerciseList}>
                        {newRoutines.map((exercise) => (
                            <ExerciseCard
                                key={exercise.id}
                                title={exercise.title}
                                duration={exercise.duration}
                                target={exercise.target}
                                image={exercise.image}
                            />
                        ))}
                    </View>
                </View>
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
