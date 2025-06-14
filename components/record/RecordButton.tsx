import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

interface RecordButtonProps {
  recording: boolean | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  recording,
  startRecording,
  stopRecording,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    // Scale down animation
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // Scale back up animation
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });

    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.button, recording ? styles.active : styles.inactive]}
        onPress={handlePress}
      >
        {recording ? (
          <Ionicons name="square" size={64} color={Colors.dark.text} />
        ) : (
          <Image
            source={require("../../assets/images/logo-transparent.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: Colors.dark.tint,
  },
  inactive: {
    backgroundColor: Colors.light.background,
  },
});

export default RecordButton;
