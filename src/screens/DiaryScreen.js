import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { theme } from '../styles/theme';
import { commonStyles } from '../styles/common';
import { getDiaryEntries } from '../services/database';

const { width } = Dimensions.get('window');

export default function DiaryScreen() {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadDiaryEntries();
  }, []);

  const loadDiaryEntries = async () => {
    try {
      const entries = await getDiaryEntries();
      setDiaryEntries(entries);
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryPress = (entry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const DiaryEntryCard = ({ entry, onPress }) => (
    <TouchableOpacity
      style={[
        commonStyles.romanticCard,
        {
          marginBottom: theme.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: theme.colors.primary,
        },
      ]}
      onPress={() => onPress(entry)}
      activeOpacity={0.8}
    >
      <View style={commonStyles.spaceBetween}>
        <Text style={[
          commonStyles.bodyText,
          {
            fontFamily: theme.fonts.semiBold,
            fontSize: theme.fontSizes.lg,
            color: theme.colors.text,
            flex: 1,
          }
        ]}>
          {entry.title}
        </Text>
        <Ionicons name="heart-outline" size={20} color={theme.colors.primary} />
      </View>
      
      <Text style={[
        commonStyles.bodyText,
        {
          color: theme.colors.textSecondary,
          fontSize: theme.fontSizes.sm,
          marginTop: theme.spacing.xs,
          marginBottom: theme.spacing.sm,
        }
      ]}>
        {formatDate(entry.date)}
      </Text>
      
      <Text
        style={[
          commonStyles.bodyText,
          {
            color: theme.colors.text,
            lineHeight: 22,
          }
        ]}
        numberOfLines={3}
      >
        {entry.content}
      </Text>
      
      <View style={[commonStyles.row, { marginTop: theme.spacing.md, justifyContent: 'flex-end' }]}>
        <Text style={[
          commonStyles.bodyText,
          {
            color: theme.colors.primary,
            fontFamily: theme.fonts.semiBold,
            fontSize: theme.fontSizes.sm,
          }
        ]}>
          Read More →
        </Text>
      </View>
    </TouchableOpacity>
  );

  const EntryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.xl,
          margin: theme.spacing.lg,
          maxHeight: '80%',
          width: width - (theme.spacing.lg * 2),
          ...theme.shadows.strong,
        }}>
          {selectedEntry && (
            <>
              <View style={[commonStyles.spaceBetween, { marginBottom: theme.spacing.lg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    commonStyles.title,
                    {
                      fontSize: theme.fontSizes.xl,
                      textAlign: 'left',
                      marginBottom: theme.spacing.sm,
                    }
                  ]}>
                    {selectedEntry.title}
                  </Text>
                  <Text style={[
                    commonStyles.bodyText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.fontSizes.sm,
                    }
                  ]}>
                    {formatDate(selectedEntry.date)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.round,
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: '70%' }}
              >
                <Text style={[
                  commonStyles.bodyText,
                  {
                    lineHeight: 26,
                    fontSize: theme.fontSizes.md,
                  }
                ]}>
                  {selectedEntry.content}
                </Text>
              </ScrollView>
              
              <View style={{
                alignItems: 'center',
                marginTop: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                borderTopWidth: 1,
                borderTopColor: theme.colors.primary,
              }}>
                <Ionicons name="heart" size={24} color={theme.colors.heart} />
                <Text style={[
                  commonStyles.scriptText,
                  {
                    marginTop: theme.spacing.sm,
                    fontSize: theme.fontSizes.md,
                  }
                ]}>
                  Written with love, just for you 💕
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View style={commonStyles.centerContainer}>
          <Ionicons name="book-outline" size={48} color={theme.colors.primary} />
          <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md }]}>
            Loading diary entries...
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
        contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: Math.max(insets.bottom + 80, 120) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
          <View style={[commonStyles.heartContainer, { marginBottom: theme.spacing.md }]}>
            <Ionicons name="book" size={32} color={theme.colors.primary} />
          </View>
          <Text style={[commonStyles.title, { marginBottom: theme.spacing.sm }]}>
            His Diary for Me 💕
          </Text>
          <Text style={[commonStyles.scriptText, { textAlign: 'center' }]}>
            "Love letters written in diary form, each one a piece of my heart for you"
          </Text>
        </View>

        {/* Read-Only Notice */}
        <View style={[
          commonStyles.card,
          {
            backgroundColor: theme.colors.romantic,
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }
        ]}>
          <Ionicons name="lock-closed" size={20} color={theme.colors.text} />
          <Text style={[
            commonStyles.bodyText,
            {
              marginTop: theme.spacing.sm,
              textAlign: 'center',
              fontFamily: theme.fonts.medium,
            }
          ]}>
            These are his personal thoughts and feelings written just for you to read 💖
          </Text>
        </View>

        {/* Diary Entries */}
        {diaryEntries.length > 0 ? (
          diaryEntries.map((entry) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              onPress={handleEntryPress}
            />
          ))
        ) : (
          <View style={[commonStyles.centerContainer, { marginTop: theme.spacing.xxl }]}>
            <Ionicons name="heart-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[
              commonStyles.subtitle,
              {
                marginTop: theme.spacing.md,
                color: theme.colors.textSecondary,
              }
            ]}>
              No diary entries yet
            </Text>
            <Text style={[
              commonStyles.bodyText,
              {
                textAlign: 'center',
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.sm,
              }
            ]}>
              He'll write beautiful entries for you soon! 💕
            </Text>
          </View>
        )}
      </ScrollView>

      <EntryModal />
      </LinearGradient>
    </SafeAreaView>
  );
}