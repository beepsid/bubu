export const theme = {
  colors: {
    primary: '#FFB6C1',        // Light pink
    secondary: '#E6E6FA',      // Lavender  
    accent: '#FFC0CB',         // Pink
    background: '#FFF8F0',     // Cream white
    surface: '#FFFFFF',        // Pure white
    card: '#FEFEFE',          // Card background
    text: '#4A4A4A',          // Soft gray
    textSecondary: '#8E8E8E',  // Light gray
    textLight: '#B8B8B8',     // Very light gray
    error: '#FF6B6B',         // Soft red for periods
    success: '#98FB98',       // Light green for ovulation
    warning: '#FFE4B5',       // Moccasin
    shadow: 'rgba(0,0,0,0.1)', // Soft shadows
    overlay: 'rgba(0,0,0,0.3)', // Modal overlay
    heart: '#FF69B4',         // Hot pink for hearts
    romantic: '#F8BBD9',      // Romantic pink
  },
  
  fonts: {
    regular: 'System',
    medium: 'System', 
    semiBold: 'System',
    bold: 'System',
    elegant: 'System',
    elegantBold: 'System',
    script: 'System',
    scriptBold: 'System',
  },
  
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 50,
  },
  
  shadows: {
    soft: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    strong: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  animations: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
};