import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation, formatLabel } from '@/utils/i18n';
import { getHistory, HistoryItem } from '@/utils/storage';
import { generateRoadmap, RecoveryRoadmap, phaseLabelKey } from '@/utils/recoveryRoadmap';
import {
    sendCoachMessage,
    loadChatHistory,
    clearChatHistory
} from '@/utils/aiCoach';
import { getGeminiApiKey, saveGeminiApiKey, ChatMessage } from '@/utils/gemini';

export default function CoachChatScreen() {
    const router = useRouter();
    const { language, theme } = usePreferences();
    const { user } = useUser();
    const colors = Colors[theme];
    const isDark = theme === 'dark';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasKey, setHasKey] = useState<boolean | null>(null);
    const [tempKey, setTempKey] = useState('');
    const [isSavingKey, setIsSavingKey] = useState(false);
    const [roadmap, setRoadmap] = useState<RecoveryRoadmap | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const flatListRef = useRef<FlatList>(null);

    // Load initial data
    useEffect(() => {
        const initChat = async () => {
            const apiKey = await getGeminiApiKey();
            setHasKey(!!apiKey);

            const hist = await getHistory();
            setHistory(hist);

            const rm = generateRoadmap(hist);
            setRoadmap(rm);

            const loadedMessages = await loadChatHistory();
            if (loadedMessages.length === 0) {
                // Insert initial welcome message
                setMessages([
                    {
                        role: 'coach',
                        content: t('coachChatWelcome'),
                        timestamp: Date.now(),
                    }
                ]);
            } else {
                setMessages(loadedMessages);
            }
        };

        initChat();
    }, [language]);

    // Auto scroll to end when messages update
    const scrollToEnd = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToEnd();
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;
        const userText = inputText.trim();
        setInputText('');
        Keyboard.dismiss();

        // Optimistically add user message
        const newMsg: ChatMessage = {
            role: 'user',
            content: userText,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMsg]);
        setIsLoading(true);

        // Fallback roadmap if not loaded yet
        const currentHistory = history.length > 0 ? history : await getHistory();
        const currentRoadmap = roadmap || generateRoadmap(currentHistory);

        // If active roadmap doesn't exist, create a dummy for dummy context
        const activeRoadmap = currentRoadmap || {
            targetMuscle: 'General',
            currentPhase: 'maintenance' as const,
            dayNumber: 1,
            suggestedActivityType: 'warmup',
            coachMessage: '',
            coachParams: {},
            painTrend: 'stable' as const,
            avgPainLevel: 0,
            difficultyFilter: ['beginner'],
            phaseColor: '#3b82f6',
            phaseIcon: 'shield-checkmark-outline',
            weeklyProgress: { sessionsThisWeek: 0, sessionsLastWeek: 0, painChangePercent: 0, musclesWorked: [] },
            milestones: [],
            suggestedExerciseIds: [],
            totalSessions: 0
        };

        try {
            const result = await sendCoachMessage(
                userText,
                activeRoadmap,
                currentHistory,
                user.attributes.fitnessLevel || 'BEGINNER',
                language
            );
            setMessages(result.chatHistory);
        } catch (error) {
            console.error('Failed to get coach response:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'coach',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: Date.now()
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = async () => {
        await clearChatHistory();
        setMessages([
            {
                role: 'coach',
                content: t('coachChatWelcome'),
                timestamp: Date.now(),
            }
        ]);
    };

    const handleSaveKey = async () => {
        if (!tempKey.trim()) return;
        setIsSavingKey(true);
        const success = await saveSaveKey(tempKey.trim());
        if (success) {
            setHasKey(true);
        }
        setIsSavingKey(false);
    };

    const saveSaveKey = async (key: string) => {
        return await saveGeminiApiKey(key);
    };

    const renderMessageItem = ({ item }: { item: ChatMessage }) => {
        const isCoach = item.role === 'coach';
        return (
            <View style={[
                styles.messageRow,
                isCoach ? styles.messageRowLeft : styles.messageRowRight
            ]}>
                {isCoach && (
                    <View style={[styles.avatarCircle, { backgroundColor: colors.accent + '20' }]}>
                        <Text style={{ fontSize: 16 }}>🧠</Text>
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isCoach 
                        ? [styles.bubbleCoach, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', borderColor: colors.cardBorder }]
                        : [styles.bubbleUser, { backgroundColor: colors.accent }]
                ]}>
                    <Text style={[
                        styles.messageText, 
                        { color: isCoach ? colors.text : '#000000' }
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        { color: isCoach ? colors.textSecondary : 'rgba(0,0,0,0.5)' }
                    ]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderColor: colors.cardBorder }]}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{t('coachChatTitle')}</Text>
                    {roadmap && (
                        <Text style={[styles.headerSubtitle, { color: colors.accent }]}>
                            {formatLabel(roadmap.targetMuscle)} • {t(phaseLabelKey(roadmap.currentPhase) as any) || formatLabel(roadmap.currentPhase)}
                        </Text>
                    )}
                </View>
                <TouchableOpacity style={styles.headerButton} onPress={handleClearChat}>
                    <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>{t('coachChatClearHistory')}</Text>
                </TouchableOpacity>
            </View>

            {hasKey === false ? (
                // Setup Gemini Key card view
                <View style={styles.noKeyContainer}>
                    <View style={[styles.noKeyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.noKeyEmoji, { color: colors.accent }]}>🔑</Text>
                        <Text style={[styles.noKeyTitle, { color: colors.text }]}>{t('coachChatTitle')}</Text>
                        <Text style={[styles.noKeyDesc, { color: colors.textSecondary }]}>
                            {t('coachChatNoKey')}
                        </Text>
                        <TextInput
                            style={[styles.keyInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }]}
                            placeholder="Enter Gemini API Key..."
                            placeholderTextColor={colors.textSecondary}
                            value={tempKey}
                            onChangeText={setTempKey}
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            style={[styles.saveKeyButton, { backgroundColor: colors.accent }]}
                            onPress={handleSaveKey}
                            disabled={isSavingKey}
                        >
                            {isSavingKey ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text style={styles.saveKeyText}>{t('save' as any) || 'Save Key'}</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 12 }} onPress={() => router.push('/(tabs)/profile' as any)}>
                            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 14 }}>
                                {t('goToProfile' as any) || 'Go to Profile settings'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                // Chat messaging view
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderMessageItem}
                        contentContainerStyle={styles.messageList}
                        onContentSizeChange={scrollToEnd}
                        onLayout={scrollToEnd}
                    />

                    {isLoading && (
                        <View style={styles.thinkingRow}>
                            <View style={[styles.avatarCircle, { backgroundColor: colors.accent + '20' }]}>
                                <Text style={{ fontSize: 16 }}>🧠</Text>
                            </View>
                            <View style={[styles.messageBubble, styles.bubbleCoach, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6', borderColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 }]}>
                                <ActivityIndicator size="small" color={colors.accent} />
                                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{t('coachChatThinking')}</Text>
                            </View>
                        </View>
                    )}

                    {/* Input bar */}
                    <View style={[styles.inputBar, { borderTopWidth: 1, borderColor: colors.cardBorder, backgroundColor: isDark ? '#0a0a0c' : '#ffffff' }]}>
                        <TextInput
                            style={[
                                styles.textInput, 
                                { 
                                    color: colors.text, 
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                                    borderColor: colors.cardBorder
                                }
                            ]}
                            placeholder={t('coachChatPlaceholder')}
                            placeholderTextColor={colors.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={1000}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.sendButton, 
                                { backgroundColor: inputText.trim() ? colors.accent : 'rgba(255,255,255,0.05)' }
                            ]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Ionicons 
                                name="arrow-up" 
                                size={22} 
                                color={inputText.trim() ? '#000000' : colors.textSecondary} 
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    messageList: {
        padding: 16,
        gap: 16,
        paddingBottom: 24,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: '85%',
    },
    messageRowLeft: {
        alignSelf: 'flex-start',
    },
    messageRowRight: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
        gap: 4,
    },
    bubbleCoach: {
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    bubbleUser: {
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    messageTime: {
        fontSize: 9,
        fontWeight: '600',
        alignSelf: 'flex-end',
        marginTop: 2,
    },
    thinkingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    textInput: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 14,
        fontWeight: '500',
        borderWidth: 1,
    },
    sendButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noKeyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    noKeyCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        width: '100%',
        gap: 16,
    },
    noKeyEmoji: {
        fontSize: 48,
    },
    noKeyTitle: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    noKeyDesc: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 8,
    },
    keyInput: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 14,
        fontSize: 14,
        fontWeight: '500',
    },
    saveKeyButton: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    saveKeyText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '800',
    }
});
