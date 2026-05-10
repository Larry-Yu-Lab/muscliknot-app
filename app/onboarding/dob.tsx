import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);

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

export default function DOBScreen() {
    const router = useRouter();
    const { theme, language } = usePreferences();
    
    // Pick standard defaults
    const [month, setMonth] = useState('Jan');
    const [day, setDay] = useState('1');
    const [year, setYear] = useState('2000');

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

    const handleContinue = async () => {
        const dob = `${month} ${day}, ${year}`;
        await AsyncStorage.setItem('user_dob', dob);
        router.push('/onboarding/goals');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
            <View style={styles.progressHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '70%' }]} />
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>When were you born?</Text>
                <Text style={styles.subtitle}>Age helps us refine muscle recovery predictions.</Text>
                
                <View style={styles.rollersRow}>
                    <View style={styles.rollerCol}>
                        <Text style={styles.rollerLabel}>Month</Text>
                        <Roller 
                            data={MONTHS} 
                            selectedValue={month} 
                            onValueChange={setMonth} 
                        />
                    </View>
                    <View style={styles.rollerCol}>
                        <Text style={styles.rollerLabel}>Day</Text>
                        <Roller 
                            data={DAYS} 
                            selectedValue={day} 
                            onValueChange={setDay} 
                        />
                    </View>
                    <View style={styles.rollerCol}>
                        <Text style={styles.rollerLabel}>Year</Text>
                        <Roller 
                            data={YEARS} 
                            selectedValue={year} 
                            onValueChange={setYear} 
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
    container: { flex: 1 },
    progressHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 32, marginBottom: 32 },
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    progressContainer: { flex: 1, height: 4 },
    progressBarBackground: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 2 },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 12, lineHeight: 40 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 48, lineHeight: 24 },
    rollersRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    rollerCol: { flex: 1, alignItems: 'center' },
    rollerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    bottom: { paddingHorizontal: 24, paddingBottom: 32 },
    button: { backgroundColor: '#f97316', paddingVertical: 16, borderRadius: 32, alignItems: 'center' },
    buttonText: { color: '#000', fontSize: 18, fontWeight: '600' },
});
