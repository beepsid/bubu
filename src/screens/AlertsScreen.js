import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { theme } from "../styles/theme";
import { commonStyles } from "../styles/common";
import { useNavigationSystem } from "../utils/navigationDetection";
import {
  getAlerts,
  addAlert,
  updateAlert,
  deleteAlert,
  getAlertTypes,
} from "../services/alertsService";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigationSystem = useNavigationSystem();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertsData = await getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error loading alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert("Add New Alert 🔔", "Choose an alert type:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "💊 Medication Reminder",
        onPress: () => showAddAlertForm("medication"),
      },
      { text: "💧 Water Reminder", onPress: () => showAddAlertForm("water") },
      {
        text: "🏃‍♀️ Exercise Reminder",
        onPress: () => showAddAlertForm("exercise"),
      },
      { text: "😴 Sleep Reminder", onPress: () => showAddAlertForm("sleep") },
      { text: "🍎 Meal Reminder", onPress: () => showAddAlertForm("meal") },
      { text: "📝 Custom Alert", onPress: () => showAddAlertForm("custom") },
    ]);
  };

  const showAddAlertForm = (type) => {
    const alertTypes = getAlertTypes();
    const alertInfo = alertTypes[type];

    Alert.prompt(
      `Add ${alertInfo.name}`,
      `Enter details for your ${alertInfo.name.toLowerCase()}:`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Alert",
          onPress: (text) =>
            createAlert(type, text || alertInfo.defaultMessage),
        },
      ],
      "plain-text",
      alertInfo.defaultMessage
    );
  };

  const createAlert = async (type, message) => {
    try {
      const newAlert = await addAlert({
        type,
        message,
        time: "09:00", // Default time
        enabled: true,
        frequency: "daily",
      });

      setAlerts((prev) => [...prev, newAlert]);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        "Alert Added! ✅",
        `Your ${type} reminder has been created.`,
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error creating alert:", error);
      Alert.alert("Error", "Failed to create alert. Please try again.");
    }
  };

  const toggleAlert = async (alertId, enabled) => {
    try {
      await updateAlert(alertId, { enabled });
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, enabled } : alert
        )
      );

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Error toggling alert:", error);
    }
  };

  const handleDeleteAlert = (alertId, alertType) => {
    Alert.alert(
      "Delete Alert? 🗑️",
      `Are you sure you want to delete this ${alertType} reminder?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAlert(alertId);
              setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));

              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            } catch (error) {
              console.error("Error deleting alert:", error);
              Alert.alert("Error", "Failed to delete alert.");
            }
          },
        },
      ]
    );
  };

  const getAlertIcon = (type) => {
    const icons = {
      medication: "medical",
      water: "water",
      exercise: "fitness",
      sleep: "bed",
      meal: "restaurant",
      custom: "notifications",
    };
    return icons[type] || "notifications";
  };

  const getAlertColor = (type) => {
    const colors = {
      medication: "#FF6B6B",
      water: "#4ECDC4",
      exercise: "#45B7D1",
      sleep: "#96CEB4",
      meal: "#FECA57",
      custom: "#A55EEA",
    };
    return colors[type] || theme.colors.primary;
  };

  const AlertCard = ({ alert }) => (
    <View
      style={[
        commonStyles.card,
        {
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: getAlertColor(alert.type),
        },
      ]}
    >
      <View style={[commonStyles.row, { alignItems: "flex-start" }]}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: getAlertColor(alert.type) + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: theme.spacing.md,
          }}
        >
          <Ionicons
            name={getAlertIcon(alert.type)}
            size={20}
            color={getAlertColor(alert.type)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              commonStyles.bodyText,
              {
                fontFamily: theme.fonts.semiBold,
                marginBottom: theme.spacing.xs,
              },
            ]}
          >
            {alert.message}
          </Text>

          <Text
            style={[
              commonStyles.bodyText,
              {
                fontSize: theme.fontSizes.sm,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.sm,
              },
            ]}
          >
            {alert.frequency} at {alert.time}
          </Text>

          <View style={[commonStyles.row, { justifyContent: "space-between" }]}>
            <View style={[commonStyles.row, { alignItems: "center" }]}>
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    fontSize: theme.fontSizes.sm,
                    marginRight: theme.spacing.sm,
                  },
                ]}
              >
                {alert.enabled ? "Active" : "Paused"}
              </Text>
              <Switch
                value={alert.enabled}
                onValueChange={(enabled) => toggleAlert(alert.id, enabled)}
                trackColor={{
                  false: theme.colors.textLight,
                  true: getAlertColor(alert.type) + "40",
                }}
                thumbColor={
                  alert.enabled
                    ? getAlertColor(alert.type)
                    : theme.colors.textSecondary
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteAlert(alert.id, alert.type)}
              style={{
                padding: theme.spacing.xs,
              }}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={commonStyles.centerContainer}>
          <Ionicons
            name="notifications-outline"
            size={48}
            color={theme.colors.primary}
          />
          <Text
            style={[commonStyles.subtitle, { marginTop: theme.spacing.md }]}
          >
            Loading your alerts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={commonStyles.container}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: navigationSystem.getBottomPadding(80),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              alignItems: "center",
              padding: theme.spacing.md,
              marginBottom: theme.spacing.lg,
            }}
          >
            <View
              style={[
                commonStyles.heartContainer,
                { marginBottom: theme.spacing.md },
              ]}
            >
              <Ionicons
                name="notifications"
                size={32}
                color={theme.colors.iconContrast}
              />
            </View>
            <Text
              style={[commonStyles.title, { marginBottom: theme.spacing.sm }]}
            >
              Smart Alerts 🔔
            </Text>
            <Text style={[commonStyles.scriptText, { textAlign: "center" }]}>
              "Never miss what matters to you"
            </Text>
          </View>

          {/* Quick Stats */}
          <View
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.romantic,
                alignItems: "center",
                marginHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.lg,
              },
            ]}
          >
            <View style={[commonStyles.row, { width: "100%" }]}>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontFamily: theme.fonts.bold,
                      color: theme.colors.iconContrast,
                    },
                  ]}
                >
                  {alerts.length}
                </Text>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.textSecondary,
                    },
                  ]}
                >
                  Total Alerts
                </Text>
              </View>

              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontFamily: theme.fonts.bold,
                      color: theme.colors.iconContrast,
                    },
                  ]}
                >
                  {alerts.filter((a) => a.enabled).length}
                </Text>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.textSecondary,
                    },
                  ]}
                >
                  Active
                </Text>
              </View>

              <View style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontFamily: theme.fonts.bold,
                      color: theme.colors.iconContrast,
                    },
                  ]}
                >
                  {new Set(alerts.map((a) => a.type)).size}
                </Text>
                <Text
                  style={[
                    commonStyles.bodyText,
                    {
                      fontSize: theme.fontSizes.sm,
                      color: theme.colors.textSecondary,
                    },
                  ]}
                >
                  Types
                </Text>
              </View>
            </View>
          </View>

          {/* Add Alert Button */}
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                marginHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.lg,
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={handleAddAlert}
          >
            <Ionicons name="add" size={20} color={theme.colors.surface} />
            <Text
              style={[
                commonStyles.buttonText,
                { marginLeft: theme.spacing.sm },
              ]}
            >
              Add New Alert
            </Text>
          </TouchableOpacity>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <View
              style={[
                commonStyles.card,
                {
                  alignItems: "center",
                  marginHorizontal: theme.spacing.md,
                  backgroundColor: theme.colors.secondary,
                },
              ]}
            >
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  commonStyles.subtitle,
                  {
                    marginTop: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                No Alerts Yet
              </Text>
              <Text
                style={[
                  commonStyles.bodyText,
                  {
                    textAlign: "center",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Tap "Add New Alert" to create your first reminder
              </Text>
            </View>
          ) : (
            alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          )}

          {/* Instructions */}
          <View
            style={[
              commonStyles.card,
              {
                backgroundColor: theme.colors.secondary,
                marginHorizontal: theme.spacing.md,
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text
              style={[
                commonStyles.bodyText,
                {
                  marginTop: theme.spacing.sm,
                  textAlign: "center",
                  fontFamily: theme.fonts.medium,
                },
              ]}
            >
              💡 Create personalized reminders for medications, water intake,
              exercise, sleep, and more! Toggle alerts on/off anytime. 💕
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
