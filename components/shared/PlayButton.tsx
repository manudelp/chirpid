import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

interface PlayButtonProps {
  uri: string;
  size?: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({ uri, size = 64 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useAudioPlayer({ uri });

  const handlePress = async () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  // Listen for when playback finishes
  React.useEffect(() => {
    const checkStatus = () => {
      if (player.currentTime >= player.duration && player.duration > 0) {
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
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Ionicons
        name={isPlaying ? "stop" : "play"}
        size={size * 0.5}
        color={Colors.dark.text}
      />
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

export default PlayButton;
