export const useAudioUploader = () => {
  const uploadAudio = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "recording.wav",
      type: "audio/wav",
    } as any);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    return response.json();
  };

  return { uploadAudio };
};
