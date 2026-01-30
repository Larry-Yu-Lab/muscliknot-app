import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<'profile' | 'plans'>('profile');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);

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
                        {/* Verified Badge */}
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={12} color="#fff" />
                        </View>
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
                        <Text style={styles.statValue}>124</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>RECOVERY</Text>
                        <Text style={styles.statValueOrange}>92%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>STREAK</Text>
                        <Text style={styles.statValueOrange}>14d</Text>
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
                            {/* Mini Graph */}
                            <View style={styles.miniGraphContainer}>
                                <View style={styles.graphYAxis}>
                                    <Text style={styles.graphYLabel}>100</Text>
                                    <Text style={styles.graphYLabel}>50</Text>
                                    <Text style={styles.graphYLabel}>0</Text>
                                </View>
                                <View style={styles.graphArea}>
                                    <Svg width="100%" height={48} viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <Path
                                            d="M0 25 Q 25 25, 50 15 T 100 5"
                                            fill="none"
                                            stroke="#f96b06"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <Circle cx="100" cy="5" r="3" fill="#f96b06" />
                                    </Svg>
                                    <Text style={styles.graphXLabel}>7d</Text>
                                </View>
                            </View>
                        </View>

                        {/* Fitness Level Card */}
                        <View style={[styles.glassCard, styles.fitnessCard]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIconGreen}>
                                    <MaterialCommunityIcons name="dumbbell" size={20} color="#22c55e" />
                                </View>
                            </View>
                            {/* Circular Progress */}
                            <View style={styles.circularProgressContainer}>
                                <Svg width={80} height={80} viewBox="0 0 80 80">
                                    <Circle
                                        cx="40"
                                        cy="40"
                                        r="32"
                                        stroke="rgba(255,255,255,0.05)"
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
                                <View style={styles.fitnessLevelRow}>
                                    <Text style={styles.fitnessLevelText}>ADVANCED</Text>
                                    <View style={styles.levelBadge}>
                                        <Text style={styles.levelBadgeText}>LVL 8</Text>
                                    </View>
                                </View>
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
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#222222', true: '#f96b06' }}
                                thumbColor="#fff"
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
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: '#222222', true: '#f96b06' }}
                                thumbColor="#fff"
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
        flexDirection: 'row',
        marginTop: 8,
        height: 48,
    },
    graphYAxis: {
        justifyContent: 'space-between',
        paddingRight: 4,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
    },
    graphYLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 7,
        fontWeight: '700',
    },
    graphArea: {
        flex: 1,
        paddingLeft: 8,
        position: 'relative',
    },
    graphXLabel: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: -0.5,
    },

    // Fitness Card
    fitnessCard: {
        alignItems: 'center',
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
    levelBadge: {
        backgroundColor: '#f96b06',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    levelBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
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
});
