import React, { useState, useEffect } from "react";
import { View } from "react-native";
import NotificationCurtain from "./NotificationCurtain";
import WaterReminderScreen from "./WaterReminderScreen";
import { notificationManager } from "../services/notificationManager";
// backgroundNotificationService removed for SDK 53 compatibility

export default function NotificationWrapper({ children }) {
  const [showCurtain, setShowCurtain] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    // Listen for notification events
    const unsubscribe = notificationManager.addListener((event) => {
      switch (event.type) {
        case "SHOW_NOTIFICATION":
          // Ensure clean state before showing new notification
          setShowCurtain(false);
          setShowFullScreen(false);
          setCurrentAlert(null);

          // Small delay to ensure state is reset, then show new notification
          setTimeout(() => {
            setCurrentAlert(event.alert);
            setShowCurtain(true);
          }, 50);
          break;

        case "HIDE_NOTIFICATION":
          setShowCurtain(false);
          setShowFullScreen(false);
          setTimeout(() => setCurrentAlert(null), 300); // Delay to allow animation
          break;

        case "EXPAND_NOTIFICATION":
          setShowCurtain(false);
          setShowFullScreen(true);
          break;

        case "WATER_COMPLETED":
          setShowCurtain(false);
          setShowFullScreen(false);
          setTimeout(() => setCurrentAlert(null), 300);
          break;
      }
    });

    // Background notification listeners removed for SDK 53 compatibility
    // Using development notification service instead

    return unsubscribe;
  }, []);

  const handleCloseCurtain = () => {
    notificationManager.dismissNotification();
  };

  const handleExpandCurtain = () => {
    notificationManager.expandNotification();
  };

  const handleCloseFullScreen = () => {
    notificationManager.dismissNotification();
  };

  const handleDrinkWater = () => {
    notificationManager.completeWaterReminder();
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Notification Curtain */}
      <NotificationCurtain
        visible={showCurtain}
        alert={currentAlert}
        onClose={handleCloseCurtain}
        onExpand={handleExpandCurtain}
      />

      {/* Full Screen Water Reminder */}
      <WaterReminderScreen
        visible={showFullScreen}
        alert={currentAlert}
        onClose={handleCloseFullScreen}
        onDrinkWater={handleDrinkWater}
      />
    </View>
  );
}
