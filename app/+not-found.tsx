import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import Layout from "../constants/Layout";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Page Not Found</Text>
      <Text style={styles.message}>
        The page you&apos;re looking for does not exist.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "bold",
    marginBottom: Layout.spacing.sm,
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
  },
  message: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.icon,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
