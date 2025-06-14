import * as Permissions from "expo-permissions";
import { useEffect, useState } from "react";

export const useMicrophonePermission = () => {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      setGranted(status === "granted");
    })();
  }, []);

  return granted;
};
