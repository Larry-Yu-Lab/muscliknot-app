import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { getHistory } from '../utils/storage';

const { width } = Dimensions.get('window');

function CustomSwitch({ value, onValueChange }: { value: boolean; onValueChange: (val: boolean) => void }) {
    const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 22], // 2px padding start, total width 50, thumb 26 -> 50-26-2 = 22
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#222222', '#f96b06'],
    });

    return (
        <Pressable onPress={() => onValueChange(!value)}>
            <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
                <Animated.View style={[styles.switchThumb, { transform: [{ translateX }] }]} />
            </Animated.View>
        </Pressable>
    );
}

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<'profile' | 'plans'>('profile');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [sessionsCount, setSessionsCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            getHistory().then(items => setSessionsCount(items.length));
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>DASHBOARD</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="settings-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabWrapper}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('profile')}
                        >
                            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'plans' && styles.tabButtonActive]}
                            onPress={() => setActiveTab('plans')}
                        >
                            <Text style={[styles.tabText, activeTab === 'plans' && styles.tabTextActive]}>Plans & Pricing</Text>
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
                                        stroke="rgba(249,107,6,0.1)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <Circle
                                        cx="72"
                                        cy="72"
                                        r="66"
                                        stroke="#f96b06"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray="414"
                                        strokeDashoffset="80"
                                        strokeLinecap="round"
                                        rotation="-90"
                                        origin="72, 72"
                                    />
                                </Svg>
                                <Image
                                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNnzd-GV3B24Bcd6xHjlfFuasANL03ODkk-uPd2oMVJxTUGZ9UP425kJTEiSa54sI4kiDChYi_6GpkJMzmV3izbk6t50URWJE21zP0gZvRu_S8HMBYJBCb3U_7bXD7zGKsva8EppfGZqYDZjX4_txR-_COedD6zdQQzdy3HyR1ofKmgdwZ-fmRN5yohGUtr3UGE3cVqifwpGTOKYdJ1KD7FmKgHWgkFl3qu9qvMFiPEDFRAx9JTIcsRjcHGcwwV2ca8Z4sS-H4rZWc" }}
                                    style={styles.avatar}
                                />
                            </View>

                            {/* Name and Status */}
                            <View style={styles.nameSection}>
                                <Text style={styles.userName}>Alex Rivera</Text>
                                <View style={styles.statusRow}>
                                    <Text style={styles.athleteStatus}>DATA-DRIVEN ATHLETE</Text>
                                    <Text style={styles.statusDot}>•</Text>
                                    <Text style={styles.premiumStatus}>PREMIUM</Text>
                                </View>
                            </View>
                        </View>

                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>WORKOUTS</Text>
                                <Text style={styles.statValue}>{sessionsCount}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>RECOVERY</Text>
                                <Text style={styles.statValueOrange}>92%</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>STREAK</Text>
                                <Text style={styles.statValueOrange}>{sessionsCount > 0 ? '1d' : '0d'}</Text>
                            </View>
                        </View>

                        {/* Health Vault Section */}
                        <View style={styles.healthVaultSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>HEALTH VAULT</Text>
                                <TouchableOpacity style={styles.analyticsButton}>
                                    <Text style={styles.analyticsButtonText}>VIEW ANALYTICS</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.healthCardsGrid}>
                                {/* Injury History Card */}
                                <View style={styles.glassCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardIconOrange}>
                                            <MaterialCommunityIcons name="human-handsup" size={20} color="#f96b06" />
                                        </View>
                                        <View style={styles.cardBadge}>
                                            <Text style={styles.cardBadgeText}>+12%</Text>
                                        </View>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardLabel}>INJURY HISTORY</Text>
                                        <Text style={styles.cardTitle}>Recovery Track</Text>
                                    </View>
                                    <View style={styles.miniGraphContainer}>
                                        <Svg width="100%" height={60} viewBox="0 0 100 40" preserveAspectRatio="none">
                                            <Path
                                                d="M0 35 Q 30 35, 60 25 T 100 10"
                                                fill="none"
                                                stroke="#f96b06"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                            <Circle cx="100" cy="10" r="4" fill="#f96b06" />
                                        </Svg>
                                    </View>
                                </View>

                                {/* Fitness Level Card */}
                                <View style={[styles.glassCard, styles.fitnessCard]}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardIconGreen}>
                                            <MaterialCommunityIcons name="dumbbell" size={20} color="#22c55e" />
                                        </View>
                                        <Text style={styles.levelTextSimple}>LVL 8</Text>
                                    </View>
                                    {/* Circular Progress */}
                                    <View style={styles.circularProgressContainer}>
                                        <Svg width={80} height={80} viewBox="0 0 80 80">
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke="#1a1a1a"
                                                strokeWidth="6"
                                                fill="transparent"
                                            />
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r="32"
                                                stroke="#f96b06"
                                                strokeWidth="6"
                                                fill="transparent"
                                                strokeDasharray="201"
                                                strokeDashoffset="44"
                                                strokeLinecap="round"
                                                rotation="-90"
                                                origin="40, 40"
                                            />
                                        </Svg>
                                        <Text style={styles.circularProgressText}>78%</Text>
                                    </View>
                                    <View style={styles.fitnessInfo}>
                                        <Text style={styles.cardLabel}>FITNESS LEVEL</Text>
                                        <Text style={styles.fitnessLevelText}>ADVANCED</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* General Settings Section */}
                        <View style={styles.settingsSection}>
                            <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>

                            <View style={styles.settingsList}>
                                {/* Notifications */}
                                <View style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <View style={styles.settingsIcon}>
                                            <Ionicons name="notifications" size={22} color="rgba(255,255,255,0.6)" />
                                        </View>
                                        <Text style={styles.settingsItemText}>Notifications</Text>
                                    </View>
                                    <CustomSwitch
                                        value={notificationsEnabled}
                                        onValueChange={setNotificationsEnabled}
                                    />
                                </View>

                                {/* Dark Mode */}
                                <View style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <View style={styles.settingsIcon}>
                                            <Ionicons name="moon" size={22} color="rgba(255,255,255,0.6)" />
                                        </View>
                                        <Text style={styles.settingsItemText}>Dark Mode</Text>
                                    </View>
                                    <CustomSwitch
                                        value={darkModeEnabled}
                                        onValueChange={setDarkModeEnabled}
                                    />
                                </View>

                                {/* Language */}
                                <TouchableOpacity style={styles.settingsItem}>
                                    <View style={styles.settingsItemLeft}>
                                        <View style={styles.settingsIcon}>
                                            <Ionicons name="language" size={22} color="rgba(255,255,255,0.6)" />
                                        </View>
                                        <Text style={styles.settingsItemText}>Language</Text>
                                    </View>
                                    <View style={styles.languageSelector}>
                                        <Text style={styles.languageText}>EN</Text>
                                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Account Section */}
                        <View style={styles.accountSection}>
                            <Text style={styles.sectionTitle}>ACCOUNT</Text>
                            <TouchableOpacity style={styles.logoutItem}>
                                <View style={styles.settingsItemLeft}>
                                    <View style={styles.logoutIcon}>
                                        <Ionicons name="log-out" size={22} color="#ef4444" />
                                    </View>
                                    <Text style={styles.logoutText}>Logout</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.plansContainer}>
                        {/* Billing Toggle */}
                        <View style={styles.billingToggleWrapper}>
                            <View style={styles.billingToggleBg}>
                                <View style={[styles.billingToggleActive, billingCycle === 'monthly' ? { left: 4 } : { left: '50%' }]} />
                                <TouchableOpacity style={styles.billingToggleOption} onPress={() => setBillingCycle('monthly')}>
                                    <Text style={[styles.billingToggleText, billingCycle === 'monthly' ? styles.billingTextActive2 : styles.billingTextActive]}>MONTHLY</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.billingToggleOption} onPress={() => setBillingCycle('annual')}>
                                    <Text style={[styles.billingToggleText, billingCycle === 'annual' ? styles.billingTextActive2 : styles.billingTextActive]}>ANNUAL</Text>
                                    {billingCycle === 'annual' && (
                                        <View style={styles.saveBadge}>
                                            <Text style={styles.saveBadgeText}>SAVE 20%</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Elite Plan Card */}
                        <View style={styles.planCardWrapper}>
                            {/* Glow Effect */}
                            <View style={styles.eliteGlow} />
                            <View style={styles.eliteCard}>
                                <View style={styles.planHeader}>
                                    <View>
                                        <Text style={styles.planTitleElite}>ELITE PLAN</Text>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.priceBig}>{billingCycle === 'annual' ? '$7.99' : '$9.99'}</Text>
                                            <Text style={styles.pricePeriod}>/mo</Text>
                                        </View>
                                        {billingCycle === 'annual' && (
                                            <Text style={styles.billedText}>Billed annually ($95.88/yr)</Text>
                                        )}
                                    </View>
                                    <View style={styles.bestValueBadge}>
                                        <Text style={styles.bestValueText}>BEST VALUE</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.featuresList}>
                                    <View style={styles.featureItem}>
                                        <MaterialCommunityIcons name="check-circle" size={20} color="#f96b06" />
                                        <Text style={styles.featureText}>Full AI Recovery Suite</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <MaterialCommunityIcons name="check-circle" size={20} color="#f96b06" />
                                        <Text style={styles.featureText}>Priority Expert Support</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <MaterialCommunityIcons name="check-circle" size={20} color="#f96b06" />
                                        <Text style={styles.featureText}>Unlimited Routine History</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.eliteButton}>
                                    <Text style={styles.eliteButtonText}>
                                        {billingCycle === 'annual' ? 'UPGRADE & SAVE 20%' : 'UPGRADE TO ELITE'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Pro Plan Card */}
                        <View style={styles.proCard}>
                            <View style={styles.planHeader}>
                                <View>
                                    <Text style={styles.planTitlePro}>PRO PLAN</Text>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.priceBigPro}>{billingCycle === 'annual' ? '$4.15' : '$4.99'}</Text>
                                        <Text style={styles.pricePeriod}>/mo</Text>
                                    </View>
                                    {billingCycle === 'annual' && (
                                        <Text style={styles.billedTextPro}>Billed annually ($49.90/yr)</Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity style={styles.proButton}>
                                <Text style={styles.proButtonText}>CHOOSE PRO</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Comparison Table */}
                        <View style={styles.comparisonContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableTitle}>TRANSPARENCY COMPARISON</Text>
                            </View>
                            <View style={styles.table}>
                                {/* Header Row */}
                                <View style={styles.tableRowHeader}>
                                    <Text style={[styles.colFeature, styles.headerText]}>FEATURES</Text>
                                    <Text style={[styles.colValue, styles.headerText]}>FREE</Text>
                                    <Text style={[styles.colValue, styles.headerText]}>PRO</Text>
                                    <Text style={[styles.colValue, styles.headerTextElite]}>ELITE</Text>
                                </View>
                                {/* Row 1 */}
                                <View style={styles.tableRow}>
                                    <Text style={styles.colFeature}>Muscle Mapping</Text>
                                    <Text style={[styles.colValue, styles.textSub]}>Basic</Text>
                                    <Text style={styles.colValue}>Advanced</Text>
                                    <Text style={styles.colValueElite}>Elite</Text>
                                </View>
                                {/* Row 2 */}
                                <View style={styles.tableRow}>
                                    <Text style={styles.colFeature}>AI Coaching</Text>
                                    <View style={styles.colValueIcon}><Ionicons name="close" size={14} color="#52525b" /></View>
                                    <View style={styles.colValueIcon}><Ionicons name="checkmark" size={14} color="#f96b06" /></View>
                                    <Text style={styles.colValueElite}>Unlimited</Text>
                                </View>
                                {/* Row 3 */}
                                <View style={styles.tableRow}>
                                    <Text style={styles.colFeature}>Monthly Savings</Text>
                                    <Text style={[styles.colValue, styles.textSub]}>-</Text>
                                    <Text style={styles.colValue}>{billingCycle === 'annual' ? '$0.84' : '-'}</Text>
                                    <Text style={styles.colValueElite}>{billingCycle === 'annual' ? '$2.00' : '-'}</Text>
                                </View>
                                {/* Row 4 */}
                                <View style={styles.tableRowBorderNone}>
                                    <Text style={styles.colFeature}>Annual Total</Text>
                                    <Text style={[styles.colValue, styles.textSub]}>$0</Text>
                                    <Text style={styles.colValue}>{billingCycle === 'annual' ? '$49.90' : '$59.88'}</Text>
                                    <Text style={styles.colValueElite}>{billingCycle === 'annual' ? '$95.88' : '$119.88'}</Text>
                                </View>
                            </View>
                            <View style={styles.tableFooter}>
                                <Text style={styles.footerNote}>
                                    {billingCycle === 'annual'
                                        ? '*Savings calculated based on annual vs monthly subscription prices. Transparent pricing with no hidden activation fees.'
                                        : '*Pricing reflects standard monthly billing rates. Transparent pricing with no hidden activation fees.'}
                                </Text>
                            </View>
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
        backgroundColor: '#000000',
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
        backgroundColor: 'rgba(0,0,0,0.95)',
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
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
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#333333',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.4)',
    },
    tabTextActive: {
        color: '#fff',
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
        borderColor: '#000000',
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
        color: '#fff',
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
        color: '#f96b06',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statusDot: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
    },
    premiumStatus: {
        color: 'rgba(255,255,255,0.4)',
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
        backgroundColor: '#111111',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 32,
    },
    statValueOrange: {
        color: '#FF6B00',
        fontSize: 30,
        fontWeight: '800',
        lineHeight: 32,
    },

    // Health Vault Section
    healthVaultSection: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
    },
    analyticsButton: {
        borderWidth: 1,
        borderColor: '#f96b06',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    analyticsButtonText: {
        color: '#f96b06',
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
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
        color: '#f96b06',
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        marginTop: 12,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    cardTitle: {
        color: '#fff',
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
        // alignItems: 'center', // Remove this to allow header flex-between
    },
    circularProgressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
    },
    circularProgressText: {
        position: 'absolute',
        color: '#fff',
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
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    levelTextSimple: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '700',
    },

    // Settings Section
    settingsSection: {
        marginTop: 40,
        paddingHorizontal: 16,
    },
    settingsList: {
        marginTop: 16,
        gap: 10,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111111',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingsIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsItemText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    languageText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '700',
    },

    // Account Section
    accountSection: {
        marginTop: 40,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111111',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginTop: 16,
    },
    logoutIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(239,68,68,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
    },
    // Custom Switch Styles
    switchTrack: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
    },
    switchThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff',
    },

    // Plans Tab Styles
    plansContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 24,
    },
    billingToggleWrapper: {
        alignItems: 'center',
    },
    billingToggleBg: {
        flexDirection: 'row',
        backgroundColor: '#111111',
        borderRadius: 100,
        padding: 4,
        width: 280,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
    },
    billingToggleActive: {
        position: 'absolute',
        top: 4,
        width: '50%', // 280 - 8 / 2 roughly
        bottom: 4,
        backgroundColor: '#f96b06',
        borderRadius: 100,
        width: 134, // (280-8)/2 = 136
    },
    billingToggleOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 1,
        gap: 4,
    },
    billingToggleText: {
        fontSize: 12,
        fontWeight: '700',
    },
    billingTextActive: {
        color: 'rgba(255,255,255,0.6)',
    },
    billingTextActive2: {
        color: '#000',
    },
    billingTextInactive: {
        color: '#fff',
    },
    saveBadge: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 100,
    },
    saveBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#000',
    },

    // Elite Card
    planCardWrapper: {
        position: 'relative',
    },
    eliteGlow: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        backgroundColor: '#f96b06',
        opacity: 0.2,
        borderRadius: 32,
        transform: [{ scale: 1.02 }],
    },
    eliteCard: {
        backgroundColor: '#0a0a0a',
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#f96b06',
        padding: 24,
        shadowColor: '#f96b06',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    planTitleElite: {
        color: '#f96b06',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    priceBig: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '900',
    },
    pricePeriod: {
        color: '#71717a',
        fontSize: 14,
        fontWeight: '700',
    },
    billedText: {
        color: '#f96b06',
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
    },
    bestValueBadge: {
        backgroundColor: '#f96b06',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    bestValueText: {
        color: '#000',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 16,
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        color: '#e4e4e7',
        fontSize: 14,
        fontWeight: '500',
    },
    eliteButton: {
        backgroundColor: '#f96b06',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    eliteButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Pro Card
    proCard: {
        backgroundColor: '#111111',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 24,
        gap: 24,
    },
    planTitlePro: {
        color: '#a1a1aa',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    priceBigPro: {
        color: '#fff',
        fontSize: 36,
        fontWeight: '900',
    },
    billedTextPro: {
        color: '#71717a',
        fontSize: 10,
        fontWeight: '700',
        marginTop: 4,
    },
    proButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    proButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Comparison Table
    comparisonContainer: {
        backgroundColor: '#111111',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        marginBottom: 32,
    },
    tableHeader: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tableTitle: {
        color: '#a1a1aa',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    table: {
        paddingBottom: 0,
    },
    tableRowHeader: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    tableRowBorderNone: {
        flexDirection: 'row',
        paddingVertical: 12,
        alignItems: 'center',
    },
    headerText: {
        color: '#71717a',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    headerTextElite: {
        color: '#f96b06',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    colFeature: {
        flex: 2, // 50%
        paddingLeft: 20,
        color: '#e4e4e7',
        fontSize: 11,
        fontWeight: '500',
    },
    colValue: {
        flex: 1,
        textAlign: 'center',
        color: '#e4e4e7',
        fontSize: 11,
        fontWeight: '500',
    },
    colValueIcon: {
        flex: 1,
        alignItems: 'center',
    },
    colValueElite: {
        flex: 1,
        textAlign: 'center',
        color: '#f96b06',
        fontSize: 11,
        fontWeight: '700',
    },
    textSub: {
        color: '#52525b',
    },
    tableFooter: {
        backgroundColor: 'rgba(249,107,6,0.05)',
        padding: 16,
    },
    footerNote: {
        color: '#71717a',
        fontSize: 9,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 14,
    },
});
