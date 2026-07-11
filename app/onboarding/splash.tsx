import { usePreferences } from '@/context/PreferencesContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingSplash() {
    const router = useRouter();
    const { theme } = usePreferences();

    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const fadeOutAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance: logo → text
        Animated.sequence([
            Animated.timing(logoAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const navigateAway = () => {
        Animated.timing(fadeOutAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            router.replace('/onboarding/welcome');
        });
    };

    useEffect(() => {
        const timer = setTimeout(navigateAway, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
            <TouchableOpacity
                style={styles.touchable}
                activeOpacity={1}
                onPress={navigateAway}
            >
                <View style={styles.center}>
                    {/* Logo */}
                    <Animated.View style={{
                        opacity: logoAnim,
                        transform: [{
                            scale: logoAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1],
                            })
                        }],
                    }}>
                        <Image
                            source={require('@/assets/images/muscliknot-logo.png')}
                            style={styles.logo}
                            contentFit="contain"
                        />
                    </Animated.View>

                    {/* App name + tagline */}
                    <Animated.View style={[styles.textGroup, {
                        opacity: textAnim,
                        transform: [{
                            translateY: textAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [16, 0],
                            })
                        }],
                    }]}>
                        <Text style={styles.appName}>MuscliKnot</Text>
                        <Text style={styles.tagline}>Your body. Your progress.</Text>
                    </Animated.View>
                </View>

                <SafeAreaView edges={['bottom']}>
                    <Text style={styles.hint}>Tap anywhere to continue</Text>
                </SafeAreaView>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    touchable: {
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
