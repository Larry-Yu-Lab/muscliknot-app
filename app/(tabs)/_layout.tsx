import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '../../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import { getTranslation } from '../utils/i18n';


export default function TabLayout() {
  const { language, theme } = usePreferences();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.cardBorder,
        },
      }}>

      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabHome'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />

      {/* 2. Find Relief - Replacing Explore in the tab list order, though keeping explore file if needed */}
      <Tabs.Screen
        name="find-relief"
        options={{
          title: t('tabFindRelief'),
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="health-and-safety" color={color} />,
        }}
      />

      {/* 3. History */}
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabHistory'),
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="history" color={color} />,
        }}
      />

      {/* 4. Library */}
      <Tabs.Screen
        name="library"
        options={{
          title: t('tabLibrary'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="book" color={color} />,
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ color }) => <Ionicons size={24} name="person" color={color} />,
        }}
      />

      {/* Hide Explore from Tabs if it's not in the main 5 */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
