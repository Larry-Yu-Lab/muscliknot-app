import { Dimensions, PixelRatio, Platform, useWindowDimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Detect if current device is a tablet (iPad, Android Tablet, etc.)
export const isTablet = SCREEN_WIDTH >= 600 || SCREEN_HEIGHT >= 1000 || (Platform.OS === 'ios' && Platform.isPad);

// Tablet scale multiplier (1.35x) to scale text, inputs, buttons and padding so they fit iPad screen dimensions comfortably
export const TABLET_SCALE = isTablet ? 1.35 : 1.0;
export const MAX_CONTENT_WIDTH = 720;

/**
 * Scale layout dimensions (paddings, heights, icon sizes, margins) for tablet support.
 */
export function scale(size: number): number {
  if (!isTablet) return size;
  return Math.round(size * TABLET_SCALE);
}

/**
 * Scale font sizes for tablet support so text is crisp, legible and effortless to read on iPad displays.
 */
export function scaleFont(size: number): number {
  if (!isTablet) return size;
  const scaled = size * TABLET_SCALE;
  return Math.round(PixelRatio.roundToNearestPixel(scaled));
}

/**
 * Full-width ScrollView contentContainerStyle to ensure the scroll container spans 100% width
 * so swiping/dragging on any empty space on tablet screens scrolls the page.
 */
export const tabletScrollContentStyle = isTablet
  ? {
      width: '100%' as const,
      alignItems: 'center' as const,
      flexGrow: 1 as const,
    }
  : {};

/**
 * Responsive inner content container style to constrain content width to 720px centered on tablet screens.
 */
export const tabletContainerStyle = isTablet
  ? {
      maxWidth: MAX_CONTENT_WIDTH,
      width: '100%' as const,
      alignSelf: 'center' as const,
    }
  : {};

/**
 * Dynamic hook for orientation-aware responsive calculations.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTabletDevice = width >= 600 || height >= 1000 || (Platform.OS === 'ios' && Platform.isPad);
  const scaleMult = isTabletDevice ? 1.35 : 1.0;

  const scale = (size: number) => (isTabletDevice ? Math.round(size * scaleMult) : size);
  const scaleFont = (size: number) =>
    isTabletDevice ? Math.round(PixelRatio.roundToNearestPixel(size * scaleMult)) : size;

  return {
    width,
    height,
    isTablet: isTabletDevice,
    scale,
    scaleFont,
    scrollContentStyle: isTabletDevice
      ? {
          width: '100%' as const,
          alignItems: 'center' as const,
          flexGrow: 1 as const,
        }
      : {},
    containerStyle: isTabletDevice
      ? {
          maxWidth: MAX_CONTENT_WIDTH,
          width: '100%' as const,
          alignSelf: 'center' as const,
        }
      : {},
  };
}
