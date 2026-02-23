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
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 10,
    },
    headerTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
    },
    closeButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 48,
        zIndex: 10,
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGlow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(250,204,21,0.2)',
    },
    glassCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
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
        width: 96,
        height: 96,
        borderRadius: 48,
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
        gap: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 300,
    },
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 48,
        zIndex: 10,
    },
    button: {
        backgroundColor: '#f97316',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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
