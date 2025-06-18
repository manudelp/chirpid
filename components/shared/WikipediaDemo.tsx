import { WikipediaInfo } from "@/components/shared/WikipediaInfo";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

/**
 * Demo component showcasing the Wikipedia integration
 * This demonstrates the WikipediaInfo component with different bird species
 */
export function WikipediaDemo() {
  const demoSpecies = [
    {
      commonName: "American Robin",
      scientificName: "Turdus migratorius",
    },
    {
      commonName: "Northern Cardinal",
      scientificName: "Cardinalis cardinalis",
    },
    {
      commonName: "Blue Jay",
      scientificName: "Cyanocitta cristata",
    },
    {
      commonName: "House Sparrow",
      scientificName: "Passer domesticus",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Wikipedia Integration Demo</Text>
          <Text style={styles.subtitle}>
            This component fetches real-time bird information from
            Wikipedia&apos;s REST API. Each card demonstrates different aspects
            of the integration including loading states, error handling, and
            data display.
          </Text>
        </View>

        {demoSpecies.map((species, index) => (
          <View key={index} style={styles.demoSection}>
            <Text style={styles.sectionTitle}>
              {species.commonName} ({species.scientificName})
            </Text>
            <WikipediaInfo
              birdName={species.commonName}
              scientificName={species.scientificName}
            />
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>The Wikipedia service includes:</Text>
          <Text style={styles.featureText}>
            • Automatic fallback from common name to scientific name
          </Text>
          <Text style={styles.featureText}>
            • Error handling for missing or ambiguous pages
          </Text>
          <Text style={styles.featureText}>
            • Loading states and retry functionality
          </Text>
          <Text style={styles.featureText}>
            • Responsive layout with image integration
          </Text>
          <Text style={styles.featureText}>
            • Direct links to Wikipedia pages
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.icon,
  },
  title: {
    fontSize: Layout.fontSizes.xxl,
    fontWeight: "700",
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
    marginBottom: Layout.spacing.sm,
  },
  subtitle: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    lineHeight: Layout.fontSizes.md * 1.5,
  },
  demoSection: {
    marginVertical: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  footer: {
    padding: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.icon,
  },
  footerText: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.md,
  },
  featureText: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.9,
    fontFamily: "Inter_400Regular",
    marginBottom: Layout.spacing.xs,
    paddingLeft: Layout.spacing.sm,
  },
});
