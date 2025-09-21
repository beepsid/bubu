import { notificationManager } from './notificationManager';

/**
 * Development Notification Service
 * Simulates background notifications for testing in Expo Go
 */
class DevelopmentNotificationService {
  constructor() {
    this.scheduledAlerts = new Map();
    this.intervals = new Map();
    this.isRunning = false;
  }

  async initialize() {
    return true;
  }

  async scheduleAlert(alert) {
    try {
      // Clear existing interval for this alert
      if (this.intervals.has(alert.id)) {
        clearInterval(this.intervals.get(alert.id));
      }

      // Store the alert
      this.scheduledAlerts.set(alert.id, alert);

      // For development, check every 30 seconds if it's time to trigger
      const interval = setInterval(() => {
        this.checkAlertTime(alert);
      }, 30000); // Check every 30 seconds for better accuracy

      this.intervals.set(alert.id, interval);


      return `dev-${alert.id}`;
    } catch (error) {
      console.error('Failed to schedule development alert:', error);
      throw error;
    }
  }

  checkAlertTime(alert) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    

    
    let shouldTrigger = false;

    if (alert.frequency === 'daily') {
      // For daily alerts, just check time
      shouldTrigger = alert.time === currentTime && alert.enabled;
    } else {
      // For one-time alerts, check both date and time
      if (alert.dateTime) {
        const alertDateTime = new Date(alert.dateTime);
        const alertTime = alertDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const alertDate = alertDateTime.toISOString().split('T')[0];
        shouldTrigger = alert.enabled && alertDate === currentDate && alertTime === currentTime;
      } else if (alert.date) {
        shouldTrigger = alert.enabled && alert.date === currentDate && alert.time === currentTime;
      } else {
        // Fallback: treat as today
        shouldTrigger = alert.time === currentTime && alert.enabled;
      }
    }
    
    if (shouldTrigger) {
      // Check if we haven't triggered this alert in the last 2 minutes
      const lastTriggered = alert.lastTriggered ? new Date(alert.lastTriggered) : null;
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      
      if (!lastTriggered || lastTriggered < twoMinutesAgo) {
        // Update last triggered time
        alert.lastTriggered = now.toISOString();
        this.scheduledAlerts.set(alert.id, alert);
        
        // Trigger the notification
        notificationManager.triggerNotification(alert);

        // For one-time alerts, disable them after triggering
        if (alert.frequency === 'once') {
          alert.enabled = false;
          this.scheduledAlerts.set(alert.id, alert);

        }
      } else {

      }
    }
  }

  async cancelAlert(alertId) {
    try {
      if (this.intervals.has(alertId)) {
        clearInterval(this.intervals.get(alertId));
        this.intervals.delete(alertId);
      }
      
      this.scheduledAlerts.delete(alertId);

    } catch (error) {
      console.error('Failed to cancel development alert:', error);
    }
  }

  async scheduleAllAlerts(alerts) {
    try {
      // Clear all existing intervals
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals.clear();
      this.scheduledAlerts.clear();

      // Schedule all active alerts
      for (const alert of alerts) {
        if (alert.enabled) {
          await this.scheduleAlert(alert);
        }
      }


    } catch (error) {
      console.error('Failed to schedule all development alerts:', error);
    }
  }

  async clearAllNotifications() {
    try {
      this.intervals.forEach(interval => clearInterval(interval));
      this.intervals.clear();
      this.scheduledAlerts.clear();

    } catch (error) {
      console.error('Failed to clear development notifications:', error);
    }
  }

  async getScheduledNotifications() {
    return Array.from(this.scheduledAlerts.values());
  }

  // Simulate immediate notification for testing
  async simulateNotification(alert) {
    notificationManager.triggerNotification(alert);
  }

  // Manual trigger for testing specific times
  async testAlertAtTime(alert, testTime) {
    const originalTime = alert.time;
    alert.time = testTime;
    

    
    // Trigger immediately for testing
    setTimeout(() => {
      notificationManager.triggerNotification(alert);
      // Restore original time
      alert.time = originalTime;
    }, 1000);
  }
}

// Create singleton instance
export const developmentNotificationService = new DevelopmentNotificationService();

// Export for easy access
export default developmentNotificationService;