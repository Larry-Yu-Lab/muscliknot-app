import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation, formatLabel } from '@/utils/i18n';
import { createSquad, getActiveChallenge, getLeaderboard, getMySquad, joinSquad, leaveSquad, Squad, SquadChallenge, SquadMember } from '@/utils/squadService';
import { shareSquadInvite, shareRoutine } from '@/utils/socialUtils';
import { getHistory } from '@/utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { scale, scaleFont, tabletContainerStyle } from '@/utils/responsive';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Join/Create Screen ────────────────────────────────────────────────────

function JoinOrCreateView({
    colors,
    isDark,
    t,
    onSquadJoined,
}: {
    colors: any;
    isDark: boolean;
    t: (key: any) => string;
    onSquadJoined: () => void;
}) {
    const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            Alert.alert('Missing Name', 'Please enter a squad name.');
            return;
        }
        setIsLoading(true);
        try {
            await createSquad(name.trim());
            onSquadJoined();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to create squad.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!code.trim()) {
            Alert.alert('Missing Code', 'Please enter an invite code.');
            return;
        }
        setIsLoading(true);
        try {
            await joinSquad(code.trim());
            onSquadJoined();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to join squad.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                <MaterialCommunityIcons name="account-group-outline" size={64} color={colors.accent} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    {t('recoverySquad' as any) || 'Recovery Squad'}
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    Join or create a squad to compete with friends, track streaks, and stay accountable.
                </Text>

                {mode === 'idle' && (
                    <View style={styles.emptyActions}>
                        <TouchableOpacity
                            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
                            onPress={() => setMode('create')}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#000" />
                            <Text style={styles.primaryBtnText}>{t('createSquad')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.outlineBtn, { borderColor: colors.accent }]}
                            onPress={() => setMode('join')}
                        >
                            <Ionicons name="enter-outline" size={20} color={colors.accent} />
                            <Text style={[styles.outlineBtnText, { color: colors.accent }]}>{t('joinWithCode')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {mode === 'create' && (
                    <View style={styles.inputSection}>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: isDark ? '#1a1a1e' : '#f4f4f5', color: colors.text, borderColor: colors.cardBorder }]}
                            placeholder="Squad name (e.g., Recovery Warriors)"
                            placeholderTextColor={colors.textSecondary}
                            value={name}
                            onChangeText={setName}
                            autoFocus
                            maxLength={30}
                        />
                        <View style={styles.inputActions}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.cardBorder }]}
                                onPress={() => { setMode('idle'); setName(''); }}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: colors.accent, flex: 1 }]}
                                onPress={handleCreate}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : (
                                    <>
                                        <Ionicons name="add" size={18} color="#000" />
                                        <Text style={styles.primaryBtnText}>{t('create')}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {mode === 'join' && (
                    <View style={styles.inputSection}>
                        <TextInput
                            style={[styles.textInput, styles.codeInput, { backgroundColor: isDark ? '#1a1a1e' : '#f4f4f5', color: colors.text, borderColor: colors.cardBorder }]}
                            placeholder="Enter 6-digit invite code"
                            placeholderTextColor={colors.textSecondary}
                            value={code}
                            onChangeText={(t) => setCode(t.toUpperCase())}
                            autoFocus
                            autoCapitalize="characters"
                            maxLength={6}
                        />
                        <View style={styles.inputActions}>
                            <TouchableOpacity
                                style={[styles.cancelBtn, { borderColor: colors.cardBorder }]}
                                onPress={() => { setMode('idle'); setCode(''); }}
                            >
                                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.primaryBtn, { backgroundColor: colors.accent, flex: 1 }]}
                                onPress={handleJoin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : (
                                    <>
                                        <Ionicons name="enter" size={18} color="#000" />
                                        <Text style={styles.primaryBtnText}>{t('join')}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

// ─── Main Screen ───────────────────────────────────────────────────────────

export default function SquadsScreen() {
    const router = useRouter();
    const { language, theme } = usePreferences();
    const { user } = useUser();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [squad, setSquad] = useState<Squad | null>(null);
    const [members, setMembers] = useState<SquadMember[]>([]);
    const [challenge, setChallenge] = useState<SquadChallenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadSquadData = useCallback(async () => {
        try {
            const mySquad = await getMySquad();
            setSquad(mySquad);

            if (mySquad) {
                const [leaderboard, activeChallenge] = await Promise.all([
                    getLeaderboard(mySquad.id),
                    getActiveChallenge(mySquad.id),
                ]);
                setMembers(leaderboard);
                setChallenge(activeChallenge);
            } else {
                setMembers([]);
                setChallenge(null);
            }
        } catch (e) {
            console.error('Failed to load squad data:', e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadSquadData();
    }, [loadSquadData]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadSquadData();
    };

    const handleLeave = () => {
        if (!squad) return;
        Alert.alert(
            'Leave Squad',
            `Are you sure you want to leave "${squad.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await leaveSquad(squad.id);
                            setSquad(null);
                            setMembers([]);
                            setChallenge(null);
                        } catch (e: any) {
                            Alert.alert('Error', e.message || 'Failed to leave squad.');
                        }
                    },
                },
            ]
        );
    };

    const handleShareRoutine = async () => {
        const history = await getHistory();
        if (history.length > 0 && history[0].exercises.length > 0) {
            await shareRoutine(
                history[0].exercises,
                history[0].muscleGroup,
                history[0].assessment?.activityType || 'relief',
                user.name
            );
        }
    };

    const handleInvite = async () => {
        if (!squad) return;
        await shareSquadInvite(squad.name, squad.invite_code);
    };

    const getRankEmoji = (index: number) => {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `${index + 1}`;
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{ flex: 1, width: '100%' }}
                refreshControl={
                    squad ? (
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor={colors.accent}
                        />
                    ) : undefined
                }
            >
                <View style={styles.innerContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('recoverySquad' as any) || 'Recovery Squad'}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {!squad ? (
                    /* No squad — show create/join view */
                    <JoinOrCreateView
                        colors={colors}
                        isDark={isDark}
                        t={t}
                        onSquadJoined={() => {
                            setIsLoading(true);
                            loadSquadData();
                        }}
                    />
                ) : (
                    /* Has squad — show squad details */
                    <>
                        {/* Squad Info Card */}
                        <View style={[styles.squadCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <View style={styles.squadCardInner}>
                                <View style={[styles.squadIcon, { backgroundColor: colors.accent + '20' }]}>
                                    <MaterialCommunityIcons name="account-group" size={32} color={colors.accent} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.squadName, { color: colors.text }]}>{squad.name}</Text>
                                    <Text style={[styles.squadMeta, { color: colors.textSecondary }]}>
                                        {squad.member_count ?? members.length} {t('members' as any) || 'members'} • Code: {squad.invite_code}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.squadActions}>
                                <TouchableOpacity
                                    style={[styles.inviteButton, { backgroundColor: colors.accent }]}
                                    onPress={handleInvite}
                                >
                                    <Ionicons name="person-add" size={16} color="#000" />
                                    <Text style={styles.inviteButtonText}>
                                        {t('inviteFriends' as any) || 'Invite Friends'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.shareButton, { borderColor: colors.accent }]}
                                    onPress={handleShareRoutine}
                                >
                                    <Ionicons name="share-outline" size={16} color={colors.accent} />
                                    <Text style={[styles.shareButtonText, { color: colors.accent }]}>
                                        {t('shareRoutine' as any) || 'Share Routine'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Leaderboard */}
                        <View style={styles.leaderboardSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                                    {(t('streakLeaderboard' as any) || 'STREAK LEADERBOARD').toUpperCase()}
                                </Text>
                                <View style={[styles.liveBadge, { backgroundColor: '#22c55e20' }]}>
                                    <View style={styles.liveIndicator} />
                                    <Text style={[styles.liveText, { color: '#22c55e' }]}>{t('live')}</Text>
                                </View>
                            </View>

                            {members.length === 0 ? (
                                <View style={[styles.emptyLeaderboard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                    <Text style={[styles.emptyLeaderboardText, { color: colors.textSecondary }]}>
                                        No members yet. Invite friends to compete!
                                    </Text>
                                </View>
                            ) : (
                                members.map((member, index) => (
                                    <View
                                        key={member.id}
                                        style={[
                                            styles.memberCard,
                                            {
                                                backgroundColor: member.is_current_user
                                                    ? (isDark ? colors.accent + '12' : colors.accent + '08')
                                                    : colors.cardBackground,
                                                borderColor: member.is_current_user ? colors.accent + '40' : colors.cardBorder,
                                            },
                                        ]}
                                    >
                                        <View style={styles.memberLeft}>
                                            <Text style={styles.rankText}>{getRankEmoji(index)}</Text>
                                            <Image
                                                source={{ uri: member.avatar_url }}
                                                style={[
                                                    styles.memberAvatar,
                                                    member.is_current_user && { borderColor: colors.accent, borderWidth: 2 },
                                                ]}
                                            />
                                            <View>
                                                <View style={styles.nameRow}>
                                                    <Text style={[styles.memberName, { color: colors.text }]}>
                                                        {member.name}
                                                    </Text>
                                                    {member.is_current_user && (
                                                        <View style={[styles.youBadge, { backgroundColor: colors.accent }]}>
                                                            <Text style={styles.youBadgeText}>{t('you')}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={[styles.memberLevel, { color: colors.textSecondary }]}>
                                                    Lv.{member.level} • {member.recovery_score}% {t('recovery' as any) || 'recovery'}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.memberRight}>
                                            <Ionicons name="flame" size={20} color="#f97316" />
                                            <Text style={[styles.streakValue, { color: colors.text }]}>
                                                {member.streak_days}
                                            </Text>
                                            <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>d</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>

                        {/* Weekly Challenge Card */}
                        {challenge && (
                            <View style={[styles.challengeCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                                <View style={styles.challengeHeader}>
                                    <MaterialCommunityIcons name="trophy-outline" size={24} color="#FACC15" />
                                    <Text style={[styles.challengeTitle, { color: colors.text }]}>
                                        {challenge.title}
                                    </Text>
                                </View>
                                <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
                                    {challenge.description || `Complete ${challenge.target_sessions} sessions this week to earn a badge!`}
                                </Text>
                                <View style={[styles.challengeProgressBg, { backgroundColor: isDark ? '#333' : '#e5e5e5' }]}>
                                    <View style={[styles.challengeProgressFill, { width: '0%', backgroundColor: '#FACC15' }]} />
                                </View>
                                <Text style={[styles.challengeProgressText, { color: colors.textSecondary }]}>
                                    0 / {challenge.target_sessions} {t('sessions' as any) || 'sessions'}
                                </Text>
                            </View>
                        )}

                        {/* Leave Squad */}
                        <TouchableOpacity
                            style={[styles.leaveButton, { borderColor: '#ef444460' }]}
                            onPress={handleLeave}
                        >
                            <Ionicons name="exit-outline" size={18} color="#ef4444" />
                            <Text style={styles.leaveButtonText}>{t('leaveSquad')}</Text>
                        </TouchableOpacity>
                    </>
                )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: scale(100), width: '100%', alignItems: 'center', flexGrow: 1 },
    innerContainer: { width: '100%', ...tabletContainerStyle },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 200 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerBtn: {
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

    // Empty / Create-Join State
    emptyContainer: {
        paddingHorizontal: 16,
        paddingTop: 40,
    },
    emptyCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
        gap: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        fontWeight: '500',
    },
    emptyActions: {
        width: '100%',
        gap: 12,
        marginTop: 8,
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        borderRadius: 14,
    },
    primaryBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    outlineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        borderRadius: 14,
        borderWidth: 1.5,
    },
    outlineBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
    inputSection: {
        width: '100%',
        gap: 12,
        marginTop: 4,
    },
    textInput: {
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    codeInput: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 8,
    },
    inputActions: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // Squad Card
    squadCard: {
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        gap: 16,
    },
    squadCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    squadIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    squadName: {
        fontSize: 20,
        fontWeight: '800',
    },
    squadMeta: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    squadActions: {
        flexDirection: 'row',
        gap: 12,
    },
    inviteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 44,
        borderRadius: 12,
    },
    inviteButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
    },
    shareButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 44,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    shareButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // Leaderboard
    leaderboardSection: {
        marginTop: 28,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22c55e',
    },
    liveText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    emptyLeaderboard: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    emptyLeaderboardText: {
        fontSize: 14,
        fontWeight: '500',
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 10,
    },
    memberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    rankText: {
        fontSize: 18,
        fontWeight: '800',
        width: 28,
        textAlign: 'center',
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    memberName: {
        fontSize: 15,
        fontWeight: '700',
    },
    youBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    youBadgeText: {
        color: '#000',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    memberLevel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    memberRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    streakValue: {
        fontSize: 22,
        fontWeight: '800',
    },
    streakUnit: {
        fontSize: 14,
        fontWeight: '700',
    },

    // Challenge Card
    challengeCard: {
        marginHorizontal: 16,
        marginTop: 28,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        gap: 12,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    challengeDesc: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    challengeProgressBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    challengeProgressFill: {
        height: '100%',
        borderRadius: 4,
    },
    challengeProgressText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Leave Button
    leaveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 28,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
    },
    leaveButtonText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '700',
    },
});
