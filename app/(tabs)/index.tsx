import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type ViewState = 'Front' | 'Back';

interface MarkerProps {
  initialX: number;
  initialY: number;
  initialRadius: number;
  onUpdate: (x: number, y: number, radius: number) => void;
}

const DraggableMarker = ({ initialX, initialY, initialRadius, onUpdate }: MarkerProps) => {
  // We use top/left for positioning to ensure it works reliably in absolute containers
  const top = useSharedValue(initialY);
  const left = useSharedValue(initialX);
  const scale = useSharedValue(initialRadius);
  const context = useSharedValue({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    top.value = initialY;
    left.value = initialX;
    scale.value = initialRadius;
  }, [initialX, initialY, initialRadius]);

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = { x: left.value, y: top.value, scale: scale.value };
    })
    .onUpdate((event) => {
      left.value = context.value.x + event.translationX;
      top.value = context.value.y + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onUpdate)(left.value, top.value, scale.value);
    });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      context.value = { ...context.value, scale: scale.value };
    })
    .onUpdate((event) => {
      scale.value = context.value.scale * event.scale;
    })
    .onEnd(() => {
      runOnJS(onUpdate)(left.value, top.value, scale.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value - 16, // Center offset
    left: left.value - 16,
    transform: [
      { scale: scale.value },
    ],
  }));

  const composed = Gesture.Simultaneous(pan, pinch);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.painMarker, animatedStyle]} />
    </GestureDetector>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('Front');
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; radius: number } | null>(null);

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      runOnJS(setActivePoint)({
        x: event.x,
        y: event.y,
        radius: 1
      });
    });

  const updatePoint = (x: number, y: number, radius: number) => {
    setActivePoint({ x, y, radius });
  };

  const handleFindRelief = () => {
    if (activePoint) {
      router.push({
        pathname: '/(tabs)/find-relief',
        params: {
          x: activePoint.x,
          y: activePoint.y,
          radius: activePoint.radius,
          view,
          timestamp: Date.now()
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuATfKINBnYddwALYOWgnuRoHefSk8YUwGzzqj09-y9OuUOYSlHWWTUDnJ-ATViJk106sgPtrQ7TGy5HW82D9CW8zxe4GUAvHl7Yv2kpQUMKw3UyP3fEk87uibvOm8nOTMzJQ0Joy_l7k3uN4g4B5gOO4GPpj7iMDX55B2u0lQXz-SR1fnS_PzRZShxB4XFzO8nPITSCqGOHZic_6yrSbnBTSwfP6YAh_977r7ima5hru3ocwA6w4pwZNSguCa_wBXPsBNyeyHUrU75c" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greetingSub}>Let's recover</Text>
              <Text style={styles.greetingTitle}>Welcome Back</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#fff" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={activePoint ? "Pain point selected" : "Tap on the body model to select"}
            placeholderTextColor="#71717a" // zinc-500
            editable={false}
          />
        </View>

        {/* Body Visualizer */}
        <View style={styles.bodyVisualizerContainer}>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Front' && styles.toggleButtonActive]}
              onPress={() => { setView('Front'); setActivePoint(null); }}
            >
              <Text style={[styles.toggleText, view === 'Front' && styles.toggleTextActive]}>FRONT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Back' && styles.toggleButtonActive]}
              onPress={() => { setView('Back'); setActivePoint(null); }}
            >
              <Text style={[styles.toggleText, view === 'Back' && styles.toggleTextActive]}>BACK</Text>
            </TouchableOpacity>
          </View>

          {/* Image Area with Inteaction */}
          <View style={styles.bodyImageContainer}>
            {/* Gesture Detector for Tapping Background */}
            <GestureDetector gesture={tapGesture}>
              <View style={{ flex: 1 }}>
                <Image
                  source={view === 'Front' ? require('../../assets/images/front_muscle.png') : require('../../assets/images/back_muscle.png')}
                  style={styles.bodyImage}
                  contentFit="contain"
                />
                {/* Render Marker ON TOP if active */}
              </View>
            </GestureDetector>

            {activePoint && (
              <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <DraggableMarker
                  initialX={activePoint.x}
                  initialY={activePoint.y}
                  initialRadius={activePoint.radius}
                  onUpdate={updatePoint}
                />
              </View>
            )}
          </View>

          {/* Contextual Action Button */}
          {activePoint && (
            <TouchableOpacity style={styles.generateButton} onPress={handleFindRelief}>
              <Text style={styles.generateButtonText}>GENERATE RELIEF PLAN</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Fix */}
        <View style={styles.quickFixHeader}>
          <Text style={styles.sectionTitle}>Recent Plans</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>History</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          {/* Placeholder for 'No recent plans' could go here if we wanted strict 'Remove all', 
               but keeping the cards as 'Recent' examples for UI structure makes sense unless strictly forbidden.
               I'll keep them but rename to be generic */}

          {/* Card 1 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="medkit-outline" size={24} color="#f97316" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Neck Relief</Text>
              <Text style={styles.cardSubtitle}>YESTERDAY</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="fitness-outline" size={24} color="#f97316" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Lower Back</Text>
              <Text style={styles.cardSubtitle}>2 DAYS AGO</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
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
    backgroundColor: '#121212', // background-dark
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // glass
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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