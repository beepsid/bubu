import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  SLAP_COUNT: 'slap_count',
  LAST_SYNC: 'last_sync',
  USER_PREFERENCES: 'user_preferences',
  GALLERY_FAVORITES: 'gallery_favorites',
};

// Generic storage functions
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Slap counter specific functions
export const getSlapCount = async () => {
  const count = await getData(STORAGE_KEYS.SLAP_COUNT);
  return count || 0;
};

export const setSlapCount = async (count) => {
  return await storeData(STORAGE_KEYS.SLAP_COUNT, count);
};

export const incrementSlapCount = async () => {
  const currentCount = await getSlapCount();
  const newCount = currentCount + 1;
  await setSlapCount(newCount);
  return newCount;
};

// User preferences
export const getUserPreferences = async () => {
  const prefs = await getData(STORAGE_KEYS.USER_PREFERENCES);
  return prefs || {
    theme: 'romantic',
    notifications: true,
    hapticFeedback: true,
  };
};

export const setUserPreferences = async (preferences) => {
  return await storeData(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

// Gallery favorites
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

// Sync tracking
export const getLastSyncTime = async () => {
  return await getData(STORAGE_KEYS.LAST_SYNC);
};

export const setLastSyncTime = async (timestamp) => {
  return await storeData(STORAGE_KEYS.LAST_SYNC, timestamp);
};