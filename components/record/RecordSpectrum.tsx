import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

interface RecordSpectrumProps {
  metering: number | null;
}

const BAR_COUNT = 40;

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
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [metering]);

  if (metering === null) return null;

  const normalized = Math.max(0, Math.min(1, (metering + 60) / 60));

  return (
    <View style={styles.container}>
      {noiseOffsets.map((offset, i) => {
        const t = (animationTime + offset) * 0.002;
        const noise = Math.abs(Math.sin(t)); // pseudo-random, per-bar phase offset
        const height = 8 + 40 * normalized * noise;
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height,
                opacity: 0.7 + normalized * 0.3,
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
    height: 60,
    gap: Layout.spacing.xs,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
  },
  bar: {
    width: Layout.spacing.xs,
    backgroundColor: Colors.dark.tint,
    borderRadius: Layout.borderRadius.sm / 2, // 3
  },
});

export default RecordSpectrum;
