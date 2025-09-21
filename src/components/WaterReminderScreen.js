import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { theme } from "../styles/theme";
import { commonStyles } from "../styles/common";
import DrinkingAnimation from "./DrinkingAnimation";

const { height: screenHeight } = Dimensions.get("window");

export default function WaterReminderScreen({
  visible,
  onClose,
  onDrinkWater,
  alert,
}) {
  const [catAnimation] = useState(new Animated.Value(0));
  const [waterDrops] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const [glassAnimation] = useState(new Animated.Value(1));
  const [showDrinkingAnimation, setShowDrinkingAnimation] = useState(false);
  const mainCatRef = useRef(null);
  const bottomCatRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Reset all animations to initial state
      catAnimation.setValue(0);
      waterDrops.forEach((drop) => drop.setValue(0));
      glassAnimation.setValue(1);
      setShowDrinkingAnimation(false);

      startAnimations();

      // Start Lottie animations
      if (mainCatRef.current) {
        mainCatRef.current.play();
      }
      if (bottomCatRef.current) {
        bottomCatRef.current.play();
      }
    } else {
      // Stop all animations when not visible
      catAnimation.stopAnimation();
      waterDrops.forEach((drop) => drop.stopAnimation());
      glassAnimation.stopAnimation();

      // Stop Lottie animations
      if (mainCatRef.current) {
        mainCatRef.current.pause();
      }
      if (bottomCatRef.current) {
        bottomCatRef.current.pause();
      }
    }
  }, [visible]);

  const startAnimations = () => {
    // Cat bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(catAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(catAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Water drops animation
    const animateDrops = () => {
      waterDrops.forEach((drop, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 300),
            Animated.timing(drop, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(drop, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateDrops();

    // Glass pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glassAnimation, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glassAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleDrinkWater = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowDrinkingAnimation(true);
  };

  const handleDrinkingComplete = () => {
    setShowDrinkingAnimation(false);
    onDrinkWater();
    onClose();
  };

  const handleRemindLater = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const catTranslateY = catAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <LinearGradient
          colors={["#E3F2FD", "#BBDEFB", "#90CAF9"]} // Light blue gradient
          style={{ flex: 1 }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 50,
              right: theme.spacing.md,
              zIndex: 10,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surface + "80",
              borderRadius: theme.borderRadius.round,
            }}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {/* Water Drops Animation */}
          {waterDrops.map((drop, index) => (
            <Animated.View
              key={index}
              style={{
                position: "absolute",
                left: 50 + index * 100,
                top: 100,
                opacity: drop,
                transform: [
                  {
                    translateY: drop.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, screenHeight - 200],
                    }),
                  },
                ],
              }}
            >
              <Text style={{ fontSize: 30, color: "#2196F3" }}>💧</Text>
            </Animated.View>
          ))}

          {/* Main Content */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: theme.spacing.lg,
            }}
          >
            {/* Cat Animation */}
            <Animated.View
              style={{
                transform: [{ translateY: catTranslateY }],
                marginBottom: theme.spacing.xl,
              }}
            >
              <LottieView
                ref={mainCatRef}
                source={require("../../assets/images/catlook.json")}
                style={{
                  width: 140,
                  height: 200,
                  alignSelf: "center",
                }}
                autoPlay={visible}
                loop={true}
                speed={1}
              />
            </Animated.View>

            {/* Message */}
            <Text
              style={[
                commonStyles.title,
                {
                  color: theme.colors.text,
                  textAlign: "center",
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              Drink Water! 💧
            </Text>

            <Text
              style={[
                commonStyles.scriptText,
                {
                  fontSize: theme.fontSizes.lg,
                  color: theme.colors.iconContrast,
                  textAlign: "center",
                  marginBottom: theme.spacing.xl,
                },
              ]}
            >
              {alert?.message || "Time to hydrate, beautiful! 🌊"}
            </Text>

            {/* Animated Water Glass */}
            <Animated.View
              style={{
                transform: [{ scale: glassAnimation }],
                marginBottom: theme.spacing.xl,
              }}
            >
              <Text style={{ fontSize: 80, textAlign: "center" }}>🥤</Text>
            </Animated.View>

            {/* Cat Message */}
            <View
              style={[
                commonStyles.card,
                {
                  backgroundColor: theme.colors.surface + "90",
                  alignItems: "center",
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    textAlign: "center",
                    fontFamily: theme.fonts.medium,
                    color: theme.colors.text,
                  },
                ]}
              >
                🐾 "Meow! Even cats know water is important! Stay hydrated like
                a good human!" 🐾
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ width: "85%", alignSelf: "center" }}>
              <TouchableOpacity
                style={[
                  commonStyles.button,
                  {
                    backgroundColor: theme.colors.iconContrast,
                    marginBottom: theme.spacing.sm,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                  },
                ]}
                onPress={handleDrinkWater}
              >
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={theme.colors.surface}
                />
                <Text
                  style={[
                    commonStyles.buttonText,
                    {
                      color: theme.colors.surface,
                      marginLeft: theme.spacing.xs,
                      fontSize: theme.fontSizes.sm,
                    },
                  ]}
                >
                  Drank Water! 💧
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  commonStyles.button,
                  {
                    backgroundColor: theme.colors.textLight,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                  },
                ]}
                onPress={handleRemindLater}
              >
                <Ionicons name="time" size={16} color={theme.colors.text} />
                <Text
                  style={[
                    commonStyles.buttonText,
                    {
                      marginLeft: theme.spacing.xs,
                      fontSize: theme.fontSizes.xs,
                    },
                  ]}
                >
                  Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom cat removed as requested */}

          {/* Drinking Animation Overlay */}
          <DrinkingAnimation
            visible={showDrinkingAnimation}
            onComplete={handleDrinkingComplete}
          />
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}
