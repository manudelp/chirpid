import RecordButton from "@/components/record/RecordButton";
import RecordSpectrum from "@/components/record/RecordSpectrum";
import ClearButton from "@/components/shared/ClearButton";
import PlayButton from "@/components/shared/PlayButton";
import SendButton from "@/components/shared/SendButton";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useBirdHistory } from "@/contexts/BirdHistoryContext";
import { uploadAudio } from "@/lib/api";
import { pollMetering, requestRecordingPermissions } from "@/lib/recorder";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [metering, setMetering] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const clearPolling = useRef<() => void | undefined>(undefined);
  const recordingTimeout = useRef<number | null>(null);
  const { addBirdToHistory } = useBirdHistory();

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

      // Auto-stop recording after 60 seconds
      recordingTimeout.current = setTimeout(() => {
        stopRecording();
      }, 60000);
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
      setMetering(null); // Reset metering when stopping

      // Clear the auto-stop timeout
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
        recordingTimeout.current = null;
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };
  const handleUploadAudio = async (uri: string) => {
    try {
      setIsUploading(true);
      console.log("Uploading audio to backend...");
      const response = await uploadAudio(uri);
      setRecordingUri(null); // Add bird to history if identification was successful
      if (response.success && response.result) {
        addBirdToHistory({
          species: response.result.species,
          scientificName: response.result.scientificName,
          confidence: response.result.confidence,
          audioUri: uri,
        });

        // Navigate to bird details screen
        router.push({
          pathname: "/bird-details",
          params: {
            id: response.id || `upload_${Date.now()}`,
            species: response.result.species,
            scientificName: response.result.scientificName || "",
            confidence: response.result.confidence.toString(),
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Failed to send chirp:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert(
        "Upload Failed",
        `Failed to send chirp to backend.\n\nError: ${errorMessage}`,
        [
          { text: "Retry", onPress: () => handleUploadAudio(uri) },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.title}>
        {isRecording
          ? "Listening..."
          : isUploading
          ? "Analyzing..."
          : recordingUri
          ? "Analyze Chirp"
          : "Tap to Record"}
      </Text>
      <Text style={styles.subtitle}>
        {isRecording
          ? "Recording... Tap again to stop when ready"
          : isUploading
          ? "Please wait while we identify the bird..."
          : recordingUri
          ? "Send to identify the bird species"
          : "Point your device toward the bird and tap the button"}
      </Text>
      {/* Show record button when not uploading and no recording, or show send button when there's a recording */}
      {!recordingUri && !isUploading ? (
        <RecordButton
          recording={isRecording}
          startRecording={async () => {
            await startRecording();
          }}
          stopRecording={stopRecording}
        />
      ) : !isUploading ? (
        <SendButton
          onSend={() => {
            if (recordingUri && !isUploading)
              return handleUploadAudio(recordingUri);
          }}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.text} />
        </View>
      )}

      {!isRecording && recordingUri && (
        <View style={styles.buttonsContainer}>
          <ClearButton onClear={() => setRecordingUri(null)} />
          <PlayButton uri={recordingUri} />
        </View>
      )}
      {isRecording && <RecordSpectrum metering={metering} />}
    </SafeAreaView>
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
  loadingContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.tint,
    borderRadius: Layout.borderRadius.circle,
    marginVertical: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "600",
    marginBottom: Layout.spacing.lg,
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: Layout.fontSizes.md,
    lineHeight: Layout.fontSizes.md * 1.5,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    minHeight: Layout.spacing.xxl, // 48px equivalent
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
