// api.ts

export const uploadAudio = async (uri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "recording.wav",
    type: "audio/wav",
  } as any);

  return await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};
