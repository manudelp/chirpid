import { Colors } from "@/constants/Colors";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface RecordSpectrumProps {
  metering: number | null;
}

const BAR_COUNT = 40;

const RecordSpectrum: React.FC<RecordSpectrumProps> = ({ metering }) => {
  const noiseOffsets = useMemo(
    () => Array.from({ length: BAR_COUNT }, () => Math.random() * 1000),
    []
  );

  if (metering === null) return null;

  const normalized = Math.max(0, Math.min(1, (metering + 60) / 60));
  const now = performance.now();

  return (
    <View style={styles.container}>
      {noiseOffsets.map((offset, i) => {
        const t = (now + offset) * 0.002;
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
    gap: 4,
    paddingBottom: 16,
    backgroundColor: Colors.dark.background,
  },
  bar: {
    width: 4,
    backgroundColor: Colors.dark.tint,
    borderRadius: 2,
  },
});

export default RecordSpectrum;
