import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316', // Orange
        tabBarInactiveTintColor: '#a1a1aa', // Zinc-400 equivalent
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#121212', // Background Dark
          borderTopColor: 'rgba(255,255,255,0.1)',
        },
      }}>

      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />

      {/* 2. Find Relief - Replacing Explore in the tab list order, though keeping explore file if needed */}
      <Tabs.Screen
        name="find-relief"
        options={{
          title: 'Find Relief',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="health-and-safety" color={color} />,
        }}
      />

      {/* 3. History */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <MaterialIcons size={24} name="history" color={color} />,
        }}
      />

      {/* 4. Library */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="book" color={color} />,
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
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
