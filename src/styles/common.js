import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.soft,
  },
  
  romanticCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.semiBold,
  },
  
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontFamily: theme.fonts.elegant,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  
  subtitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  bodyText: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 24,
  },
  
  scriptText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.script,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  shadow: theme.shadows.soft,
  mediumShadow: theme.shadows.medium,
  strongShadow: theme.shadows.strong,
  
  // Romantic specific styles
  heartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.romantic,
    ...theme.shadows.medium,
  },
  
  romanticBorder: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'solid',
  },
  
  gradientBackground: {
    flex: 1,
  },
  
  floatingButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.strong,
  },
});