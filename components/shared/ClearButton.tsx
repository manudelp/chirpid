// components/shared/ClearButton.tsx
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface ClearButtonProps {
  onClear: () => void;
  size?: keyof typeof Layout.buttonSizes;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClear, size = "lg" }) => {
  const buttonSize = Layout.buttonSizes[size];
  const iconSize =
    size === "sm"
      ? Layout.iconSizes.sm
      : size === "md"
      ? Layout.iconSizes.md
      : size === "lg"
      ? Layout.iconSizes.lg
      : Layout.iconSizes.xl;

  return (
    <Pressable
      onPress={onClear}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: Layout.borderRadius.circle,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      hitSlop={Layout.hitSlop.md}
    >
      <Ionicons name="trash" size={iconSize} color={Colors.dark.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.tint,
  },
});

export default ClearButton;
