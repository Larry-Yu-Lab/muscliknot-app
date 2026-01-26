import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [view, setView] = useState('Front'); // 'Front' or 'Back'

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuATfKINBnYddwALYOWgnuRoHefSk8YUwGzzqj09-y9OuUOYSlHWWTUDnJ-ATViJk106sgPtrQ7TGy5HW82D9CW8zxe4GUAvHl7Yv2kpQUMKw8UyP3fEk87uibvOm8nOTMzJQ0Joy_l7k3uN4g4B5gOO4GPpj7iMDX55B2u0lQXz-SR1fnS_PzRZShxB4XFzO8nPITSCqGOHZic_6yrSbnBTSwfP6YAh_977r7ima5hru3ocwA6w4pwZNSguCa_wBXPsBNyeyHUrU75c" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greetingSub}>Good morning</Text>
              <Text style={styles.greetingTitle}>Hello, Alex</Text>
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
            placeholder="Where does it hurt?"
            placeholderTextColor="#71717a" // zinc-500
          />
        </View>

        {/* Body Visualizer */}
        <View style={styles.bodyVisualizerContainer}>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Front' && styles.toggleButtonActive]}
              onPress={() => setView('Front')}
            >
              <Text style={[styles.toggleText, view === 'Front' && styles.toggleTextActive]}>FRONT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, view === 'Back' && styles.toggleButtonActive]}
              onPress={() => setView('Back')}
            >
              <Text style={[styles.toggleText, view === 'Back' && styles.toggleTextActive]}>BACK</Text>
            </TouchableOpacity>
          </View>

          {/* Image Area */}
          <View style={styles.bodyImageContainer}>
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAk-UF0WSacioRYvkrHxCkJL-itbNieGbN_sUZWqd8COBT2aFXZ2FTJ4RHOjeHh7wpcO-oe5PbVLdymAojMLyFS2SxRVy73EJSBHregjYg1bq4hR3TfI-9LY4G6i42BbeKFA5NZDCNM5gVLhD-UG91ssp_wHn4j1d90C2j9Z971SRNvFUyFStILENckA-pgVPwEiRcqP2DCi0P1De74gFMy8kIpx4N1iQ5qCB8d64DLPVAye8E4jPoVEYYAbq0mURzd6545cvSQF4B" }}
              style={styles.bodyImage}
              contentFit="contain"
            />
            {/* Pulse Dots (Absolute) matching HTML positions approx */}
            <View style={[styles.pulseDot, { top: '42%', left: '50%', marginLeft: -8 }]} />
            <View style={[styles.staticDot, { top: '42%', left: '34%' }]} />
            <View style={[styles.staticDot, { top: '48%', right: '40%' }]} />
          </View>
        </View>

        {/* Quick Fix */}
        <View style={styles.quickFixHeader}>
          <Text style={styles.sectionTitle}>Quick Fix</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          {/* Card 1 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="medkit-outline" size={24} color="#f97316" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Stiff Neck</Text>
              <Text style={styles.cardSubtitle}>3 MIN ROUTINE</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="hand-left-outline" size={24} color="#f97316" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Lower Back Pain</Text>
              <Text style={styles.cardSubtitle}>5 MIN RELIEF</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
            </View>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name="body-outline" size={24} color="#f97316" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Shoulder Tension</Text>
              <Text style={styles.cardSubtitle}>4 MIN FLOW</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // glass
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.05)', // primary/5
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
    aspectRatio: 0.8, // 4/5
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
});