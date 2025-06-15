import ClearButton from "@/components/shared/ClearButton";
import PlayButton from "@/components/shared/PlayButton";
import SendButton from "@/components/shared/SendButton";
import UploadCard from "@/components/upload/UploadCard";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { uploadAudio, UploadResponse } from "@/lib/api";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

function UploadScreen() {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [clearTrigger, setClearTrigger] = useState(false);
  const [identificationResult, setIdentificationResult] =
    useState<UploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadAudio = async (uri: string) => {
    try {
      setIsUploading(true);
      console.log("Uploading audio to backend...");
      const response = await uploadAudio(uri);
      setIdentificationResult(response);
      setRecordingUri(null);
      setClearTrigger(true);
      // Reset the trigger after a brief moment
      setTimeout(() => setClearTrigger(false), 100);
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
    setIdentificationResult(null);
    setClearTrigger(true);
    // Reset the trigger after a brief moment
    setTimeout(() => setClearTrigger(false), 100);
  };

  const handleAudioSelected = (uri: string) => {
    setRecordingUri(uri);
    setClearTrigger(false);
  };

  return (
    <View style={styles.container}>
      {identificationResult ? (
        // Show identification result
        <View style={styles.resultContainer}>
          <Text style={styles.title}>Bird Identified!</Text>
          <Text style={styles.speciesName}>
            {identificationResult.result?.species}
          </Text>
          {identificationResult.result?.scientificName && (
            <Text style={styles.scientificName}>
              {identificationResult.result.scientificName}
            </Text>
          )}
          {identificationResult.result?.confidence && (
            <Text style={styles.confidence}>
              {`Confidence: ${Math.round(
                identificationResult.result.confidence * 100
              )}%`}
            </Text>
          )}
          <Text style={styles.subtitle}>
            Select another audio file to identify more birds
          </Text>
        </View>
      ) : (
        // Show upload interface
        <>
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
            <Text style={styles.subtitle}>
              Send to identify the bird species
            </Text>
          )}

          {isUploading && (
            <Text style={styles.subtitle}>
              Please wait while we identify the bird...
            </Text>
          )}
        </>
      )}

      {/* Show upload card if no result */}
      {!identificationResult && !recordingUri && !isUploading ? (
        <UploadCard
          onAudioSelected={handleAudioSelected}
          onAudioCleared={handleClearAudio}
          shouldClear={clearTrigger}
        />
      ) : identificationResult ? (
        // Show upload card again after result to upload another file
        <UploadCard
          onAudioSelected={(uri) => {
            setIdentificationResult(null);
            handleAudioSelected(uri);
          }}
          onAudioCleared={handleClearAudio}
          shouldClear={clearTrigger}
        />
      ) : (
        // Show send button when file is selected
        <SendButton
          onSend={() => {
            if (recordingUri && !isUploading)
              return handleUploadAudio(recordingUri);
          }}
        />
      )}

      {recordingUri && !identificationResult && (
        <View style={styles.buttonsContainer}>
          <ClearButton onClear={handleClearAudio} />
          <PlayButton uri={recordingUri} />
        </View>
      )}
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
  resultContainer: {
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
  },
  speciesName: {
    fontSize: Layout.fontSizes.xxl,
    fontWeight: "700",
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: Layout.spacing.sm,
  },
  scientificName: {
    fontSize: Layout.fontSizes.lg,
    fontStyle: "italic",
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  confidence: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: Layout.spacing.lg,
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
