import { CustomToggle } from '@/components/ui/CustomToggle';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { processAnalytics } from '@/utils/analytics';
import { isHealthKitAvailable, isHealthKitEnabled, setHealthKitEnabled as persistHealthKitEnabled, requestHealthKitPermission, getHealthKitSteps } from '@/utils/healthKit';
import { getTranslation, LANGUAGES } from '@/utils/i18n';
import { getHistory } from '@/utils/storage';
import { getGeminiApiKey, saveGeminiApiKey, deleteGeminiApiKey } from '@/utils/gemini';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getOfferings, purchasePackage, restorePurchases } from '@/utils/purchases';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const PainTrendsMiniSvg = ({ trends, color }: { trends: any[], color: string }) => {
    if (trends.length < 2) {
        return (
            <Svg 
                width="100%" 
                height={40} 
                viewBox="0 0 100 40" 
                preserveAspectRatio="none"
                onLayout={() => {}}
            >
                <Line x1="0" y1="35" x2="100" y2="35" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
            </Svg>
        );
    }

    const chartWidth = 100;
    const chartHeight = 40;
    const maxPain = 10;
    const padding = 5;

    // Use last 7 entries for the mini graph
    const recentTrends = trends.slice(-7);

    const points = recentTrends.map((entry, idx) => {
        const x = (idx / (recentTrends.length - 1)) * (chartWidth - padding * 2) + padding;
        const y = chartHeight - (entry.painLevel / maxPain) * (chartHeight - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    const pathData = `M ${points}`;
    const lastX = (recentTrends.length - 1) / (recentTrends.length - 1) * (chartWidth - padding * 2) + padding;
    const lastY = chartHeight - (recentTrends[recentTrends.length - 1].painLevel / maxPain) * (chartHeight - padding * 2) - padding;

    return (
        <Svg 
            width="100%" 
            height={40} 
            viewBox="0 0 100 40" 
            preserveAspectRatio="none"
            onLayout={() => {}}
        >
            <Path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Circle cx={lastX} cy={lastY} r="3" fill={color} />
        </Svg>
    );
};

export default function ProfileScreen() {
    const router = useRouter();
    const { theme, language, toggleTheme, setLanguage, notificationsEnabled, toggleNotifications } = usePreferences();
    const [isFitnessLevelModalVisible, setIsFitnessLevelModalVisible] = useState(false);
    const { user, updateUser } = useUser();
    const { user: authUser, signOut } = useAuth();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string>) => getTranslation(language, key, params);

    const [activeTab, setActiveTab] = useState<'profile' | 'plans'>('profile');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [stats, setStats] = useState({
        workouts: user.stats.workouts,
        recovery: user.stats.recoveryScore,
        streak: user.stats.streakDays
    });
    const [painTrends, setPainTrends] = useState<any[]>([]);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [healthKitEnabled, setHealthKitEnabledState] = useState(false);
    const [todaySteps, setTodaySteps] = useState<number>(0);
    const [devTapCount, setDevTapCount] = useState(0);
    const [geminiApiKey, setGeminiApiKeyValue] = useState('');
    const [isSavingKey, setIsSavingKey] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    const handleApplyPromoCode = async () => {
        const trimmedCode = promoCode.trim().toUpperCase();
        if (!trimmedCode) return;

        const tiers: Record<string, string> = {
            'KNOTFREE': 'Lifetime',
            'FREEKNOT': '1-Month',
            'GIFT2026': '3-Month',
            'COACH100': '1-Year',
            'VIPRECOVERY': '1-Year'
        };

        if (tiers[trimmedCode]) {
            setIsApplyingPromo(true);
            try {
                const tierName = tiers[trimmedCode];
                await AsyncStorage.setItem('user_referral_code', trimmedCode);
                await updateUser({ isPremium: true });
                
                Alert.alert(
                    "Code Accepted!",
                    `Valid referral code. ${tierName} Premium Access has been unlocked for your account!`,
                    [{ text: "Awesome" }]
                );
                setPromoCode('');
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to apply code. Please try again.");
            } finally {
                setIsApplyingPromo(false);
            }
        } else {
            Alert.alert(
                "Invalid Code",
                "The code you entered is invalid. Please check the spelling and try again.",
                [{ text: "OK" }]
            );
        }
    };

    const handleSaveGeminiKey = async () => {
        setIsSavingKey(true);
        const success = await saveGeminiApiKey(geminiApiKey);
        setIsSavingKey(false);
        if (success) {
            Alert.alert(t('aiHeaderCard' as any) || 'AI Settings', t('apiKeySaved' as any) || 'API Key saved successfully!');
        } else {
            Alert.alert('Error', 'Failed to save API key.');
        }
    };

    const handleDeleteGeminiKey = async () => {
        const success = await deleteGeminiApiKey();
        if (success) {
            setGeminiApiKeyValue('');
            Alert.alert(t('aiHeaderCard' as any) || 'AI Settings', 'API Key cleared.');
        } else {
            Alert.alert('Error', 'Failed to clear API key.');
        }
    };

    const handleDevTap = () => {
        setDevTapCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
                const newPremium = !user.isPremium;
                if (!newPremium) {
                    AsyncStorage.removeItem('user_referral_code');
                }
                updateUser({ isPremium: newPremium });
                Alert.alert(
                    'Developer Mode',
                    `Premium membership has been ${newPremium ? 'ENABLED' : 'DISABLED'} for testing.`,
                    [{ text: 'OK' }]
                );
                return 0;
            }
            return next;
        });
    };

    // Load persisted HealthKit preference on mount
    useEffect(() => {
        isHealthKitEnabled().then(setHealthKitEnabledState);
        getGeminiApiKey().then(key => {
            if (key) setGeminiApiKeyValue(key);
        });
    }, []);

    const handleUpdateFitnessLevel = (level: string) => {
        updateUser({
            attributes: {
                ...user.attributes,
                fitnessLevel: level
            }
        });
        setIsFitnessLevelModalVisible(false);
    };

    const handleUpgrade = async () => {
        try {
            const packages = await getOfferings();
            if (packages.length === 0) {
                Alert.alert(
                    'Error',
                    'No subscription packages found. Please verify your connection or try again later.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Find the package corresponding to selected billing cycle
            // 'annual' -> PACKAGE_TYPE.ANNUAL, 'monthly' -> PACKAGE_TYPE.MONTHLY
            // RevenueCat SDK uses 'ANNUAL' and 'MONTHLY' string keys or enum properties
            const packageTypeToFind = billingCycle === 'annual' ? 'ANNUAL' : 'MONTHLY';
            const selectedPackage = packages.find(pkg => pkg.packageType === packageTypeToFind) || packages[0];

            if (!selectedPackage) {
                Alert.alert(
                    'Error',
                    'The selected plan is not available at this moment.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await purchasePackage(selectedPackage);
            if (result.success) {
                await updateUser({ isPremium: true });
                Alert.alert(
                    'Success',
                    'Congratulations! Your Premium Access has been unlocked.',
                    [{ text: 'OK' }]
                );
            } else if (result.error && result.error !== 'User cancelled the purchase') {
                Alert.alert(
                    'Purchase Failed',
                    result.error,
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            console.error('Failed upgrading:', error);
            Alert.alert(
                'Error',
                'An unexpected error occurred. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleRestorePurchases = async () => {
        try {
            const result = await restorePurchases();
            if (result.success) {
                await updateUser({ isPremium: true });
                Alert.alert(
                    'Success',
                    'Your purchases have been successfully restored! Premium Access is active.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert(
                    'No Active Subscription',
                    result.error || 'We could not find an active premium subscription for your App Store account.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            console.error('Failed restoring purchases:', error);
            Alert.alert(
                'Error',
                'An unexpected error occurred while restoring purchases. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleHealthKitToggle = async () => {
        if (!healthKitEnabled) {
            // Turning ON — request permissions
            if (!isHealthKitAvailable()) {
                Alert.alert(
                    'Not Available',
                    'Apple Health integration requires a native build. Run `npx expo run:ios` to enable this feature.',
                    [{ text: 'OK' }]
                );
                return;
            }
            const granted = await requestHealthKitPermission();
            if (granted) {
                await persistHealthKitEnabled(true);
                setHealthKitEnabledState(true);
                // Fetch initial steps
                const steps = await getHealthKitSteps();
                setTodaySteps(steps);
            } else {
                Alert.alert(
                    'Permission Denied',
                    'MuscliKnot needs Apple Health access to sync your workouts and read step data. You can enable this in Settings > Privacy > Health.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            // Turning OFF
            await persistHealthKitEnabled(false);
            setHealthKitEnabledState(false);
            setTodaySteps(0);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getHistory().then(items => {
                const analytics = processAnalytics(items);
                setStats({
                    workouts: analytics.totalSessions,
                    recovery: analytics.recoveryScore,
                    streak: analytics.streakDays
                });
                setPainTrends(analytics.painTrends);

                // Update persistent user context with these factual stats
                if (analytics.totalSessions !== user.stats.workouts ||
                    analytics.recoveryScore !== user.stats.recoveryScore ||
                    analytics.streakDays !== user.stats.streakDays ||
                    analytics.level !== user.attributes.level ||
                    analytics.levelProgress !== user.attributes.levelProgress ||
                    analytics.injuryRecovery !== user.attributes.injuryRecovery) {
                    updateUser({
                        stats: {
                            workouts: analytics.totalSessions,
                            recoveryScore: analytics.recoveryScore,
                            streakDays: analytics.streakDays
                        },
                        attributes: {
                            ...user.attributes,
                            level: analytics.level,
                            levelProgress: analytics.levelProgress,
                            injuryRecovery: analytics.injuryRecovery
                        }
                    });
                }
            });

            // Refresh step count if HealthKit is enabled
            isHealthKitEnabled().then(enabled => {
                if (enabled) {
                    getHealthKitSteps().then(setTodaySteps);
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
                                <Svg 
                                    style={styles.progressRing} 
                                    width={144} 
                                    height={144} 
                                    viewBox="0 0 144 144"
                                    onLayout={() => {}}
                                >
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
                                <TouchableOpacity onPress={handleDevTap} activeOpacity={0.8}>
                                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                </TouchableOpacity>
                                <View style={styles.statusRow}>
                                    <Text style={[styles.athleteStatus, { color: colors.accent }]}>
                                        {t('statusAthlete')}
                                    </Text>
                                    <Text style={[styles.statusDot, { color: colors.textSecondary }]}>•</Text>
                                    <Text style={[styles.premiumStatus, { color: colors.textSecondary }]}>
                                        {user.isPremium ? t('premiumStatus') : t('freemium')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('workouts')}</Text>
                                <Text style={[styles.statValue, { color: colors.text }]}>{stats.workouts}</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('recovery')}</Text>
                                <Text style={[styles.statValueOrange, { color: colors.accent }]}>{stats.recovery}%</Text>
                            </View>
                            <View style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <Text style={[styles.statLabel, { color: colors.text }]}>{t('streak')}</Text>
                                <Text style={[styles.statValueOrange, { color: colors.accent }]}>{stats.streak}d</Text>
                            </View>
                        </View>

                        {/* Health Vault Section */}
                        <View style={styles.healthVaultSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('healthVault')}</Text>
                                <TouchableOpacity
                                    style={[styles.analyticsButton, { borderColor: colors.accent }]}
                                    onPress={() => router.push('/analytics' as any)}
                                >
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
                                        <PainTrendsMiniSvg trends={painTrends} color={colors.accent} />
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
                                        <Svg 
                                            width={80} 
                                            height={80} 
                                            viewBox="0 0 80 80"
                                            onLayout={() => {}}
                                        >
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
                                    <TouchableOpacity 
                                        style={styles.fitnessInfo}
                                        onPress={() => setIsFitnessLevelModalVisible(true)}
                                    >
                                        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{t('fitnessLevel')}</Text>
                                        <View style={styles.fitnessLevelRow}>
                                            <Text style={[styles.fitnessLevelText, { color: colors.text }]}>
                                                {(() => {
                                                    const fl = user.attributes.fitnessLevel || 'BEGINNER';
                                                    const levelKey = `fl${fl.charAt(0) + fl.slice(1).toLowerCase()}` as any;
                                                    return t(levelKey) !== levelKey ? t(levelKey) : fl;
                                                })()}
                                            </Text>
                                            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                                        </View>
                                    </TouchableOpacity>
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

                            {/* Apple Health Toggle (iOS only) */}
                            {Platform.OS === 'ios' && (
                                <View style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                    <View style={styles.rowInner}>
                                        <View style={styles.rowLeft}>
                                            <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb' }]}>
                                                <Ionicons name="heart" size={18} color="#ef4444" />
                                            </View>
                                            <View>
                                                <Text style={[styles.pillLabel, { color: colors.text }]}>{t('appleHealth' as any) || 'Apple Health'}</Text>
                                                {healthKitEnabled && todaySteps > 0 && (
                                                    <Text style={[styles.healthSubLabel, { color: colors.textSecondary }]}>
                                                        {todaySteps.toLocaleString()} steps today
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <CustomToggle
                                            value={healthKitEnabled}
                                            onValueChange={handleHealthKitToggle}
                                            activeColor="#ef4444"
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Recovery Squad Card */}
                            <TouchableOpacity
                                style={[styles.pillCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                                onPress={() => router.push('/squads' as any)}
                            >
                                <View style={styles.rowInner}>
                                    <View style={styles.rowLeft}>
                                        <View style={[styles.iconCircleSmall, { backgroundColor: isDark ? 'rgba(139,92,246,0.15)' : '#ede9fe' }]}>
                                            <MaterialCommunityIcons name="account-group" size={18} color="#8b5cf6" />
                                        </View>
                                        <Text style={[styles.pillLabel, { color: colors.text }]}>{t('recoverySquad' as any) || 'Recovery Squad'}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                                </View>
                            </TouchableOpacity>

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

                            {/* AI Settings Card */}
                            <View style={[
                                { 
                                    backgroundColor: colors.cardBackground, 
                                    borderColor: colors.cardBorder, 
                                    marginTop: 16, 
                                    padding: 16, 
                                    borderRadius: 16, 
                                    borderWidth: 1 
                                }
                            ]}>
                                <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="sparkles" size={18} color={colors.accent} />
                                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                                        {t('aiHeaderCard' as any) || 'AI Settings'}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 12 }}>
                                    {t('aiExplanation' as any) || 'Personalized recovery plans are generated dynamically using Gemini AI based on your specific pain notes and physical attributes.'}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                    <TextInput
                                        style={{ 
                                            flex: 1, 
                                            backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : '#f3f4f6', 
                                            color: colors.text, 
                                            borderColor: colors.cardBorder,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            fontSize: 13
                                        }}
                                        placeholder={t('geminiApiKey' as any) || 'Gemini API Key'}
                                        placeholderTextColor={colors.textSecondary}
                                        value={geminiApiKey}
                                        onChangeText={setGeminiApiKeyValue}
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    {geminiApiKey.length > 0 && (
                                        <TouchableOpacity
                                            style={{ backgroundColor: colors.accent, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10 }}
                                            onPress={handleSaveGeminiKey}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={{ color: '#000', fontWeight: '700', fontSize: 12 }}>
                                                {t('saveKey' as any) || 'Save'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {geminiApiKey.length > 0 && (
                                        <TouchableOpacity
                                            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb', paddingVertical: 9, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: colors.cardBorder }}
                                            onPress={handleDeleteGeminiKey}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons name="trash-outline" size={14} color="#ef4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Promo Code Card in Profile Settings */}
                            {!user.isPremium ? (
                                <View style={[
                                    { 
                                        backgroundColor: colors.cardBackground, 
                                        borderColor: colors.cardBorder, 
                                        marginTop: 16, 
                                        padding: 16, 
                                        borderRadius: 16, 
                                        borderWidth: 1 
                                    }
                                ]}>
                                    <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Ionicons name="gift" size={18} color={colors.accent} />
                                        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                                            {t('promoHeaderCard' as any) || 'Redeem Promo Code'}
                                        </Text>
                                    </View>
                                    <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 12 }}>
                                        {t('promoExplanation' as any) || 'Enter a promo/referral code to unlock Premium features.'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                        <TextInput
                                            style={{ 
                                                flex: 1, 
                                                backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : '#f3f4f6', 
                                                color: colors.text, 
                                                borderColor: colors.cardBorder,
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                fontSize: 13
                                            }}
                                            placeholder={t('promoPlaceholder' as any) || "Enter Code"}
                                            placeholderTextColor={colors.textSecondary}
                                            value={promoCode}
                                            onChangeText={setPromoCode}
                                            autoCapitalize="characters"
                                            autoCorrect={false}
                                        />
                                        <TouchableOpacity
                                            style={{ backgroundColor: colors.accent, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, opacity: promoCode.length === 0 ? 0.6 : 1 }}
                                            onPress={handleApplyPromoCode}
                                            disabled={promoCode.length === 0}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={{ color: '#000', fontWeight: '700', fontSize: 12 }}>
                                                {t('applyPromo' as any) || 'Apply'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={[
                                    { 
                                        backgroundColor: colors.cardBackground, 
                                        borderColor: colors.cardBorder, 
                                        marginTop: 16, 
                                        padding: 16, 
                                        borderRadius: 16, 
                                        borderWidth: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 12
                                    }
                                ]}>
                                    <View style={{ backgroundColor: colors.success + '20', padding: 8, borderRadius: 10 }}>
                                        <Ionicons name="sparkles" size={20} color={colors.success} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                                            Premium Membership Active
                                        </Text>
                                        <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                                            You have unlocked all Elite recovery features.
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Account Actions */}
                        <View style={styles.settingsSection}>
                            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('account')}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.logoutButton,
                                    { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }
                                ]}
                                onPress={async () => {
                                    await signOut();
                                    router.replace('/auth/login' as any);
                                }}
                            >
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
                                            <Text style={[styles.priceBig, { color: colors.text }]}>{billingCycle === 'annual' ? '$2.99' : '$3.99'}</Text>
                                            <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>{t('monthAbbr')}</Text>
                                        </View>
                                        {billingCycle === 'annual' && (
                                            <Text style={[styles.billedText, { color: colors.textSecondary }]}>
                                                {t('billedAnnually')} {t('annualPrice').replace('${price}', '35.88')}
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
                                <TouchableOpacity 
                                    style={[styles.eliteButton, { backgroundColor: colors.accent }]}
                                    onPress={handleUpgrade}
                                >
                                    <Text style={styles.eliteButtonText}>
                                        {billingCycle === 'annual' ? t('upgradeSave') : t('upgradeElite')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>



                        {/* Freemium Plan Card */}
                        <View style={[styles.proCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, marginTop: 16 }]}>
                            <View style={styles.planHeader}>
                                <View>
                                    <View style={[styles.proBadge, { backgroundColor: 'rgba(148, 163, 184, 0.1)' }]}>
                                        <Text style={[styles.proBadgeText, { color: colors.textSecondary }]}>{t('freemium')}</Text>
                                    </View>
                                    <Text style={[styles.planTitlePro, { color: colors.text }]}>{t('freemiumPlan')}</Text>
                                    <View style={styles.priceContainer}>
                                        <Text style={[styles.priceBig, { color: colors.text }]}>$0.00</Text>
                                        <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>{t('monthAbbr')}</Text>
                                    </View>
                                </View>
                                {!user.isPremium && (
                                    <View style={[styles.saveBadge, { backgroundColor: colors.success }]}>
                                        <Text style={styles.saveBadgeText}>{t('currentPlan')}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
                            <View style={styles.featuresList}>
                                {[
                                    'featureBasicMappingOnly',
                                    'featureLimitedHistory'
                                ].map((key, i) => (
                                    <View key={i} style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={20} color={colors.textSecondary} />
                                        <Text style={[styles.featureText, { color: colors.textSecondary }]}>{t(key as any)}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity style={[styles.proButton, { borderColor: colors.cardBorder, opacity: !user.isPremium ? 0.5 : 1 }]} disabled={!user.isPremium}>
                                <Text style={[styles.proButtonText, { color: colors.text }]}>{!user.isPremium ? t('currentPlan') : t('chooseFreemium')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Promo Code Card in Plans & Pricing */}
                        {!user.isPremium ? (
                            <View style={[
                                { 
                                    backgroundColor: colors.cardBackground, 
                                    borderColor: colors.cardBorder, 
                                    borderRadius: 16, 
                                    borderWidth: 1, 
                                    padding: 16, 
                                    marginTop: 16,
                                }
                            ]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <Ionicons name="gift-outline" size={18} color={colors.accent} />
                                    <Text style={{ color: colors.text, fontWeight: '700', fontSize: 14 }}>
                                        {t('promoHeaderCard' as any) || 'Have a Promo/Referral Code?'}
                                    </Text>
                                </View>
                                <Text style={{ color: colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 12 }}>
                                    {t('promoExplanation' as any) || 'Redeem a special code from a friend, coach, or organization to unlock premium features.'}
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                    <TextInput
                                        style={{ 
                                            flex: 1, 
                                            backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : '#f3f4f6', 
                                            color: colors.text, 
                                            borderColor: colors.cardBorder,
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            paddingHorizontal: 12,
                                            paddingVertical: 8,
                                            fontSize: 13
                                        }}
                                        placeholder={t('promoPlaceholder' as any) || "Enter Code"}
                                        placeholderTextColor={colors.textSecondary}
                                        value={promoCode}
                                        onChangeText={setPromoCode}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        style={{ backgroundColor: colors.accent, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 10, opacity: promoCode.length === 0 ? 0.6 : 1 }}
                                        onPress={handleApplyPromoCode}
                                        disabled={promoCode.length === 0}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ color: '#000', fontWeight: '700', fontSize: 12 }}>
                                            {t('applyPromo' as any) || 'Apply'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}

                        {/* Restore Purchases Link */}
                        <TouchableOpacity
                            style={{ 
                                alignSelf: 'center', 
                                marginTop: 24, 
                                marginBottom: 16,
                                paddingVertical: 8,
                                paddingHorizontal: 16
                            }}
                            onPress={handleRestorePurchases}
                        >
                            <Text style={{ color: colors.textSecondary, fontSize: 13, textDecorationLine: 'underline', fontWeight: '500' }}>
                                {t('restorePurchases' as any) || 'Restore Purchases'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>

            <Modal
                visible={isFitnessLevelModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsFitnessLevelModalVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setIsFitnessLevelModalVisible(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('fitnessLevel')}</Text>
                        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>{t('youCanChangeLater' as any)}</Text>
                        
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.modalOption,
                                    { borderColor: colors.cardBorder },
                                    user.attributes.fitnessLevel === level && { backgroundColor: colors.accent, borderColor: colors.accent }
                                ]}
                                onPress={() => handleUpdateFitnessLevel(level)}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    { color: user.attributes.fitnessLevel === level ? '#000' : colors.text }
                                ]}>
                                    {t(`fl${level.charAt(0) + level.slice(1).toLowerCase()}` as any)}
                                </Text>
                                {user.attributes.fitnessLevel === level && (
                                    <Ionicons name="checkmark-circle" size={20} color="#000" />
                                )}
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity 
                            style={[styles.modalCloseButton, { marginTop: 12 }]}
                            onPress={() => setIsFitnessLevelModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>{t('dismiss')}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
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
    healthSubLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        gap: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '700',
    },
    modalCloseButton: {
        padding: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 15,
        fontWeight: '700',
    },
});
