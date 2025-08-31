import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { theme } from '../styles/theme';
import { commonStyles } from '../styles/common';
import { getGalleryFavorites, addToFavorites, removeFromFavorites } from '../services/storage';

const { width, height } = Dimensions.get('window');

// Sample gallery images (replace with actual bundled images)
const galleryImages = [
  {
    id: 1,
    uri: 'https://picsum.photos/400/600?random=1',
    title: 'Our First Date',
    description: 'The day everything began 💕',
    date: '2024-01-15',
  },
  {
    id: 2,
    uri: 'https://picsum.photos/400/400?random=2',
    title: 'Coffee Morning',
    description: 'Perfect morning together ☕',
    date: '2024-02-03',
  },
  {
    id: 3,
    uri: 'https://picsum.photos/600/400?random=3',
    title: 'Sunset Walk',
    description: 'Golden hour magic 🌅',
    date: '2024-02-14',
  },
  {
    id: 4,
    uri: 'https://picsum.photos/400/500?random=4',
    title: 'Cooking Together',
    description: 'Kitchen adventures 👩‍🍳',
    date: '2024-02-28',
  },
  {
    id: 5,
    uri: 'https://picsum.photos/500/400?random=5',
    title: 'Beach Day',
    description: 'Sand between our toes 🏖️',
    date: '2024-03-10',
  },
  {
    id: 6,
    uri: 'https://picsum.photos/400/600?random=6',
    title: 'Movie Night',
    description: 'Cozy evening in 🎬',
    date: '2024-03-15',
  },
  {
    id: 7,
    uri: 'https://picsum.photos/600/500?random=7',
    title: 'Garden Picnic',
    description: 'Under the cherry blossoms 🌸',
    date: '2024-03-20',
  },
  {
    id: 8,
    uri: 'https://picsum.photos/400/400?random=8',
    title: 'Dancing',
    description: 'Lost in the music 💃',
    date: '2024-03-25',
  },
];

export default function GalleryScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await getGalleryFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleImagePress = (image) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedImage(image);
    setModalVisible(true);
  };

  const toggleFavorite = async (imageId) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (favorites.includes(imageId)) {
        const newFavorites = await removeFromFavorites(imageId);
        setFavorites(newFavorites);
      } else {
        const newFavorites = await addToFavorites(imageId);
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getFilteredImages = () => {
    if (filter === 'Favorites') {
      return galleryImages.filter(img => favorites.includes(img.id));
    }
    return galleryImages;
  };

  const calculateImageSize = (index) => {
    const numColumns = 2;
    const imageWidth = (width - (theme.spacing.md * 3)) / numColumns;
    
    // Vary heights for masonry effect
    const heights = [200, 250, 180, 220, 240, 190, 260, 210];
    const height = heights[index % heights.length];
    
    return { width: imageWidth, height };
  };

  const ImageCard = ({ image, index, onPress }) => {
    const size = calculateImageSize(index);
    const isFavorite = favorites.includes(image.id);
    
    return (
      <TouchableOpacity
        style={[
          {
            width: size.width,
            height: size.height,
            marginBottom: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
          },
          theme.shadows.soft,
        ]}
        onPress={() => onPress(image)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: image.uri }}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.background,
          }}
          resizeMode="cover"
        />
        
        {/* Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            justifyContent: 'flex-end',
            padding: theme.spacing.sm,
          }}
        >
          <Text style={[
            commonStyles.bodyText,
            {
              color: theme.colors.surface,
              fontFamily: theme.fonts.semiBold,
              fontSize: theme.fontSizes.sm,
            }
          ]}>
            {image.title}
          </Text>
          <Text style={[
            commonStyles.bodyText,
            {
              color: theme.colors.surface,
              fontSize: theme.fontSizes.xs,
              opacity: 0.9,
            }
          ]}>
            {image.description}
          </Text>
        </LinearGradient>
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: theme.borderRadius.round,
            padding: theme.spacing.xs,
          }}
          onPress={() => toggleFavorite(image.id)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? theme.colors.heart : theme.colors.text}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const ImageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {selectedImage && (
          <>
            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 50,
                right: 20,
                zIndex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: theme.borderRadius.round,
                padding: theme.spacing.sm,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.surface} />
            </TouchableOpacity>
            
            {/* Favorite Button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 50,
                left: 20,
                zIndex: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: theme.borderRadius.round,
                padding: theme.spacing.sm,
              }}
              onPress={() => toggleFavorite(selectedImage.id)}
            >
              <Ionicons
                name={favorites.includes(selectedImage.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={favorites.includes(selectedImage.id) ? theme.colors.heart : theme.colors.surface}
              />
            </TouchableOpacity>
            
            {/* Image */}
            <Image
              source={{ uri: selectedImage.uri }}
              style={{
                width: width - 40,
                height: height * 0.7,
                borderRadius: theme.borderRadius.lg,
              }}
              resizeMode="contain"
            />
            
            {/* Image Info */}
            <View style={{
              position: 'absolute',
              bottom: 100,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              alignItems: 'center',
            }}>
              <Text style={[
                commonStyles.bodyText,
                {
                  fontFamily: theme.fonts.elegantBold,
                  fontSize: theme.fontSizes.lg,
                  color: theme.colors.text,
                  marginBottom: theme.spacing.xs,
                }
              ]}>
                {selectedImage.title}
              </Text>
              <Text style={[
                commonStyles.scriptText,
                {
                  fontSize: theme.fontSizes.md,
                  color: theme.colors.primary,
                  marginBottom: theme.spacing.sm,
                }
              ]}>
                {selectedImage.description}
              </Text>
              <Text style={[
                commonStyles.bodyText,
                {
                  fontSize: theme.fontSizes.sm,
                  color: theme.colors.textSecondary,
                }
              ]}>
                {new Date(selectedImage.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </>
        )}
      </View>
    </Modal>
  );

  const filteredImages = getFilteredImages();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.surface]}
      style={commonStyles.container}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', padding: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={[commonStyles.heartContainer, { marginBottom: theme.spacing.md }]}>
            <Ionicons name="images" size={32} color={theme.colors.iconContrast} />
          </View>
          <Text style={[commonStyles.title, { marginBottom: theme.spacing.sm }]}>
            Our Memories 📸
          </Text>
          <Text style={[commonStyles.scriptText, { textAlign: 'center' }]}>
            "Every picture tells our beautiful story"
          </Text>
        </View>

        {/* Filter Buttons */}
        <View style={[commonStyles.row, { justifyContent: 'center', marginBottom: theme.spacing.lg }]}>
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                backgroundColor: filter === 'All' ? theme.colors.primary : theme.colors.surface,
                marginHorizontal: theme.spacing.sm,
                paddingHorizontal: theme.spacing.lg,
              }
            ]}
            onPress={() => setFilter('All')}
          >
            <Text style={[
              commonStyles.buttonText,
              {
                color: filter === 'All' ? theme.colors.surface : theme.colors.text,
              }
            ]}>
              All Photos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              commonStyles.button,
              {
                backgroundColor: filter === 'Favorites' ? theme.colors.heart : theme.colors.surface,
                marginHorizontal: theme.spacing.sm,
                paddingHorizontal: theme.spacing.lg,
              }
            ]}
            onPress={() => setFilter('Favorites')}
          >
            <View style={commonStyles.row}>
              <Ionicons 
                name="heart" 
                size={16} 
                color={filter === 'Favorites' ? theme.colors.surface : theme.colors.heart} 
              />
              <Text style={[
                commonStyles.buttonText,
                {
                  color: filter === 'Favorites' ? theme.colors.surface : theme.colors.text,
                  marginLeft: theme.spacing.xs,
                }
              ]}>
                Favorites ({favorites.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.md,
          }}>
            {filteredImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                onPress={handleImagePress}
              />
            ))}
          </View>
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
              No favorite photos yet
            </Text>
            <Text style={[
              commonStyles.bodyText,
              {
                textAlign: 'center',
                color: theme.colors.textSecondary,
                marginTop: theme.spacing.sm,
              }
            ]}>
              Tap the heart on photos to add them to favorites! 💕
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={[commonStyles.card, { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.xl }]}>
          <Text style={[
            commonStyles.subtitle,
            {
              textAlign: 'left',
              marginBottom: theme.spacing.md,
            }
          ]}>
            Gallery Stats 📊
          </Text>
          
          <View style={commonStyles.row}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.iconContrast }]}>
                {galleryImages.length}
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Total Photos
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.heart }]}>
                {favorites.length}
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Favorites
              </Text>
            </View>
            
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[commonStyles.bodyText, { fontFamily: theme.fonts.bold, color: theme.colors.iconContrast }]}>
                ∞
              </Text>
              <Text style={[commonStyles.bodyText, { fontSize: theme.fontSizes.sm, color: theme.colors.textSecondary }]}>
                Memories
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ImageModal />
    </LinearGradient>
  );
}