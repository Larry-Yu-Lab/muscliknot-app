import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { getTranslation } from '@/utils/i18n';


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
          paddingTop: 0,
          paddingBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
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
          title: t('tabActivity'),
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="fitness-center" color={color} />,
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

      {/* Hide Pain Assessment - only accessible via navigation from Generate Relief Plan */}
      <Tabs.Screen
        name="pain-assessment"
        options={{
          href: null,
        }}
      />

      {/* Activity Selection - Intermediate screen */}
      <Tabs.Screen
        name="activity-selection"
        options={{
          href: null,
        }}
      />

      {/* New Activity Pages - Hidden from tabs */}
      <Tabs.Screen
        name="warm-up"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="yoga"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="fix-posture"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="strengthen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
