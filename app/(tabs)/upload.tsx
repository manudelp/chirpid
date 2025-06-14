import React from "react";
import { StyleSheet, Text, View } from "react-native";
import UploadCard from "../../components/upload/UploadCard";
import { Colors } from "../../constants/Colors";
import Layout from "../../constants/Layout";

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
});

export default ExploreScreen;
