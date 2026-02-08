import { CustomToggle } from '@/components/ui/CustomToggle';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsRowProps {
    icon: string;
    label: string;
    rightLabel?: string;
    showChevron?: boolean;
    showExpand?: boolean;
    onPress?: () => void;
    isLast?: boolean;
}

const SettingsRow = ({ icon, label, rightLabel, showChevron = true, showExpand = false, onPress, isLast }: SettingsRowProps) => {
    const { theme } = usePreferences();
    const colors = Colors[theme];

    return (
        <TouchableOpacity
            style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.rowLeft}>
                <View style={styles.iconCircle}>
                    <MaterialIcons name={icon as any} size={20} color={colors.accent} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.rowRight}>
                {rightLabel && <Text style={[styles.rightLabel, { color: 'rgba(255,255,255,0.4)' }]}>{rightLabel}</Text>}
                {showChevron && <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />}
                {showExpand && <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.3)" />}
            </View>
        </TouchableOpacity>
    );
};

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, toggleTheme, language, setLanguage, notificationsEnabled, toggleNotifications } = usePreferences();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SETTINGS</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('preferences').toUpperCase()}</Text>
                    <View style={styles.glassCard}>
                        {/* Dark Mode */}
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <View style={styles.iconCircle}>
                                    <MaterialIcons name="brightness-6" size={20} color={colors.accent} />
                                </View>
                                <Text style={[styles.rowLabel, { color: colors.text }]}>{t('darkMode')}</Text>
                            </View>
                            <CustomToggle
                                value={theme === 'dark'}
                                onValueChange={toggleTheme}
                                activeColor={colors.accent}
                            />
                        </View>
                        <View style={styles.dividerRow} />

                        {/* Notifications */}
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <View style={styles.iconCircle}>
                                    <MaterialIcons name="notifications-none" size={20} color={colors.accent} />
                                </View>
                                <Text style={[styles.rowLabel, { color: colors.text }]}>{t('notifications')}</Text>
                            </View>
                            <CustomToggle
                                value={notificationsEnabled}
                                onValueChange={toggleNotifications}
                                activeColor={colors.accent}
                            />
                        </View>
                        <View style={styles.dividerRow} />

                        {/* Language */}
                        <View style={[styles.languageContainer, !isLanguageDropdownOpen && { borderBottomWidth: 0 }]}>
                            <TouchableOpacity
                                style={styles.languageHeader}
                                onPress={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            >
                                <View style={styles.rowLeft}>
                                    <View style={styles.iconCircle}>
                                        <MaterialIcons name="language" size={20} color={colors.accent} />
                                    </View>
                                    <Text style={[styles.rowLabel, { color: colors.text }]}>{t('language')}</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Text style={[styles.rightLabel, { color: 'rgba(255,255,255,0.4)' }]}>
                                        {LANGUAGES.find(l => l.code === language)?.label || 'English'}
                                    </Text>
                                    <Ionicons
                                        name={isLanguageDropdownOpen ? "chevron-down" : "chevron-forward"}
                                        size={20}
                                        color="rgba(255,255,255,0.3)"
                                    />
                                </View>
                            </TouchableOpacity>

                            {isLanguageDropdownOpen && (
                                <View style={[styles.languageList, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb' }]}>
                                    {LANGUAGES.map((langItem) => (
                                        <TouchableOpacity
                                            key={langItem.code}
                                            style={[
                                                styles.languageOption,
                                                language === langItem.code && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }
                                            ]}
                                            onPress={() => {
                                                setLanguage(langItem.code);
                                                setIsLanguageDropdownOpen(false);
                                            }}
                                        >
                                            <View style={styles.languageOptionLeft}>
                                                <View style={[styles.radioOuter, { borderColor: language === langItem.code ? colors.accent : colors.textSecondary }]}>
                                                    {language === langItem.code && (
                                                        <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                                                    )}
                                                </View>
                                                <Text style={[styles.languageOptionText, { color: isDark ? '#fff' : '#000' }]}>{langItem.label}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <View style={styles.dividerRow} />

                        <SettingsRow
                            icon="straighten"
                            label={t('metricUnits')}
                            rightLabel={t('metricSymbol')}
                            showChevron={false}
                            showExpand={true}
                            isLast={true}
                        />
                    </View>
                </View>

                {/* Health & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('healthPrivacy').toUpperCase()}</Text>
                    <View style={styles.glassCard}>
                        <SettingsRow icon="file-download" label={t('dataExport')} />
                        <SettingsRow icon="shield" label={t('privacyPolicy')} />
                        <SettingsRow icon="health-and-safety" label={t('manageHealthRecords')} isLast={true} />
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('support').toUpperCase()}</Text>
                    <View style={styles.glassCard}>
                        <SettingsRow icon="help-outline" label={t('helpCenter')} />
                        <SettingsRow icon="mail-outline" label={t('contactUs')} />
                        <SettingsRow icon="info-outline" label={t('aboutMuscliKnot')} isLast={true} />
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
                    <MaterialIcons name="logout" size={20} color="#ef4444" />
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerRow: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        minHeight: 64,
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
        backgroundColor: 'rgba(249, 107, 6, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rightLabel: {
        fontSize: 14,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        paddingVertical: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },
    languageContainer: {
        overflow: 'hidden',
    },
    languageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        minHeight: 64,
    },
    languageList: {
        paddingVertical: 8,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    languageOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    languageOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
