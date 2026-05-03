import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation, formatLabel } from '@/utils/i18n';
import { getMockLeaderboard, getMockSquad, shareSquadInvite, shareRoutine } from '@/utils/socialUtils';
import { getHistory } from '@/utils/storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SquadMember {
    id: string;
    name: string;
    avatarUrl: string;
    streakDays: number;
    recoveryScore: number;
    level: number;
    isCurrentUser?: boolean;
}

export default function SquadsScreen() {
    const router = useRouter();
    const { language, theme } = usePreferences();
    const { user } = useUser();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [members, setMembers] = useState<SquadMember[]>([]);
    const [squad, setSquad] = useState(getMockSquad());

    useEffect(() => {
        const leaderboard = getMockLeaderboard(user.name, {
            streakDays: user.stats.streakDays,
            recoveryScore: user.stats.recoveryScore,
            level: user.attributes.level,
        });
        setMembers(leaderboard);
    }, [user]);

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
        await shareSquadInvite(squad.name, squad.inviteCode);
    };

    const getRankEmoji = (index: number) => {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `${index + 1}`;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

                {/* Squad Info Card */}
                <View style={[styles.squadCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.squadCardInner}>
                        <View style={[styles.squadIcon, { backgroundColor: colors.accent + '20' }]}>
                            <MaterialCommunityIcons name="account-group" size={32} color={colors.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.squadName, { color: colors.text }]}>{squad.name}</Text>
                            <Text style={[styles.squadMeta, { color: colors.textSecondary }]}>
                                {squad.memberCount} {t('members' as any) || 'members'} • Code: {squad.inviteCode}
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
                            <Text style={[styles.liveText, { color: '#22c55e' }]}>LIVE</Text>
                        </View>
                    </View>

                    {members.map((member, index) => (
                        <View
                            key={member.id}
                            style={[
                                styles.memberCard,
                                {
                                    backgroundColor: member.isCurrentUser
                                        ? (isDark ? colors.accent + '12' : colors.accent + '08')
                                        : colors.cardBackground,
                                    borderColor: member.isCurrentUser ? colors.accent + '40' : colors.cardBorder,
                                },
                            ]}
                        >
                            <View style={styles.memberLeft}>
                                <Text style={styles.rankText}>{getRankEmoji(index)}</Text>
                                <Image
                                    source={{ uri: member.avatarUrl }}
                                    style={[
                                        styles.memberAvatar,
                                        member.isCurrentUser && { borderColor: colors.accent, borderWidth: 2 },
                                    ]}
                                />
                                <View>
                                    <View style={styles.nameRow}>
                                        <Text style={[styles.memberName, { color: colors.text }]}>
                                            {member.name}
                                        </Text>
                                        {member.isCurrentUser && (
                                            <View style={[styles.youBadge, { backgroundColor: colors.accent }]}>
                                                <Text style={styles.youBadgeText}>YOU</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[styles.memberLevel, { color: colors.textSecondary }]}>
                                        Lv.{member.level} • {member.recoveryScore}% {t('recovery' as any) || 'recovery'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.memberRight}>
                                <Ionicons name="flame" size={20} color="#f97316" />
                                <Text style={[styles.streakValue, { color: colors.text }]}>
                                    {member.streakDays}
                                </Text>
                                <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>d</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Weekly Challenge Card */}
                <View style={[styles.challengeCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    <View style={styles.challengeHeader}>
                        <MaterialCommunityIcons name="trophy-outline" size={24} color="#FACC15" />
                        <Text style={[styles.challengeTitle, { color: colors.text }]}>
                            {t('weeklyChallenge' as any) || 'Weekly Challenge'}
                        </Text>
                    </View>
                    <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
                        {t('challengeDesc' as any) || 'Complete 5 sessions this week to earn the "Iron Recovery" badge!'}
                    </Text>
                    <View style={[styles.challengeProgressBg, { backgroundColor: isDark ? '#333' : '#e5e5e5' }]}>
                        <View style={[styles.challengeProgressFill, { width: '60%', backgroundColor: '#FACC15' }]} />
                    </View>
                    <Text style={[styles.challengeProgressText, { color: colors.textSecondary }]}>
                        3 / 5 {t('sessions' as any) || 'sessions'}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
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
});
