import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';

export default function PrivacyPolicyScreen() {
  const { language } = usePreferences();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <>
      <Stack.Screen options={{ title: t('privacyPolicy') }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{t('privacyPolicy')}</Text>
        <Text style={styles.date}>{t('lastUpdated')}{new Date().toLocaleDateString()}</Text>

        <Text style={styles.heading}>{t('privIntroTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privIntroText' as any)}
        </Text>

        <Text style={styles.heading}>{t('privDataTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privDataText' as any)}
        </Text>

        <Text style={styles.heading}>{t('privUseTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privUseText' as any)}
        </Text>

        <Text style={styles.heading}>{t('privSecurityTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privSecurityText' as any)}
        </Text>

        <Text style={styles.heading}>{t('privRightsTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privRightsText' as any)}
        </Text>

        <Text style={styles.heading}>{t('privContactTitle' as any)}</Text>
        <Text style={styles.paragraph}>
          {t('privContactText' as any)}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
  },
});
