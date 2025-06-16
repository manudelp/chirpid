import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 20, fontSize: 16, color: "#666" }}>
        Loading ChirpID...
      </Text>
    </View>
  );
}

function AppContent() {
  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        if (fontsLoaded || fontError) {
          // Hide the splash screen once we know the root view has already performed layout
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.warn("Error during app preparation:", e);
        // Even if there's an error, we should try to show the app
        setIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return <LoadingScreen />;
  }

  // Show loading screen while preparing
  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // Add animation configuration
          animation: "slide_from_right",
        }}
      />
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
