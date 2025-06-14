import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useAudioUploader } from "../../hooks/useAudioUploader";

const UploadCard = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const { uploadAudio } = useAudioUploader();

  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
    if (result.canceled === false) {
      const asset = result.assets[0];
      setFileName(asset.name);
      await uploadAudio(asset.uri);
    }
  };

  return (
    <View>
      {!fileName && (
        <Pressable style={styles.uploadButton} onPress={handlePick}>
          <Ionicons name="cloud-upload" size={80} color={Colors.dark.text} />
        </Pressable>
      )}
      {fileName && <Text style={styles.fileName}>{fileName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.dark.tint,
    justifyContent: "center",
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    color: Colors.dark.text,
    fontFamily: "Inter_400Regular",
  },
});

export default UploadCard;
