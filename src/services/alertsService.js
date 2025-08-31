/**
 * Alerts Service - Manage user reminders and notifications
 */

// In-memory storage for demo (replace with database in production)
let alerts = [];
let nextId = 1;

/**
 * Alert types with default configurations
 */
export const getAlertTypes = () => ({
  medication: {
    name: 'Medication Reminder',
    icon: 'medical',
    color: '#FF6B6B',
    defaultMessage: 'Time to take your medication',
    defaultTime: '09:00'
  },
  water: {
    name: 'Water Reminder',
    icon: 'water',
    color: '#4ECDC4',
    defaultMessage: 'Remember to drink water',
    defaultTime: '10:00'
  },
  exercise: {
    name: 'Exercise Reminder',
    icon: 'fitness',
    color: '#45B7D1',
    defaultMessage: 'Time for your workout',
    defaultTime: '18:00'
  },
  sleep: {
    name: 'Sleep Reminder',
    icon: 'bed',
    color: '#96CEB4',
    defaultMessage: 'Time to get ready for bed',
    defaultTime: '22:00'
  },
  meal: {
    name: 'Meal Reminder',
    icon: 'restaurant',
    color: '#FECA57',
    defaultMessage: 'Time for your meal',
    defaultTime: '12:00'
  },
  custom: {
    name: 'Custom Alert',
    icon: 'notifications',
    color: '#A55EEA',
    defaultMessage: 'Custom reminder',
    defaultTime: '15:00'
  }
});

/**
 * Get all alerts
 */
export const getAlerts = async () => {
  // Sort by creation time (newest first)
  return alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Add a new alert
 */
export const addAlert = async (alertData) => {
  const newAlert = {
    id: nextId++,
    type: alertData.type,
    message: alertData.message,
    time: alertData.time || '09:00',
    frequency: alertData.frequency || 'daily',
    enabled: alertData.enabled !== undefined ? alertData.enabled : true,
    createdAt: new Date().toISOString(),
    lastTriggered: null
  };
  
  alerts.push(newAlert);
  
  // In a real app, you would schedule the notification here
  console.log('Alert added:', newAlert);
  
  return newAlert;
};

/**
 * Update an existing alert
 */
export const updateAlert = async (alertId, updates) => {
  const alertIndex = alerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex === -1) {
    throw new Error('Alert not found');
  }
  
  alerts[alertIndex] = {
    ...alerts[alertIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  console.log('Alert updated:', alerts[alertIndex]);
  
  return alerts[alertIndex];
};

/**
 * Delete an alert
 */
export const deleteAlert = async (alertId) => {
  const alertIndex = alerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex === -1) {
    throw new Error('Alert not found');
  }
  
  const deletedAlert = alerts.splice(alertIndex, 1)[0];
  
  console.log('Alert deleted:', deletedAlert);
  
  return deletedAlert;
};

/**
 * Get alerts by type
 */
export const getAlertsByType = async (type) => {
  return alerts.filter(alert => alert.type === type);
};

/**
 * Get active alerts (enabled ones)
 */
export const getActiveAlerts = async () => {
  return alerts.filter(alert => alert.enabled);
};

/**
 * Toggle alert enabled/disabled
 */
export const toggleAlert = async (alertId) => {
  const alert = alerts.find(alert => alert.id === alertId);
  
  if (!alert) {
    throw new Error('Alert not found');
  }
  
  alert.enabled = !alert.enabled;
  alert.updatedAt = new Date().toISOString();
  
  console.log('Alert toggled:', alert);
  
  return alert;
};

/**
 * Mark alert as triggered (for tracking purposes)
 */
export const markAlertTriggered = async (alertId) => {
  const alert = alerts.find(alert => alert.id === alertId);
  
  if (!alert) {
    throw new Error('Alert not found');
  }
  
  alert.lastTriggered = new Date().toISOString();
  
  console.log('Alert marked as triggered:', alert);
  
  return alert;
};

/**
 * Get alert statistics
 */
export const getAlertStats = async () => {
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(alert => alert.enabled).length;
  const alertsByType = {};
  
  alerts.forEach(alert => {
    alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
  });
  
  return {
    total: totalAlerts,
    active: activeAlerts,
    inactive: totalAlerts - activeAlerts,
    byType: alertsByType
  };
};

/**
 * Create sample alerts for demo
 */
export const createSampleAlerts = async () => {
  const sampleAlerts = [
    {
      type: 'medication',
      message: 'Take morning vitamins',
      time: '08:00',
      frequency: 'daily',
      enabled: true
    },
    {
      type: 'water',
      message: 'Drink a glass of water',
      time: '10:00',
      frequency: 'daily',
      enabled: true
    },
    {
      type: 'exercise',
      message: 'Evening workout time',
      time: '18:30',
      frequency: 'daily',
      enabled: true
    },
    {
      type: 'sleep',
      message: 'Start winding down for bed',
      time: '22:00',
      frequency: 'daily',
      enabled: false
    }
  ];
  
  for (const alertData of sampleAlerts) {
    await addAlert(alertData);
  }
  
  console.log('Sample alerts created');
  
  return alerts;
};

/**
 * Clear all alerts (for testing)
 */
export const clearAllAlerts = async () => {
  alerts = [];
  nextId = 1;
  console.log('All alerts cleared');
  return true;
};

/**
 * Export alerts data (for backup)
 */
export const exportAlerts = async () => {
  return {
    alerts,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Import alerts data (for restore)
 */
export const importAlerts = async (data) => {
  if (!data.alerts || !Array.isArray(data.alerts)) {
    throw new Error('Invalid alerts data');
  }
  
  alerts = data.alerts;
  nextId = Math.max(...alerts.map(a => a.id), 0) + 1;
  
  console.log('Alerts imported:', alerts.length);
  
  return alerts;
};