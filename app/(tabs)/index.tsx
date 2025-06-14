import RecordButton from "@/components/record/RecordButton";
import RecordSpectrum from "@/components/record/RecordSpectrum";
import ClearButton from "@/components/shared/ClearButton";
import PlayButton from "@/components/shared/PlayButton";
import SendButton from "@/components/shared/SendButton";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { pollMetering, requestRecordingPermissions } from "@/lib/recorder";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [metering, setMetering] = useState<number | null>(null);
  const clearPolling = useRef<() => void | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const granted = await requestRecordingPermissions();
      if (!granted) Alert.alert("Microphone permission denied");
    })();
  }, []);

  const startRecording = async () => {
    try {
      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();

      clearPolling.current = pollMetering(audioRecorder, setMetering);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      setRecordingUri(uri ?? null);
      clearPolling.current?.();
      setIsRecording(false);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording
          ? "Listening..."
          : recordingUri
          ? "Analyze Chirp"
          : "Tap to Record"}
      </Text>

      {recordingUri ? (
        <SendButton
          onSend={() => {
            /* handle upload */
          }}
        />
      ) : (
        <RecordButton
          recording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      )}

      {isRecording && <Text style={styles.tip}>Tap again to stop.</Text>}

      {!isRecording && recordingUri && (
        <View style={styles.buttonsContainer}>
          <ClearButton onClear={() => setRecordingUri(null)} />
          <PlayButton uri={recordingUri} />
        </View>
      )}

      {isRecording && <RecordSpectrum metering={metering} />}
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
  tip: {
    position: "absolute",
    top: Layout.spacing.md,
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
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
