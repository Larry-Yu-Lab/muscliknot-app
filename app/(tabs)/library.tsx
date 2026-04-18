import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { EXERCISES } from '@/data/exercises';
import { getTranslation } from '@/utils/i18n';
import { fetchSavedExercises, saveExercise, unsaveExercise } from '@/utils/savedExercises';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: 'All', icon: 'apps-outline', label: 'catAll' },
    { id: 'Saved', icon: 'heart-outline', label: 'catSaved' },
    { id: 'Relief', icon: 'fitness-outline', label: 'catRelief' },
    { id: 'Warm-ups', icon: 'thermometer-outline', label: 'catWarmups' },
    { id: 'Yoga', icon: 'body-outline', label: 'catYoga' },
    { id: 'Posture', icon: 'accessibility-outline', label: 'catPosture' },
    { id: 'Strength', icon: 'barbell-outline', label: 'catStrength' },
];

type ExerciseCardProps = {
    id: string;
    title: string;
    duration: string;
    target: string;
    image: string;
    t: (key: any, params?: Record<string, string>) => string;
    colors: any;
    isSaved?: boolean;
    onToggleSave?: () => void;
};

// Helper for mapped muscle group translation inside card
const getMuscleKey = (name: string | undefined) => {
    if (!name) return 'catAll';
    if (name === 'All') return 'catAll';
    return `mg${name.replace(/\s/g, '')}` as any;
};

const ExerciseCard = ({ id, title, duration, target, image, t, colors, exercise, isSaved, onToggleSave }: ExerciseCardProps & { exercise: any }) => {
    const router = useRouter();
    const titleKey = `ex_${id}_title` as any;
    let translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : title;

    if (title === 'Neck Release & Stretch') translatedTitle = t('db_neck_title' as any) || title;
    else if (title === 'Lower Back Decompression') translatedTitle = t('db_lower_back_title' as any) || title;
    else if (title === 'Full Leg Flush') translatedTitle = t('db_leg_title' as any) || title;

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
                muscleGroup: exercise.muscleGroup,
                video_url: exercise.video_url ? encodeURIComponent(exercise.video_url) : undefined
            }
        });
    };

    return (
        <TouchableOpacity
            style={[styles.exerciseCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
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
                    <View style={[styles.targetBadge, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
                        <Text style={[styles.targetText, { color: colors.accent }]}>
                            {t('target', { target: t(getMuscleKey(target)) !== getMuscleKey(target) ? t(getMuscleKey(target)) : target })}
                        </Text>
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
    const [searchQuery, setSearchQuery] = useState('');
    const [supabaseExercises, setSupabaseExercises] = useState<any[]>([]);
    const [savedExerciseIds, setSavedExerciseIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string>) => getTranslation(language, key, params);
    const colors = Colors[theme];

    useEffect(() => {
        const fetchAllExercises = async () => {
            if (!supabase) { setIsLoading(false); return; }
            try {
                const { data, error } = await supabase.from('recovery_knowledge_base').select('*');
                if (error) console.error('Error fetching exercises:', error);
                else if (data) {
                    const categoryMap: Record<string, string> = {
                        'relief': 'Relief', 'posture': 'Posture', 'warmup': 'Warm-ups', 'warmups': 'Warm-ups', 'yoga': 'Yoga', 'strength': 'Strength',
                    };
                    const transformed = data.map((ex: any) => ({
                        id: ex.id?.toString() || String(Math.random()),
                        title: ex.title || ex.solution_stretch || ex.common_name || 'Unknown Exercise',
                        duration: ex.duration || '3-5 min',
                        target: ex.common_name || 'General',
                        muscleGroup: ex.common_name?.split(' ')[0] || 'General',
                        category: categoryMap[ex.exercise_type?.toLowerCase()] || 'Relief',
                        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQvExJHNf-gPBvV9mafHYX_QH4RDM2a10DReFfan-2uta-tGIgoYLy2YcqV88wGpuO0qaD_Yr1qPxSQtigGhxM0Sq6uOtWbw-JV0RDp_0RmODacO147g0dvAY693HSe3XPVdm2eTzs6ER9VAKERpdSDpdD1MgVcJ8HJCDesjsxF-hhw0aRZc-sY0sB3sHox58BbJ7vYjkyyLq8KDnpbu4x0PolLYeNnsL3Q3fcRFHU5BkgY0KWaZ8NP',
                        instructions: ex.instructions || ex.description, 
                        why: ex.why, 
                        process: ex.process,
                        video_url: ex.video_url,
                    }));
                    setSupabaseExercises(transformed);
                }
            } catch (err) { console.error(err); } finally { setIsLoading(false); }
        };
        fetchAllExercises();
    }, []);

    useEffect(() => {
        const loadSaved = async () => { setSavedExerciseIds(await fetchSavedExercises()); };
        loadSaved();
    }, []);

    const toggleSave = async (exerciseId: string) => {
        const isSaved = savedExerciseIds.includes(exerciseId);
        setSavedExerciseIds(prev => isSaved ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]);
        if (isSaved) await unsaveExercise('', exerciseId);
        else await saveExercise('', exerciseId);
    };

    const allExercises = useMemo(() => {
        const local = EXERCISES.map(ex => ({
            ...ex,
            target: ex.muscleGroup || 'General'
        }));
        return [...local, ...supabaseExercises];
    }, [supabaseExercises]);

    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex => {
            if (activeCategory === 'Saved') {
                if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return savedExerciseIds.includes(ex.id);
            }
            if (searchQuery && !ex.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (activeCategory !== 'All' && ex.category !== activeCategory) return false;
            return true;
        });
    }, [activeCategory, searchQuery, allExercises, savedExerciseIds]);

    const displayCategories = ['Saved', 'Relief', 'Warm-ups', 'Yoga', 'Posture', 'Strength'];

    const getCategoryDisplay = (name: string) => {
        const key = name === 'All' ? 'catAll' : `cat${name.replace(/[-\s]/g, '')}` as any;
        const trans = t(key);
        return trans !== key ? trans : name;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient colors={[colors.headerBackground, colors.background]} style={styles.gradientHeader}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('library')}</Text>
                    <TouchableOpacity style={[styles.profileButton, { backgroundColor: colors.cardBackground }]}>
                        <Ionicons name="filter-outline" size={20} color={colors.accent} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <BlurView intensity={30} tint={theme === 'dark' ? 'dark' : 'light'} style={[styles.searchBar, { borderColor: colors.cardBorder }]}>
                        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                        <TextInput
                            placeholder={t('searchExercises')}
                            placeholderTextColor={colors.textSecondary}
                            style={[styles.searchInput, { color: colors.text }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </BlurView>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                            style={[
                                styles.categoryChip,
                                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                                activeCategory === cat.id && { backgroundColor: colors.accent, borderColor: colors.accent }
                            ]}
                        >
                            <Ionicons name={cat.icon as any} size={18} color={activeCategory === cat.id ? '#000' : colors.textSecondary} />
                            <Text style={[styles.categoryLabel, { color: activeCategory === cat.id ? '#000' : colors.textSecondary, fontWeight: activeCategory === cat.id ? '700' : '500' }]}>
                                {t(cat.label as any)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {activeCategory !== 'All' ? (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('exercisesCount' as any, { count: filteredExercises.length.toString() })}
                        </Text>
                        <View style={styles.exerciseList}>
                            {filteredExercises.map((ex) => (
                                <ExerciseCard key={ex.id} {...ex} exercise={ex} t={t as any} colors={colors} isSaved={savedExerciseIds.includes(ex.id)} onToggleSave={() => toggleSave(ex.id)} />
                            ))}
                        </View>
                    </View>
                ) : (
                    displayCategories.map(cat => {
                        const catEx = cat === 'Saved'
                            ? allExercises.filter(ex => savedExerciseIds.includes(ex.id))
                            : allExercises.filter(ex => ex.category === cat);

                        if (catEx.length === 0) return null;
                        return (
                            <View key={cat} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{getCategoryDisplay(cat)}</Text>
                                    <TouchableOpacity onPress={() => setActiveCategory(cat)}>
                                        <Text style={{ color: colors.accent, fontWeight: '700' }}>{t('seeAll')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.exerciseList}>
                                    {catEx.slice(0, 3).map((ex) => (
                                        <ExerciseCard key={ex.id} {...ex} exercise={ex} t={t as any} colors={colors} isSaved={savedExerciseIds.includes(ex.id)} onToggleSave={() => toggleSave(ex.id)} />
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
    container: { flex: 1 },
    gradientHeader: { paddingBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: '800' },
    profileButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 25, borderWidth: 1, paddingHorizontal: 15, overflow: 'hidden' },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16 },
    categoryScroll: { paddingHorizontal: 20, gap: 10 },
    categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 8 },
    categoryLabel: { fontSize: 14 },
    scrollContent: { paddingBottom: 40 },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700' },
    exerciseList: { gap: 16 },
    exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1 },
    exerciseImageContainer: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, overflow: 'hidden' },
    exerciseImage: { width: '100%', height: '100%' },
    exerciseContent: { flex: 1, marginLeft: 16 },
    exerciseTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    durationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    durationText: { fontSize: 12, fontWeight: '500' },
    targetBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1 },
    targetText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    favoriteButton: { padding: 8 },
});
