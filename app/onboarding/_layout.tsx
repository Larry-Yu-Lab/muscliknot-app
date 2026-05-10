import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="gender" />
            <Stack.Screen name="dob" />
            <Stack.Screen name="vitals" />
            <Stack.Screen name="lifestyle" />
            <Stack.Screen name="experience" />
            <Stack.Screen name="equipment" />
            <Stack.Screen name="goals" />
            <Stack.Screen name="coach" />
            <Stack.Screen name="source" />
            <Stack.Screen name="results" />
        </Stack>
    );
}
