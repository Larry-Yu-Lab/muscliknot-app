import { usePreferences } from '@/context/PreferencesContext';
import { supabase } from '@/utils/supabase';
import { saveUserPreferences } from '@/utils/userPreferences';
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { theme } = usePreferences();

    // Explicit Design Constants
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

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation State
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [nameError, setNameError] = useState('');

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
            if (password.length < 6) {
                setPasswordError('Password must be at least 6 characters.');
                setPasswordSuccess('');
            } else {
                setPasswordError('');
                setPasswordSuccess('Strong password.');
            }
        } else {
            setPasswordError('');
            setPasswordSuccess('');
        }
    }, [password]);

    async function signUpWithEmail() {
        // Final Validation Check
        let isValid = true;

        if (!name) {
            setNameError('Name is required.');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email.');
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            isValid = false;
        }

        if (!isValid) return;

        if (!supabase) {
            Alert.alert('Configuration Error', 'Supabase client is not initialized.');
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`,
                    },
                },
            });

            if (error) {
                Alert.alert('Registration Failed', error.message);
            } else if (data.session) {
                // Sync onboarding preferences to database
                try {
                    const lifestyle = await AsyncStorage.getItem('user_lifestyle');
                    const goal = await AsyncStorage.getItem('user_goal');

                    if (data.user?.id) {
                        await saveUserPreferences(data.user.id, {
                            lifestyle: lifestyle as 'sedentary' | 'active' | 'athlete' | null,
                            primary_goal: goal as 'relieve_pain' | 'improve_mobility' | 'daily_maintenance' | null,
                            onboarding_completed: true,
                        });
                    }
                } catch (syncError) {
                    console.log('Error syncing preferences:', syncError);
                    // Continue anyway - preferences saved locally
                }

                router.replace('/auth/signup-success' as any);
            } else {
                Alert.alert(
                    'Success',
                    'Please check your inbox for email verification!',
                    [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
                );
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
            {/* Background Glow Orbs Simulation (Simple Views) */}
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
                    <Text style={styles.stepText}>Step 5 of 5</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Main Content */}
                <View style={styles.mainSection}>
                    <View style={styles.titleBlock}>
                        <Text style={styles.mainTitle}>Join MuscliKnot</Text>
                        <Text style={[styles.subtitle, { color: THEME.textMuted }]}>
                            Start your journey to peak performance and recovery.
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Full Name</Text>
                            <View style={[
                                styles.glassInput,
                                {
                                    backgroundColor: THEME.inputBg,
                                    borderColor: nameError ? THEME.inputErrorBorder : THEME.inputBorder
                                }
                            ]}>
                                <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your name"
                                    placeholderTextColor={THEME.textDim}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            {nameError ? <Text style={[styles.validationText, { color: THEME.errorText }]}>{nameError}</Text> : null}
                        </View>

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

                {/* Footer Section (Pushed to bottom) */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: THEME.primary }]}
                        onPress={signUpWithEmail}
                        disabled={loading}
                        activeOpacity={0.9}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.createButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.termsContainer}>
                        <Text style={[styles.termsText, { color: 'rgba(255,255,255,0.5)' }]}>
                            By creating an account, you agree to our{'\n'}
                            <Text style={{ color: THEME.primary }}>Terms</Text> & <Text style={{ color: THEME.primary }}>Privacy Policy</Text>
                        </Text>

                        <View style={styles.loginRow}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' }}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/auth/login')}>
                                <Text style={{ color: THEME.primary, textDecorationLine: 'underline', fontWeight: '600' }}>
                                    Log In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom Bar Indicator */}
                <View style={styles.bottomIndicator} />
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
        // Since we can't easily blur in vanilla RN without extra deps, 
        // we use low opacity. If expo-blur is available, we could wrap this.
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
        backgroundColor: 'rgba(255,255,255,0.0)', // Hover effect not applicable, but placeholder
    },
    stepText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
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
        height: 64, // h-16 = 64px
        borderRadius: 12, // rounded-xl
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
        height: 60, // slightly larger for touch target
        borderRadius: 12, // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, // shadow-lg shadow-primary/20
        shadowRadius: 10,
        elevation: 5,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    termsContainer: {
        alignItems: 'center',
        gap: 16,
    },
    termsText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomIndicator: {
        width: 128, // w-32
        height: 6, // h-1.5
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3, // rounded-full
        alignSelf: 'center',
        marginBottom: 8,
    },
});
