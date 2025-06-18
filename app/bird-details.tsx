import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import {
  BirdWikiInfo,
  fetchBirdWikipediaInfo,
  searchBirdWikipedia,
} from "@/lib/wikipediaService";
import { BirdIdentification } from "@/types/bird";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BirdDetailsScreen() {
  const params = useLocalSearchParams();
  const [wikiInfo, setWikiInfo] = useState<BirdWikiInfo | null>(null);
  const [wikiLoading, setWikiLoading] = useState(true);
  const [wikiError, setWikiError] = useState<string | null>(null);
  // Parse the bird data from route params
  const bird: BirdIdentification = {
    id: params.id as string,
    species: params.species as string,
    scientificName: params.scientificName as string,
    confidence: parseFloat(params.confidence as string),
    timestamp: new Date(params.timestamp as string),
    habitat: params.habitat as string,
    diet: params.diet as string,
    size: params.size as string,
    wingspan: params.wingspan as string,
    description: params.description as string,
    conservationStatus: params.conservationStatus as string,
    imageUrl: params.imageUrl as string,
    wikipediaImageUrl: params.wikipediaImageUrl as string,
  };

  // Fetch Wikipedia data
  useEffect(() => {
    const fetchWikipediaData = async () => {
      setWikiLoading(true);
      setWikiError(null);

      try {
        // Try with the common name first
        let result = await fetchBirdWikipediaInfo(bird.species);

        // If that fails and we have a scientific name, try with that
        if (result.error && bird.scientificName) {
          result = await searchBirdWikipedia(bird.scientificName);
        }

        // If still no luck, try with "bird" appended
        if (result.error) {
          result = await searchBirdWikipedia(bird.species);
        }

        if (result.error) {
          setWikiError(result.error);
        } else {
          setWikiInfo(result);
        }
      } catch (err) {
        setWikiError("Failed to load information");
        console.error("Wikipedia fetch error:", err);
      } finally {
        setWikiLoading(false);
      }
    };

    fetchWikipediaData();
  }, [bird.species, bird.scientificName]);

  // Use Wikipedia data if available, otherwise fall back to bird data
  const displayImage =
    bird.wikipediaImageUrl || wikiInfo?.thumbnailUrl || bird.imageUrl;
  const displayDescription = wikiInfo?.description || bird.description;

  const handleWikipediaPress = async () => {
    if (wikiInfo?.pageUrl) {
      try {
        await Linking.openURL(wikiInfo.pageUrl);
      } catch (err) {
        console.error("Failed to open Wikipedia URL:", err);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bird Details</Text>
        <View style={styles.placeholder} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="share-outline" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bird Image */}
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.birdImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons
              name="image-outline"
              size={60}
              color={Colors.dark.text}
              opacity={0.3}
            />
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
        {/* Main Information */}
        <View style={styles.mainInfo}>
          <Text style={styles.speciesName}>{bird.species}</Text>
          {bird.scientificName && (
            <Text style={styles.scientificName}>{bird.scientificName}</Text>
          )}

          <View style={styles.confidenceContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.confidence}>
              {Math.round(bird.confidence * 100)}% Confidence
            </Text>
          </View>

          <Text style={styles.timestamp}>
            Identified on {bird.timestamp.toLocaleDateString()} at{" "}
            {bird.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {/* Additional Information */}
        <View style={styles.detailsContainer}>
          {wikiLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
              <Text style={styles.loadingText}>Loading information...</Text>
            </View>
          ) : wikiError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
              <Text style={styles.errorText}>
                Unable to load detailed information
              </Text>
              <Text style={styles.errorSubtext}>{wikiError}</Text>
            </View>
          ) : (
            <>
              {displayDescription && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.sectionContent}>
                    {displayDescription}
                  </Text>

                  {/* Wikipedia Attribution */}
                  {wikiInfo && !wikiError && (
                    <View style={styles.wikipediaAttribution}>
                      <Text style={styles.attributionText}>
                        Information retrieved from Wikipedia
                      </Text>
                      <TouchableOpacity
                        style={styles.wikipediaButton}
                        onPress={handleWikipediaPress}
                      >
                        <Ionicons
                          name="open-outline"
                          size={16}
                          color={Colors.dark.background}
                        />
                        <Text style={styles.wikipediaButtonText}>
                          View on Wikipedia
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.recordAgainButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Ionicons name="mic" size={20} color={Colors.dark.background} />
            <Text style={styles.recordAgainText}>Record Another Bird</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.icon,
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  headerTitle: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
  },
  placeholder: {
    width: 32, // Same width as back button for centering
  },
  content: {
    flex: 1,
  },
  birdImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 250,
    backgroundColor: Colors.dark.icon,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.dark.text,
    opacity: 0.5,
    marginTop: Layout.spacing.sm,
    fontFamily: "Inter_400Regular",
  },
  mainInfo: {
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.icon,
  },
  speciesName: {
    fontSize: Layout.fontSizes.xxl,
    fontWeight: "700",
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
    marginBottom: Layout.spacing.xs,
  },
  scientificName: {
    fontSize: Layout.fontSizes.lg,
    fontStyle: "italic",
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    marginBottom: Layout.spacing.md,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  confidence: {
    fontSize: Layout.fontSizes.md,
    color: "#4CAF50",
    fontFamily: "Inter_500Medium",
    marginLeft: Layout.spacing.xs,
  },
  timestamp: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
  },
  detailsContainer: {
    padding: Layout.spacing.lg,
  },
  detailSection: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.sm,
  },
  sectionContent: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.9,
    fontFamily: "Inter_400Regular",
    lineHeight: Layout.fontSizes.md * 1.5,
  },
  infoRow: {
    marginBottom: Layout.spacing.lg,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  infoTitle: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginLeft: Layout.spacing.sm,
  },
  infoContent: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    marginLeft: Layout.spacing.xl,
  },
  footer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  recordAgainButton: {
    backgroundColor: Colors.dark.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
  },
  recordAgainText: {
    color: Colors.dark.background,
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginLeft: Layout.spacing.sm,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.xl,
  },
  loadingText: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
    marginLeft: Layout.spacing.sm,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },
  errorText: {
    fontSize: Layout.fontSizes.sm,
    color: "#FF6B6B",
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    marginVertical: Layout.spacing.xs,
  },
  errorSubtext: {
    fontSize: Layout.fontSizes.xs,
    color: "#FF6B6B",
    opacity: 0.8,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  wikipediaAttribution: {
    marginTop: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.icon,
    alignItems: "center",
  },
  attributionText: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
    marginBottom: Layout.spacing.sm,
  },
  wikipediaButton: {
    backgroundColor: Colors.dark.tint,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
  },
  wikipediaButtonText: {
    color: Colors.dark.background,
    fontSize: Layout.fontSizes.sm,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    marginLeft: Layout.spacing.xs,
  },
});
