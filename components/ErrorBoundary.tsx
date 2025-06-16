import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || "No stack trace available",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Log error for debugging
    const errorMessage = `
      Error: ${error.message}
      Stack: ${error.stack}
      Component Stack: ${errorInfo.componentStack}
    `;

    console.error("Full error details:", errorMessage);

    // You can also send this to a logging service
    // crashlytics().recordError(error);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleShowDetails = () => {
    const { error, errorInfo } = this.state;
    Alert.alert("Error Details", `${error?.message}\n\n${errorInfo}`, [
      { text: "OK" },
    ]);
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Oops! Something went wrong
            </Text>

            <Text
              style={{
                fontSize: 16,
                marginBottom: 30,
                textAlign: "center",
                color: "#666",
              }}
            >
              The app encountered an unexpected error. This information helps us
              fix the problem.
            </Text>

            <ScrollView
              style={{
                maxHeight: 200,
                backgroundColor: "#f0f0f0",
                padding: 15,
                marginBottom: 20,
                width: "100%",
              }}
            >
              <Text style={{ fontFamily: "monospace", fontSize: 12 }}>
                {this.state.error?.message}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 8,
                marginBottom: 10,
              }}
              onPress={this.handleRestart}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Try Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#FF3B30",
                paddingHorizontal: 30,
                paddingVertical: 15,
                borderRadius: 8,
              }}
              onPress={this.handleShowDetails}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Show Details
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}
