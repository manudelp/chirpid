import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tabIconSelected,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.icon,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: Layout.spacing.md,
        },
        tabBarItemStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: Layout.spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: Layout.fontSizes.sm,
          fontWeight: "500",
          color: Colors.dark.text,
          alignSelf: "center",
          fontFamily: "Inter_500Medium",
        },
        tabBarIconStyle: {
          alignSelf: "center",
        },
        headerTitle: "ChirpID",
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTitleStyle: {
          fontSize: Layout.fontSizes.lg,
          color: Colors.dark.text,
          fontFamily: "Inter_500Medium",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Record",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
