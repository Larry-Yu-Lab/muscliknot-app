/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#f96b06';
const tintColorDark = '#f96b06';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorLight,
    // Semantic Colors
    cardBackground: '#f7f7f7',
    cardBorder: '#e5e5e5',
    textSecondary: '#687076',
    accent: '#f96b06',
    success: '#22c55e',
    danger: '#ef4444',
    headerBackground: '#ffffff',
    switchTrack: '#e5e7eb',
    switchThumb: '#ffffff',
    surface: '#ffffff',
    inputBackground: '#f1f5f9',
    muscleVisualizerBackground: '#f0f0f0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212', // Using the app's specific dark grey
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Semantic Colors
    cardBackground: '#1e1e1e', // Slightly lighter than bg
    cardBorder: 'rgba(255,255,255,0.08)',
    textSecondary: 'rgba(255,255,255,0.6)',
    accent: '#f96b06',
    success: '#22c55e',
    danger: '#ef4444',
    headerBackground: '#121212',
    switchTrack: '#3f3f46',
    switchThumb: '#ffffff',
    surface: '#18181b', // zinc-900
    inputBackground: 'rgba(255,255,255,0.05)',
    muscleVisualizerBackground: '#272727',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
