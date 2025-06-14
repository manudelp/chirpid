import { AudioModule } from "expo-audio";
import { useEffect, useState } from "react";

export const useMicrophonePermission = () => {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      setGranted(granted);
    })();
  }, []);

  return granted;
};
