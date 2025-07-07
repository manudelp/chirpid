import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { useBirdHistory } from "@/contexts/BirdHistoryContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackendStatusIndicator from "./BackendStatusIndicator";

export default function TabsHeader() {
  const { setHistoryVisible, history } = useBirdHistory();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("@/assets/images/logo-transparent.png")}
            style={{
              width: 32,
              height: 32,
              marginRight: Layout.spacing.xs,
              tintColor: Colors.dark.text,
            }}
          />
          <Text style={styles.title}>ChirpID</Text>
          <BackendStatusIndicator size="small" />
        </View>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setHistoryVisible(true)}
        >
          <Ionicons name="time-outline" size={24} color={Colors.dark.text} />
          {history.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {history.length > 99 ? "99+" : history.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: Layout.fontSizes.lg,
    color: Colors.dark.text,
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
  },
  historyButton: {
    position: "relative",
    padding: Layout.spacing.xs,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.dark.tint,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.dark.background,
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
