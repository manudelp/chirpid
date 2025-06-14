// components/shared/SendButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import Layout from "../../constants/Layout";

interface SendButtonProps {
  onSend: () => void | Promise<void>;
}

const SendButton: React.FC<SendButtonProps> = ({ onSend }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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
      <Pressable style={styles.button} onPress={handlePress}>
        <Ionicons name="search" size={82} color={Colors.dark.text} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150,
    borderRadius: Layout.borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.tint,
  },
});

export default SendButton;
