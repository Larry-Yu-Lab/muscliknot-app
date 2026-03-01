import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EQUIPMENT_LIST = [
    { id: 'foam_roller', icon: 'settings-input-component' },
    { id: 'lacrosse_ball', icon: 'lens' },
    { id: 'resistance_band', icon: 'vibration' },
    { id: 'yoga_block', icon: 'crop-square' },
    { id: 'dumbbells', icon: 'fitness-center' },
    { id: 'kettlebell', icon: 'album' },
    { id: 'massage_gun', icon: 'bolt' },
    { id: 'stability_ball', icon: 'radio-button-checked' },
];

export default function EquipmentSettingsScreen() {
    const router = useRouter();
    const { theme, language, equipment, toggleEquipment } = usePreferences();
    const colors = Colors[theme];
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('equipmentSettings').toUpperCase()}</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>
                    {t('onboardingEquipmentDesc')}
                </Text>

                <View style={styles.glassCard}>
                    {EQUIPMENT_LIST.map((item, index) => {
                        const isSelected = equipment.includes(item.id);
                        const isLast = index === EQUIPMENT_LIST.length - 1;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.row,
                                    !isLast && styles.rowBorder
                                ]}
                                onPress={() => toggleEquipment(item.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.rowLeft}>
                                    <View style={[
                                        styles.iconCircle,
                                        isSelected && { backgroundColor: `${colors.accent}20` }
                                    ]}>
                                        <MaterialIcons
                                            name={item.icon as any}
                                            size={20}
                                            color={isSelected ? colors.accent : 'rgba(255,255,255,0.4)'}
                                        />
                                    </View>
                                    <View>
                                        <Text style={[
                                            styles.rowLabel,
                                            { color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)' }
                                        ]}>
                                            {t(`eq_${item.id}` as any)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[
                                    styles.checkbox,
                                    { borderColor: isSelected ? colors.accent : 'rgba(255,255,255,0.2)' },
                                    isSelected && { backgroundColor: colors.accent }
                                ]}>
                                    {isSelected && <Ionicons name="checkmark" size={16} color="#000" />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 40,
    },
    description: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 64,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
