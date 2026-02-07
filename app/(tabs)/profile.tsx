import { CustomToggle } from '@/components/ui/CustomToggle';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { getHistory } from '@/utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const { theme, language, toggleTheme, setLanguage, notificationsEnabled, toggleNotifications } = usePreferences();
    const { user, updateUser } = useUser();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [activeTab, setActiveTab] = useState<'profile' | 'plans'>('profile');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [sessionsCount, setSessionsCount] = useState(user.stats.workouts);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getHistory().then(items => {
                const count = items.length;
                setSessionsCount(count);
                // Also update user context if needed, or just display local count
                if (count !== user.stats.workouts) {
                    updateUser({ stats: { ...user.stats, workouts: count } });
                }
            });
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('dashboard')}</Text>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/settings')}>
                        <Ionicons name="settings-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <View style={[styles.tabWrapper, { backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6' }]}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'profile' && { backgroundColor: isDark ? '#333333' : '#white', shadowOpacity: theme === 'light' ? 0.1 : 0 }]}
                            onPress={() => setActiveTab('profile')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'profile' ? colors.text : colors.textSecondary }]}>{t('profile')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'plans' && { backgroundColor: isDark ? '#333333' : '#white', shadowOpacity: theme === 'light' ? 0.1 : 0 }]}
                            onPress={() => setActiveTab('plans')}
                        >
                            <Text style={[styles.tabText, { color: activeTab === 'plans' ? colors.text : colors.textSecondary }]}>{t('plansPricing')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Area */}
                {activeTab === 'profile' ? (
                    <>
                        {/* Profile Avatar with Progress Ring */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarContainer}>
                                {/* Progress Ring SVG */}
                                <Svg style={styles.progressRing} width={144} height={144} viewBox="0 0 144 144">
                                    <Circle
                                        cx="72"
                                        cy="72"
                                        r="66"
                                        stroke={isDark ? "rgba(249,107,6,0.1)" : "rgba(249,107,6,0.2)"}
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <Circle
                                        cx="72"
                                        cy="72"
                                        r="66"
                                        stroke={colors.accent}
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="414"
                                        strokeDashoffset={414 - (414 * user.attributes.levelProgress) / 100}
                                        strokeLinecap="round"
                                        rotation="-90"
                                        origin="72, 72"
                                    />
                                </Svg>
                                <Image
                                    source={{ uri: user.avatarUrl }}
                                    style={[styles.avatar, { borderColor: colors.background }]}
                                />
                            </View>

                            {/* Name and Status */}
                            <View style={styles.nameSection}>
                                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                <View style={styles.statusRow}>
                                    <Text style={[styles.athleteStatus, { color: colors.accent }]}>
                                        {t('statusAthlete')}
                                    </Text>
                                    <Text style={[styles.statusDot, { color: colors.textSecondary }]}>•</Text>
                                    <Text style={[styles.premiumStatus, { color: colors.textSecondary }]}>{t('premiumStatus')}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('workoutsLabel')}</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{sessionsCount}</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('recoveryLabel')}</Text>
                                <Text style={[styles.statValueOrange, { color: colors.accent }]}>{user.stats.recoveryScore}%</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('streakLabel')}</Text>
                                <Text style={[styles.statValueOrange, { color: colors.accent }]}>{sessionsCount > 0 ? `${user.stats.streakDays}d` : '0d'}</Text>
                            </View>
                        </View>

                        {/* Health Vault Section */}
                        <View style={styles.healthVaultSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('healthVault')}</Text>
                                <TouchableOpacity style={[styles.analyticsButton, { borderColor: colors.accent }]}>
                                    <Text style={[styles.analyticsButtonText, { color: colors.accent }]}>{t('viewAnalytics')}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.healthCardsGrid}>
                                {/* Injury History Card */}
                                <View style={[styles.glassCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardIconOrange}>
                                            <MaterialCommunityIcons name="human-handsup" size={20} color={colors.accent} />
                                        </View>
                                        <View style={styles.cardBadge}>
                                            <Text style={[styles.cardBadgeText, { color: colors.accent }]}>+{user.attributes.injuryRecovery}%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{t('injuryHistory')}</Text>
                                        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('recoveryTrack')}</Text>
                                    </View>
                                    <View style={styles.miniGraphContainer}>
                                        <Svg width="100%" height={60} viewBox="0 0 100 40" preserveAspectRatio="none">
                                            <Path
                                                d="M0 35 Q 30 35, 60 25 T 100 10"
                                                fill="none"
                                                stroke={colors.accent}
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                            <Circle cx="100" cy="10" r="4" fill={colors.accent} />
                                        </Svg>
                                    </View>
                                </View>

                                {/* Fitness Level Card */}
                                <View style={[styles.glassCard, styles.fitnessCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardIconGreen}>
                                            <MaterialCommunityIcons name="dumbbell" size={20} color={colors.success} />
                                        </View>
                                        <Text style={[styles.levelTextSimple, { color: colors.textSecondary }]}>
                                            {t('lvlLabel')} {user.attributes.level}
                                        </Text>
                                    </View>
                                    {/* Circular Progress */}
                                    <View style={styles.circularProgressContainer}>
                                        <Svg width={80} height={80} viewBox="0 0 80 80">
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke={isDark ? "#1a1a1a" : "#e5e5e5"}
                                                strokeWidth="6"
                                                fill="transparent"
                                            />
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke={colors.accent}
                                                strokeWidth="6"
                                                fill="transparent"
                                                strokeDasharray="201"
                                                strokeDashoffset={201 - (201 * user.attributes.levelProgress) / 100}
                                                strokeLinecap="round"
                                                rotation="-90"
                                                origin="40, 40"
                                            />
                                        </Svg>
                                        <Text style={[styles.circularProgressText, { color: colors.text }]}>{user.attributes.levelProgress}%</Text>
                                    </View>
                                    <View style={styles.fitnessInfo}>
                                        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{t('fitnessLevel')}</Text>
                                        <Text style={[styles.fitnessLevelText, { color: colors.text }]}>
                                            {(() => {
                                                const levelKey = `fl${user.attributes.fitnessLevel.charAt(0) + user.attributes.fitnessLevel.slice(1).toLowerCase()}` as any;
                                                return t(levelKey) !== levelKey ? t(levelKey) : user.attributes.fitnessLevel;
                                            })()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* General Settings Section */}
                        <View style={styles.settingsSection}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginBottom: 12 }]}>{t('generalSettings').toUpperCase()}</Text>

                            {/* Notifications */}
                            <View style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={styles.rowInner}>
                                    <View style={styles.rowLeft}>
                                        <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
                                            <Ionicons name="notifications" size={18} color={colors.text} />
                                        </View>
                                        <Text style={[styles.pillLabel, { color: colors.text }]}>{t('notifications')}</Text>
                                    </View>
                                    <CustomToggle
                                        value={notificationsEnabled}
                                        onValueChange={toggleNotifications}
                                        activeColor={colors.accent}
                                    />
                                </View>
                            </View>

                            {/* Dark Mode */}
                            <View style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={styles.rowInner}>
                                    <View style={styles.rowLeft}>
                                        <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
                                            <Ionicons name="moon" size={18} color={colors.text} />
                                        </View>
                                        <Text style={[styles.pillLabel, { color: colors.text }]}>{t('darkMode')}</Text>
                                    </View>
                                    <CustomToggle
                                        value={isDark}
                                        onValueChange={toggleTheme}
                                        activeColor={colors.accent}
                                    />
                                </View>
                            </View>

                            {/* Language */}
                            <View style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <TouchableOpacity
                                    style={styles.rowInner}
                                    onPress={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                >
                                    <View style={styles.rowLeft}>
                                        <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
                                            <Ionicons name="language" size={18} color={colors.text} />
                                        </View>
                                        <Text style={[styles.pillLabel, { color: colors.text }]}>{t('language')}</Text>
                                    </View>
                                    <View style={styles.rowRight}>
                                        <Text style={[styles.currentLangTextPill, { color: colors.textSecondary }]}>
                                            {language.toUpperCase()}
                                        </Text>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color={colors.textSecondary}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {isLanguageDropdownOpen && (
                                    <View style={[styles.languageListPill, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#f9fafb' }]}>
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

                            {/* Settings Link */}
                            <TouchableOpacity
                                style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                                onPress={() => router.push('/settings')}
                            >
                                <View style={styles.rowInner}>
                                    <View style={styles.rowLeft}>
                                        <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
                                            <Ionicons name="settings-outline" size={18} color={colors.text} />
                                        </View>
                                        <Text style={[styles.pillLabel, { color: colors.text }]}>{t('settings')}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Account Actions */}
                        <View style={styles.settingsSection}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('account')}</Text>
                            <TouchableOpacity style={[
                                styles.logoutButton,
                                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }
                            ]}>
                                <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                                <Text style={[styles.logoutText, { color: colors.danger }]}>{t('logout')}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.plansContainer}>
                        {/* Billing Toggle */}
                        <View style={styles.billingToggleWrapper}>
                            <View style={[styles.billingToggleBg, { backgroundColor: colors.cardBackground }]}>
                                <View style={[styles.billingToggleActive,
                                billingCycle === 'monthly' ? { left: 4 } : { left: '50%' },
                                { backgroundColor: colors.background }
                                ]} />
                                <TouchableOpacity style={styles.billingToggleOption} onPress={() => setBillingCycle('monthly')}>
                                    <Text style={[styles.billingToggleText, billingCycle === 'monthly' ? { color: colors.text } : { color: colors.textSecondary }]}>{t('monthly')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.billingToggleOption} onPress={() => setBillingCycle('annual')}>
                                    <Text style={[styles.billingToggleText, billingCycle === 'annual' ? { color: colors.text } : { color: colors.textSecondary }]}>{t('annual')}</Text>
                                    {billingCycle === 'annual' && (
                                        <View style={[styles.saveBadge, { backgroundColor: colors.success }]}>
                                            <Text style={styles.saveBadgeText}>{t('save20')}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Elite Plan Card */}
                        <View style={styles.planCardWrapper}>
                            {/* Glow Effect only in dark mode or subtle shadow in light */}
                            <View style={isDark ? styles.eliteGlow : {}} />

                            <View style={[styles.eliteCard, { backgroundColor: colors.cardBackground }]}>
                                <View style={styles.planHeader}>
                                    <View>
                                        <Text style={styles.planTitleElite}>{t('elitePlan')}</Text>
                                        <View style={styles.priceContainer}>
                                            <Text style={[styles.priceBig, { color: colors.text }]}>{billingCycle === 'annual' ? '$7.99' : '$9.99'}</Text>
                                            <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>{t('monthAbbr')}</Text>
                                        </View>
                                        {billingCycle === 'annual' && (
                                            <Text style={[styles.billedText, { color: colors.textSecondary }]}>
                                                {t('billedAnnually')} {t('annualPrice').replace('${price}', '95.88')}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[styles.bestValueBadge, { backgroundColor: colors.accent }]}>
                                        <Text style={styles.bestValueText}>{t('bestValue')}</Text>
                                    </View>
                                </View>
                                <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
                                <View style={styles.featuresList}>
                                    {[
                                        'featureUnlimitedAI',
                                        'featureAdvancedMapping',
                                        'featureFullAnalytics'
                                    ].map((key, i) => (
                                        <View key={i} style={styles.featureItem}>
                                            <MaterialCommunityIcons name="check-circle" size={20} color={colors.accent} />
                                            <Text style={[styles.featureText, { color: colors.text }]}>{t(key as any)}</Text>
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity style={[styles.eliteButton, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.eliteButtonText}>
                                        {billingCycle === 'annual' ? t('upgradeSave') : t('upgradeElite')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Tables and Pro Card logic simplified for brevity but followed same theme pattern */}
                        {/* Pro Plan Card */}
                        <View style={[styles.proCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.planHeader}>
                                <View>
                                    <View style={styles.proBadge}>
                                        <Text style={styles.proBadgeText}>{t('pro')}</Text>
                                    </View>
                                    <Text style={[styles.planTitlePro, { color: colors.text }]}>{t('proPlan')}</Text>
                                    <View style={styles.priceContainer}>
                                        <Text style={[styles.priceBig, { color: colors.text }]}>{billingCycle === 'annual' ? '$3.99' : '$4.99'}</Text>
                                        <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>{t('monthAbbr')}</Text>
                                    </View>
                                    {billingCycle === 'annual' && (
                                        <Text style={[styles.billedText, { color: colors.textSecondary }]}>
                                            {t('billedAnnually')} {t('annualPrice').replace('${price}', '47.88')}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
                            <View style={styles.featuresList}>
                                {[
                                    'featureBasicAI',
                                    'featureStandardMapping',
                                    'featureWeeklyReports'
                                ].map((key, i) => (
                                    <View key={i} style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={20} color={colors.textSecondary} />
                                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>{t(key as any)}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity style={[styles.proButton, { borderColor: colors.cardBorder }]}>
                                <Text style={[styles.proButtonText, { color: colors.text }]}>{t('choosePro')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },

    // Tab Switcher
    tabContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    tabWrapper: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginTop: 32,
        paddingHorizontal: 24,
    },
    avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRing: {
        position: 'absolute',
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 4,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#f96b06',
        borderRadius: 20,
        padding: 4,
        borderWidth: 4,
        borderColor: '#000000',
    },
    nameSection: {
        alignItems: 'center',
        marginTop: 16,
        gap: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    athleteStatus: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statusDot: {
        fontSize: 10,
    },
    premiumStatus: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },

    // Stats Container
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginTop: 32,
    },
    statCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 32,
    },
    statValueOrange: {
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 32,
    },

    // Health Vault Section
    healthVaultSection: {
        marginTop: 32,
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
    },
    analyticsButton: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    analyticsButtonText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    healthCardsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    glassCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardIconOrange: {
        backgroundColor: 'rgba(249,115,22,0.1)',
        padding: 8,
        borderRadius: 8,
    },
    cardIconGreen: {
        backgroundColor: 'rgba(34,197,94,0.1)',
        padding: 8,
        borderRadius: 8,
    },
    cardBadge: {
        backgroundColor: 'rgba(249,115,22,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },
    cardBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        marginTop: 12,
    },
    cardLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 2,
    },
    miniGraphContainer: {
        marginTop: 24,
        height: 60,
        justifyContent: 'flex-end',
    },

    // Fitness Card
    fitnessCard: {
    },
    circularProgressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    circularProgressText: {
        position: 'absolute',
        fontSize: 14,
        fontWeight: '700',
    },
    fitnessInfo: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    fitnessLevelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    fitnessLevelText: {
        fontSize: 14,
        fontWeight: '700',
    },
    levelTextSimple: {
        fontSize: 10,
        fontWeight: '700',
    },

    // Plan Related
    plansContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    billingToggleWrapper: {
        alignItems: 'center',
        marginVertical: 24,
    },
    billingToggleBg: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 30,
        width: 280,
        height: 48,
        position: 'relative',
    },
    billingToggleActive: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        width: 134,
        borderRadius: 24,
    },
    billingToggleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        gap: 6,
    },
    billingToggleText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    saveBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    saveBadgeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '800',
    },

    // Elite Card
    planCardWrapper: {
        marginBottom: 20,
    },
    eliteGlow: {
        position: 'absolute',
        top: -20,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(249,107,6,0.15)',
        filter: 'blur(40px)',
        // Note: blur might not work on all RN versions, usually requires wrapping details or image based glow. 
        // For simplicity we leave it as a view with opacity.
    },
    eliteCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f96b06',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    planTitleElite: {
        color: '#f96b06',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    priceBig: {
        fontSize: 32,
        fontWeight: '900',
    },
    pricePeriod: {
        fontSize: 14,
        fontWeight: '600',
    },
    billedText: {
        fontSize: 12,
        marginTop: 4,
    },
    bestValueBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bestValueText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
    },
    divider: {
        height: 1,
        marginVertical: 20,
    },
    featuresList: {
        gap: 16,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        fontWeight: '500',
    },
    eliteButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    eliteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
    },

    // Pro Card
    proCard: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        marginTop: 16,
    },
    proBadge: {
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    proBadgeText: {
        color: '#9ca3af',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    planTitlePro: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    proButton: {
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        marginTop: 8,
    },
    proButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    // Settings Section Styles
    settingsSection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    languageContainer: {
        borderBottomWidth: 1,
        overflow: 'hidden',
    },
    languageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    currentLangText: {
        fontSize: 14,
        fontWeight: '500',
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
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
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
    langButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    langText: {
        fontSize: 14,
        fontWeight: '600',
    },
    pillCard: {
        borderRadius: 40,
        borderWidth: 1,
        marginBottom: 12,
        overflow: 'hidden',
    },
    rowInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        minHeight: 70,
    },
    iconCircleSmall: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    currentLangTextPill: {
        fontSize: 14,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.4)',
    },
    languageListPill: {
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 40,
        borderWidth: 1,
        gap: 8,
        marginTop: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
