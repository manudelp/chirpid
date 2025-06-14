import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import RecordButton from "../../components/record/RecordButton";
import { Colors } from "../../constants/Colors";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [amplitudes, setAmplitudes] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const statusListener = (status: any) => {
    if (status?.isRecording) {
      const meteringValue = status?.metering ?? Math.random() * -60;
      const normalized = Math.max(0.1, Math.min(1, (meteringValue + 60) / 60));
      setAmplitudes((prev) => [...prev.slice(-150), normalized * 50]); // Keep more points and scale appropriately
    } else {
      setAmplitudes([]);
    }
  };

  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    statusListener
  );

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording ? "Listening..." : "Tap to Record"}
      </Text>
      <RecordButton
        recording={isRecording}
        startRecording={record}
        stopRecording={stopRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
  },
  waveform: {
    position: "absolute",
    bottom: 50,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)", // Add background for visibility debugging
    borderRadius: 8,
  },
});

export default HomeScreen;
