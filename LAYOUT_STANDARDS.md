# Layout Standards Implementation

This document outlines the standardized layout constants used throughout the ChirpID application to ensure consistent spacing, typography, and visual design.

## Layout Constants Overview

All layout constants are defined in `constants/Layout.ts` and should be imported and used instead of hardcoded values.

```typescript
import Layout from "@/constants/Layout";
```

## Available Constants

### Spacing

Use consistent spacing throughout the app:

```typescript
Layout.spacing = {
  xs: 4, // For very small gaps
  sm: 8, // For small spacing between elements
  md: 16, // Standard spacing
  lg: 24, // Large spacing (padding, margins)
  xl: 32, // Extra large spacing
  xxl: 48, // Maximum spacing for large layouts
};
```

**Usage Examples:**

- Container padding: `Layout.spacing.lg`
- Element margins: `Layout.spacing.md`
- Small gaps between icons: `Layout.spacing.xs`

### Border Radius

Consistent rounded corners:

```typescript
Layout.borderRadius = {
  sm: 6, // Small radius for buttons/cards
  md: 10, // Medium radius
  lg: 16, // Large radius
  xl: 24, // Extra large radius
  circle: 999, // For perfectly circular elements
};
```

**Usage Examples:**

- Buttons: `Layout.borderRadius.md`
- Cards: `Layout.borderRadius.lg`
- Circular buttons: `Layout.borderRadius.circle`

### Typography

Standardized font sizes:

```typescript
Layout.fontSizes = {
  xs: 10, // Very small text
  sm: 12, // Small text (captions, labels)
  md: 16, // Body text (default)
  lg: 20, // Subheadings
  xl: 24, // Main headings
  xxl: 32, // Large titles
};
```

### Icon Sizes

Consistent icon sizing:

```typescript
Layout.iconSizes = {
  sm: 16, // Small icons
  md: 24, // Standard icons
  lg: 32, // Large icons
  xl: 48, // Extra large icons
  xxl: 64, // Maximum icon size
};
```

### Button Sizes

Standard button dimensions:

```typescript
Layout.buttonSizes = {
  sm: 32, // Small buttons
  md: 44, // Standard buttons
  lg: 56, // Large buttons
  xl: 80, // Extra large buttons
};
```

### Hit Slop

Improved touch targets:

```typescript
Layout.hitSlop = {
  sm: { top: 8, bottom: 8, left: 8, right: 8 },
  md: { top: 12, bottom: 12, left: 12, right: 12 },
  lg: { top: 16, bottom: 16, left: 16, right: 16 },
};
```

### Shadows

Consistent elevation effects:

```typescript
Layout.shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
```

## Implementation Examples

### Screen Layout

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: Layout.fontSizes.xl,
    marginBottom: Layout.spacing.lg,
    color: Colors.dark.text,
  },
});
```

### Button Component

```typescript
const styles = StyleSheet.create({
  button: {
    height: Layout.buttonSizes.md,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
```

### Card Component

```typescript
const styles = StyleSheet.create({
  card: {
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.md,
    ...Layout.shadows.sm,
  },
});
```

## Implemented in Components

The following components have been updated to use Layout constants:

### Screen Components

- ✅ `app/(tabs)/index.tsx` - Home screen with record functionality
- ✅ `app/(tabs)/upload.tsx` - Upload screen
- ✅ `app/(tabs)/_layout.tsx` - Tab navigation layout
- ✅ `app/+not-found.tsx` - 404 error screen

### UI Components

- ✅ `components/record/RecordButton.tsx` - Main recording button
- ✅ `components/record/RecordSpectrum.tsx` - Audio visualization
- ✅ `components/upload/UploadCard.tsx` - File upload interface
- ✅ `components/shared/PlayButton.tsx` - Audio playback control

## Benefits

1. **Consistency**: All spacing and sizing follows the same scale
2. **Maintainability**: Easy to update spacing globally by modifying constants
3. **Design System**: Creates a cohesive visual language
4. **Developer Experience**: Clear guidelines for new components
5. **Accessibility**: Consistent hit targets and spacing improve usability

## Guidelines for New Components

When creating new components:

1. Always import and use Layout constants instead of hardcoded values
2. Use semantic sizing (xs, sm, md, lg, xl) rather than pixel values
3. Follow the established patterns for spacing and typography
4. Ensure proper hit targets using `hitSlop` for interactive elements
5. Apply consistent border radius using the predefined values

## Migration Checklist

- [x] Update all screen components to use Layout constants
- [x] Update all UI components to use standardized spacing
- [x] Replace hardcoded font sizes with Layout.fontSizes
- [x] Replace hardcoded border radius with Layout.borderRadius
- [x] Ensure consistent spacing patterns across the app
- [x] Validate all components compile without errors

## Future Enhancements

Consider adding these constants as the app grows:

- Animation durations and easing curves
- Z-index values for layering
- Grid system constants
- Responsive breakpoint utilities
- Additional shadow variations
