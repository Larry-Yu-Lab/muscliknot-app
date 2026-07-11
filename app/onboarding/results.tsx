import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

export default function ResultsScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleContinue = () => {
        router.push('/onboarding/vitals');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '50%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>MuscliKnot creates long-term results.</Text>
                <Text style={styles.subtitle}>See the difference between our targeted approach and traditional methods over time.</Text>
                
                <View style={styles.graphContainer}>
                    <Svg 
                        width="100%" 
                        height={250} 
                        viewBox="0 0 300 250"
                        onLayout={() => {}}
                    >
                        {/* Axes */}
                        <Line x1="40" y1="20" x2="40" y2="210" stroke="#555" strokeWidth="2" />
                        <Line x1="40" y1="210" x2="280" y2="210" stroke="#555" strokeWidth="2" />
                        
                        {/* Labels */}
                        <SvgText x="10" y="115" fill="#888" fontSize="12" originX="10" originY="115" rotation="-90" textAnchor="middle">Pain / Tension</SvgText>
                        <SvgText x="160" y="235" fill="#888" fontSize="12" textAnchor="middle">Time (Weeks)</SvgText>

                        {/* Traditional Methods Line (oscillating high) */}
                        <Path d="M 40 80 Q 70 40 100 90 T 160 70 T 220 100 T 280 60" fill="none" stroke="#888" strokeWidth="3" strokeDasharray="5,5" />
                        <Circle cx="280" cy="60" r="4" fill="#888" />
                        
                        {/* MuscliKnot Line (consistent drop) */}
                        <Path d="M 40 80 Q 100 90 160 150 T 280 190" fill="none" stroke="#f97316" strokeWidth="4" />
                        <Circle cx="280" cy="190" r="5" fill="#f97316" />
                    </Svg>
                    
                    {/* Legend */}
                    <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#f97316' }]} />
                            <Text style={styles.legendText}>MuscliKnot</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendIndicator, { backgroundColor: '#888' }]} />
                            <Text style={styles.legendText}>Traditional Methods</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleContinue}
                >
                    <Text style={styles.buttonText}>{t('continue')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 32,
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    progressContainer: {
        flex: 1,
        height: 4,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#f97316',
        borderRadius: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 32,
        lineHeight: 24,
    },
    graphContainer: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        padding: 16,
        paddingBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendIndicator: {
        width: 16,
        height: 4,
        marginRight: 8,
        borderRadius: 2,
    },
    legendText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    bottom: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    button: {
        backgroundColor: '#f97316',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
});
