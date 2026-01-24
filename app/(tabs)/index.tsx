import { Ionicons } from '@expo/vector-icons'; // Built-in icons for the "intricate" look
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandText}>MUSCLIKNOT</Text>
          <Text style={styles.welcomeText}>Hello, Founder</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color="#ff9500" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Intricate Muscle Map Container */}
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Body Analysis</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.dot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.mapPlaceholder}>
            <Ionicons name="body-outline" size={120} color="rgba(255, 149, 0, 0.2)" />
            <Text style={styles.placeholderText}>3D Muscle Model Rendering...</Text>
          </View>
        </View>

        {/* Quick Select Buttons */}
        <Text style={styles.sectionTitle}>Focus Areas</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="fitness" size={24} color="#ff9500" />
            <Text style={styles.gridText}>Upper Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="walk" size={24} color="#ff9500" />
            <Text style={styles.gridText}>Lower Body</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Your Deep Charcoal
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  brandText: {
    color: '#ff9500', // Your Orange
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  mapContainer: {
    backgroundColor: '#161616',
    borderRadius: 30,
    height: 400,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4444',
    marginRight: 6,
  },
  liveText: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#444',
    marginTop: 10,
    fontSize: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 30,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    gap: 15,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#161616',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ff9500',
  },
  gridText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
  },
});