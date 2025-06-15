import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import { AudioModule, useAudioPlayer } from "expo-audio";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

interface PlayButtonProps {
  uri: string;
  size?: keyof typeof Layout.buttonSizes;
}

const PlayButton: React.FC<PlayButtonProps> = ({ uri, size = "xl" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useAudioPlayer({ uri });
  const buttonSize = Layout.buttonSizes[size];
  const iconSize =
    size === "sm"
      ? Layout.iconSizes.sm
      : size === "md"
      ? Layout.iconSizes.md
      : size === "lg"
      ? Layout.iconSizes.lg
      : Layout.iconSizes.xl;

  // Configure audio session once when component mounts
  React.useEffect(() => {
    const configureAudio = async () => {
      try {
        await AudioModule.setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error("Error configuring audio session:", error);
      }
    };
    configureAudio();
  }, []);
  const handlePress = async () => {
    try {
      // Ensure audio plays through speaker on iOS (configure before each playback)
      await AudioModule.setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        // Reset to beginning before playing (in case it was at the end)
        player.seekTo(0);
        player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      // Fallback without audio configuration
      try {
        if (isPlaying) {
          player.pause();
          setIsPlaying(false);
        } else {
          player.seekTo(0);
          player.play();
          setIsPlaying(true);
        }
      } catch (fallbackError) {
        console.error("Fallback play also failed:", fallbackError);
      }
    }
  };
  // Listen for when playback finishes
  React.useEffect(() => {
    const checkStatus = () => {
      if (player.currentTime >= player.duration && player.duration > 0) {
        // Reset the player to the beginning and set playing state to false
        player.seekTo(0);
        setIsPlaying(false);
      }
    };

    const interval = setInterval(checkStatus, 100);
    return () => clearInterval(interval);
  }, [player]);
  return (
    <Pressable
      onPress={handlePress}
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
      <Ionicons
        name={isPlaying ? "stop" : "play"}
        size={iconSize}
        color={Colors.dark.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.tint,
  },
});

export default PlayButton;
