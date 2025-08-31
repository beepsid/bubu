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
import { getPoems } from '../services/database';

const { width } = Dimensions.get('window');

export default function PoemsScreen() {
  const [poems, setPoems] = useState([]);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    try {
      const poemData = await getPoems();
      setPoems(poemData);
    } catch (error) {
      console.error('Error loading poems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePoemPress = (poem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPoem(poem);
    setModalVisible(true);
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(poems.map(poem => poem.category).filter(Boolean))];
    return categories;
  };

  const getFilteredPoems = () => {
    if (selectedCategory === 'All') {
      return poems;
    }
    return poems.filter(poem => poem.category === selectedCategory);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Love': return 'heart';
      case 'Beauty': return 'flower';
      case 'Forever': return 'infinite';
      case 'Daily Life': return 'home';
      default: return 'library';
    }
  };

  const PoemCard = ({ poem, onPress }) => (
    <TouchableOpacity
      style={[
        commonStyles.romanticCard,
        {
          marginBottom: theme.spacing.md,
          borderTopWidth: 3,
          borderTopColor: theme.colors.primary,
        },
      ]}
      onPress={() => onPress(poem)}
      activeOpacity={0.8}
    >
      <View style={commonStyles.spaceBetween}>
        <View style={{ flex: 1 }}>
          <Text style={[
            commonStyles.bodyText,
            {
              fontFamily: theme.fonts.elegantBold,
              fontSize: theme.fontSizes.lg,
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
            }
          ]}>
            {poem.title}
          </Text>
          {poem.category && (
            <View style={[commonStyles.row, { marginBottom: theme.spacing.sm }]}>
              <Ionicons 
                name={getCategoryIcon(poem.category)} 
                size={16} 
                color={theme.colors.primary} 
              />
              <Text style={[
                commonStyles.bodyText,
                {
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.primary,
                  marginLeft: theme.spacing.xs,
                  fontFamily: theme.fonts.medium,
                }
              ]}>
                {poem.category}
              </Text>
            </View>
          )}
        </View>
        <Ionicons name="library-outline" size={24} color={theme.colors.primary} />
      </View>
      
      <Text
        style={[
          commonStyles.scriptText,
          {
            fontSize: theme.fontSizes.md,
            textAlign: 'left',
            lineHeight: 22,
            color: theme.colors.text,
          }
        ]}
        numberOfLines={4}
      >
        {poem.content}
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
          Read Full Poem →
        </Text>
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: theme.spacing.lg }}
      contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
    >
      {getCategories().map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.lg,
              marginRight: theme.spacing.sm,
              backgroundColor: selectedCategory === category 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.primary,
            },
            theme.shadows.soft,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <View style={commonStyles.row}>
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={16} 
              color={selectedCategory === category ? theme.colors.surface : theme.colors.primary} 
            />
            <Text style={[
              commonStyles.bodyText,
              {
                marginLeft: theme.spacing.xs,
                color: selectedCategory === category ? theme.colors.surface : theme.colors.primary,
                fontFamily: theme.fonts.medium,
              }
            ]}>
              {category}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const PoemModal = () => (
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
          {selectedPoem && (
            <>
              <View style={[commonStyles.spaceBetween, { marginBottom: theme.spacing.lg }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    commonStyles.title,
                    {
                      fontSize: theme.fontSizes.xl,
                      textAlign: 'left',
                      marginBottom: theme.spacing.sm,
                      fontFamily: theme.fonts.elegantBold,
                    }
                  ]}>
                    {selectedPoem.title}
                  </Text>
                  {selectedPoem.category && (
                    <View style={commonStyles.row}>
                      <Ionicons 
                        name={getCategoryIcon(selectedPoem.category)} 
                        size={18} 
                        color={theme.colors.primary} 
                      />
                      <Text style={[
                        commonStyles.bodyText,
                        {
                          color: theme.colors.primary,
                          fontSize: theme.fontSizes.sm,
                          marginLeft: theme.spacing.xs,
                          fontFamily: theme.fonts.medium,
                        }
                      ]}>
                        {selectedPoem.category}
                      </Text>
                    </View>
                  )}
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
                  commonStyles.scriptText,
                  {
                    fontSize: theme.fontSizes.lg,
                    lineHeight: 28,
                    textAlign: 'center',
                    color: theme.colors.text,
                  }
                ]}>
                  {selectedPoem.content}
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
                  Written from the heart, with all my love 💕
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
          <Ionicons name="library-outline" size={48} color={theme.colors.primary} />
          <Text style={[commonStyles.subtitle, { marginTop: theme.spacing.md }]}>
            Loading poems...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredPoems = getFilteredPoems();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={commonStyles.container}
      >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 80, 120) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', padding: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={[commonStyles.heartContainer, { marginBottom: theme.spacing.md }]}>
            <Ionicons name="library" size={32} color={theme.colors.iconContrast} />
          </View>
          <Text style={[commonStyles.title, { marginBottom: theme.spacing.sm }]}>
            Poems for You 🎭
          </Text>
          <Text style={[commonStyles.scriptText, { textAlign: 'center' }]}>
            "Words woven with love, verses written from the heart"
          </Text>
        </View>

        {/* Category Filter */}
        <CategoryFilter />

        {/* Read-Only Notice */}
        <View style={[
          commonStyles.card,
          {
            backgroundColor: theme.colors.romantic,
            alignItems: 'center',
            marginHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }
        ]}>
          <Ionicons name="create-outline" size={20} color={theme.colors.text} />
          <Text style={[
            commonStyles.bodyText,
            {
              marginTop: theme.spacing.sm,
              textAlign: 'center',
              fontFamily: theme.fonts.medium,
            }
          ]}>
            Each poem is crafted with love, just for your beautiful soul 💖
          </Text>
        </View>

        {/* Poems List */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          {filteredPoems.length > 0 ? (
            filteredPoems.map((poem) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onPress={handlePoemPress}
              />
            ))
          ) : (
            <View style={[commonStyles.centerContainer, { marginTop: theme.spacing.xxl }]}>
              <Ionicons name="library-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[
                commonStyles.subtitle,
                {
                  marginTop: theme.spacing.md,
                  color: theme.colors.textSecondary,
                }
              ]}>
                No poems in this category yet
              </Text>
              <Text style={[
                commonStyles.bodyText,
                {
                  textAlign: 'center',
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.sm,
                }
              ]}>
                More beautiful poems coming soon! 💕
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <PoemModal />
      </LinearGradient>
    </SafeAreaView>
  );
}