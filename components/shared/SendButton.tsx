// components/shared/SendButton.tsx
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

interface SendButtonProps {
  onSend: () => void | Promise<void>;
}

const SendButton: React.FC<SendButtonProps> = ({ onSend }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonSize = 150; // Large custom size for send button
  const iconSize = 82; // Large icon for send button

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSend();
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
          },
        ]}
        onPress={handlePress}
        hitSlop={Layout.hitSlop.lg}
      >
        <Ionicons name="search" size={iconSize} color={Colors.dark.text} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Layout.borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.tint,
  },
});

export default SendButton;
