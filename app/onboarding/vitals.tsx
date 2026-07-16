import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IMPERIAL_HEIGHTS: string[] = [];
for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
        IMPERIAL_HEIGHTS.push(`${feet}' ${inches}"`);
    }
}
const METRIC_HEIGHTS: string[] = Array.from({ length: 101 }, (_, i) => `${i + 120} cm`);

const IMPERIAL_WEIGHTS: string[] = Array.from({ length: 261 }, (_, i) => `${i + 90} lbs`);
const METRIC_WEIGHTS: string[] = Array.from({ length: 121 }, (_, i) => `${i + 40} kg`);

const ITEM_HEIGHT = 50;

function Roller({ data, selectedValue, onValueChange }: { data: string[], selectedValue: string, onValueChange: (v: string) => void }) {
    const paddedData = ['', '', ...data, '', ''];

    const handleScrollEnd = (e: any) => {
        const y = e.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (data[index]) {
            onValueChange(data[index]);
        }
    };

    return (
        <View style={{ height: ITEM_HEIGHT * 5, width: '100%', overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: ITEM_HEIGHT * 2, left: 0, right: 0, height: ITEM_HEIGHT, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={handleScrollEnd}
            >
                {paddedData.map((item, idx) => (
                    <View key={idx} style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: item === selectedValue ? 24 : 18,
                            color: item === selectedValue ? '#f97316' : 'rgba(255,255,255,0.4)',
                            fontWeight: item === selectedValue ? '700' : '400'
                        }}>
                            {item}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default function VitalsScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    
    // Default values
    const [isImperial, setIsImperial] = useState(true);
    const [impHeight, setImpHeight] = useState("5' 8\"");
    const [impWeight, setImpWeight] = useState("160 lbs");
    const [metHeight, setMetHeight] = useState("170 cm");
    const [metWeight, setMetWeight] = useState("70 kg");

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleContinue = async () => {
        await AsyncStorage.setItem('user_height', isImperial ? impHeight : metHeight);
        await AsyncStorage.setItem('user_weight', isImperial ? impWeight : metWeight);
        await AsyncStorage.setItem('user_measurement_system', isImperial ? 'imperial' : 'metric');
        router.push('/onboarding/dob');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '60%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Height & Weight</Text>
                <Text style={styles.subtitle}>This helps us personalize your recovery and exercise plans.</Text>
                
                {/* Imperial / Metric Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={[styles.toggleButton, isImperial && styles.toggleActive]} 
                        onPress={() => setIsImperial(true)}
                    >
                        <Text style={[styles.toggleText, isImperial && styles.toggleTextActive]}>Imperial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.toggleButton, !isImperial && styles.toggleActive]} 
                        onPress={() => setIsImperial(false)}
                    >
                        <Text style={[styles.toggleText, !isImperial && styles.toggleTextActive]}>Metric</Text>
                    </TouchableOpacity>
                </View>

                {/* Rollers Side by Side */}
                <View style={styles.rollersRow}>
                    <View style={styles.rollerCol}>
                        <Text style={styles.rollerLabel}>Height</Text>
                        <Roller 
                            data={isImperial ? IMPERIAL_HEIGHTS : METRIC_HEIGHTS} 
                            selectedValue={isImperial ? impHeight : metHeight} 
                            onValueChange={isImperial ? setImpHeight : setMetHeight} 
                        />
                    </View>
                    <View style={styles.rollerCol}>
                        <Text style={styles.rollerLabel}>Weight</Text>
                        <Roller 
                            data={isImperial ? IMPERIAL_WEIGHTS : METRIC_WEIGHTS} 
                            selectedValue={isImperial ? impWeight : metWeight} 
                            onValueChange={isImperial ? setImpWeight : setMetWeight} 
                        />
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
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 32,
        padding: 4,
        marginBottom: 40,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 28,
    },
    toggleActive: {
        backgroundColor: '#f97316',
    },
    toggleText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    toggleTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    rollersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    rollerCol: {
        flex: 1,
        alignItems: 'center',
    },
    rollerLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
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
    skipButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    skipText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
