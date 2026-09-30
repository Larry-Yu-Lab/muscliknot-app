import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Floating particles component
const FloatingParticles = () => (
    <View style={styles.particlesContainer}>
        <View style={[styles.particle, { top: '15%', left: '20%', width: 16, height: 16, backgroundColor: 'rgba(249,116,21,0.3)', }]} />
        <View style={[styles.particle, { top: '40%', right: '10%', width: 32, height: 32, backgroundColor: 'rgba(239,68,68,0.2)', }]} />
        <View style={[styles.particle, { bottom: '30%', left: '15%', width: 24, height: 24, backgroundColor: 'rgba(250,204,21,0.2)', }]} />
        <View style={[styles.particle, { top: '60%', right: '25%', width: 12, height: 12, backgroundColor: 'rgba(249,116,21,0.4)', }]} />
        <View style={[styles.particle, { top: '20%', right: '30%', width: 40, height: 40, backgroundColor: 'rgba(220,38,38,0.3)', }]} />
    </View>
);

// Success checkmark icon
const SuccessIcon = () => (
    <View style={styles.iconContainer}>
        {/* Outer glow */}
        <View style={styles.iconGlow} />
        {/* Glass circle */}
        <View style={styles.glassCircle}>
            {/* Yellow inner circle with checkmark */}
            <View style={styles.yellowCircle}>
                <Ionicons name="checkmark" size={48} color="#23170f" />
            </View>
        </View>
    </View>
);

export default function LoginWelcomeScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { language } = usePreferences();
    const [userName, setUserName] = useState('');

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    useEffect(() => {
        // Get user name from session metadata
        if (session?.user?.user_metadata?.full_name) {
            const fullName = session.user.user_metadata.full_name;
            const firstName = fullName.split(' ')[0];
            setUserName(firstName);
        } else if (session?.user?.email) {
            // Use email prefix as fallback
            const emailPrefix = session.user.email.split('@')[0];
            setUserName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
        } else {
            setUserName(t('there'));
        }
    }, [session]);

    const handleContinue = () => {
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FloatingParticles />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ width: 48 }} />
                <Text style={styles.headerTitle}>{t('welcomeHeader')}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleContinue}>
                    <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <SuccessIcon />

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{t('welcomeBackUser').replace('${name}', userName)}</Text>
                    <Text style={styles.subtitle}>
                        {t('loginWelcomeSubtitle')}
                    </Text>
                </View>
            </View>

            {/* Bottom Button */}
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>{t('goToDashboard')}</Text>
                </TouchableOpacity>
            </View>

            {/* Gradient overlays */}
            <View style={styles.topGradient} />
            <View style={styles.bottomGradient} />
        </SafeAreaView>
    );
}

import { scale, scaleFont, tabletContainerStyle } from '@/utils/responsive';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#23170f',
    },
    particlesContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
    particle: {
        position: 'absolute',
        borderRadius: 50,
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        zIndex: 10,
        ...tabletContainerStyle,
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: scaleFont(14),
        fontWeight: '600',
        letterSpacing: 2,
    },
    closeButton: {
        width: scale(48),
        height: scale(48),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(24),
        gap: scale(48),
        zIndex: 10,
        ...tabletContainerStyle,
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGlow: {
        position: 'absolute',
        width: scale(200),
        height: scale(200),
        borderRadius: scale(100),
        backgroundColor: 'rgba(250,204,21,0.2)',
    },
    glassCircle: {
        width: scale(160),
        height: scale(160),
        borderRadius: scale(80),
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#facc15',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
    },
    yellowCircle: {
        width: scale(96),
        height: scale(96),
        borderRadius: scale(48),
        backgroundColor: '#facc15',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#facc15',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
    },
    textContainer: {
        alignItems: 'center',
        gap: scale(16),
    },
    title: {
        fontSize: scaleFont(36),
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: scaleFont(44),
    },
    subtitle: {
        fontSize: scaleFont(18),
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: scaleFont(26),
        maxWidth: scale(340),
    },
    bottom: {
        paddingHorizontal: scale(24),
        paddingBottom: scale(48),
        zIndex: 10,
        ...tabletContainerStyle,
    },
    button: {
        backgroundColor: '#f97316',
        height: scale(56),
        borderRadius: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: scaleFont(18),
        fontWeight: '700',
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'transparent',
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'transparent',
    },
});
