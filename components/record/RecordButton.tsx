import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import Layout from "../../constants/Layout";

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
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // Create pulse effect when recording
  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation;

    if (recording) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      animationLoop.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [recording, pulseAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { scale: recording ? pulseAnim : 1 }],
      }}
    >
      <Pressable
        style={[styles.button, recording ? styles.active : styles.inactive]}
        onPress={handlePress}
        hitSlop={Layout.hitSlop.lg}
      >
        {recording ? (
          <Ionicons name="stop" size={72} color={Colors.light.background} />
        ) : (
          <Image
            source={require("../../assets/images/logo-transparent.png")}
            style={{ width: 120, height: 120, tintColor: Colors.dark.tint }}
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
    borderRadius: Layout.borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: Colors.dark.error,
  },
  inactive: {
    backgroundColor: Colors.light.background,
    ...Layout.shadows.md,
  },
});

export default RecordButton;
