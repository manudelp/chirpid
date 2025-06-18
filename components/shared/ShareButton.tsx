import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, Share } from "react-native";

interface ShareButtonProps {
  onClick?: () => void;
  className?: string;
  title: string;
  url: string;
  message: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  className = "",
  title,
  url,
  message = "",
}) => {
  const handleShare = async () => {
    if (onClick) {
      onClick();
      return;
    }

    try {
      // For React Native environments (iOS/Android native apps)
      if (Platform?.OS === "ios" || Platform?.OS === "android") {
        await Share.share({
          title,
          message: message || url,
          url,
        });
        return;
      }

      // For web browsers supporting Web Share API
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          url,
          text: message,
        });
        return;
      }

      // Fallback for unsupported browsers
      console.log("Web Share API not supported");
      // Here you could implement a custom share dialog
      // or copy to clipboard functionality
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Share"
    >
      <Ionicons name="share-social-outline" size={24} color="currentColor" />
    </button>
  );
};

export default ShareButton;
