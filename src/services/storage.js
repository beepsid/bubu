import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  GALLERY_FAVORITES: 'gallery_favorites',
};

// Generic storage functions
const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

// Gallery favorites functions
export const getGalleryFavorites = async () => {
  const favorites = await getData(STORAGE_KEYS.GALLERY_FAVORITES);
  return favorites || [];
};

export const addToFavorites = async (imageId) => {
  const favorites = await getGalleryFavorites();
  if (!favorites.includes(imageId)) {
    favorites.push(imageId);
    await storeData(STORAGE_KEYS.GALLERY_FAVORITES, favorites);
  }
  return favorites;
};

export const removeFromFavorites = async (imageId) => {
  const favorites = await getGalleryFavorites();
  const updatedFavorites = favorites.filter(id => id !== imageId);
  await storeData(STORAGE_KEYS.GALLERY_FAVORITES, updatedFavorites);
  return updatedFavorites;
};