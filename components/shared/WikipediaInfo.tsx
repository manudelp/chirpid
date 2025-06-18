import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import {
  BirdWikiInfo,
  fetchBirdWikipediaInfo,
  searchBirdWikipedia,
} from "@/lib/wikipediaService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WikipediaInfoProps {
  birdName: string;
  scientificName?: string;
}

export function WikipediaInfo({
  birdName,
  scientificName,
}: WikipediaInfoProps) {
  const [wikiInfo, setWikiInfo] = useState<BirdWikiInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try with the common name first
        let result = await fetchBirdWikipediaInfo(birdName);

        // If that fails and we have a scientific name, try with that
        if (result.error && scientificName) {
          result = await searchBirdWikipedia(scientificName);
        }

        // If still no luck, try with "bird" appended
        if (result.error) {
          result = await searchBirdWikipedia(birdName);
        }

        if (result.error) {
          setError(result.error);
        } else {
          setWikiInfo(result);
        }
      } catch (err) {
        setError("Failed to load Wikipedia information");
        console.error("Wikipedia fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [birdName, scientificName]);
  const handleWikipediaPress = async () => {
    if (wikiInfo?.pageUrl) {
      try {
        await Linking.openURL(wikiInfo.pageUrl);
      } catch (err) {
        console.error("Failed to open Wikipedia URL:", err);
      }
    }
  };
  const handleRetry = () => {
    // Trigger a re-fetch by changing a state value
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        // Try with the common name first
        let result = await fetchBirdWikipediaInfo(birdName);

        // If that fails and we have a scientific name, try with that
        if (result.error && scientificName) {
          result = await searchBirdWikipedia(scientificName);
        }

        // If still no luck, try with "bird" appended
        if (result.error) {
          result = await searchBirdWikipedia(birdName);
        }

        if (result.error) {
          setError(result.error);
        } else {
          setWikiInfo(result);
        }
      } catch (err) {
        setError("Failed to load Wikipedia information");
        console.error("Wikipedia fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="book-outline" size={20} color={Colors.dark.tint} />
          <Text style={styles.headerTitle}>Wikipedia Information</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.dark.tint} />
          <Text style={styles.loadingText}>Loading information...</Text>
        </View>
      </View>
    );
  }
  if (error || !wikiInfo) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="book-outline" size={20} color={Colors.dark.tint} />
          <Text style={styles.headerTitle}>Wikipedia Information</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>
            {error || "No Wikipedia information available"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Ionicons
              name="refresh-outline"
              size={16}
              color={Colors.dark.background}
            />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book-outline" size={20} color={Colors.dark.tint} />
        <Text style={styles.headerTitle}>Wikipedia Information</Text>
      </View>

      <View style={styles.content}>
        {wikiInfo.thumbnailUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: wikiInfo.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
        )}

        <View
          style={[
            styles.textContainer,
            wikiInfo.thumbnailUrl ? styles.textWithImage : null,
          ]}
        >
          <Text style={styles.title}>{wikiInfo.title}</Text>
          {wikiInfo.description ? (
            <Text style={styles.description} numberOfLines={0}>
              {wikiInfo.description}
            </Text>
          ) : null}
        </View>
      </View>

      {wikiInfo.pageUrl && (
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={handleWikipediaPress}
        >
          <Text style={styles.readMoreText}>Read more on Wikipedia</Text>
          <Ionicons name="open-outline" size={16} color={Colors.dark.tint} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const { width: screenWidth } = Dimensions.get("window");
const imageSize = Math.min(120, screenWidth * 0.25);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
    borderRadius: Layout.borderRadius.lg,
    marginHorizontal: Layout.spacing.lg,
    marginVertical: Layout.spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.dark.icon,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.dark.icon,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.icon,
  },
  headerTitle: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginLeft: Layout.spacing.xs,
  },
  content: {
    padding: Layout.spacing.md,
    minHeight: 100,
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
    fontFamily: "Inter_400Regular",
    marginVertical: Layout.spacing.sm,
    lineHeight: Layout.fontSizes.sm * 1.4,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.md,
    marginTop: Layout.spacing.sm,
  },
  retryText: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.background,
    fontFamily: "Inter_500Medium",
    marginLeft: Layout.spacing.xs,
  },
  imageContainer: {
    position: "absolute",
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    zIndex: 1,
  },
  thumbnail: {
    width: imageSize,
    height: imageSize,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.dark.icon,
  },
  textContainer: {
    flex: 1,
  },
  textWithImage: {
    paddingRight: imageSize + Layout.spacing.md,
  },
  title: {
    fontSize: Layout.fontSizes.lg,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    marginBottom: Layout.spacing.sm,
    lineHeight: Layout.fontSizes.lg * 1.2,
  },
  description: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.9,
    fontFamily: "Inter_400Regular",
    lineHeight: Layout.fontSizes.sm * 1.5,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.icon,
  },
  readMoreText: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.tint,
    fontFamily: "Inter_500Medium",
    marginRight: Layout.spacing.xs,
  },
});
