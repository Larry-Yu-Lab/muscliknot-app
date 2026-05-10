import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function OnboardingSplash() {
    const router = useRouter();
    const { theme } = usePreferences();
    const colors = Colors[theme];
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
                style={styles.touchable} 
                activeOpacity={1} 
                onPress={() => router.replace('/onboarding/welcome')}
            >
                <View style={styles.content}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
                <Text style={[styles.name, { color: colors.text }]}>MuscliKnot</Text>
            </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    touchable: {
        flex: 1,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 16,
    },
    name: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
