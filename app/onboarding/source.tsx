import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OPTIONS = [
    { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
    { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
    { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
    { id: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
    { id: 'x', label: 'X (Twitter)', icon: 'logo-twitter' },
    { id: 'google', label: 'Google Search', icon: 'logo-google' },
    { id: 'tv', label: 'TV', icon: 'tv-outline' },
    { id: 'friends_family', label: 'Friends or Family', icon: 'people-outline' },
    { id: 'app_store', label: 'App Store', icon: 'logo-apple-appstore' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' },
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
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '30%' }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Where did you hear about us?</Text>
                <Text style={styles.subtitle}>Let us know how you found MuscliKnot.</Text>
                
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
                            <Ionicons 
                                name={option.icon as any} 
                                size={24} 
                                color={selected === option.id ? '#f97316' : 'rgba(255,255,255,0.6)'} 
                                style={{ marginRight: 16 }} 
                            />
                            <Text style={[
                                styles.optionTitle,
                                selected === option.id && { color: '#f97316' }
                            ]}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

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
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 32,
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    progressContainer: {
        flex: 1,
        height: 4,
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
        marginBottom: 12,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 32,
        lineHeight: 24,
    },
    optionsContainer: {
        gap: 12,
    },
    optionCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'transparent',
        flexDirection: 'row',
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
