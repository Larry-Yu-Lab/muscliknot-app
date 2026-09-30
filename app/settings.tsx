import { CustomToggle } from '@/components/ui/CustomToggle';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { scale, scaleFont, tabletContainerStyle } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

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
                {rightLabel && <Text style={[styles.rightLabel, { color: colors.textSecondary }]}>{rightLabel}</Text>}
                {showChevron && <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
                {showExpand && <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />}
            </View>
        </TouchableOpacity>
    );
};

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut, user } = useAuth();
    const { theme, toggleTheme, language, setLanguage, notificationsEnabled, toggleNotifications, equipment } = usePreferences();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings').toUpperCase()}</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
                <View style={styles.outerAligner}>
                    <View style={styles.innerContainer}>
                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('preferences').toUpperCase()}</Text>
                    <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
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
                                    <Text style={[styles.rightLabel, { color: colors.textSecondary }]}>
                                        {LANGUAGES.find(l => l.code === language)?.label || 'English'}
                                    </Text>
                                    <Ionicons
                                        name={isLanguageDropdownOpen ? "chevron-down" : "chevron-forward"}
                                        size={20}
                                        color={colors.textSecondary}
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
                                                <Text style={[styles.languageOptionText, { color: colors.text }]}>{langItem.label}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        <View style={styles.dividerRow} />

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => router.push('/settings/equipment' as any)}
                        >
                            <View style={styles.rowLeft}>
                                <View style={styles.iconCircle}>
                                    <MaterialIcons name="straighten" size={20} color={colors.accent} />
                                </View>
                                <Text style={[styles.rowLabel, { color: colors.text }]}>{t('manageEquipment')}</Text>
                            </View>
                            <View style={styles.rowRight}>
                                {equipment.length > 0 && (
                                    <Text style={[styles.rightLabel, { color: colors.textSecondary }]}>
                                        {equipment.length}
                                    </Text>
                                )}
                                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.dividerRow} />

                        <SettingsRow
                            icon="settings-input-component"
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
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('healthPrivacy').toUpperCase()}</Text>
                    <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <SettingsRow icon="file-download" label={t('dataExport')} />
                        <SettingsRow icon="shield" label={t('privacyPolicy')} onPress={() => router.push('/privacy' as any)} />
                        <SettingsRow icon="health-and-safety" label={t('manageHealthRecords')} isLast={true} />
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('support').toUpperCase()}</Text>
                    <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <SettingsRow icon="help-outline" label={t('helpCenter')} />
                        <SettingsRow icon="mail-outline" label={t('contactUs')} />
                        <SettingsRow icon="info-outline" label={t('aboutMuscliKnot')} isLast={true} />
                    </View>
                </View>

                {/* Logout & Account Actions */}
                <View style={{ gap: 10, marginTop: 24, marginBottom: 40 }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        activeOpacity={0.7}
                        onPress={async () => {
                            await signOut();
                            router.replace('/auth/login' as any);
                        }}
                    >
                        <MaterialIcons name="logout" size={20} color="#ef4444" />
                        <Text style={styles.logoutText}>{t('logout').toUpperCase()}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' }]}
                        activeOpacity={0.7}
                        onPress={() => {
                            Alert.alert(
                                t('deleteAccountConfirmTitle'),
                                t('deleteAccountConfirmMsg'),
                                [
                                    { text: t('cancel'), style: 'cancel' },
                                    {
                                        text: t('deleteAccount'),
                                        style: 'destructive',
                                        onPress: async () => {
                                            try {
                                                if (user?.id && supabase) {
                                                    await supabase.from('profiles').delete().eq('id', user.id);
                                                    await supabase.from('user_stats').delete().eq('user_id', user.id);
                                                }
                                                await AsyncStorage.clear();
                                                await signOut();
                                                router.replace('/auth/login' as any);
                                            } catch (e) {
                                                await signOut();
                                                router.replace('/auth/login' as any);
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <MaterialIcons name="delete-forever" size={20} color="#ef4444" />
                        <Text style={[styles.logoutText, { color: '#ef4444' }]}>{t('deleteAccount').toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
                </View>
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
        paddingHorizontal: scale(8),
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        ...tabletContainerStyle,
    },
    backButton: {
        width: scale(44),
        height: scale(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: scaleFont(18),
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: scale(24),
        paddingBottom: scale(40),
        width: '100%',
        flexGrow: 1,
    },
    outerAligner: {
        width: '100%',
        alignItems: 'center',
        flex: 1,
    },
    innerContainer: {
        width: '100%',
        ...tabletContainerStyle,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        paddingHorizontal: 8,
        marginBottom: 12,
    },
    glassCard: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
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
