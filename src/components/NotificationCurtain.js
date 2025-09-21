import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-audio";
import { theme } from "../styles/theme";

export default function NotificationCurtain({
  visible,
  onClose,
  onExpand,
  alert,
}) {
  const [curtainHeight] = useState(new Animated.Value(0));
  const [dragY] = useState(new Animated.Value(0));
  const [catBounce] = useState(new Animated.Value(0));
  const lottieRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Reset animated values to initial state
      curtainHeight.setValue(0);
      dragY.setValue(0);
      catBounce.setValue(0);

      // Play notification sound
      playNotificationSound();

      // Show curtain with animation
      Animated.spring(curtainHeight, {
        toValue: 100, // Slightly taller for better cat display
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();

      // Start Lottie animation
      if (lottieRef.current) {
        lottieRef.current.play();
      }

      // Cat bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(catBounce, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(catBounce, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Hide curtain and stop animations
      Animated.spring(curtainHeight, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();

      catBounce.stopAnimation();

      // Stop Lottie animation
      if (lottieRef.current) {
        lottieRef.current.pause();
      }
    }
  }, [visible]);

  const playNotificationSound = async () => {
    try {
      // Try to play notification sound with expo-audio
      if (Audio?.Sound) {
        const sound = await Audio.Sound.createAsync({
          uri: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        });
        await sound.setVolumeAsync(0.5);
        await sound.playAsync();

        // Clean up sound after playing
        setTimeout(async () => {
          await sound.unloadAsync();
        }, 2000);
      } else {
        // Fallback to haptic feedback if Audio is not available
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {

      // Fallback to haptic feedback if sound fails
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Start gesture
    },
    onPanResponderMove: (evt, gestureState) => {
      dragY.setValue(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dy, vy, dx } = gestureState;

      try {
        if (dy > 50 || vy > 0.5) {
          // Pull down - expand to full screen
          if (onExpand) {
            onExpand();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        } else if (dy < -30 || vy < -0.5) {
          // Pull up - close curtain
          if (onClose) {
            onClose();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } else if (Math.abs(dx) > 100) {
          // Swipe left or right - dismiss notification
          if (onClose) {
            onClose();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      } catch (error) {
        console.warn("Pan responder error:", error);
      }

      // Reset drag position
      Animated.spring(dragY, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    },
  });

  if (!visible) return null;

  const catTranslateY = catBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const catScale = catBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: curtainHeight,
        backgroundColor: "#FFE4E1", // Light pink cat-themed background
        borderBottomLeftRadius: theme.borderRadius.lg,
        borderBottomRightRadius: theme.borderRadius.lg,
        ...theme.shadows.strong,
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          transform: [{ translateY: dragY }],
        }}
      >
        {/* Curtain Content */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.md,
            paddingTop: 45, // Account for status bar
            paddingBottom: theme.spacing.sm,
          }}
        >
          {/* Animated Cat Lottie */}
          <Animated.View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: theme.spacing.md,
              transform: [{ translateY: catTranslateY }, { scale: catScale }],
              overflow: "hidden",
              // Add a subtle shadow
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <LottieView
              ref={lottieRef}
              source={require("../../assets/images/catpaw.json")}
              style={{
                width: 70,
                height: 90,
              }}
              autoPlay={visible}
              loop={true}
              speed={1}
              onAnimationFinish={() => {

              }}
            />
          </Animated.View>

          {/* Alert Text with Cat Theme */}
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              if (onExpand) {
                onExpand();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: theme.fontSizes.md,
                  fontFamily: theme.fonts.semiBold,
                  color: "#8B4513", // Brown cat-like color
                  flex: 1,
                }}
              >
                🐾 {alert?.message || "Meow! Water Time!"} 🐾
              </Text>
            </View>
            <Text
              style={{
                fontSize: theme.fontSizes.sm,
                color: "#A0522D", // Lighter brown
                marginTop: 2,
              }}
            >
              Tap or pull down to expand
            </Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: theme.spacing.sm,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: theme.borderRadius.sm,
            }}
          >
            <Ionicons name="close" size={20} color="#8B4513" />
          </TouchableOpacity>
        </View>

        {/* Cat Paw Pull Indicator */}
        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            marginLeft: -20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>🐾</Text>
          <View
            style={{
              width: 20,
              height: 4,
              backgroundColor: "#DEB887", // Sandy brown
              borderRadius: 2,
              marginHorizontal: 4,
            }}
          />
          <Text style={{ fontSize: 16 }}>🐾</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
