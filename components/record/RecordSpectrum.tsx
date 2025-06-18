import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface RecordSpectrumProps {
  metering: number | null;
}

const BAR_COUNT = 30;

const RecordSpectrum: React.FC<RecordSpectrumProps> = ({ metering }) => {
  const [animationTime, setAnimationTime] = useState(0);

  const noiseOffsets = useMemo(
    () => Array.from({ length: BAR_COUNT }, () => Math.random() * 1000),
    []
  );

  // Create animation loop to update the bars
  useEffect(() => {
    if (metering === null) return;

    const interval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 50);

    return () => clearInterval(interval);
  }, [metering]);

  if (metering === null) return null;

  // Use fallback value if metering is not working properly
  const meteringValue = typeof metering === "number" ? metering : -30;
  const normalized = Math.max(0.2, Math.min(1, (meteringValue + 60) / 60));

  return (
    <View style={styles.container}>
      {noiseOffsets.map((offset, i) => {
        const t = (animationTime + offset) * 0.003;
        const noise = (Math.sin(t) + 1) / 2;
        const baseHeight = 12;
        const maxHeight = 50;
        const height = baseHeight + maxHeight * normalized * noise;

        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: Math.max(baseHeight, height),
                opacity: Math.max(0.4, 0.6 + normalized * 0.4),
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: Layout.buttonSizes.xl + Layout.spacing.lg, // 100px equivalent
    gap: Layout.spacing.xs,
    paddingBottom: Layout.spacing.lg,
  },
  bar: {
    width: Layout.spacing.xs + 2, // 6px equivalent
    backgroundColor: Colors.dark.tint,
    borderRadius: Layout.borderRadius.sm / 2,
    minHeight: Layout.spacing.sm + Layout.spacing.xs, // 12px equivalent
  },
});

export default RecordSpectrum;
