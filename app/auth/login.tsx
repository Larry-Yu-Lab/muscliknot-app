import { usePreferences } from '@/context/PreferencesContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const { theme } = usePreferences();

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

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation effects
    useEffect(() => {
        if (email) {
            if (!validateEmail(email)) {
                setEmailError('Please enter a valid email.');
                setEmailSuccess('');
            } else {
                setEmailError('');
                setEmailSuccess('Valid email format.');
            }
        } else {
            setEmailError('');
            setEmailSuccess('');
        }
    }, [email]);

    useEffect(() => {
        if (password) {
            if (password.length < 1) {
                setPasswordError('Password is required.');
                setPasswordSuccess('');
            } else {
                setPasswordError('');
                setPasswordSuccess('Password entered.');
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
            setEmailError('Please enter a valid email.');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        }

        if (!isValid) return;

        console.log('Attempting to sign in with:', email);
        if (!supabase) {
            Alert.alert('Configuration Error', 'Supabase client is not initialized.');
            return;
        }

        try {
            setLoading(true);
            const { error, data } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
            } else {
                router.replace('/auth/login-welcome' as any);
            }
        } catch (e) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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
                style={styles.content}
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
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
                        <Text style={styles.mainTitle}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: THEME.textMuted }]}>
                            Sign in to continue your recovery journey.
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Email Address</Text>
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
                                    placeholder="vitality@muscliknot.com"
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
                            <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Password</Text>
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
                                    placeholder="••••••••"
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
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: THEME.primary }]}
                        onPress={signInWithEmail}
                        disabled={loading}
                        activeOpacity={0.9}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.createButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' }}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text style={{ color: THEME.primary, textDecorationLine: 'underline', fontWeight: '600' }}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
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
        marginTop: 20,
    },
    titleBlock: {
        marginBottom: 30,
    },
    mainTitle: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: -0.5,
        marginBottom: 8,
        lineHeight: 42,
    },
    subtitle: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '400',
    },
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 4,
    },
    glassInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
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
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
        marginTop: 4,
    },
    footerContainer: {
        marginTop: 'auto',
        marginBottom: 20,
        gap: 24,
    },
    createButton: {
        height: 60,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
