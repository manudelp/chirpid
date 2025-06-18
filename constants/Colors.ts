/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#8BC199";
const tintColorDark = "#5da871";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    // Additional shades
    textSecondary: "#687076",
    textTertiary: "#889096",
    backgroundElevated: "#F8F9FA",
    backgroundPressed: "#F1F3F5",
    border: "#E6E8EB",
    borderStrong: "#C5CBD0",
    // Link colors
    link: "#0E7490",
    linkVisited: "#7752BE",
    linkHover: "#0891B2",
    // Status colors
    success: "#16A34A",
    successBackground: "#E3F9E5",
    warning: "#F59E0B",
    warningBackground: "#FFF7ED",
    error: "#DC2626",
    errorBackground: "#FEE2E2",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    // Additional shades
    textSecondary: "#9BA1A6",
    textTertiary: "#7D848A",
    backgroundElevated: "#1A1D1E",
    backgroundPressed: "#252829",
    border: "#313538",
    borderStrong: "#4C5155",
    // Link colors
    link: "#22D3EE",
    linkVisited: "#A78BFA",
    linkHover: "#67E8F9",
    // Status colors
    success: "#4ADE80",
    successBackground: "rgba(76, 175, 80, 0.1)",
    warning: "#FBBF24",
    warningBackground: "#4A3C1D",
    error: "#F87171",
    errorBackground: "#4A1D1D",
  },
};
