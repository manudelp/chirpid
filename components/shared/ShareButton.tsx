import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface ShareButtonProps {
  onClick?: () => void;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  onClick,
  className = "",
}) => {
  const handleShare = () => {
    if (onClick) {
      onClick();
    } else if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      console.log("Web Share API not supported");
      // Could implement a custom share dialog here
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
