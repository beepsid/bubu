import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { theme } from '../styles/theme';
import { commonStyles } from '../styles/common';
import { getSlapCount, incrementSlapCount } from '../services/storage';
import { incrementAndSyncSlapCount, syncSlapCount, testGoogleSheetsConnection } from '../services/googleSheets';

const { width, height } = Dimensions.get('window');

export default function SlapCounterScreen() {
  const [slapCount, setSlapCount] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [secretTapCount, setSecretTapCount] = useState(0);
  
  // Animations
  const countAnimation = useRef(new Animated.Value(1)).current;
  const heartAnimations = useRef([]).current;
  const [floatingHearts, setFloatingHearts] = useState([]);

  useEffect(() => {
    loadSlapCount();
    checkOnlineStatus();
    
    // Reset secret tap count after 3 seconds
    const timer = setTimeout(() => {
      setSecretTapCount(0);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [secretTapCount]);

  const loadSlapCount = async () => {
    try {
      const count = await getSlapCount();
      setSlapCount(count);
      
      // Try to sync with Google Sheets
      const syncedCount = await syncSlapCount();
      if (syncedCount !== count) {
        setSlapCount(syncedCount);
      }
    } catch (error) {
      console.error('Error loading slap count:', error);
    }
  };

  const checkOnlineStatus = async () => {
    const online = await testGoogleSheetsConnection();
    setIsOnline(online);
  };

  const handleSecretTap = async () => {
    const newTapCount = secretTapCount + 1;
    setSecretTapCount(newTapCount);
    
    // Secret sequence: 5 taps on the heart
    if (newTapCount === 5) {
      Alert.alert(
        "Secret Admin Mode 🔐",
        "You found the secret! This is where you can increment the slap counter.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add Slap +1", onPress: handleSecretIncrement },
        ]
      );
      setSecretTapCount(0);
    }
  };

  const handleSecretIncrement = async () => {
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Increment count
      const newCount = await incrementAndSyncSlapCount();
      setSlapCount(newCount);
      
      // Animate the counter
      animateCounterIncrement();
      
      // Create floating hearts
      createFloatingHearts();
      
      // Check sync status
      checkOnlineStatus();
      
    } catch (error) {
      console.error('Error incrementing slap count:', error);
      Alert.alert('Error', 'Failed to increment slap count. Please try again.');
    }
  };

  const animateCounterIncrement = () => {
    Animated.sequence([
      Animated.timing(countAnimation, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(countAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const createFloatingHearts = () => {
    const newHearts = [];
    for (let i = 0; i < 5; i++) {
      const heartId = Date.now() + i;
      const startX = Math.random() * (width - 50);
      const animatedValue = new Animated.Value(0);
      
      newHearts.push({
        id: heartId,
        x: startX,
        animation: animatedValue,
      });
      
      // Animate heart floating up
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // Remove heart after animation
        setFloatingHearts(prev => prev.filter(heart => heart.id !== heartId));
      });
    }
    
    setFloatingHearts(prev => [...prev, ...newHearts]);
  };

  const handleSyncPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const syncedCount = await syncSlapCount();
      setSlapCount(syncedCount);
      checkOnlineStatus();
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync with Google Sheets. Check your internet connection.');
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.romantic]}
      style={commonStyles.container}
    >
      <View style={commonStyles.centerContainer}>
        
        {/* Sync Status */}
        <View style={[commonStyles.card, { position: 'absolute', top: 50, right: 20, padding: theme.spacing.sm }]}>
          <View style={commonStyles.row}>
            <Ionicons 
              name={isOnline ? "cloud-done" : "cloud-offline"} 
              size={16} 
              color={isOnline ? theme.colors.success : theme.colors.error} 
            />
            <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.xs, marginLeft: theme.spacing.xs }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          {lastSync && (
            <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.xs, color: theme.colors.textSecondary }]}>
              Synced: {lastSync}
            </Text>
          )}
        </View>

        {/* Main Counter Display */}
        <TouchableOpacity
          onPress={handleSecretTap}
          activeOpacity={0.8}
          style={{ alignItems: 'center' }}
        >
          <View style={[commonStyles.heartContainer, { width: 120, height: 120, borderRadius: 60, marginBottom: theme.spacing.lg }]}>
            <Ionicons name="heart" size={60} color={theme.colors.heart} />
          </View>
          
          <Text style={[commonStyles.subtitle, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>
            Slaps Received
          </Text>
          
          <Animated.View style={{ transform: [{ scale: countAnimation }] }}>
            <Text style={[
              commonStyles.title, 
              { 
                fontSize: 80, 
                color: theme.colors.heart,
                fontFamily: theme.fonts.elegantBold,
                textShadowColor: theme.colors.shadow,
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }
            ]}>
              {slapCount}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Romantic Message */}
        <View style={[commonStyles.romanticCard, { marginTop: theme.spacing.xl, alignItems: 'center' }]}>
          <Ionicons name="hand-left" size={32} color={theme.colors.primary} />
          <Text style={[commonStyles.scriptText, { marginTop: theme.spacing.md, textAlign: 'center' }]}>
            "Each playful slap is a reminder of our silly, loving moments together 💕"
          </Text>
        </View>

        {/* Fun Stats */}
        <View style={[commonStyles.card, { marginTop: theme.spacing.lg, alignItems: 'center' }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: theme.spacing.md }]}>
            Fun Stats 📊
          </Text>
          
          <View style={commonStyles.row}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.primary }]}>
                {Math.floor(slapCount / 7)}
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Weeks of Slaps
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.primary }]}>
                {slapCount * 2}
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Kisses Owed
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.primary }]}>
                ∞
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Love Level
              </Text>
            </View>
          </View>
        </View>

        {/* Sync Button */}
        <TouchableOpacity
          style={[
            commonStyles.button,
            { 
              marginTop: theme.spacing.xl,
              backgroundColor: isOnline ? theme.colors.success : theme.colors.secondary,
            }
          ]}
          onPress={handleSyncPress}
        >
          <View style={commonStyles.row}>
            <Ionicons 
              name={isOnline ? "sync" : "sync-outline"} 
              size={20} 
              color={theme.colors.text} 
            />
            <Text style={[commonStyles.buttonText, { marginLeft: theme.spacing.sm }]}>
              {isOnline ? 'Sync Now' : 'Try Sync'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Secret Tap Indicator */}
        {secretTapCount > 0 && (
          <View style={{ position: 'absolute', bottom: 100, alignItems: 'center' }}>
            <Text style={[commonStyles.bodyText, { color: theme.colors.textLight, fontSize: theme.fontSizes.xs }]}>
              {secretTapCount}/5 taps
            </Text>
          </View>
        )}

      </View>

      {/* Floating Hearts */}
      {floatingHearts.map((heart) => (
        <Animated.View
          key={heart.id}
          style={{
            position: 'absolute',
            left: heart.x,
            bottom: height / 2,
            transform: [
              {
                translateY: heart.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -200],
                }),
              },
              {
                scale: heart.animation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.2, 0],
                }),
              },
            ],
            opacity: heart.animation.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            }),
          }}
        >
          <Ionicons name="heart" size={24} color={theme.colors.heart} />
        </Animated.View>
      ))}
    </LinearGradient>
  );
}