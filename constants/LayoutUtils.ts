import Layout from "./Layout";

/**
 * Layout utility functions for common spacing and sizing patterns
 */
export const LayoutUtils = {
  /**
   * Get spacing values for common padding patterns
   */
  containerPadding: () => ({
    padding: Layout.spacing.lg,
  }),

  screenPadding: () => ({
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  }),

  cardPadding: () => ({
    padding: Layout.spacing.md,
  }),

  /**
   * Get common button styles
   */
  buttonBase: () => ({
    height: Layout.buttonSizes.md,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  }),

  circularButton: (size: keyof typeof Layout.buttonSizes = "md") => ({
    width: Layout.buttonSizes[size],
    height: Layout.buttonSizes[size],
    borderRadius: Layout.borderRadius.circle,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  }),

  /**
   * Get common text styles
   */
  headingText: () => ({
    fontSize: Layout.fontSizes.xl,
    fontWeight: "600" as const,
    marginBottom: Layout.spacing.lg,
  }),

  bodyText: () => ({
    fontSize: Layout.fontSizes.md,
    lineHeight: Layout.fontSizes.md * 1.5,
  }),

  captionText: () => ({
    fontSize: Layout.fontSizes.sm,
    lineHeight: Layout.fontSizes.sm * 1.4,
  }),

  /**
   * Get common spacing patterns
   */
  verticalSpacing: (size: keyof typeof Layout.spacing = "md") => ({
    marginVertical: Layout.spacing[size],
  }),

  horizontalSpacing: (size: keyof typeof Layout.spacing = "md") => ({
    marginHorizontal: Layout.spacing[size],
  }),

  /**
   * Get common card styles
   */
  card: () => ({
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    ...Layout.shadows.sm,
  }),

  /**
   * Get responsive spacing based on screen size
   */
  responsiveSpacing: (screenWidth: number) => {
    if (screenWidth < Layout.breakpoints.phone) {
      return Layout.spacing.md;
    } else if (screenWidth < Layout.breakpoints.tablet) {
      return Layout.spacing.lg;
    } else {
      return Layout.spacing.xl;
    }
  },

  /**
   * Get appropriate icon size for context
   */
  iconForButton: (buttonSize: keyof typeof Layout.buttonSizes = "md") => {
    const sizeMap = {
      sm: Layout.iconSizes.sm,
      md: Layout.iconSizes.md,
      lg: Layout.iconSizes.lg,
      xl: Layout.iconSizes.xl,
    };
    return sizeMap[buttonSize];
  },
};

export default LayoutUtils;
