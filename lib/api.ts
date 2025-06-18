// api.ts
import { createAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system";

interface UploadResponse {
  success: boolean;
  id?: string;
  message?: string;
  result?: {
    species: string;
    confidence: number;
    scientificName?: string;
  };
}

export type { UploadResponse };

interface PingResponse {
  status: string;
  message: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

if (!API_BASE_URL) {
  throw new Error(
    "API base URL is not defined. Set EXPO_PUBLIC_API_URL in your environment variables."
  );
}

// Test connection to backend
export async function pingBackend(): Promise<PingResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as PingResponse;
  } catch (error) {
    console.error("Backend ping failed:", error);
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function to validate audio duration
export async function validateAudioDuration(uri: string): Promise<void> {
  const player = createAudioPlayer({ uri });

  try {
    await new Promise<void>((resolve, reject) => {
      const check = setInterval(() => {
        if (player.duration && player.duration > 0) {
          clearInterval(check);
          if (player.duration > 60) {
            reject(new Error("Audio file must be 60 seconds or less"));
          } else if (player.duration < 5) {
            reject(new Error("Audio file must be at least 5 seconds long"));
          } else {
            resolve();
          }
        }
      }, 50);
      setTimeout(() => reject(new Error("Duration check timed out")), 2000);
    });
  } finally {
    player.remove();
  }
}

export async function uploadAudio(uri: string): Promise<UploadResponse> {
  const apiUrl = `${API_BASE_URL}/api/audio/upload`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error("File does not exist");

    // Validate audio duration before upload
    await validateAudioDuration(uri);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.wav",
      type: "audio/wav",
    } as unknown as Blob);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = (await response.json()) as { error?: string };
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response isn't JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // For now, return a dummy response until backend logic is implemented
    // TODO: Remove these dummy responses when backend returns real bird identification
    const dummyResponses: UploadResponse[] = [
      {
        success: true,
        id: `upload_${Date.now()}`,
        message: "Bird identification completed",
        result: {
          species: "American Robin",
          confidence: 0.87,
          scientificName: "Turdus migratorius",
        },
      },
      {
        success: true,
        id: `upload_${Date.now()}`,
        message: "Bird identification completed",
        result: {
          species: "Northern Cardinal",
          confidence: 0.92,
          scientificName: "Cardinalis cardinalis",
        },
      },
      {
        success: true,
        id: `upload_${Date.now()}`,
        message: "Bird identification completed",
        result: {
          species: "Blue Jay",
          confidence: 0.84,
          scientificName: "Cyanocitta cristata",
        },
      },
    ];

    // Select a random response from the array
    const dummyResponse =
      dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return dummyResponse;
    // return (await response.json()) as UploadResponse;
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown upload error occurred");
  }
}
