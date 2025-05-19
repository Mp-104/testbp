import { NativeModules } from 'react-native';

const { OverlayModule } = NativeModules;

type UsageCallback = (packageName: string, timeSpent: number) => void;
type ErrorCallback = (error: string) => void;

class UsageTrackingService {
  startTrackingUsage(onSuccess: UsageCallback, onError: ErrorCallback) {
    if (OverlayModule && OverlayModule.startTrackingUsage) {
      OverlayModule.startTrackingUsage(onSuccess, onError);
    } else {
      onError('Native module not found');
    }
  }

  stopTrackingUsage() {
    if (OverlayModule && OverlayModule.stopTrackingUsage) {
      OverlayModule.stopTrackingUsage();
    }
  }
}

export default new UsageTrackingService();
