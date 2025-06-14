import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UploadCard from "../../components/upload/UploadCard";
import { Colors } from "../../constants/Colors";

const ExploreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Audio</Text>
      <UploadCard />
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
});

export default ExploreScreen;
