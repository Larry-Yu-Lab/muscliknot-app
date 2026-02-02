import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { usePreferences } from '../../app/context/PreferencesContext';

interface CustomToggleProps {
    value: boolean;
    onValueChange: () => void;
    activeColor: string;
}

export const CustomToggle = ({ value, onValueChange, activeColor }: CustomToggleProps) => {
    const { theme } = usePreferences();
    const isDarkGlobal = theme === 'dark';
    const translateX = useSharedValue(value ? 20 : 0);

    React.useEffect(() => {
        translateX.value = withSpring(value ? 20 : 0, { damping: 15, stiffness: 120 });
    }, [value]);

    const trackAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                translateX.value,
                [0, 20],
                [isDarkGlobal ? '#333' : '#e5e7eb', activeColor]
            )
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        };
    });

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onValueChange}>
            <Animated.View style={[styles.customToggleTrack, trackAnimatedStyle]}>
                <Animated.View style={[styles.customToggleThumb, thumbAnimatedStyle]} />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    customToggleTrack: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: 'center',
    },
    customToggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
});
