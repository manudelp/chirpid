import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { uploadAudio } from "../../lib/api";
import SendButton from "../shared/SendButton";

interface UploadCardProps {
  onAudioSelected: (uri: string) => void;
  onAudioCleared: () => void;
  shouldClear?: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({
  onAudioSelected,
  onAudioCleared,
  shouldClear,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // Listen for external clear events
  useEffect(() => {
    if (shouldClear) {
      setFileName(null);
      setAudioUri(null);
    }
  }, [shouldClear]);

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.canceled === false) {
      const asset = result.assets[0];
      setFileName(asset.name);
      setAudioUri(asset.uri);
      onAudioSelected(asset.uri);
    }
  };

  const handleClearAudio = () => {
    setFileName(null);
    setAudioUri(null);
    onAudioCleared();
  };

  const handleUploadAudio = async () => {
    if (!audioUri) return;

    try {
      console.log("Uploading audio to backend...");
      await uploadAudio(audioUri);
      handleClearAudio();
      Alert.alert("Success", "Chirp sent successfully!");
    } catch (error) {
      console.error("Failed to send chirp:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert(
        "Upload Failed",
        `Failed to send chirp to backend.\n\nError: ${errorMessage}`,
        [
          { text: "Retry", onPress: () => handleUploadAudio() },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };
  return (
    <View>
      {!fileName && (
        <Pressable
          style={styles.uploadButton}
          onPress={handlePick}
          hitSlop={Layout.hitSlop.lg}
        >
          <Ionicons
            name="cloud-upload"
            size={Layout.iconSizes.xxl + Layout.spacing.md}
            color={Colors.dark.text}
          />
        </Pressable>
      )}
      {fileName && !audioUri && <Text style={styles.fileName}>{fileName}</Text>}
      {fileName && audioUri && (
        <View style={styles.uploadedContainer}>
          <SendButton onSend={handleUploadAudio} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    width: 150,
    height: 150,
    borderRadius: Layout.borderRadius.circle,
    backgroundColor: Colors.dark.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedContainer: {
    alignItems: "center",
  },
  fileName: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    fontFamily: "Inter_400Regular",
    marginTop: Layout.spacing.md,
    textAlign: "center",
  },
  analyzeText: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "600",
    marginBottom: Layout.spacing.lg,
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});

export default UploadCard;
