import { getMusclesInArea } from '@/components/AnatomyMap';
import { Colors } from '@/constants/theme';
import { usePreferences } from '@/context/PreferencesContext';
import { useUser } from '@/context/UserContext';
import { getTranslation, formatLabel } from '@/utils/i18n';
import { generatePreventionAlerts, PreventionAlert } from '@/utils/preventionEngine';
import { generateRoadmap, phaseLabelKey, RecoveryRoadmap } from '@/utils/recoveryRoadmap';
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
  const t = (key: Parameters<typeof getTranslation>[1], params?: Record<string, string>) => getTranslation(language, key, params);
  const colors = Colors[theme];
  const isDark = theme === 'dark';

  const [view, setView] = useState<ViewState>('Front');
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; width: number; height: number; rotation: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState(1); // Default to avoid div by zero
  const [containerWidth, setContainerWidth] = useState(1); // Default to avoid div by zero
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [recentPlans, setRecentPlans] = useState<HistoryItem[]>([]);
  const [roadmap, setRoadmap] = useState<RecoveryRoadmap | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [preventionAlerts, setPreventionAlerts] = useState<PreventionAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
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

        // Generate AI Roadmap from full history
        const rm = generateRoadmap(data);
        setRoadmap(rm);

        // Count how many assessments have pain scores
        const relevantCount = data.filter(h => h.assessment?.painLevel !== undefined).length;
        setHistoryCount(relevantCount);

        // Generate Prevention Alerts
        const alerts = generatePreventionAlerts(data);
        setPreventionAlerts(alerts);
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

      // Normalize X coordinate
      const scaleX = 300 / (containerWidth || 1);
      const normalizedX = activePoint.x * scaleX;

      // Normalize Y coordinate
      const scaleY = 1000 / (containerHeight || 1);
      const normalizedY = activePoint.y * scaleY;

      // Get muscle from selection
      const muscleIds = getMusclesInArea({
        x: normalizedX,
        y: normalizedY,
        width: activePoint.width * scaleX,
        height: activePoint.height * scaleY
      });

      if (muscleIds.length === 0) {
        return; // Early exit if no valid muscle is targeted
      }

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
          muscleId: muscleIds[0],
          timestamp: Date.now()
        }
      });
    }
  };

  // Muscle search mapping - maps common terms to muscle IDs
  // Load localized search keywords
  const searchKeywordsJson = t('searchKeywordsJson');
  let searchKeywords: Record<string, string> = {};
  try {
    searchKeywords = JSON.parse(searchKeywordsJson);
  } catch (e) {
    console.error('Failed to parse search keywords JSON', e);
  }

  // Map keywords to their muscle IDs
  const SEARCHABLE_MUSCLES: Record<string, { id: string; name: string }> = {};
  Object.entries(searchKeywords).forEach(([keyword, muscleId]) => {
    // We use the keyword itself as the display name if we don't have a better one
    // or we could look up the translated muscle name here if needed.
    SEARCHABLE_MUSCLES[keyword.toLowerCase()] = {
      id: muscleId,
      name: keyword.charAt(0).toUpperCase() + keyword.slice(1)
    };
  });

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
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : colors.cardBackground, borderColor: colors.cardBorder }]} onPress={() => router.push('/settings' as any)}>
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
            onLayout={(e) => {
              setContainerHeight(e.nativeEvent.layout.height);
              setContainerWidth(e.nativeEvent.layout.width);
            }}
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

            {/* 2. Interaction Layer - Full Width */}
            <View style={{ width: '100%', height: '100%', alignSelf: 'center', position: 'relative' }}>
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
          <View style={[styles.zoomControls, { bottom: activePoint ? 90 : 24 }]}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Contextual Action Button */}
          {activePoint && (() => {
            const scaleX = 300 / (containerWidth || 1);
            const scaleY = 1000 / (containerHeight || 1);
            const muscleIds = getMusclesInArea({
              x: activePoint.x * scaleX,
              y: activePoint.y * scaleY,
              width: activePoint.width * scaleX,
              height: activePoint.height * scaleY
            });
            const valid = muscleIds.length > 0;
            return valid ? (
              <TouchableOpacity style={styles.generateButton} onPress={handleFindRelief}>
                <Text style={styles.generateButtonText}>{t('generatePlan')}</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            ) : (
              <View style={[styles.generateButton, { backgroundColor: isDark ? '#3f3f46' : '#d4d4d8', shadowOpacity: 0, elevation: 0 }]}>
                <Text style={[styles.generateButtonText, { color: isDark ? '#a1a1aa' : '#71717a' }]}>{t('selectValidMuscle' as any) || 'Select a valid muscle'}</Text>
                <Ionicons name="warning-outline" size={20} color={isDark ? '#a1a1aa' : '#71717a'} />
              </View>
            );
          })()}
        </View>

        {/* ─── AI Recovery Roadmap Card ──────────────────────────────── */}
        {(() => {
          if (!user.isPremium) {
            // 1. FREE USER: Render locked preview
            return (
              <View style={[styles.roadmapCard, { backgroundColor: colors.cardBackground, borderColor: '#f9731640', overflow: 'hidden' }]}>
                <View style={[StyleSheet.absoluteFillObject, styles.lockOverlay, { backgroundColor: 'rgba(23,15,10,0.92)' }]}>
                  <View style={styles.lockContainer}>
                    <View style={[styles.lockIconCircle, { backgroundColor: colors.accent + '15' }]}>
                      <Ionicons name="lock-closed" size={18} color={colors.accent} />
                    </View>
                    <Text style={[styles.lockTitle, { color: colors.text }]}>Personal AI Coach</Text>
                    <Text style={[styles.lockSubtitle, { color: colors.textSecondary }]}>Unlock phase targets, daily coach warnings & analytics.</Text>
                    <TouchableOpacity
                      style={[styles.lockButton, { backgroundColor: colors.accent }]}
                      onPress={() => router.push('/auth/signup-success' as any)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.lockButtonText}>Unlock Elite Plan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Mock data underneath the lock */}
                <View style={styles.roadmapHeader}>
                  <View style={[styles.roadmapPhaseBadge, { backgroundColor: colors.accent + '20' }]}>
                    <Ionicons name="body-outline" size={16} color={colors.accent} />
                    <Text style={[styles.roadmapPhaseText, { color: colors.accent }]}>MOBILITY</Text>
                  </View>
                  <Text style={[styles.roadmapDay, { color: colors.textSecondary }]}>{t('dayNumber' as any) || 'Day'} 3</Text>
                </View>
                <Text style={[styles.roadmapTitle, { color: colors.text }]}>🧠 {t('recoveryRoadmap' as any) || 'Recovery Roadmap'}</Text>
                <Text style={[styles.roadmapCoach, { color: colors.textSecondary }]}>
                  Focus on gentle mobility routines to restore full range of motion.
                </Text>
                <View style={styles.roadmapMeta}>
                  <View style={styles.roadmapMetaItem}>
                    <Ionicons name="trending-up-outline" size={14} color="#22c55e" />
                    <Text style={[styles.roadmapMetaText, { color: colors.textSecondary }]}>Improving</Text>
                  </View>
                  <View style={styles.roadmapMetaItem}>
                    <Ionicons name="analytics-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.roadmapMetaText, { color: colors.textSecondary }]}>{t('avgPain' as any) || 'Avg Pain'}: 4.2/10</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.roadmapCTA, { backgroundColor: colors.accent }]} disabled={true}>
                  <Text style={styles.roadmapCTAText}>{t('startTodaysPlan' as any) || "Start Today's Plan"}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            );
          } else if (roadmap) {
            // 2. PREMIUM USER WITH ACTIVE ROADMAP: Render full interactive roadmap
            return (
              <View style={[styles.roadmapCard, { backgroundColor: colors.cardBackground, borderColor: roadmap.phaseColor + '40', overflow: 'hidden' }]}>
                <View style={styles.roadmapHeader}>
                  <View style={[styles.roadmapPhaseBadge, { backgroundColor: roadmap.phaseColor + '20' }]}>
                    <Ionicons name={roadmap.phaseIcon as any} size={16} color={roadmap.phaseColor} />
                    <Text style={[styles.roadmapPhaseText, { color: roadmap.phaseColor }]}>
                      {t(phaseLabelKey(roadmap.currentPhase) as any) || roadmap.currentPhase.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.roadmapDay, { color: colors.textSecondary }]}>
                    {t('dayNumber' as any) || 'Day'} {roadmap.dayNumber}
                  </Text>
                </View>
                <Text style={[styles.roadmapTitle, { color: colors.text }]}>
                  🧠 {t('recoveryRoadmap' as any) || 'Recovery Roadmap'}
                </Text>
                <Text style={[styles.roadmapCoach, { color: colors.textSecondary }]}>
                  {(() => {
                    const params = { ...roadmap.coachParams };
                    if (params.muscle) {
                      const mgKey = `mg${(params.muscle as string).replace(/\s/g, '').replace(/_/g, '')}` as any;
                      const trans = t(mgKey);
                      params.muscle = trans !== mgKey ? trans : formatLabel(params.muscle as string);
                    }
                    return t(roadmap.coachMessage as any, params as any) || `${formatLabel(roadmap.targetMuscle)} — ${formatLabel(roadmap.currentPhase)} phase. Pain trend: ${formatLabel(roadmap.painTrend)}.`;
                  })()}
                </Text>
                <View style={styles.roadmapMeta}>
                  <View style={styles.roadmapMetaItem}>
                    <Ionicons name="trending-up-outline" size={14} color={roadmap.painTrend === 'improving' ? '#22c55e' : roadmap.painTrend === 'worsening' ? '#ef4444' : colors.textSecondary} />
                    <Text style={[styles.roadmapMetaText, { color: colors.textSecondary }]}>
                      {t(`trend_${roadmap.painTrend}` as any) || formatLabel(roadmap.painTrend)}
                    </Text>
                  </View>
                  <View style={styles.roadmapMetaItem}>
                    <Ionicons name="analytics-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.roadmapMetaText, { color: colors.textSecondary }]}>
                      {t('avgPain' as any) || 'Avg Pain'}: {roadmap.avgPainLevel}/10
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.roadmapCTA, { backgroundColor: roadmap.phaseColor }]}
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/pain-assessment',
                      params: {
                        muscleId: roadmap.targetMuscle,
                        activityType: roadmap.suggestedActivityType,
                        timestamp: Date.now(),
                      },
                    });
                  }}
                >
                  <Text style={styles.roadmapCTAText}>
                    {t('startTodaysPlan' as any) || "Start Today's Plan"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            );
          } else {
            // 3. PREMIUM USER WITH NO ROADMAP YET: Render setup checklist/instructions
            return (
              <View style={[styles.roadmapCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, overflow: 'hidden' }]}>
                <View style={styles.roadmapHeader}>
                  <View style={[styles.roadmapPhaseBadge, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                    <Ionicons name="sparkles-outline" size={16} color={colors.accent} />
                    <Text style={[styles.roadmapPhaseText, { color: colors.accent }]}>SETUP ACTIVE</Text>
                  </View>
                </View>
                <Text style={[styles.roadmapTitle, { color: colors.text }]}>🧠 Personal AI Coach</Text>
                <Text style={[styles.roadmapCoach, { color: colors.textSecondary }]}>
                  {historyCount === 0 ? (
                    "Log 2 pain assessments to build your dynamic injury recovery roadmap and daily coach messages."
                  ) : historyCount === 1 ? (
                    "Log 1 more pain assessment to build your dynamic injury recovery roadmap and daily coach messages."
                  ) : (
                    "Log 1 more assessment for a previously tracked muscle group (e.g. Neck or Shoulder) to build your recovery plan."
                  )}
                </Text>
                <TouchableOpacity
                  style={[styles.roadmapCTA, { backgroundColor: colors.accent }]}
                  onPress={() => {
                    router.push('/(tabs)/find-relief' as any);
                  }}
                >
                  <Text style={styles.roadmapCTAText}>Log Pain Assessment</Text>
                  <Ionicons name="add" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            );
          }
        })()}

        {/* ─── Prevention Alerts ─────────────────────────────────────── */}
        {preventionAlerts.filter(a => !dismissedAlerts.includes(a.id)).length > 0 && (
          <View style={styles.preventionSection}>
            <Text style={[styles.preventionSectionTitle, { color: colors.textSecondary }]}>
              {(t('preventionAlerts' as any) || 'PREVENTION ALERTS').toUpperCase()}
            </Text>
            {preventionAlerts
              .filter(a => !dismissedAlerts.includes(a.id))
              .map(alert => (
                <View
                  key={alert.id}
                  style={[styles.preventionCard, { backgroundColor: colors.cardBackground, borderLeftColor: alert.color }]}
                >
                  <TouchableOpacity
                    style={styles.preventionDismiss}
                    onPress={() => setDismissedAlerts(prev => [...prev, alert.id])}
                  >
                    <Ionicons name="close" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <View style={styles.preventionContent}>
                    <View style={[styles.preventionIcon, { backgroundColor: alert.color + '20' }]}>
                      <Ionicons name={alert.icon as any} size={20} color={alert.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.preventionTitle, { color: colors.text }]}>
                        {t(alert.titleKey as any) !== alert.titleKey ? t(alert.titleKey as any) : formatLabel(alert.titleKey)}
                      </Text>
                      <Text style={[styles.preventionSubtitle, { color: colors.textSecondary }]} numberOfLines={2}>
                        {(() => {
                          const params = { ...alert.subtitleParams };
                          if (params.muscle) {
                            const mgKey = `mg${(params.muscle as string).replace(/\s/g, '').replace(/_/g, '')}` as any;
                            const trans = t(mgKey);
                            params.muscle = trans !== mgKey ? trans : formatLabel(params.muscle as string);
                          }
                          const translated = t(alert.subtitleKey as any, params as any);
                          return translated !== alert.subtitleKey ? translated : formatLabel(alert.subtitleKey);
                        })()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.preventionStartBtn, { borderColor: alert.color }]}
                    onPress={() => {
                      router.push({
                        pathname: '/(tabs)/pain-assessment',
                        params: {
                          muscleId: alert.targetMuscle,
                          activityType: alert.suggestedActivityType,
                          timestamp: Date.now(),
                        },
                      });
                    }}
                  >
                    <Text style={[styles.preventionStartText, { color: alert.color }]}>
                      {t('startNow' as any) || 'Start'}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color={alert.color} />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}

        {/* Quick Fix */}
        <View style={styles.quickFixHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('recentPlans')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
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
                targetName = transMg !== mgKey ? transMg : formatLabel(muscleGroup);
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

  // ── Recovery Roadmap Card ──────────────────────────────────────────
  roadmapCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  roadmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roadmapPhaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roadmapPhaseText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  roadmapDay: {
    fontSize: 12,
    fontWeight: '700',
  },
  roadmapTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  roadmapCoach: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  roadmapMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  roadmapMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roadmapMetaText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roadmapCTA: {
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  roadmapCTAText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // ── Prevention Alerts ──────────────────────────────────────────────
  preventionSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  preventionSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  preventionCard: {
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    gap: 12,
    position: 'relative',
  },
  preventionDismiss: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  preventionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 20,
  },
  preventionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preventionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  preventionSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
  },
  preventionStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
  },
  preventionStartText: {
    fontSize: 12,
    fontWeight: '800',
  },
  
  // ── Lock Overlay styles ───────────────────────────────────────────
  lockOverlay: {
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  lockContainer: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  lockIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  lockTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lockSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  lockButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lockButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
  },
});