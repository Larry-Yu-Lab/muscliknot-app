import { fetchExercisesByMuscleAndSize } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StrengthenScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { language, theme } = usePreferences();
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
    const colors = Colors[theme];

    const muscleId = (params.muscleId as string) || 'unknown';
    const size = (params.size as string) || 'medium';
    const activityType = 'strength';

    const [exercises, setExercises] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);
            const data = await fetchExercisesByMuscleAndSize(muscleId, size, activityType);
            if (data && data.length > 0) setExercises(data);
            setIsLoading(false);
        };
        fetchExercises();
    }, [muscleId, size]);

    const handleComplete = () => {
        Alert.alert(t('alertStrengthTitle'), t('alertStrengthMsg'), [
            { text: "OK", onPress: () => router.navigate('/(tabs)') }
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('strengthenTitle')} ({(() => {
                            const locKey = `loc${muscleId.charAt(0).toUpperCase()}${muscleId.slice(1).replace(/_/g, '')}` as any;
                            const trans = t(locKey);
                            return trans !== locKey ? trans : muscleId;
                        })()})
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                {isLoading ? (
                    <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>{t('loadingStrength')}</Text>
                ) : exercises.length === 0 ? (
                    <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>{t('noStrength')}</Text>
                ) : (
                    exercises.map((ex, index) => (
                        <View key={index} style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{ex.solution_stretch || ex.common_name}</Text>
                            <Text style={{ color: colors.textSecondary }}>{ex.instructions || t('fallbackStrength')}</Text>
                        </View>
                    ))
                )}
            </ScrollView>

            <View style={[styles.bottomContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity style={[styles.completeButton, { backgroundColor: '#10b981' }]} onPress={handleComplete}>
                    <Text style={styles.completeButtonText}>{t('markAsComplete')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    backButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerSpacer: { width: 48 },
    card: { padding: 16, margin: 16, borderRadius: 12, borderWidth: 1 },
    cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
    completeButton: { height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    completeButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
