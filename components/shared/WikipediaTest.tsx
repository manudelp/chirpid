import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { BirdWikiInfo, fetchBirdWikipediaInfo } from "@/lib/wikipediaService";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Test component for the Wikipedia API integration
 * Allows manual testing of bird name lookups
 */
export function WikipediaTest() {
  const [birdName, setBirdName] = useState("American Robin");
  const [result, setResult] = useState<BirdWikiInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const testWikipediaAPI = async () => {
    if (!birdName.trim()) {
      Alert.alert("Error", "Please enter a bird name");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const apiResult = await fetchBirdWikipediaInfo(birdName.trim());
      setResult(apiResult);

      if (apiResult.error) {
        Alert.alert("API Error", apiResult.error);
      } else {
        Alert.alert("Success", `Found information for: ${apiResult.title}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Network Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Wikipedia API Test</Text>
        <Text style={styles.description}>
          Enter a bird name to test the Wikipedia integration
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bird Name:</Text>
          <TextInput
            style={styles.textInput}
            value={birdName}
            onChangeText={setBirdName}
            placeholder="Enter bird name (e.g., American Robin)"
            placeholderTextColor={Colors.dark.text + "80"}
          />
        </View>

        <TouchableOpacity
          style={[styles.testButton, loading && styles.testButtonDisabled]}
          onPress={testWikipediaAPI}
          disabled={loading}
        >
          <Text style={styles.testButtonText}>
            {loading ? "Testing..." : "Test Wikipedia API"}
          </Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>API Response:</Text>

            <View style={styles.resultField}>
              <Text style={styles.fieldLabel}>Title:</Text>
              <Text style={styles.fieldValue}>{result.title}</Text>
            </View>

            {result.description && (
              <View style={styles.resultField}>
                <Text style={styles.fieldLabel}>Description:</Text>
                <Text style={styles.fieldValue} numberOfLines={5}>
                  {result.description}
                </Text>
              </View>
            )}

            {result.thumbnailUrl && (
              <View style={styles.resultField}>
                <Text style={styles.fieldLabel}>Thumbnail URL:</Text>
                <Text style={styles.fieldValue} numberOfLines={2}>
                  {result.thumbnailUrl}
                </Text>
              </View>
            )}

            {result.pageUrl && (
              <View style={styles.resultField}>
                <Text style={styles.fieldLabel}>Page URL:</Text>
                <Text style={styles.fieldValue} numberOfLines={2}>
                  {result.pageUrl}
                </Text>
              </View>
            )}

            {result.error && (
              <View style={styles.resultField}>
                <Text style={styles.fieldLabel}>Error:</Text>
                <Text style={[styles.fieldValue, styles.errorText]}>
                  {result.error}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.quickTests}>
          <Text style={styles.quickTestsTitle}>Quick Tests:</Text>
          {[
            "American Robin",
            "Northern Cardinal",
            "Blue Jay",
            "InvalidBirdName123",
          ].map((testName) => (
            <TouchableOpacity
              key={testName}
              style={styles.quickTestButton}
              onPress={() => setBirdName(testName)}
            >
              <Text style={styles.quickTestText}>{testName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSizes.xxl,
    fontWeight: "700",
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    marginBottom: Layout.spacing.xl,
    lineHeight: Layout.fontSizes.md * 1.5,
  },
  inputContainer: {
    marginBottom: Layout.spacing.lg,
  },
  label: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.dark.icon,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderColor: Colors.dark.icon,
  },
  testButton: {
    backgroundColor: Colors.dark.tint,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testButtonText: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.background,
    fontFamily: "Inter_600SemiBold",
  },
  resultContainer: {
    backgroundColor: Colors.dark.icon,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  resultTitle: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.md,
  },
  resultField: {
    marginBottom: Layout.spacing.md,
  },
  fieldLabel: {
    fontSize: Layout.fontSizes.sm,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.xs,
  },
  fieldValue: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.9,
    fontFamily: "Inter_400Regular",
    lineHeight: Layout.fontSizes.sm * 1.4,
  },
  errorText: {
    color: "#FF6B6B",
  },
  quickTests: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.icon,
    paddingTop: Layout.spacing.lg,
  },
  quickTestsTitle: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.md,
  },
  quickTestButton: {
    backgroundColor: Colors.dark.icon,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
  },
  quickTestText: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    fontFamily: "Inter_400Regular",
  },
});
