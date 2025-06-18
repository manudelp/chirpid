import ClearButton from "@/components/shared/ClearButton";
import PlayButton from "@/components/shared/PlayButton";
import SendButton from "@/components/shared/SendButton";
import UploadCard from "@/components/upload/UploadCard";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useBirdHistory } from "@/contexts/BirdHistoryContext";
import { uploadAudio } from "@/lib/api";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function UploadScreen() {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [clearTrigger, setClearTrigger] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addBirdToHistory } = useBirdHistory();
  const handleUploadAudio = async (uri: string) => {
    try {
      setIsUploading(true);
      console.log("Uploading audio to backend...");
      const response = await uploadAudio(uri);
      setRecordingUri(null);
      setClearTrigger(true);
      // Reset the trigger after a brief moment
      setTimeout(() => setClearTrigger(false), 100); // Add bird to history if identification was successful
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
  const handleClearAudio = () => {
    setRecordingUri(null);
    setClearTrigger(true);
    // Reset the trigger after a brief moment
    setTimeout(() => setClearTrigger(false), 100);
  };

  const handleAudioSelected = (uri: string) => {
    setRecordingUri(uri);
    setClearTrigger(false);
  };
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Text style={styles.title}>
        {isUploading
          ? "Analyzing..."
          : recordingUri
          ? "Analyze Chirp"
          : "Upload Audio"}
      </Text>

      {!recordingUri && (
        <Text style={styles.subtitle}>
          {isUploading
            ? "Please wait while we identify the bird..."
            : "Select an audio file from your device"}
        </Text>
      )}

      {recordingUri && !isUploading && (
        <Text style={styles.subtitle}>Send to identify the bird species</Text>
      )}

      {isUploading && (
        <Text style={styles.subtitle}>
          Please wait while we identify the bird...
        </Text>
      )}

      {/* Show upload card when no recording is selected */}
      {!recordingUri && !isUploading ? (
        <UploadCard
          onAudioSelected={handleAudioSelected}
          onAudioCleared={handleClearAudio}
          shouldClear={clearTrigger}
        />
      ) : recordingUri && !isUploading ? (
        // Show send button when file is selected
        <SendButton
          onSend={() => {
            if (recordingUri && !isUploading)
              return handleUploadAudio(recordingUri);
          }}
        />
      ) : null}

      {recordingUri && !isUploading && (
        <View style={styles.buttonsContainer}>
          <ClearButton onClear={handleClearAudio} />
          <PlayButton uri={recordingUri} />
        </View>
      )}
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
    minHeight: 48,
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

export default UploadScreen;
