import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { theme } from "../styles/theme";
import { commonStyles } from "../styles/common";
import {
  getSlapCount,
  testGoogleSheetsConnection,
} from "../services/googleSheets";

export default function SlapCounterScreen({ navigation }) {
  const [slapCount, setSlapCount] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Animations
  const countAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSlapCount();
    checkOnlineStatus();

    // Listen for navigation focus to refresh data when returning to counter
    const unsubscribe = navigation.addListener('focus', () => {
      loadSlapCount();
      checkOnlineStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSlapCount = async () => {
    try {
      setErrorMessage(null);
      const count = await getSlapCount();
      setSlapCount(count);

    } catch (error) {
      console.error("❌ Error loading slap count:", error);
      setErrorMessage(`Failed to load count: ${error.message}`);
      setSlapCount(0);
    }
  };

  const checkOnlineStatus = async () => {
    const online = await testGoogleSheetsConnection();
    setIsOnline(online);
  };

  const handleRefresh = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setErrorMessage(null);

      const count = await getSlapCount();
      setSlapCount(count);

      await checkOnlineStatus();
      setLastSync(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      setErrorMessage(`Refresh failed: ${error.message}`);
      Alert.alert("Error", `Failed to refresh count: ${error.message}`);
    }
  };





  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.romantic]}
        style={commonStyles.container}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: 120, // Extra space for bottom navigation
            minHeight: '100%'
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: theme.spacing.xl 
          }}>
            <Text style={[
              commonStyles.title,
              {
                fontSize: theme.fontSizes.xl,
                color: theme.colors.text,
              },
            ]}>
              Slap Counter
            </Text>

            <View style={[
              commonStyles.card,
              { padding: theme.spacing.sm }
            ]}>
              <View style={commonStyles.row}>
                <Ionicons
                  name={isOnline ? "cloud-done" : "cloud-offline"}
                  size={16}
                  color={isOnline ? theme.colors.success : theme.colors.error}
                />
                <Text style={[
                  commonStyles.bodyText,
                  {
                    fontSize: theme.fontSizes.xs,
                    marginLeft: theme.spacing.xs,
                  },
                ]}>
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
              {lastSync && (
                <Text style={[
                  commonStyles.bodyText,
                  {
                    fontSize: theme.fontSizes.xs,
                    color: theme.colors.textSecondary,
                  },
                ]}>
                  {lastSync}
                </Text>
              )}
            </View>
          </View>

          {/* Main Counter Display */}
          <View style={{ alignItems: "center", marginBottom: theme.spacing.xl }}>
            <View style={[
              commonStyles.heartContainer,
              {
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: theme.spacing.lg,
              },
            ]}>
              <Ionicons name="heart" size={60} color={theme.colors.heart} />
            </View>

            <Text style={[
              commonStyles.subtitle,
              {
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
                fontSize: theme.fontSizes.md,
                textAlign: 'center',
              },
            ]}>
              Total Slaps Received
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
                  textAlign: 'center',
                },
              ]}>
                {slapCount}
              </Text>
            </Animated.View>
          </View>

          {/* Romantic Message */}
          <View style={[
            commonStyles.romanticCard,
            {
              alignItems: "center",
              marginBottom: theme.spacing.lg,
            },
          ]}>
            <Ionicons
              name="heart"
              size={24}
              color={theme.colors.iconContrast}
            />
            <Text style={[
              commonStyles.scriptText,
              {
                marginTop: theme.spacing.sm,
                textAlign: "center",
                fontSize: theme.fontSizes.sm,
                lineHeight: 20,
              },
            ]}>
              "Every slap is a loving reminder from your boyfriend when you're being too hard on yourself 💕"
            </Text>
            <Text style={[
              commonStyles.bodyText,
              {
                marginTop: theme.spacing.sm,
                textAlign: "center",
                fontSize: theme.fontSizes.xs,
                color: theme.colors.textSecondary,
                fontStyle: 'italic',
              },
            ]}>
              Only he can update this counter - you just get to see how much he cares! 🥰
            </Text>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <View style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.error + "20",
                borderColor: theme.colors.error,
                borderWidth: 1,
                marginBottom: theme.spacing.lg,
              },
            ]}>
              <Text style={[
                commonStyles.bodyText,
                {
                  color: theme.colors.error,
                  textAlign: "center",
                  fontSize: theme.fontSizes.sm,
                },
              ]}>
                {errorMessage}
              </Text>
            </View>
          )}



          {/* Refresh Button */}
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                backgroundColor: isOnline ? theme.colors.primary : theme.colors.secondary,
                marginBottom: theme.spacing.md,
              },
            ]}
            onPress={handleRefresh}
          >
            <View style={commonStyles.row}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={[
                commonStyles.buttonText,
                { marginLeft: theme.spacing.sm, color: "white" },
              ]}>
                Refresh Count
              </Text>
            </View>
          </TouchableOpacity>


        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
