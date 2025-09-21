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
  createDefaultWaterAlerts,
} from "../services/alertsService";
import { notificationManager } from "../services/notificationManager";
import { developmentNotificationService } from "../services/developmentNotificationService";
import Constants from 'expo-constants';
import ModernAlertModal from "../components/ModernAlertModal";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState("custom");
  const [editingAlert, setEditingAlert] = useState(null);
  const navigationSystem = useNavigationSystem();

  useEffect(() => {
    loadAlerts();
    initializeBackgroundService();
  }, []);

  const initializeBackgroundService = async () => {

    await developmentNotificationService.initialize();
    const alertsData = await getAlerts();
    await developmentNotificationService.scheduleAllAlerts(alertsData);
  };

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

  const handleSetupWaterReminders = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Setup Water Reminders 💧",
      "This will create 8 daily water reminders to help you drink 2L per day. Any existing water reminders will be replaced.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Setup Reminders",
          onPress: async () => {
            try {
              await createDefaultWaterAlerts();
              await loadAlerts(); // Refresh the list
              
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              
              Alert.alert(
                "Water Reminders Created! 💧",
                "8 daily water reminders have been set up to help you stay hydrated throughout the day.",
                [{ text: "Great!", style: "default" }]
              );
            } catch (error) {
              console.error("Error creating water reminders:", error);
              Alert.alert("Error", "Failed to create water reminders. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleTestNotification = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const testAlert = {
      id: 999,
      type: 'water',
      message: 'Test notification! 💧 This is how alerts will appear in SDK 54.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      enabled: true
    };
    
    // Check if we can use expo-notifications (SDK 54) or fallback to development service
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      developmentNotificationService.simulateNotification(testAlert);
    } else {
      // In standalone app, we can use expo-notifications
      developmentNotificationService.simulateNotification(testAlert);
    }
  };

  const handleAddAlert = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Alert.alert("Add New Alert 🔔", "Choose an alert type:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "💊 Medication Reminder",
        onPress: () => openAlertModal("medication"),
      },
      { text: "💧 Water Reminder", onPress: () => openAlertModal("water") },
      {
        text: "🏃‍♀️ Exercise Reminder",
        onPress: () => openAlertModal("exercise"),
      },
      { text: "😴 Sleep Reminder", onPress: () => openAlertModal("sleep") },
      { text: "🍎 Meal Reminder", onPress: () => openAlertModal("meal") },
      { text: "📝 Custom Alert", onPress: () => openAlertModal("custom") },
    ]);
  };

  const openAlertModal = (type, alert = null) => {
    setSelectedAlertType(type);
    setEditingAlert(alert);
    setShowAlertModal(true);
  };

  const handleSaveAlert = async (alertData) => {
    try {
      let savedAlert;
      
      if (alertData.id) {
        // Update existing alert
        savedAlert = await updateAlert(alertData.id, alertData);
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertData.id ? savedAlert : alert
          )
        );
      } else {
        // Create new alert
        savedAlert = await addAlert(alertData);
        setAlerts((prev) => [...prev, savedAlert]);
      }

      // Schedule the notification
      if (savedAlert.enabled) {
        await developmentNotificationService.scheduleAlert(savedAlert);
      }

      setShowAlertModal(false);
      setEditingAlert(null);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        alertData.id ? "Alert Updated! ✅" : "Alert Added! ✅",
        `Your ${alertData.type} reminder has been ${alertData.id ? 'updated' : 'created'}.`,
        [{ text: "OK", style: "default" }]
      );
    } catch (error) {
      console.error("Error saving alert:", error);
      Alert.alert("Error", "Failed to save alert. Please try again.");
    }
  };

  const toggleAlert = async (alertId, enabled) => {
    try {
      const updatedAlert = await updateAlert(alertId, { enabled });
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, enabled } : alert
        )
      );

      // Schedule or cancel notification based on enabled state
      if (enabled) {
        await developmentNotificationService.scheduleAlert(updatedAlert);
      } else {
        await developmentNotificationService.cancelAlert(alertId);
      }

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
              await developmentNotificationService.cancelAlert(alertId);
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
    <TouchableOpacity
      style={[
        commonStyles.card,
        {
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: getAlertColor(alert.type),
        },
      ]}
      onPress={() => openAlertModal(alert.type, alert)}
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

            <View style={[commonStyles.row, { alignItems: "center" }]}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  openAlertModal(alert.type, alert);
                }}
                style={{
                  padding: theme.spacing.xs,
                  marginRight: theme.spacing.xs,
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteAlert(alert.id, alert.type);
                }}
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
    </TouchableOpacity>
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

          {/* Quick Setup Buttons */}
          <View style={{ marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            <TouchableOpacity
              style={[
                commonStyles.button,
                {
                  backgroundColor: '#4ECDC4', // Water blue
                  marginBottom: theme.spacing.sm,
                },
              ]}
              onPress={handleSetupWaterReminders}
            >
              <Ionicons name="water" size={20} color={theme.colors.surface} />
              <Text
                style={[
                  commonStyles.buttonText,
                  { color: theme.colors.surface, marginLeft: theme.spacing.sm },
                ]}
              >
                Setup Water Reminders (2L/day)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                commonStyles.button,
                {
                  backgroundColor: theme.colors.primary,
                  marginBottom: theme.spacing.sm,
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
                Add Custom Alert
              </Text>
            </TouchableOpacity>

            {/* Test Notification Button */}
            <TouchableOpacity
              style={[
                commonStyles.button,
                {
                  backgroundColor: theme.colors.warning,
                },
              ]}
              onPress={handleTestNotification}
            >
              <Ionicons name="flask" size={20} color={theme.colors.text} />
              <Text
                style={[
                  commonStyles.buttonText,
                  { marginLeft: theme.spacing.sm },
                ]}
              >
                Test Notification 🧪
              </Text>
            </TouchableOpacity>
          </View>

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
            alerts.map((alert, index) => <AlertCard key={`alert-${alert.id}-${index}`} alert={alert} />)
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

        {/* Modern Alert Modal */}
        <ModernAlertModal
          visible={showAlertModal}
          onClose={() => {
            setShowAlertModal(false);
            setEditingAlert(null);
          }}
          onSave={handleSaveAlert}
          alertType={selectedAlertType}
          editingAlert={editingAlert}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
