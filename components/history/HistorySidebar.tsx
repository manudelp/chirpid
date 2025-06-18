import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useBirdHistory } from "@/contexts/BirdHistoryContext";
import { BirdIdentification } from "@/types/bird";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistorySidebar() {
  const { history, isHistoryVisible, setHistoryVisible, clearHistory } =
    useBirdHistory();
  const navigateToBirdDetails = (bird: BirdIdentification) => {
    setHistoryVisible(false);
    router.push({
      pathname: "/bird-details",
      params: {
        id: bird.id,
        species: bird.species,
        scientificName: bird.scientificName || "",
        confidence: bird.confidence.toString(),
        timestamp: bird.timestamp.toISOString(),
        imageUrl: bird.imageUrl || "",
        wikipediaImageUrl: bird.wikipediaImageUrl || "",
        habitat: bird.habitat || "",
        diet: bird.diet || "",
        size: bird.size || "",
        wingspan: bird.wingspan || "",
        description: bird.description || "",
        conservationStatus: bird.conservationStatus || "",
      },
    });
  };
  const renderBirdItem = ({ item }: { item: BirdIdentification }) => {
    // Prioritize Wikipedia image over regular image
    const displayImage = item.wikipediaImageUrl || item.imageUrl;

    return (
      <TouchableOpacity
        style={styles.birdItem}
        onPress={() => navigateToBirdDetails(item)}
      >
        {" "}
        <View style={styles.birdItemContent}>
          {displayImage ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: displayImage }}
                style={styles.birdImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons
                name="image-outline"
                size={24}
                color={Colors.dark.icon}
              />
            </View>
          )}
          <View style={styles.birdInfo}>
            <View style={styles.birdHeader}>
              <Text style={styles.birdName} numberOfLines={1}>
                {item.species}
              </Text>
              <Text style={styles.confidence}>
                {Math.round(item.confidence * 100)}%
              </Text>
            </View>
            {item.scientificName && (
              <Text style={styles.scientificName} numberOfLines={1}>
                {item.scientificName}
              </Text>
            )}{" "}
            <Text style={styles.timestamp}>
              {item.timestamp.toLocaleDateString()} at{" "}
              {item.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      visible={isHistoryVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setHistoryVisible(false)}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bird History</Text>
          <View style={styles.headerActions}>
            {history.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearHistory}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setHistoryVisible(false)}
            >
              <Ionicons name="close" size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="list-outline"
                size={64}
                color={Colors.dark.text}
                opacity={0.3}
              />
              <Text style={styles.emptyTitle}>No Birds Identified Yet</Text>
              <Text style={styles.emptySubtitle}>
                Start recording bird songs to build your identification history
              </Text>
              <TouchableOpacity
                style={styles.startRecordingButton}
                onPress={() => {
                  setHistoryVisible(false);
                  router.push("/(tabs)");
                }}
              >
                <Ionicons name="mic" size={20} color={Colors.dark.background} />
                <Text style={styles.startRecordingText}>Start Recording</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.historyCount}>
                {history.length} {history.length === 1 ? "bird" : "birds"}{" "}
                identified
              </Text>
              <FlatList
                data={history}
                renderItem={renderBirdItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
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
  title: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "700",
    color: Colors.dark.text,
    fontFamily: "Inter_700Bold",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  clearButton: {
    padding: Layout.spacing.xs,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.xl,
  },
  emptyTitle: {
    fontSize: Layout.fontSizes.xl,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: Layout.fontSizes.md * 1.5,
    marginBottom: Layout.spacing.xl,
  },
  startRecordingButton: {
    backgroundColor: Colors.dark.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
  },
  startRecordingText: {
    color: Colors.dark.background,
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginLeft: Layout.spacing.sm,
  },
  historyCount: {
    fontSize: Layout.fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    fontFamily: "Inter_500Medium",
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  listContainer: {
    paddingBottom: Layout.spacing.xl,
  },
  birdItem: {
    backgroundColor: Colors.dark.backgroundElevated,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  birdItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  birdHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    alignItems: "center",
  },
  birdImage: {
    width: "100%",
    height: "100%",
    borderRadius: Layout.borderRadius.md,
  },
  placeholderImage: {
    width: 64,
    height: 64,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.dark.background,
    justifyContent: "center",
    alignItems: "center",
  },
  birdInfo: {
    flex: 1,
  },
  birdName: {
    fontSize: Layout.fontSizes.md,
    fontWeight: "600",
    color: Colors.dark.text,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  confidence: {
    fontSize: Layout.fontSizes.sm,
    color: Colors.dark.success,
    fontFamily: "Inter_500Medium",
    backgroundColor: Colors.dark.successBackground,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  scientificName: {
    fontSize: Layout.fontSizes.sm,
    fontStyle: "italic",
    color: Colors.dark.text,
    opacity: 0.8,
    fontFamily: "Inter_400Regular",
    marginBottom: Layout.spacing.xs,
  },
  timestamp: {
    fontSize: Layout.fontSizes.xs,
    color: Colors.dark.text,
    opacity: 0.6,
    fontFamily: "Inter_400Regular",
  },
});
