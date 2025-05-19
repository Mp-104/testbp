import React, { useEffect } from 'react';
import { NativeEventEmitter, NativeModules, Button, Text, View, Alert } from 'react-native';

const { OverlayModule } = NativeModules;
const usageEmitter = new NativeEventEmitter(OverlayModule);

const OverlayModuleComponent = () => {
  useEffect(() => {
    const usageListener = usageEmitter.addListener('UsageUpdate', (data) => {
      console.log(`App: ${data.packageName}, Time Spent: ${data.timeSpent} ms`);
    });

    const errorListener = usageEmitter.addListener('UsageError', (err) => {
      console.error('Tracking error:', err.error);
    });

    
    OverlayModule.startTrackingUsage();
     

    return () => {
      usageListener.remove();
      errorListener.remove();
      OverlayModule.stopTrackingUsage();
    };
  }, []);

  return (
    <View>
      <Text>Tracking App Usage Every 15 Seconds...</Text>
      <Button title="Stop Tracking" onPress={() => OverlayModule.stopTrackingUsage()} />
    </View>
  );
};

export default OverlayModuleComponent;
