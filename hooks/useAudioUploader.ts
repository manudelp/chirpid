import { uploadAudio as apiUploadAudio } from "@/lib/api";
import { Alert } from "react-native";

export const useAudioUploader = () => {
  const uploadAudio = async (uri: string) => {
    try {
      console.log("Uploading audio via hook...");
      const result = await apiUploadAudio(uri);
      Alert.alert("Success", "Audio uploaded successfully!");
      return result;
    } catch (error) {
      console.error("Upload error in hook:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert(
        "Upload Failed",
        `Failed to upload audio file.\n\nError: ${errorMessage}`,
        [{ text: "OK" }]
      );
      throw error;
    }
  };

  return { uploadAudio };
};
