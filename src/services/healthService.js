/**
 * Health Service - Track health metrics and wellness data
 */

// In-memory storage for demo (replace with database in production)
let healthEntries = [];
let nextId = 1;

/**
 * Health categories with configurations
 */
export const getHealthCategories = () => ({
  water: {
    name: 'Water Intake',
    icon: 'water',
    color: '#4ECDC4',
    unit: 'glasses',
    type: 'number'
  },
  sleep: {
    name: 'Sleep Hours',
    icon: 'bed',
    color: '#96CEB4',
    unit: 'hours',
    type: 'number'
  },
  exercise: {
    name: 'Exercise Minutes',
    icon: 'fitness',
    color: '#45B7D1',
    unit: 'minutes',
    type: 'number'
  },
  weight: {
    name: 'Weight',
    icon: 'scale',
    color: '#FECA57',
    unit: 'kg',
    type: 'number'
  },
  temperature: {
    name: 'Body Temperature',
    icon: 'thermometer',
    color: '#FF6B6B',
    unit: '°C',
    type: 'number'
  },
  medication: {
    name: 'Medication',
    icon: 'medical',
    color: '#A55EEA',
    unit: 'taken',
    type: 'boolean'
  },
  mood: {
    name: 'Mood Rating',
    icon: 'happy',
    color: '#FD79A8',
    unit: '/10',
    type: 'number',
    min: 1,
    max: 10
  },
  custom: {
    name: 'Custom Entry',
    icon: 'clipboard',
    color: '#74B9FF',
    unit: '',
    type: 'text'
  }
});

/**
 * Get all health entries
 */
export const getHealthData = async () => {
  // Sort by date and time (newest first)
  return healthEntries.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });
};

/**
 * Add a new health entry
 */
export const addHealthEntry = async (entryData) => {
  const newEntry = {
    id: nextId++,
    category: entryData.category,
    value: entryData.value,
    date: entryData.date || new Date().toISOString().split('T')[0],
    time: entryData.time || new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    notes: entryData.notes || '',
    createdAt: new Date().toISOString()
  };
  
  healthEntries.push(newEntry);
  
  console.log('Health entry added:', newEntry);
  
  return newEntry;
};

/**
 * Update an existing health entry
 */
export const updateHealthEntry = async (entryId, updates) => {
  const entryIndex = healthEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex === -1) {
    throw new Error('Health entry not found');
  }
  
  healthEntries[entryIndex] = {
    ...healthEntries[entryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  console.log('Health entry updated:', healthEntries[entryIndex]);
  
  return healthEntries[entryIndex];
};

/**
 * Delete a health entry
 */
export const deleteHealthEntry = async (entryId) => {
  const entryIndex = healthEntries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex === -1) {
    throw new Error('Health entry not found');
  }
  
  const deletedEntry = healthEntries.splice(entryIndex, 1)[0];
  
  console.log('Health entry deleted:', deletedEntry);
  
  return deletedEntry;
};

/**
 * Get health entries by category
 */
export const getHealthEntriesByCategory = async (category) => {
  return healthEntries.filter(entry => entry.category === category);
};

/**
 * Get health entries for a specific date
 */
export const getHealthEntriesByDate = async (date) => {
  return healthEntries.filter(entry => entry.date === date);
};

/**
 * Get health statistics
 */
export const getHealthStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = healthEntries.filter(entry => entry.date === today);
  
  // Calculate today's stats
  const todayStats = {};
  todayEntries.forEach(entry => {
    if (entry.category === 'medication') {
      todayStats[entry.category] = (todayStats[entry.category] || 0) + 1;
    } else if (typeof entry.value === 'number') {
      if (entry.category === 'water' || entry.category === 'exercise') {
        todayStats[entry.category] = (todayStats[entry.category] || 0) + entry.value;
      } else {
        todayStats[entry.category] = entry.value; // Latest value for weight, mood, etc.
      }
    }
  });
  
  todayStats.total = todayEntries.length;
  
  // Calculate weekly averages
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const weekEntries = healthEntries.filter(entry => entry.date >= weekAgoStr);
  const weeklyStats = {};
  
  const categories = ['water', 'sleep', 'exercise', 'mood'];
  categories.forEach(category => {
    const categoryEntries = weekEntries.filter(entry => entry.category === category);
    if (categoryEntries.length > 0) {
      const sum = categoryEntries.reduce((total, entry) => total + (entry.value || 0), 0);
      weeklyStats[category] = Math.round((sum / categoryEntries.length) * 10) / 10;
    }
  });
  
  return {
    today: todayStats,
    weekly: weeklyStats,
    totalEntries: healthEntries.length
  };
};

/**
 * Get health trends for a category
 */
export const getHealthTrends = async (category, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  
  const entries = healthEntries
    .filter(entry => entry.category === category && entry.date >= startDateStr)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Group by date and calculate daily averages
  const dailyData = {};
  entries.forEach(entry => {
    if (!dailyData[entry.date]) {
      dailyData[entry.date] = [];
    }
    dailyData[entry.date].push(entry.value);
  });
  
  const trends = Object.keys(dailyData).map(date => {
    const values = dailyData[date];
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return {
      date,
      value: Math.round(average * 10) / 10,
      count: values.length
    };
  });
  
  return trends;
};

/**
 * Create sample health data for demo
 */
export const createSampleHealthData = async () => {
  const today = new Date();
  const sampleData = [];
  
  // Create data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Water intake (6-10 glasses)
    sampleData.push({
      category: 'water',
      value: Math.floor(Math.random() * 5) + 6,
      date: dateStr,
      time: '09:00'
    });
    
    // Sleep hours (6-9 hours)
    sampleData.push({
      category: 'sleep',
      value: Math.floor(Math.random() * 4) + 6,
      date: dateStr,
      time: '07:00'
    });
    
    // Exercise minutes (20-60 minutes)
    if (Math.random() > 0.3) { // 70% chance of exercise
      sampleData.push({
        category: 'exercise',
        value: Math.floor(Math.random() * 41) + 20,
        date: dateStr,
        time: '18:00'
      });
    }
    
    // Mood rating (6-10)
    sampleData.push({
      category: 'mood',
      value: Math.floor(Math.random() * 5) + 6,
      date: dateStr,
      time: '20:00'
    });
    
    // Medication (random)
    if (Math.random() > 0.2) { // 80% chance of taking medication
      sampleData.push({
        category: 'medication',
        value: 'Morning vitamins',
        date: dateStr,
        time: '08:00'
      });
    }
  }
  
  for (const data of sampleData) {
    await addHealthEntry(data);
  }
  
  console.log('Sample health data created:', sampleData.length, 'entries');
  
  return healthEntries;
};

/**
 * Clear all health data (for testing)
 */
export const clearAllHealthData = async () => {
  healthEntries = [];
  nextId = 1;
  console.log('All health data cleared');
  return true;
};

/**
 * Export health data (for backup)
 */
export const exportHealthData = async () => {
  return {
    healthEntries,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Import health data (for restore)
 */
export const importHealthData = async (data) => {
  if (!data.healthEntries || !Array.isArray(data.healthEntries)) {
    throw new Error('Invalid health data');
  }
  
  healthEntries = data.healthEntries;
  nextId = Math.max(...healthEntries.map(e => e.id), 0) + 1;
  
  console.log('Health data imported:', healthEntries.length, 'entries');
  
  return healthEntries;
};

/**
 * Get health summary for a date range
 */
export const getHealthSummary = async (startDate, endDate) => {
  const entries = healthEntries.filter(entry => 
    entry.date >= startDate && entry.date <= endDate
  );
  
  const summary = {
    totalEntries: entries.length,
    categories: {},
    dateRange: { startDate, endDate }
  };
  
  // Group by category
  entries.forEach(entry => {
    if (!summary.categories[entry.category]) {
      summary.categories[entry.category] = {
        count: 0,
        values: [],
        average: 0
      };
    }
    
    summary.categories[entry.category].count++;
    if (typeof entry.value === 'number') {
      summary.categories[entry.category].values.push(entry.value);
    }
  });
  
  // Calculate averages
  Object.keys(summary.categories).forEach(category => {
    const categoryData = summary.categories[category];
    if (categoryData.values.length > 0) {
      const sum = categoryData.values.reduce((total, val) => total + val, 0);
      categoryData.average = Math.round((sum / categoryData.values.length) * 10) / 10;
    }
  });
  
  return summary;
};