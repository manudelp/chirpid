import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Stack } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <ScrollView style={styles.container}>
        <Stack.Screen options={{ title: "About" }} />

        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo-transparent.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>ChirpID</Text>
          <Text style={styles.version}>v0.1.0 alpha</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Overview</Text>
          <Text style={styles.paragraph}>
            ChirpID identifies bird species by analyzing chirps using audio
            recognition and machine learning. Record sounds in the field and
            receive real-time species predictions through our advanced AI
            identification system.
          </Text>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: As of June 14, 2025, ChirpID supports only bird species native
            to Argentina. Expansion to other regions is underway.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureList}>
            {[
              "Record and upload bird chirps",
              "Real-time species identification",
              "Detailed species information",
              "Geo-tagged observations and history",
              "Offline caching with deferred uploads",
            ].map((item, idx) => (
              <Text key={idx} style={styles.feature}>
                {`• ${item}`}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@chirpid.com")}
          >
            support@chirpid.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © {currentYear} ChirpID. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
  },
  header: {
    alignItems: "center",
    marginVertical: Layout.spacing.xl,
  },
  logo: {
    width: Layout.iconSizes.xxl + Layout.spacing.xl,
    height: Layout.iconSizes.xxl + Layout.spacing.xl,
  },
  appName: {
    fontSize: Layout.fontSizes.xxl + Layout.spacing.xs,
    fontWeight: "bold",
    color: Colors.dark.tint,
    marginBottom: 0,
  },
  version: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  paragraph: {
    fontSize: Layout.fontSizes.md,
    lineHeight: Layout.fontSizes.md * 1.5,
    color: Colors.dark.text,
  },
  noteContainer: {
    backgroundColor: "#2A2A00",
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  noteText: {
    fontSize: Layout.fontSizes.sm,
    lineHeight: Layout.fontSizes.sm * 1.6,
    color: "#FFF176",
    fontStyle: "italic",
  },
  featureList: {
    paddingLeft: Layout.spacing.xs,
  },
  feature: {
    fontSize: Layout.fontSizes.md,
    lineHeight: Layout.fontSizes.md * 1.5,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  link: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.link,
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: Layout.spacing.xxl,
    marginBottom: Layout.spacing.xxl + Layout.spacing.sm,
    alignItems: "center",
  },
  copyright: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.textTertiary,
  },
});
