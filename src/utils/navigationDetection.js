import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Detects the type of navigation system on the device
 * @returns {Object} Navigation system information
 */
export const useNavigationSystem = () => {
  const insets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  
  // Detect navigation type based on safe area insets and device characteristics
  const hasGestureNavigation = () => {
    if (Platform.OS === 'ios') {
      // iOS devices with gesture navigation have bottom insets > 0
      // iPhone X and newer have gesture navigation
      return insets.bottom > 0;
    } else if (Platform.OS === 'android') {
      // Android gesture navigation typically has smaller bottom insets
      // Button navigation usually has insets.bottom === 0 or very small
      // This is a heuristic as Android varies by manufacturer
      return insets.bottom > 20; // Gesture nav usually has 20+ px bottom inset
    }
    return false;
  };

  const hasButtonNavigation = () => {
    if (Platform.OS === 'android') {
      // Android button navigation typically has no bottom inset or very small
      return insets.bottom <= 20;
    }
    return false; // iOS doesn't have button navigation on modern devices
  };

  const navigationType = hasGestureNavigation() 
    ? 'gesture' 
    : hasButtonNavigation() 
    ? 'button' 
    : 'unknown';

  return {
    navigationType,
    isGestureNavigation: hasGestureNavigation(),
    isButtonNavigation: hasButtonNavigation(),
    bottomInset: insets.bottom,
    // Recommended bottom padding based on navigation type
    getBottomPadding: (basepadding = 20) => {
      if (hasGestureNavigation()) {
        // Gesture navigation: use safe area + extra space
        return Math.max(insets.bottom + basepadding, 100);
      } else if (hasButtonNavigation()) {
        // Button navigation: add more space to avoid button interference
        return Math.max(basepadding + 60, 120); // Extra space for buttons
      } else {
        // Fallback
        return Math.max(insets.bottom + basepadding, 80);
      }
    }
  };
};

/**
 * Get adaptive spacing for different UI elements based on navigation type
 */
export const getAdaptiveSpacing = (insets) => {
  const isGesture = insets.bottom > 0;
  
  return {
    // Bottom padding for scrollable content
    scrollViewBottom: isGesture 
      ? Math.max(insets.bottom + 80, 120)  // Gesture: use safe area
      : Math.max(100, 140),                // Button: extra space for buttons
    
    // Bottom margin for floating action buttons
    fabBottom: isGesture 
      ? insets.bottom + 20                 // Gesture: just above safe area
      : 80,                                // Button: well above navigation buttons
    
    // Bottom padding for fixed bottom elements (like tab bars)
    fixedBottom: isGesture 
      ? insets.bottom                      // Gesture: respect safe area
      : 60,                                // Button: space for navigation buttons
  };
};