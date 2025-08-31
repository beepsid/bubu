import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { theme } from '../styles/theme';
import { commonStyles } from '../styles/common';
import { useNavigationSystem } from '../utils/navigationDetection';
import { 
  getHealthData, 
  addHealthEntry, 
  getHealthStats,
  getHealthCategories 
} from '../services/healthService';

export default function HealthScreen() {
  const [healthData, setHealthData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigationSystem = useNavigationSystem();

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const data = await getHealthData();
      const healthStats = await getHealthStats();
      setHealthData(data);
      setStats(healthStats);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Add Health Entry 📊',
      'Choose a category:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '💧 Water Intake', onPress: () => showAddEntryForm('water') },
        { text: '😴 Sleep Hours', onPress: () => showAddEntryForm('sleep') },
        { text: '🏃‍♀️ Exercise Minutes', onPress: () => showAddEntryForm('exercise') },
        { text: '⚖️ Weight', onPress: () => showAddEntryForm('weight') },
        { text: '🌡️ Temperature', onPress: () => showAddEntryForm('temperature') },
        { text: '💊 Medication', onPress: () => showAddEntryForm('medication') },
        { text: '🧘‍♀️ Mood (1-10)', onPress: () => showAddEntryForm('mood') },
        { text: '📝 Custom Entry', onPress: () => showAddEntryForm('custom') },
      ]
    );
  };

  const showAddEntryForm = (category) => {
    const categories = getHealthCategories();
    const categoryInfo = categories[category];
    
    Alert.prompt(
      `Add ${categoryInfo.name}`,
      `Enter your ${categoryInfo.name.toLowerCase()}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Entry', 
          onPress: (value) => {
            if (value && value.trim()) {
              createHealthEntry(category, value.trim());
            }
          }
        }
      ],
      'numeric',
      '',
      'numeric'
    );
  };

  const createHealthEntry = async (category, value) => {
    try {
      const newEntry = await addHealthEntry({
        category,
        value: parseFloat(value) || value,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
      
      setHealthData(prev => [newEntry, ...prev]);
      
      // Refresh stats
      const updatedStats = await getHealthStats();
      setStats(updatedStats);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Entry Added! ✅',
        `Your ${category} entry has been recorded.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error creating health entry:', error);
      Alert.alert('Error', 'Failed to add entry. Please try again.');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      water: 'water',
      sleep: 'bed',
      exercise: 'fitness',
      weight: 'scale',
      temperature: 'thermometer',
      medication: 'medical',
      mood: 'happy',
      custom: 'clipboard'
    };
    return icons[category] || 'clipboard';
  };

  const getCategoryColor = (category) => {
    const colors = {
      water: '#4ECDC4',
      sleep: '#96CEB4',
      exercise: '#45B7D1',
      weight: '#FECA57',
      temperature: '#FF6B6B',
      medication: '#A55EEA',
      mood: '#FD79A8',
      custom: '#74B9FF'
    };
    return colors[category] || theme.colors.primary;
  };

  const formatValue = (category, value) => {
    const units = {
      water: 'glasses',
      sleep: 'hours',
      exercise: 'minutes',
      weight: 'kg',
      temperature: '°C',
      medication: 'taken',
      mood: '/10'
    };
    
    if (typeof value === 'number') {
      return `${value} ${units[category] || ''}`;
    }
    return value;
  };

  const HealthEntryCard = ({ entry }) => (
    <View style={[
      commonStyles.card,
      {
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderLeftWidth: 4,
        borderLeftColor: getCategoryColor(entry.category),
      }
    ]}>
      <View style={[commonStyles.row, { alignItems: 'center' }]}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: getCategoryColor(entry.category) + '20',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: theme.spacing.md,
        }}>
          <Ionicons 
            name={getCategoryIcon(entry.category)} 
            size={18} 
            color={getCategoryColor(entry.category)} 
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={[
            commonStyles.bodyText,
            { 
              fontFamily: theme.fonts.semiBold,
              marginBottom: theme.spacing.xs,
            }
          ]}>
            {formatValue(entry.category, entry.value)}
          </Text>
          
          <Text style={[
            commonStyles.bodyText,
            { 
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textSecondary,
            }
          ]}>
            {entry.category.charAt(0).toUpperCase() + entry.category.slice(1)} • {entry.time}
          </Text>
        </View>
        
        <Text style={[
          commonStyles.bodyText,
          { 
            fontSize: theme.fontSizes.sm,
            color: theme.colors.textSecondary,
          }
        ]}>
          {new Date(entry.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
      </View>
    </View>
  );

  const StatCard = ({ icon, label, value, color }) => (
    <View style={[
      commonStyles.card,
      {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.md,
      }
    ]}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[
        commonStyles.bodyText,
        { 
          fontFamily: theme.fonts.bold,
          color: theme.colors.primary,
          marginBottom: theme.spacing.xs,
        }
      ]}>
        {value}
      </Text>
      <Text style={[
        commonStyles.bodyText,
        { 
          fontSize: theme.fontSizes.sm,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        }
      ]}>
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={commonStyles.centerContainer}>
          <Ionicons name="fitness-outline" size={48} color={theme.colors.primary} />
          <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md }]}>
            Loading your health data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={commonStyles.container}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: navigationSystem.getBottomPadding(80) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', padding: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            <View style={[commonStyles.heartContainer, { marginBottom: theme.spacing.md }]}>
              <Ionicons name="fitness" size={32} color={theme.colors.primary} />
            </View>
            <Text style={[commonStyles.title, { marginBottom: theme.spacing.sm }]}>
              Health Tracker 💪
            </Text>
            <Text style={[commonStyles.scriptText, { textAlign: 'center' }]}>
              "Track your wellness journey"
            </Text>
          </View>

          {/* Today's Stats */}
          {stats && (
            <View style={{ marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              <Text style={[
                commonStyles.subtitle,
                {
                  textAlign: 'left',
                  marginBottom: theme.spacing.md,
                }
              ]}>
                Today's Summary 📊
              </Text>
              
              <View style={[commonStyles.row, { marginBottom: theme.spacing.md }]}>
                <StatCard
                  icon="water"
                  label="Water"
                  value={`${stats.today.water || 0}`}
                  color="#4ECDC4"
                />
                <StatCard
                  icon="bed"
                  label="Sleep"
                  value={`${stats.today.sleep || 0}h`}
                  color="#96CEB4"
                />
                <StatCard
                  icon="fitness"
                  label="Exercise"
                  value={`${stats.today.exercise || 0}m`}
                  color="#45B7D1"
                />
              </View>
              
              <View style={[commonStyles.row]}>
                <StatCard
                  icon="happy"
                  label="Mood"
                  value={stats.today.mood ? `${stats.today.mood}/10` : '-'}
                  color="#FD79A8"
                />
                <StatCard
                  icon="medical"
                  label="Medications"
                  value={`${stats.today.medication || 0}`}
                  color="#A55EEA"
                />
                <StatCard
                  icon="clipboard"
                  label="Entries"
                  value={`${stats.today.total || 0}`}
                  color="#74B9FF"
                />
              </View>
            </View>
          )}

          {/* Add Entry Button */}
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                marginHorizontal: theme.spacing.md,
                marginBottom: theme.spacing.lg,
                backgroundColor: theme.colors.primary,
              }
            ]}
            onPress={handleAddEntry}
          >
            <Ionicons name="add" size={20} color={theme.colors.surface} />
            <Text style={[commonStyles.buttonText, { marginLeft: theme.spacing.sm }]}>
              Add Health Entry
            </Text>
          </TouchableOpacity>

          {/* Recent Entries */}
          <View style={{ marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            <Text style={[
              commonStyles.subtitle,
              {
                textAlign: 'left',
                marginBottom: theme.spacing.md,
              }
            ]}>
              Recent Entries 📝
            </Text>
            
            {healthData.length === 0 ? (
              <View style={[
                commonStyles.card,
                {
                  alignItems: 'center',
                  backgroundColor: theme.colors.secondary,
                }
              ]}>
                <Ionicons name="clipboard-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={[
                  commonStyles.subtitle,
                  {
                    marginTop: theme.spacing.md,
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.textSecondary,
                  }
                ]}>
                  No Entries Yet
                </Text>
                <Text style={[
                  commonStyles.bodyText,
                  {
                    textAlign: 'center',
                    color: theme.colors.textSecondary,
                  }
                ]}>
                  Start tracking your health by adding your first entry
                </Text>
              </View>
            ) : (
              healthData.slice(0, 10).map((entry, index) => (
                <HealthEntryCard key={`${entry.date}-${entry.time}-${index}`} entry={entry} />
              ))
            )}
          </View>

          {/* Instructions */}
          <View style={[
            commonStyles.card,
            {
              backgroundColor: theme.colors.secondary,
              marginHorizontal: theme.spacing.md,
              marginTop: theme.spacing.lg,
            }
          ]}>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={[
              commonStyles.bodyText,
              {
                marginTop: theme.spacing.sm,
                textAlign: 'center',
                fontFamily: theme.fonts.medium,
              }
            ]}>
              💡 Track water intake, sleep, exercise, mood, medications and more!
              Build healthy habits one entry at a time. 💕
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}