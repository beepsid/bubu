import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { theme } from '../styles/theme';
import { commonStyles } from '../styles/common';
import { getSlapCount } from '../services/storage';
import { getDiaryEntries, getPoems } from '../services/database';
import { useNavigationSystem } from '../utils/navigationDetection';



export default function HomeScreen({ navigation }) {
  const [slapCount, setSlapCount] = useState(0);
  const [recentDiary, setRecentDiary] = useState(null);
  const [recentPoem, setRecentPoem] = useState(null);
  const [heartAnimation] = useState(new Animated.Value(1));
  const insets = useSafeAreaInsets();
  const navigationSystem = useNavigationSystem();

  useEffect(() => {
    loadHomeData();

    // Animate heart on mount
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load slap count
      const count = await getSlapCount();
      setSlapCount(count);

      // Load most recent diary entry
      const diaryEntries = await getDiaryEntries();
      if (diaryEntries.length > 0) {
        setRecentDiary(diaryEntries[0]);
      }

      // Load most recent poem
      const poems = await getPoems();
      if (poems.length > 0) {
        setRecentPoem(poems[0]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const handleQuickNavigation = (screen) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen);
  };

  const QuickActionCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity
      style={[
        commonStyles.card,
        {
          flex: 1,
          marginHorizontal: theme.spacing.xs,
          backgroundColor: color,
          alignItems: 'center',
          paddingVertical: theme.spacing.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color={theme.colors.text} />
      <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.semiBold, marginTop: theme.spacing.sm }]}>
        {title}
      </Text>
      <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

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
          {/* Welcome Header */}
          <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
            <Animated.View
              style={[
                commonStyles.heartContainer,
                {
                  transform: [{ scale: heartAnimation }],
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                },
              ]}
            >
              <Ionicons name="heart" size={40} color={theme.colors.heart} />
            </Animated.View>

            <Text style={[commonStyles.title, { marginTop: theme.spacing.md, marginBottom: theme.spacing.sm }]}>
              Welcome, Beautiful 💕
            </Text>

            <Text style={[commonStyles.scriptText, { fontSize: theme.fontSizes.lg }]}>
              "You are my sunshine, my only sunshine"
            </Text>
          </View>

          {/* Slap Counter Preview */}
          <View style={[commonStyles.romanticCard, { alignItems: 'center' }]}>
            <Text style={[commonStyles.subtitle, { color: theme.colors.primary }]}>
              Slaps Received 👋
            </Text>
            <Text style={[commonStyles.title, { fontSize: theme.fontSizes.huge, color: theme.colors.heart }]}>
              {slapCount}
            </Text>
            <TouchableOpacity
              style={[commonStyles.button, { marginTop: theme.spacing.md }]}
              onPress={() => handleQuickNavigation('Counter')}
            >
              <Text style={commonStyles.buttonText}>View Counter</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={{ paddingHorizontal: theme.spacing.md, marginVertical: theme.spacing.md }}>
            <Text style={[commonStyles.subtitle, { textAlign: 'left', marginBottom: theme.spacing.sm }]}>
              Quick Access
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: theme.spacing.sm }}>
              <QuickActionCard
                title="Slap Counter"
                subtitle="Fun Counter"
                icon="hand-left"
                color={theme.colors.secondary}
                onPress={() => handleQuickNavigation('Counter')}
              />
              <QuickActionCard
                title="His Diary"
                subtitle="Love Notes"
                icon="book"
                color={theme.colors.romantic}
                onPress={() => handleQuickNavigation('Diary')}
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <QuickActionCard
                title="Alerts"
                subtitle="Smart Reminders"
                icon="notifications"
                color={theme.colors.warning}
                onPress={() => handleQuickNavigation('Alerts')}
              />
              <QuickActionCard
                title="Health"
                subtitle="Wellness Tracker"
                icon="fitness"
                color={theme.colors.success}
                onPress={() => handleQuickNavigation('Health')}
              />
            </View>
          </View>

          {/* Recent Content Preview */}
          {recentDiary && (
            <View style={commonStyles.card}>
              <View style={commonStyles.spaceBetween}>
                <Text style={[commonStyles.subtitle, { textAlign: 'left' }]}>
                  Latest Diary Entry
                </Text>
                <Ionicons name="book-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.semiBold, marginVertical: theme.spacing.sm }]}>
                {recentDiary.title}
              </Text>
              <Text style={[commonStyles.bodyText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {recentDiary.content}
              </Text>
              <TouchableOpacity
                style={{ marginTop: theme.spacing.md }}
                onPress={() => handleQuickNavigation('Diary')}
              >
                <Text style={[commonStyles.bodyText, { color: theme.colors.primary, fontFamily: theme.fonts.semiBold }]}>
                  Read More →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {recentPoem && (
            <View style={commonStyles.card}>
              <View style={commonStyles.spaceBetween}>
                <Text style={[commonStyles.subtitle, { textAlign: 'left' }]}>
                  Latest Poem
                </Text>
                <Ionicons name="library-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.semiBold, marginVertical: theme.spacing.sm }]}>
                {recentPoem.title}
              </Text>
              <Text style={[commonStyles.scriptText, { fontSize: theme.fontSizes.md, textAlign: 'left' }]} numberOfLines={3}>
                {recentPoem.content}
              </Text>
              <TouchableOpacity
                style={{ marginTop: theme.spacing.md }}
                onPress={() => handleQuickNavigation('Poems')}
              >
                <Text style={[commonStyles.bodyText, { color: theme.colors.primary, fontFamily: theme.fonts.semiBold }]}>
                  Read More →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Love Message */}
          <View style={[commonStyles.romanticCard, { alignItems: 'center', marginTop: theme.spacing.lg }]}>
            <Ionicons name="heart" size={24} color={theme.colors.heart} />
            <Text style={[commonStyles.scriptText, { marginTop: theme.spacing.sm, textAlign: 'center' }]}>
              "Every day with you is a beautiful adventure. You make my world brighter just by being in it."
            </Text>
            <Text style={[commonStyles.bodyText, { marginTop: theme.spacing.sm, fontFamily: theme.fonts.semiBold, color: theme.colors.primary }]}>
              - Your Loving Boyfriend 💕
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}