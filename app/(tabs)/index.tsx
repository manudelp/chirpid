// app/(tabs)/index.tsx
import RecordButton from "@/components/record/RecordButton";
import RecordSpectrum from "@/components/record/RecordSpectrum";
import ClearButton from "@/components/shared/ClearButton";
import PlayButton from "@/components/shared/PlayButton";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [metering, setMetering] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Microphone permission denied");
      }
    })();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      interval = setInterval(async () => {
        const status = await recordingRef.current?.getStatusAsync();
        if (status?.isRecording && typeof status.metering === "number") {
          setMetering(status.metering);
        }
      }, 100);
    } else {
      if (interval) clearInterval(interval);
      setMetering(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setIsRecording(false);
      setRecordingUri(uri ?? null);
      recordingRef.current = null;
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording ? "Listening..." : "Tap to Record"}
      </Text>
      <RecordButton
        recording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      {!isRecording && recordingUri && (
        <View style={styles.buttonsContainer}>
          <ClearButton onClear={() => setRecordingUri(null)} />
          <PlayButton uri={recordingUri} />
        </View>
      )}
      <RecordSpectrum metering={metering} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.lg,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "600",
    marginBottom: Layout.spacing.lg,
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: Layout.spacing.md,
    flexDirection: "row",
    gap: Layout.spacing.md,
    justifyContent: "center",
    width: "100%",
  },
});
