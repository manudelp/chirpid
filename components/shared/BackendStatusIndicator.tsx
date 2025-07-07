import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useBackendStatus } from "@/hooks/useBackendStatus";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BackendStatusIndicatorProps {
  showText?: boolean;
  size?: "small" | "medium";
}

export default function BackendStatusIndicator({
  showText = false,
  size = "small",
}: BackendStatusIndicatorProps) {
  const { isOnline, isLoading, refresh } = useBackendStatus();

  const getStatusColor = () => {
    if (isLoading) return Colors.dark.tabIconDefault;
    return isOnline ? "#22c55e" : "#ef4444"; // green for online, red for offline
  };

  const getStatusText = () => {
    if (isLoading) return "Checking...";
    return isOnline ? "Online" : "Offline";
  };

  const dotSize = size === "small" ? 8 : 12;
  const fontSize = size === "small" ? Layout.fontSizes.xs : Layout.fontSizes.sm;

  return (
    <TouchableOpacity
      style={[styles.container, size === "medium" && styles.containerMedium]}
      onPress={refresh}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: getStatusColor(),
            width: dotSize,
            height: dotSize,
          },
          isLoading && styles.dotPulsing,
        ]}
      />
      {showText && (
        <Text style={[styles.statusText, { fontSize }]}>{getStatusText()}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.xs,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.sm,
  },
  containerMedium: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  dot: {
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dotPulsing: {
    opacity: 0.6,
  },
  statusText: {
    color: Colors.dark.text,
    marginLeft: Layout.spacing.xs,
    fontWeight: "500",
  },
});
