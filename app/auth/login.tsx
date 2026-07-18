import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { getHistory } from '@/utils/storage';
import { supabase } from '@/utils/supabase';
import { getUserPreferences } from '@/utils/userPreferences';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { theme, language, refreshPreferences } = usePreferences();
    const { signInOffline } = useAuth();

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    // Explicit Design Constants (Matching RegisterScreen)
    const THEME = {
        background: '#23170f',
        primary: '#f97316',
        text: '#FFFFFF',
        textMuted: 'rgba(255, 255, 255, 0.6)',
        textDim: 'rgba(255, 255, 255, 0.3)',
        inputBg: 'rgba(255, 255, 255, 0.03)',
        inputBorder: 'rgba(255, 255, 255, 0.1)',
        inputErrorBorder: '#ef4444',
        inputSuccessBorder: '#22c55e',
        errorText: '#ef4444',
        successText: '#22c55e',
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation State
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [emailSuccess, setEmailSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [loginError, setLoginError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation effects
    useEffect(() => {
        setLoginError('');
        if (email) {
            if (!validateEmail(email)) {
                setEmailError(t('emailInvalid'));
                setEmailSuccess('');
            } else {
                setEmailError('');
                setEmailSuccess(t('validEmail'));
            }
        } else {
            setEmailError('');
            setEmailSuccess('');
        }
    }, [email]);

    useEffect(() => {
        setLoginError('');
        if (password) {
            if (password.length < 1) {
                setPasswordError(t('passwordRequired'));
                setPasswordSuccess('');
            } else {
                setPasswordError('');
                setPasswordSuccess(t('passwordEntered'));
            }
        } else {
            setPasswordError('');
            setPasswordSuccess('');
        }
    }, [password]);

    async function signInWithEmail() {
        // Final Validation Check
        let isValid = true;

        if (!validateEmail(email)) {
            setEmailError(t('emailInvalid'));
            isValid = false;
        }

        if (!password) {
            setPasswordError(t('passwordRequired'));
            isValid = false;
        }

        if (!isValid) return;

        console.log('Attempting to sign in with:', email);
        if (!supabase) {
            Alert.alert(
                "Connection Error",
                "Supabase client is not initialized. Would you like to log in using Offline Mode? Your data will be saved locally on this device.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Log In Offline",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await signInOffline(email.trim());
                                router.replace('/auth/login-welcome' as any);
                            } catch (offlineErr) {
                                Alert.alert("Error", "Failed to start offline session.");
                            } finally {
                                setLoading(false);
                            }
                        }
                    }
                ]
            );
            return;
        }

        try {
            setLoading(true);
            const { error, data } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setLoginError(t('loginError'));
                } else if (
                    error.message.toLowerCase().includes('fetch') || 
                    error.message.toLowerCase().includes('network') ||
                    error.message.toLowerCase().includes('typeerror') ||
                    error.message.toLowerCase().includes('failed to fetch')
                ) {
                    Alert.alert(
                        "Connection Error",
                        "Unable to connect to the server. Would you like to log in using Offline Mode? Your data will be saved locally on this device.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Log In Offline",
                                onPress: async () => {
                                    try {
                                        setLoading(true);
                                        await signInOffline(email.trim());
                                        router.replace('/auth/login-welcome' as any);
                                    } catch (offlineErr) {
                                        Alert.alert("Error", "Failed to start offline session.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert(t('loginFailed'), error.message);
                }
            } else {
                // Sync User Data
                try {
                    if (data.user) {
                        // 1. Sync Preferences
                        const { data: prefs } = await getUserPreferences(data.user.id);

                        if (prefs) {
                            if (prefs.lifestyle) await AsyncStorage.setItem('user_lifestyle', prefs.lifestyle);
                            if (prefs.primary_goal) await AsyncStorage.setItem('user_goal', prefs.primary_goal);
                            if (prefs.onboarding_completed) await AsyncStorage.setItem('onboarding_complete', 'true');
                            if (prefs.theme) await AsyncStorage.setItem('app_theme', prefs.theme);
                            if (prefs.language) await AsyncStorage.setItem('app_language', prefs.language);
                        }

                        // Refresh context to apply theme/language immediately
                        if (refreshPreferences) {
                            await refreshPreferences();
                        }

                        // 2. Sync History
                        await getHistory(); // This will fetch from Supabase and update local storage
                    }
                } catch (syncError) {
                    console.error('Error syncing user data on login:', syncError);
                    // verified - proceed even if sync fails
                }

                router.replace('/auth/login-welcome' as any);
            }
        } catch (e: any) {
            const msg = e?.message || '';
            if (
                msg.toLowerCase().includes('fetch') || 
                msg.toLowerCase().includes('network') || 
                msg.toLowerCase().includes('typeerror')
            ) {
                Alert.alert(
                    "Connection Error",
                    "Unable to connect to the server. Would you like to log in using Offline Mode? Your data will be saved locally on this device.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Log In Offline",
                            onPress: async () => {
                                try {
                                    setLoading(true);
                                    await signInOffline(email.trim());
                                    router.replace('/auth/login-welcome' as any);
                                } catch (offlineErr) {
                                    Alert.alert("Error", "Failed to start offline session.");
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(t('error') || 'Error', t('unexpectedError'));
            }
        } finally {
            setLoading(false);
        }
    }

    async function signInWithGoogle() {
        try {
            setLoading(true);
            if (!supabase) {
                await signInOffline('google-user@example.com', 'Google User');
                router.replace('/auth/login-welcome' as any);
                return;
            }

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'muscliknot://google-auth',
                },
            });

            if (error) throw error;
        } catch (e: any) {
            console.warn('Google Login error, falling back to offline mode:', e);
            Alert.alert(
                "Connection Info",
                "Google Sign-In is currently unavailable. Would you like to proceed using a mock Google account in Offline Mode?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Continue Offline",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await signInOffline('google-tester@example.com', 'Google Tester');
                                router.replace('/auth/login-welcome' as any);
                            } catch (err) {
                                Alert.alert("Error", "Failed to start offline session.");
                            } finally {
                                setLoading(false);
                            }
                        }
                    }
                ]
            );
        } finally {
            setLoading(false);
        }
    }

    // Helper to get border color based on state
    const getBorderColor = (error: string, success: string, defaultColor: string) => {
        if (error) return THEME.inputErrorBorder;
        if (success) return THEME.inputSuccessBorder;
        return defaultColor;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: THEME.background }]}>
            {/* Background Glow Orbs Simulation */}
            <View style={styles.glowContainer} pointerEvents="none">
                <View style={[styles.glowOrb, { top: -80, left: -80, backgroundColor: THEME.primary }]} />
                <View style={[styles.glowOrb, { bottom: -80, right: -80, backgroundColor: '#9a3412' }]} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/onboarding/welcome' as any);
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        {/* Placeholder to balance the header if needed, or remove if just back button is enough */}
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Main Content */}
                    <View style={styles.mainSection}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.mainTitle}>{t('loginTitle')}</Text>
                            <Text style={[styles.subtitle, { color: THEME.textMuted }]}>
                                {t('loginSubtitle')}
                            </Text>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.formContainer}>
                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>{t('email')}</Text>
                                <View style={[
                                    styles.glassInput,
                                    {
                                        backgroundColor: THEME.inputBg,
                                        borderColor: getBorderColor(emailError, emailSuccess, THEME.inputBorder)
                                    }
                                ]}>
                                    <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('emailPlaceholder')}
                                        placeholderTextColor={THEME.textDim}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                                {emailError ? (
                                    <Text style={[styles.validationText, { color: THEME.errorText }]}>{emailError}</Text>
                                ) : emailSuccess ? (
                                    <Text style={[styles.validationText, { color: THEME.successText }]}>{emailSuccess}</Text>
                                ) : null}
                            </View>

                            {/* Password */}
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>{t('password')}</Text>
                                <View style={[
                                    styles.glassInput,
                                    {
                                        backgroundColor: THEME.inputBg,
                                        borderColor: getBorderColor(passwordError, passwordSuccess, THEME.inputBorder)
                                    }
                                ]}>
                                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('passwordPlaceholder')}
                                        placeholderTextColor={THEME.textDim}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="rgba(255,255,255,0.4)"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {passwordError ? (
                                    <Text style={[styles.validationText, { color: THEME.errorText }]}>{passwordError}</Text>
                                ) : passwordSuccess ? (
                                    <Text style={[styles.validationText, { color: THEME.successText }]}>{passwordSuccess}</Text>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footerContainer}>
                        {loginError ? (
                            <Text style={[styles.validationText, { color: THEME.errorText, textAlign: 'center', marginBottom: 8 }]}>
                                {loginError}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={[styles.createButton, { backgroundColor: THEME.primary }]}
                            onPress={signInWithEmail}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.createButtonText}>{t('signIn')}</Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>{t('or')}</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Sign In Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={signInWithGoogle}
                            activeOpacity={0.8}
                        >
                            <View style={styles.googleButtonContent}>
                                <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
                                <Text style={styles.googleButtonText}>{t('signInWithGoogle')}</Text>
                            </View>
                            {/* Popular Badge */}
                            <View style={styles.popularBadge}>
                                <Text style={styles.popularBadgeText}>{t('popular')}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.registerRow}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' }}>
                                {t('dontHaveAccount')}{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/auth/register')}>
                                <Text style={{ color: THEME.primary, textDecorationLine: 'underline', fontWeight: '600' }}>
                                    {t('signUp')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    glowContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        overflow: 'hidden',
    },
    glowOrb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.15,
    },
    keyboardAvoid: {
        flex: 1,
        zIndex: 10,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.0)',
    },
    mainSection: {
        marginTop: 10,
    },
    titleBlock: {
        marginBottom: 16,
    },
    mainTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: -0.5,
        marginBottom: 6,
        lineHeight: 34,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '400',
    },
    formContainer: {
        gap: 12,
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 4,
    },
    glassInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 54,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        height: '100%',
    },
    validationText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
        marginTop: 2,
    },
    footerContainer: {
        marginTop: 'auto',
        paddingTop: 20,
        paddingBottom: 10,
        gap: 16,
    },
    createButton: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 2,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 16,
    },
    googleButton: {
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        marginRight: 12,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 16,
        backgroundColor: '#f97316',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#23170f',
    },
    popularBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
});
