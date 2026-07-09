// src/components/DeviceFrame.js
import React from 'react';
import { View, StyleSheet, Text, Platform, SafeAreaView } from 'react-native';
import { COLORS } from '../theme/theme';

export default function DeviceFrame({ children, activeTab, onTabSelect }) {
  if (Platform.OS !== 'web') {
    // On native mobile devices, just render the child content with a safe area view
    return (
      <View style={styles.nativeContainer}>
        {children}
      </View>
    );
  }

  // On Web, render a gorgeous realistic smartphone frame
  return (
    <View style={styles.webWrapper}>
      {/* Visual Ambient Background Pattern */}
      <View style={styles.ambientCircle1} />
      <View style={styles.ambientCircle2} />
      
      {/* Title Header for Web Browser */}
      <View style={styles.webHeader}>
        <Text style={styles.webBrand}>BananaStay</Text>
        <Text style={styles.webSubtitle}>PG & Rent Manager - Interactive UI/UX Preview</Text>
        <Text style={styles.webInstruction}>Scan the Expo QR code in your terminal/browser to preview on mobile, or interact with this simulator.</Text>
      </View>

      {/* The Smartphone Frame */}
      <View style={styles.phoneContainer}>
        {/* Notch / Speaker bar */}
        <View style={styles.notchContainer}>
          <View style={styles.speaker} />
          <View style={styles.camera} />
        </View>

        {/* Side Buttons (Visual Only) */}
        <View style={styles.volumeUp} />
        <View style={styles.volumeDown} />
        <View style={styles.powerButton} />

        {/* Screen Content Wrapper */}
        <View style={styles.screenContent}>
          {children}
        </View>

        {/* Virtual Home Indicator Bar */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webWrapper: {
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    fontFamily: 'system-ui, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  ambientCircle1: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(255, 199, 44, 0.05)',
    top: -200,
    left: -200,
    zIndex: 0,
  },
  ambientCircle2: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(59, 130, 246, 0.03)',
    bottom: -150,
    right: -150,
    zIndex: 0,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
    paddingHorizontal: 20,
  },
  webBrand: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  webSubtitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  webInstruction: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 500,
    opacity: 0.8,
  },
  phoneContainer: {
    width: 390,
    height: 800,
    backgroundColor: COLORS.background,
    borderRadius: 50,
    borderWidth: 12,
    borderColor: '#1E293B',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 36,
    elevation: 20,
    zIndex: 1,
    overflow: 'hidden',
  },
  notchContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    height: 28,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speaker: {
    width: 50,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    marginRight: 10,
  },
  camera: {
    width: 10,
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  volumeUp: {
    position: 'absolute',
    left: -16,
    top: 140,
    width: 4,
    height: 50,
    backgroundColor: '#334155',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  volumeDown: {
    position: 'absolute',
    left: -16,
    top: 200,
    width: 4,
    height: 50,
    backgroundColor: '#334155',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  powerButton: {
    position: 'absolute',
    right: -16,
    top: 160,
    width: 4,
    height: 70,
    backgroundColor: '#334155',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  screenContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 30, // Clearance for notch
    paddingBottom: 20, // Clearance for home indicator
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 5,
    backgroundColor: '#334155',
    borderRadius: 10,
    zIndex: 999,
  },
});
