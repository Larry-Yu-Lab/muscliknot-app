import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Simple body figure SVG matching the design
const BodyFigure = () => (
    <Svg width={200} height={320} viewBox="0 0 200 320">
        {/* Outer rounded rectangle */}
        <Rect
            x="30"
            y="20"
            width="140"
            height="280"
            rx="70"
            ry="70"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
        />

        {/* Head */}
        <Circle cx="100" cy="70" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* Body line */}
        <Line x1="100" y1="90" x2="100" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* Arms */}
        <Line x1="100" y1="120" x2="60" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <Line x1="100" y1="120" x2="140" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* Legs */}
        <Line x1="100" y1="200" x2="70" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <Line x1="100" y1="200" x2="130" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

        {/* Orange pain points with glow effect */}
        {/* Shoulders */}
        <Circle cx="60" cy="120" r="12" fill="#f97316" opacity="0.3" />
        <Circle cx="60" cy="120" r="8" fill="#f97316" />
        <Circle cx="140" cy="120" r="12" fill="#f97316" opacity="0.3" />
        <Circle cx="140" cy="120" r="8" fill="#f97316" />

        {/* Spine dots */}
        <Circle cx="100" cy="130" r="10" fill="#f97316" opacity="0.3" />
        <Circle cx="100" cy="130" r="6" fill="#f97316" />
        <Circle cx="100" cy="155" r="10" fill="#f97316" opacity="0.3" />
        <Circle cx="100" cy="155" r="6" fill="#f97316" />
        <Circle cx="100" cy="180" r="10" fill="#f97316" opacity="0.3" />
        <Circle cx="100" cy="180" r="6" fill="#f97316" />

        {/* Knees */}
        <Circle cx="78" cy="240" r="12" fill="#f97316" opacity="0.3" />
        <Circle cx="78" cy="240" r="8" fill="#f97316" />
        <Circle cx="122" cy="240" r="12" fill="#f97316" opacity="0.3" />
        <Circle cx="122" cy="240" r="8" fill="#f97316" />
    </Svg>
);

export default function WelcomeScreen() {
    const router = useRouter();
    const { theme } = usePreferences();
    const colors = Colors[theme];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.content}>
                {/* Body Figure */}
                <View style={styles.figureContainer}>
                    <BodyFigure />
                </View>

                {/* Title */}
                <Text style={styles.title}>Welcome to{'\n'}MuscliKnot</Text>
                <Text style={styles.subtitle}>Let's find your relief.</Text>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/onboarding/lifestyle')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    figureContainer: {
        marginBottom: 48,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginBottom: 48,
    },
    button: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        paddingHorizontal: 64,
        borderRadius: 32,
        marginBottom: 32,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        backgroundColor: '#f9d423',
    },
});
