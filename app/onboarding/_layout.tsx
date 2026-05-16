import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
            <Stack.Screen name="index" options={{ animation: 'none' }} />
            <Stack.Screen name="splash" options={{ animation: 'fade' }} />
            <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
            <Stack.Screen name="gender" />
            <Stack.Screen name="dob" />
            <Stack.Screen name="vitals" />
            <Stack.Screen name="lifestyle" />
            <Stack.Screen name="experience" />
            <Stack.Screen name="equipment" />
            <Stack.Screen name="goals" />
            <Stack.Screen name="coach" />
            <Stack.Screen name="source" />
            <Stack.Screen name="results" options={{ animation: 'fade' }} />
        </Stack>
    );
}
