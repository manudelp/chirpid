// components/shared/ClearButton.tsx
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface ClearButtonProps {
  onClear: () => void;
  size?: number;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClear, size = 64 }) => {
  return (
    <Pressable
      onPress={onClear}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Ionicons name="trash" size={size * 0.5} color={Colors.dark.text} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.tint,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ClearButton;
