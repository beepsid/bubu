import * as Notifications from "expo-notifications";
import { notificationManager } from "./notificationManager";
import { getActiveAlerts } from "./alertsService";

// Configure notification behavior for SDK 54
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class SDK54NotificationService {
  constructor() {
    this.isInitialized = false;
    this.scheduledNotifications = new Map();
  }

  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted");
        return false;
      }

      // Listen for notification responses
      this.addNotificationResponseListener((response) => {
        const { alertId, alertType } =
          response.notification.request.content.data || {};

        if (alertId) {
          const alert = {
            id: alertId,
            type: alertType || "water",
            message: response.notification.request.content.body,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            enabled: true,
          };

          notificationManager.triggerNotification(alert);
        }
      });

      // Listen for foreground notifications
      this.addNotificationReceivedListener((notification) => {
        const { alertId, alertType } = notification.request.content.data || {};

        if (alertId) {
          const alert = {
            id: alertId,
            type: alertType || "water",
            message: notification.request.content.body,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            enabled: true,
          };

          notificationManager.triggerNotification(alert);
        }
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize SDK 54 notifications:", error);
      return false;
    }
  }

  async scheduleAlert(alert) {
    try {
      // Cancel existing notification for this alert
      if (this.scheduledNotifications.has(alert.id)) {
        await Notifications.cancelScheduledNotificationAsync(
          this.scheduledNotifications.get(alert.id)
        );
      }

      // Parse time
      const [hours, minutes] = alert.time.split(":").map(Number);

      let trigger;

      if (alert.frequency === "daily") {
        // Create trigger for daily repeating notifications
        trigger = {
          hour: hours,
          minute: minutes,
          repeats: true,
        };
      } else {
        // For one-time alerts, use the specific date and time
        if (alert.dateTime) {
          const alertDateTime = new Date(alert.dateTime);
          trigger = {
            date: alertDateTime,
            repeats: false,
          };
        } else if (alert.date) {
          // Fallback: construct date from date and time fields
          const alertDate = new Date(alert.date);
          alertDate.setHours(hours, minutes, 0, 0);
          trigger = {
            date: alertDate,
            repeats: false,
          };
        } else {
          // Fallback: schedule for today at the specified time
          const today = new Date();
          today.setHours(hours, minutes, 0, 0);
          trigger = {
            date: today,
            repeats: false,
          };
        }
      }

      // Schedule notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: this.getNotificationTitle(alert.type),
          body: alert.message,
          data: {
            alertId: alert.id,
            alertType: alert.type,
            showCurtain: true,
          },
          sound: true,
        },
        trigger,
      });

      this.scheduledNotifications.set(alert.id, notificationId);

      return notificationId;
    } catch (error) {
      console.error("Failed to schedule SDK 54 alert:", error);
      throw error;
    }
  }

  async cancelAlert(alertId) {
    try {
      if (this.scheduledNotifications.has(alertId)) {
        await Notifications.cancelScheduledNotificationAsync(
          this.scheduledNotifications.get(alertId)
        );
        this.scheduledNotifications.delete(alertId);
      }
    } catch (error) {
      console.error("Failed to cancel SDK 54 alert:", error);
    }
  }

  async scheduleAllAlerts() {
    try {
      const alerts = await getActiveAlerts();

      // Cancel all existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();

      // Schedule all active alerts
      for (const alert of alerts) {
        if (alert.enabled) {
          await this.scheduleAlert(alert);
        }
      }


    } catch (error) {
      console.error("Failed to schedule all SDK 54 alerts:", error);
    }
  }

  getNotificationTitle(alertType) {
    const titles = {
      medication: "💊 Medication Reminder",
      water: "💧 Water Time!",
      exercise: "🏃‍♀️ Workout Time",
      sleep: "😴 Bedtime Reminder",
      meal: "🍎 Meal Time",
      custom: "🔔 Reminder",
    };
    return titles[alertType] || "🔔 Reminder";
  }

  // Listen for notification responses (when user taps notification)
  addNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Listen for notifications received while app is in foreground
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to get scheduled SDK 54 notifications:", error);
      return [];
    }
  }

  async clearAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.scheduledNotifications.clear();
    } catch (error) {
      console.error("Failed to clear SDK 54 notifications:", error);
    }
  }

  // Simulate immediate notification for testing
  async simulateNotification(alert) {
    notificationManager.triggerNotification(alert);
  }
}

// Create singleton instance
export const sdk54NotificationService = new SDK54NotificationService();

// Export for easy access
export default sdk54NotificationService;
