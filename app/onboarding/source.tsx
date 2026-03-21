import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
    { id: 'social_media', label: 'Social Media' },
    { id: 'friends_family', label: 'Friends or Family' },
    { id: 'app_store', label: 'App Store' },
    { id: 'other', label: 'Other' },
];

export default function SourceScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    const [selected, setSelected] = useState<string | null>(null);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleContinue = async () => {
        if (!selected) return;
        await AsyncStorage.setItem('user_source', selected);
        router.push('/onboarding/experience');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: '50%' }]} />
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Where did you hear about us?</Text>
                
                <View style={styles.optionsContainer}>
                    {OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                selected === option.id && styles.optionCardSelected,
                            ]}
                            onPress={() => setSelected(option.id)}
                        >
                            <Text style={styles.optionTitle}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!selected}
                >
                    <Text style={styles.buttonText}>{t('continue')}</Text>
                </TouchableOpacity>
            </View>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    progressBarBackground: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#f97316',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 32,
        lineHeight: 40,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    optionCardSelected: {
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    button: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
});
