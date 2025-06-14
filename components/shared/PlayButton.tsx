import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

interface PlayButtonProps {
  uri: string;
  size?: number;
}

const PlayButton: React.FC<PlayButtonProps> = ({ uri, size = 64 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const handlePress = async () => {
    if (isPlaying) {
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
      soundRef.current = null;
      setIsPlaying(false);
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        const s = status as AVPlaybackStatusSuccess;
        if (!s.isPlaying && s.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          setIsPlaying(false);
        }
      });
    }
  };

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
    position: "absolute",
    bottom: 32,
  },
});

export default PlayButton;
