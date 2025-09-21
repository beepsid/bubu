import { markAlertTriggered } from './alertsService';

class NotificationManager {
  constructor() {
    this.activeNotification = null;
    this.listeners = [];
  }

  // Add listener for notification events
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Trigger a notification
  triggerNotification(alert) {
    this.activeNotification = alert;
    
    // Notify all listeners
    this.listeners.forEach(listener => {
      listener({
        type: 'SHOW_NOTIFICATION',
        alert: alert
      });
    });

    // Mark alert as triggered
    markAlertTriggered(alert.id);
  }

  // Dismiss current notification
  dismissNotification() {
    if (this.activeNotification) {
      this.listeners.forEach(listener => {
        listener({
          type: 'HIDE_NOTIFICATION',
          alert: this.activeNotification
        });
      });
      
      this.activeNotification = null;
    }
  }

  // Expand notification to full screen
  expandNotification() {
    if (this.activeNotification) {
      this.listeners.forEach(listener => {
        listener({
          type: 'EXPAND_NOTIFICATION',
          alert: this.activeNotification
        });
      });
    }
  }

  // Handle water reminder completion
  completeWaterReminder() {
    if (this.activeNotification && this.activeNotification.type === 'water') {
      this.listeners.forEach(listener => {
        listener({
          type: 'WATER_COMPLETED',
          alert: this.activeNotification
        });
      });
      
      this.dismissNotification();
    }
  }

  // Get current active notification
  getActiveNotification() {
    return this.activeNotification;
  }

  // Simulate notification trigger (for testing)
  simulateWaterReminder() {
    const mockWaterAlert = {
      id: 999,
      type: 'water',
      message: 'Time to drink water! Stay hydrated 💧',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      enabled: true
    };
    
    this.triggerNotification(mockWaterAlert);
  }

  // Schedule notifications based on current time (simplified version)
  checkScheduledNotifications(alerts) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    alerts.forEach(alert => {
      if (alert.enabled && alert.time === currentTime) {
        // Check if we haven't triggered this alert in the last hour
        const lastTriggered = alert.lastTriggered ? new Date(alert.lastTriggered) : null;
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        
        if (!lastTriggered || lastTriggered < oneHourAgo) {
          this.triggerNotification(alert);
        }
      }
    });
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();

// Export for easy access
export default notificationManager;