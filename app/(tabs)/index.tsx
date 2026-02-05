import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import { getTranslation } from '../utils/i18n';


type ViewState = 'Front' | 'Back';



/* Draggable/Resizable/Rotatable Marker Component */
interface OvalProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  onUpdate: (x: number, y: number, w: number, h: number, r: number) => void;
}

const DraggableOval = ({ initialX, initialY, initialWidth, initialHeight, initialRotation, onUpdate }: OvalProps) => {
  const top = useSharedValue(initialY);
  const left = useSharedValue(initialX);
  const width = useSharedValue(initialWidth);
  const height = useSharedValue(initialHeight);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(initialRotation || 0);

  const context = useSharedValue({ x: 0, y: 0, scale: 1, rotation: 0 });

  useEffect(() => {
    top.value = initialY;
    left.value = initialX;
    width.value = initialWidth;
    height.value = initialHeight;
    scale.value = 1;
    rotation.value = initialRotation || 0;
  }, [initialX, initialY, initialWidth, initialHeight, initialRotation]);

  /* 1. PAN (Drag) - Strict 1 Finger */
  const pan = Gesture.Pan()
    .maxPointers(1) // Force 1 finger for dragging to distinguish from rotation
    .onStart(() => {
      context.value = { ...context.value, x: left.value, y: top.value };
    })
    .onUpdate((event) => {
      left.value = context.value.x + event.translationX;
      top.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onUpdate)(left.value, top.value, width.value * scale.value, height.value * scale.value, rotation.value);
    });

  /* 2. PINCH (Scale) + ROTATE - 2 Fingers */
  const pinch = Gesture.Pinch()
    .onStart(() => {
      context.value = { ...context.value, scale: scale.value };
    })
    .onUpdate((event) => {
      scale.value = context.value.scale * event.scale;
    })
    .onEnd(() => {
      const finalW = width.value * scale.value;
      const finalH = height.value * scale.value;
      width.value = finalW;
      height.value = finalH;
      scale.value = 1;
      runOnJS(onUpdate)(left.value, top.value, finalW, finalH, rotation.value);
    });

  const rotate = Gesture.Rotation()
    .onStart(() => {
      context.value = { ...context.value, rotation: rotation.value };
    })
    .onUpdate((event) => {
      rotation.value = context.value.rotation + event.rotation;
    })
    .onEnd(() => {
      runOnJS(onUpdate)(left.value, top.value, width.value * scale.value, height.value * scale.value, rotation.value);
    });

  /* Compose: 1 Finger Pan | 2 Finger Pinch+Rotate */
  const composed = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value - (height.value * scale.value) / 2,
    left: left.value - (width.value * scale.value) / 2,
    width: width.value * scale.value,
    height: height.value * scale.value,
    transform: [{ rotate: `${rotation.value}rad` }],
    borderRadius: 1000,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.painMarker, animatedStyle]} />
    </GestureDetector>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { language, theme } = usePreferences();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const colors = Colors[theme];
  const isDark = theme === 'dark';

  const [view, setView] = useState<ViewState>('Front');
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; width: number; height: number; rotation: number } | null>(null);

  const startCtx = useSharedValue({ x: 0, y: 0 });

  const creationGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((event) => {
      const { x, y } = event;
      startCtx.value = { x, y };
      runOnJS(setActivePoint)({ x, y, width: 20, height: 20, rotation: 0 });
    })
    .onUpdate((event) => {
      const { translationX, translationY } = event;
      const newW = Math.max(20, Math.abs(translationX) * 2);
      const newH = Math.max(20, Math.abs(translationY) * 2);

      runOnJS(setActivePoint)({
        x: startCtx.value.x,
        y: startCtx.value.y,
        width: newW,
        height: newH,
        rotation: 0
      });
    });

  const updatePoint = (x: number, y: number, w: number, h: number, r: number) => {
    setActivePoint({ x, y, width: w, height: h, rotation: r });
  };

  const handleFindRelief = () => {
    if (activePoint) {
      router.push({
        pathname: '/(tabs)/find-relief',
        params: {
          x: activePoint.x,
          y: activePoint.y,
          width: activePoint.width,
          height: activePoint.height,
          rotation: activePoint.rotation,
          view,
          timestamp: Date.now()
        }
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuATfKINBnYddwALYOWgnuRoHefSk8YUwGzzqj09-y9OuUOYSlHWWTUDnJ-ATViJk106sgPtrQ7TGy5HW82D9CW8zxe4GUAvHl7Yv2kpQUMKw3UyP3fEk87uibvOm8nOTMzJQ0Joy_l7k3uN4g4B5gOO4GPpj7iMDX55B2u0lQXz-SR1fnS_PzRZShxB4XFzO8nPITSCqGOHZic_6yrSbnBTSwfP6YAh_977r7ima5hru3ocwA6w4pwZNSguCa_wBXPsBNyeyHUrU75c" }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>{t('letsRecover')}</Text>
              <Text style={[styles.greetingTitle, { color: colors.text }]}>{t('welcomeBack')}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#fff" />
          </View>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={activePoint ? t('painPointSelected') : t('dragToMap')}
            placeholderTextColor={colors.textSecondary}
            editable={false}
          />
        </View>

        {/* Body Visualizer */}
        <View style={[styles.bodyVisualizerContainer, { backgroundColor: isDark ? '#272727' : '#f0f0f0' }]}>
          {/* Toggle */}
          <View style={[styles.toggleContainer, { backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#e0e0e0', borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Front' && styles.toggleButtonActive]}
              onPress={() => { setView('Front'); setActivePoint(null); }}
            >
              <Text style={[styles.toggleText, view === 'Front' && styles.toggleTextActive]}>{t('front')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Back' && styles.toggleButtonActive]}
              onPress={() => { setView('Back'); setActivePoint(null); }}
            >
              <Text style={[styles.toggleText, view === 'Back' && styles.toggleTextActive]}>{t('back')}</Text>
            </TouchableOpacity>
          </View>

          {/* Image Area with Inteaction */}
          <View style={styles.bodyImageContainer}>
            {/* 1. Underlying Visual Layer - Full Width/Height */}
            <Image
              source={view === 'Front' ? require('../../assets/images/front_muscle.png') : require('../../assets/images/back_muscle.png')}
              style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
              contentFit="contain"
            />

            {/* 2. Interaction Layer - Restricted to Center 65% */}
            <View style={{ width: '65%', height: '100%', alignSelf: 'center', position: 'relative' }}>
              <GestureDetector gesture={creationGesture}>
                {/* Transparent touch target */}
                <View style={{ flex: 1, backgroundColor: 'transparent' }} />
              </GestureDetector>

              {/* Render Marker ON TOP of the constrained view (same coordinate system) */}
              {activePoint && (
                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                  <DraggableOval
                    initialX={activePoint!.x}
                    initialY={activePoint!.y}
                    initialWidth={activePoint!.width}
                    initialHeight={activePoint!.height}
                    initialRotation={activePoint!.rotation}
                    onUpdate={updatePoint}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Contextual Action Button */}
          {activePoint && (
            <TouchableOpacity style={styles.generateButton} onPress={handleFindRelief}>
              <Text style={styles.generateButtonText}>{t('generateReliefPlan')}</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Fix */}
        <View style={styles.quickFixHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recentPlans')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>{t('seeAllHistory')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          {/* Card 1 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.accent }]}>
            <View style={[styles.cardIcon, { backgroundColor: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)' }]}>
              <Ionicons name="medkit-outline" size={24} color={colors.accent} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('neckRelief')}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{t('yesterday')}</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.accent} />
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: colors.accent }]}>
            <View style={[styles.cardIcon, { backgroundColor: isDark ? 'rgba(249, 115, 22, 0.2)' : 'rgba(249, 115, 22, 0.1)' }]}>
              <Ionicons name="fitness-outline" size={24} color={colors.accent} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('lowerBack')}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{t('daysAgo').replace('${days}', '2')}</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.accent} />
            </View>
          </TouchableOpacity>
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Matching pb-24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.3)', // primary/30
  },
  greetingSub: {
    color: '#71717a', // zinc-500
    fontSize: 12,
    fontWeight: '500',
  },
  greetingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // glass
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316', // primary
  },
  searchContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f97316', // primary
    alignItems: 'center',
    justifyContent: 'center',
    // Pulse effect simulated with shadow
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  bodyVisualizerContainer: {
    marginHorizontal: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#272727', // Custom dark grey
    alignItems: 'center',
    gap: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(24, 24, 27, 0.5)', // zinc-900/50
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FACC15', // solar
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a1a1aa', // zinc-400
  },
  toggleTextActive: {
    color: '#000',
  },
  bodyImageContainer: {
    width: '100%',
    aspectRatio: 0.65,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bodyImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pulseDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.4)',
    borderWidth: 1,
    borderColor: '#f97316',
    // Animation is harder in standard StyleSheet without Reanimated. static for now.
  },
  staticDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  quickFixHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  seeAllText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '700',
  },
  cardsScroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },
  card: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    gap: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.2)', // primary/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  cardSubtitle: {
    color: '#a1a1aa', // zinc-400
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardArrow: {
    alignItems: 'flex-end',
  },
  painMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(249, 115, 22, 0.6)', // primary with opacity
    // Pulse animation would go here
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  generateButton: {
    marginTop: 16,
    width: '100%',
    height: 56,
    backgroundColor: '#f96b06',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#f96b06',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  generateButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});