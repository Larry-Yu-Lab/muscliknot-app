import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function OnboardingSplash() {
    const router = useRouter();
    const { theme } = usePreferences();
    const colors = Colors[theme];

    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sequence: glow → logo → text
        Animated.sequence([
            Animated.timing(glowAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onboarding/welcome');
        }, 6000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: '#0a0a0a' }]}
            activeOpacity={1}
            onPress={() => router.replace('/onboarding/welcome')}
        >
            <View style={styles.center}>
                {/* Ambient glow */}
                <Animated.View style={[styles.glow, { opacity: glowAnim }]} />

                {/* Logo */}
                <Animated.View style={{ opacity: logoAnim, transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }}>
                    <Image
                        source={require('@/assets/images/muscliknot-logo.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </Animated.View>

                {/* App name + tagline */}
                <Animated.View style={[styles.textGroup, { opacity: textAnim, transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
                    <Text style={styles.appName}>MuscliKnot</Text>
                    <Text style={styles.tagline}>Your body. Your progress.</Text>
                </Animated.View>
            </View>

            <SafeAreaView>
                <Text style={styles.hint}>Tap anywhere to continue</Text>
            </SafeAreaView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(249, 107, 6, 0.18)',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 80,
    },
    logo: {
        width: 180,
        height: 130,
        marginBottom: 32,
    },
    textGroup: {
        alignItems: 'center',
        gap: 8,
    },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: 1.5,
        color: '#FFFFFF',
    },
    tagline: {
        fontSize: 16,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: 0.5,
    },
    hint: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: 0.5,
        textAlign: 'center',
        paddingBottom: 8,
    },
});
