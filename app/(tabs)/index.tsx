import { getMusclesInArea } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation } from '@/utils/i18n';
import { getHistory, HistoryItem } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


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
  const { user } = useUser();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);
  const colors = Colors[theme];
  const isDark = theme === 'dark';

  const [view, setView] = useState<ViewState>('Front');
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; width: number; height: number; rotation: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState(1); // Default to avoid div by zero
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [recentPlans, setRecentPlans] = useState<HistoryItem[]>([]);
  const startCtx = useSharedValue({ x: 0, y: 0 });

  const STATIC_QUICK_FIXES: HistoryItem[] = [
    {
      id: 'static-warmup-full',
      date: Date.now(),
      muscleGroup: 'fullBody',
      exercises: [],
      assessment: { activityType: 'warmup' }
    },
    {
      id: 'static-strength-bicep',
      date: Date.now(),
      muscleGroup: 'arms',
      exercises: [],
      assessment: { activityType: 'strength', location: 'bicep' }
    },
    {
      id: 'static-yoga-full',
      date: Date.now(),
      muscleGroup: 'fullBody',
      exercises: [],
      assessment: { activityType: 'yoga' }
    }
  ];

  useFocusEffect(
    useCallback(() => {
      getHistory().then(data => {
        // Group everything by activityType and limit to 2 per category
        // Categories: relief, warmup, yoga, strength, posture
        const categories = ['relief', 'warmup', 'yoga', 'strength', 'posture'];
        const finalPlans: HistoryItem[] = [];

        categories.forEach(cat => {
          // Get items from history for this category
          const historyItems = data.filter(item => (item.assessment?.activityType || 'relief') === cat);

          // Get static items for this category
          const staticItems = STATIC_QUICK_FIXES.filter(item => (item.assessment?.activityType || 'relief') === cat);

          // Combine and take top 2 (History first to prioritize user's recent work)
          const merged = [...historyItems, ...staticItems].slice(0, 2);
          finalPlans.push(...merged);
        });

        setRecentPlans(finalPlans);
      });
    }, [])
  );

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

  const getTargetSize = (radius: number) => {
    if (radius < 40) return 'small';
    if (radius < 100) return 'medium';
    return 'large';
  };

  const updatePoint = (x: number, y: number, w: number, h: number, r: number) => {
    setActivePoint({ x, y, width: w, height: h, rotation: r });
  };

  const handleFindRelief = () => {
    if (activePoint) {
      // Calculate size for the find-relief page
      const avgRadius = (activePoint.width + activePoint.height) / 4;
      const size = getTargetSize(avgRadius);

      // Normalize Y coordinate
      const scaleY = 1000 / (containerHeight || 1);
      const normalizedY = activePoint.y * scaleY;

      // Get muscle from selection
      const muscleIds = getMusclesInArea({
        x: activePoint.x,
        y: normalizedY,
        width: activePoint.width,
        height: activePoint.height * scaleY
      });

      router.push({
        pathname: '/(tabs)/activity-selection',
        params: {
          x: activePoint.x,
          y: activePoint.y,
          width: activePoint.width,
          height: activePoint.height,
          rotation: activePoint.rotation,
          view,
          size,
          muscleId: muscleIds.length > 0 ? muscleIds[0] : 'unknown',
          timestamp: Date.now()
        }
      });
    }
  };

  // Muscle search mapping - maps common terms to muscle IDs
  const SEARCHABLE_MUSCLES: Record<string, { id: string; name: string }> = {
    // Head and Neck
    'head': { id: 'head', name: 'Head' },
    'temple': { id: 'head', name: 'Head' },
    'jaw': { id: 'head', name: 'Head' },
    'neck': { id: 'neck', name: 'Neck' },
    'cervical': { id: 'neck', name: 'Neck' },

    // Upper Body
    'shoulder': { id: 'traps', name: 'Shoulders' },
    'shoulders': { id: 'traps', name: 'Shoulders' },
    'traps': { id: 'traps', name: 'Trapezius' },
    'trapezius': { id: 'traps', name: 'Trapezius' },
    'chest': { id: 'chest', name: 'Chest' },
    'pec': { id: 'chest', name: 'Chest' },
    'arm': { id: 'arms', name: 'Arms' },
    'arms': { id: 'arms', name: 'Arms' },
    'bicep': { id: 'arms', name: 'Arms' },
    'tricep': { id: 'arms', name: 'Arms' },
    'deltoid': { id: 'arms', name: 'Arms' },
    'elbow': { id: 'forearms', name: 'Forearms' },
    'forearm': { id: 'forearms', name: 'Forearms' },
    'forearms': { id: 'forearms', name: 'Forearms' },
    'wrist': { id: 'hands', name: 'Hands/Wrists' },
    'wrists': { id: 'hands', name: 'Hands/Wrists' },
    'hand': { id: 'hands', name: 'Hands/Wrists' },
    'hands': { id: 'hands', name: 'Hands/Wrists' },
    'finger': { id: 'hands', name: 'Hands/Wrists' },
    'fingers': { id: 'hands', name: 'Hands/Wrists' },
    'thumb': { id: 'hands', name: 'Hands/Wrists' },
    'grip': { id: 'hands', name: 'Hands/Wrists' },
    'upper back': { id: 'upper_back', name: 'Upper Back' },
    'upperback': { id: 'upper_back', name: 'Upper Back' },
    'mid back': { id: 'upper_back', name: 'Upper Back' },

    // Core
    'lower back': { id: 'lower_back', name: 'Lower Back' },
    'lowerback': { id: 'lower_back', name: 'Lower Back' },
    'lumbar': { id: 'lower_back', name: 'Lower Back' },
    'abdomen': { id: 'abdomen', name: 'Abdomen' },
    'abs': { id: 'abdomen', name: 'Abdomen' },
    'core': { id: 'abdomen', name: 'Core' },
    'stomach': { id: 'abdomen', name: 'Abdomen' },
    'hip': { id: 'hips', name: 'Hips' },
    'hips': { id: 'hips', name: 'Hips' },
    'glute': { id: 'glutes', name: 'Glutes' },
    'glutes': { id: 'glutes', name: 'Glutes' },
    'butt': { id: 'glutes', name: 'Glutes' },
    'buttocks': { id: 'glutes', name: 'Glutes' },

    // Legs
    'thigh': { id: 'thighs', name: 'Thighs' },
    'thighs': { id: 'thighs', name: 'Thighs' },
    'quad': { id: 'thighs', name: 'Quadriceps' },
    'quads': { id: 'thighs', name: 'Quadriceps' },
    'quadriceps': { id: 'thighs', name: 'Quadriceps' },
    'hamstring': { id: 'thighs', name: 'Hamstrings' },
    'hamstrings': { id: 'thighs', name: 'Hamstrings' },
    'knee': { id: 'knees', name: 'Knees' },
    'knees': { id: 'knees', name: 'Knees' },
    'calf': { id: 'calves', name: 'Calves' },
    'calves': { id: 'calves', name: 'Calves' },
    'shin': { id: 'calves', name: 'Shins' },
    'ankle': { id: 'ankles', name: 'Ankles' },
    'ankles': { id: 'ankles', name: 'Ankles' },
    'foot': { id: 'feet', name: 'Feet' },
    'feet': { id: 'feet', name: 'Feet' },
    'toe': { id: 'feet', name: 'Feet' },
    'toes': { id: 'feet', name: 'Feet' },
    'heel': { id: 'feet', name: 'Heel' },
    'plantar': { id: 'feet', name: 'Plantar' },
    'leg': { id: 'thighs', name: 'Legs' },
    'legs': { id: 'thighs', name: 'Legs' },
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError('');
      return;
    }

    // Find matching muscle
    const match = SEARCHABLE_MUSCLES[query];

    if (match) {
      setSearchError('');
      setSearchQuery('');
      router.push({
        pathname: '/(tabs)/pain-assessment',
        params: {
          x: 150,
          y: 500,
          width: 80,
          height: 80,
          rotation: 0,
          view: 'Front',
          size: 'medium',
          muscleId: match.id,
          muscleName: match.name,
          timestamp: Date.now()
        }
      });
    } else {
      setSearchError(t('searchErrorNoPart'));
    }
  };

  const handleQuickFix = (item: HistoryItem) => {
    if (item.exercises && item.exercises.length > 0) {
      router.push({
        pathname: '/results',
        params: {
          exercise: JSON.stringify(item.exercises[0]),
          muscleId: item.muscleGroup,
          timestamp: item.date
        }
      });
    } else {
      // Static quick fix or item without stored exercises
      router.push({
        pathname: '/(tabs)/pain-assessment',
        params: {
          muscleId: item.muscleGroup === 'fullBody' ? 'neck' : item.muscleGroup, // Default neck as proxy for full body if needed, or handle in assessment
          activityType: item.assessment?.activityType || 'relief',
          painLocation: item.assessment?.location, // Pass sub-location like 'bicep'
          timestamp: Date.now()
        }
      });
    }
  };
  /* ZOOM STATE */
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.0)); // Max 2x zoom
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1.0)); // Min 1x zoom
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>{t('letsRecover')}</Text>
              <Text style={[styles.greetingTitle, { color: colors.text }]}>{t('greetingHello')}, {user.name.split(' ')[0]}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: searchError ? '#ef4444' : colors.cardBorder }]}>
          <TouchableOpacity style={styles.searchIconContainer} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('searchBodyPartPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={(text) => { setSearchQuery(text); setSearchError(''); }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        {searchError ? (
          <Text style={{ color: '#ef4444', fontSize: 13, marginHorizontal: 16, marginTop: 4, marginBottom: 8 }}>{searchError}</Text>
        ) : null}

        {/* Body Visualizer */}
        <View style={[styles.bodyVisualizerContainer, { backgroundColor: colors.muscleVisualizerBackground, overflow: 'hidden' }]}>
          {/* Toggle */}
          <View style={[styles.toggleContainer, { backgroundColor: isDark ? 'rgba(24, 24, 27, 0.5)' : '#e0e0e0', borderColor: colors.cardBorder, zIndex: 10 }]}>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Front' && styles.toggleButtonActive]}
              onPress={() => { setView('Front'); setActivePoint(null); setZoomLevel(1); }}
            >
              <Text style={[styles.toggleText, view === 'Front' && styles.toggleTextActive]}>{t('front')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Back' && styles.toggleButtonActive]}
              onPress={() => { setView('Back'); setActivePoint(null); setZoomLevel(1); }}
            >
              <Text style={[styles.toggleText, view === 'Back' && styles.toggleTextActive]}>{t('back')}</Text>
            </TouchableOpacity>
          </View>

          {/* Image Area with Interaction - Scaled by Zoom */}
          <View
            style={[
              styles.bodyImageContainer,
              {
                backgroundColor: colors.muscleVisualizerBackground,
                transform: [{ scale: zoomLevel }]
              }
            ]}
            onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
          >
            {/* 1. Underlying Visual Layer - Full Width/Height */}
            <Image
              source={
                view === 'Front'
                  ? (isDark ? require('../../assets/images/front_muscle.png') : require('../../assets/images/front_muscle_light.png'))
                  : (isDark ? require('../../assets/images/back_muscle.png') : require('../../assets/images/back_muscle_light.png'))
              }
              style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', backgroundColor: 'transparent' }]}
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

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Contextual Action Button */}
          {activePoint && (
            <TouchableOpacity style={styles.generateButton} onPress={handleFindRelief}>
              <Text style={styles.generateButtonText}>{t('generatePlan')}</Text>
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
          {recentPlans.map((item) => {
            const date = new Date(item.date);
            const timeStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            const activityType = item.assessment?.activityType || 'relief';

            // Category Styles & Config
            const CATEGORY_CONFIG: Record<string, { icon: any; color: string }> = {
              relief: { icon: 'medkit-outline', color: '#ef4444' },
              warmup: { icon: 'flame-outline', color: '#f97316' },
              yoga: { icon: 'leaf-outline', color: '#8b5cf6' },
              posture: { icon: 'body-outline', color: '#06b6d4' },
              strength: { icon: 'fitness-outline', color: '#10b981' },
            };

            const config = CATEGORY_CONFIG[activityType] || CATEGORY_CONFIG.relief;
            const accentColor = config.color;

            // Title Logic
            const cardTitle = (() => {
              const location = item.assessment?.location;
              const muscleGroup = item.muscleGroup;

              // 1. Get Translated Target (Muscle or Location)
              let targetName = '';
              if (muscleGroup === 'fullBody') {
                targetName = t('fullBody');
              } else if (location) {
                const locKey = `loc${location.charAt(0).toUpperCase()}${location.slice(1)}` as any;
                const transLoc = t(locKey);
                targetName = transLoc !== locKey ? transLoc : location;
              } else if (muscleGroup) {
                const mgKey = `mg${muscleGroup.charAt(0).toUpperCase()}${muscleGroup.slice(1).replace(/\s/g, '')}` as any;
                const transMg = t(mgKey);
                targetName = transMg !== mgKey ? transMg : muscleGroup;
              }

              // 2. Wrap in Pattern (e.g., "Neck Relief")
              const patternKey = `title${activityType.charAt(0).toUpperCase()}${activityType.slice(1)}` as any;
              const pattern = t(patternKey);
              if (pattern && pattern.includes('{{muscle}}')) {
                return pattern.replace('{{muscle}}', targetName);
              }

              return targetName || t('relief');
            })();

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors.cardBackground, borderLeftColor: accentColor }]}
                onPress={() => handleQuickFix(item)}
              >
                <View style={[styles.cardIcon, { backgroundColor: isDark ? `${accentColor}33` : `${accentColor}1A` }]}>
                  <Ionicons name={config.icon} size={24} color={accentColor} />
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                    {cardTitle}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                    {item.id.startsWith('static')
                      ? t(`short${activityType.charAt(0).toUpperCase()}${activityType.slice(1)}` as any)
                      : timeStr
                    }
                  </Text>
                </View>
                <View style={styles.cardArrow}>
                  <Ionicons name="chevron-forward" size={20} color={accentColor} />
                </View>
              </TouchableOpacity>
            );
          })}
          {recentPlans.length === 0 && (
            <Text style={{ color: colors.textSecondary, marginLeft: 24, paddingVertical: 20 }}>
              {t('noHistory')}
            </Text>
          )}
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
    zIndex: 999,
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
  zoomControls: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    gap: 8,
    zIndex: 20,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,30,30,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});