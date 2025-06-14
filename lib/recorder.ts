import { AudioModule } from "expo-audio";

export const requestRecordingPermissions = async (): Promise<boolean> => {
  const { granted } = await AudioModule.requestRecordingPermissionsAsync();
  return granted;
};

export const pollMetering = (
  recorder: any,
  onMetering: (value: number | null) => void
): (() => void) => {
  const interval = setInterval(() => {
    const status = recorder.getStatus();
    if (status?.isRecording && typeof status.metering === "number") {
      onMetering(status.metering);
    }
  }, 100);

  return () => clearInterval(interval);
};
