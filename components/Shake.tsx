import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { accelerometer } from "react-native-sensors";
import { Subscription } from 'rxjs';

const Shake = () => {
  const [shakeDetected, setShakeDetected] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeStrengthMessage, setShakeStrengthMessage] = useState('');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Thresholds for shake strength
  const LIGHT_SHAKE_THRESHOLD = 15;
  const MEDIUM_SHAKE_THRESHOLD = 25;
  const STRONG_SHAKE_THRESHOLD = 40;

  useEffect(() => {
    // Subscribe to accelerometer updates
    const newSubscription = accelerometer.subscribe(
      (sensorData) => {
        const { x, y, z } = sensorData;
        const acceleration = Math.sqrt(x * x + y * y + z * z); // Calculate the total acceleration

        console.log("acceleration: ", acceleration);

        if (acceleration > STRONG_SHAKE_THRESHOLD) {
          // Strong shake detected, update the message
          setShakeDetected(true);
          setShakeStrengthMessage('Strong Shake Detected!');
          setShakeCount(prevCount => prevCount + 1);
        } else if (acceleration > MEDIUM_SHAKE_THRESHOLD) {
          // Medium shake detected, but only set the message if it wasn't already strong
          if (!shakeDetected) {
            setShakeDetected(true);
            setShakeStrengthMessage('Medium Shake Detected!');
            setShakeCount(prevCount => prevCount + 1);
          }
        } else if (acceleration > LIGHT_SHAKE_THRESHOLD) {
          // Light shake detected, but only set the message if it wasn't already medium or strong
          if (!shakeDetected) {
            setShakeDetected(true);
            setShakeStrengthMessage('Light Shake Detected!');
            setShakeCount(prevCount => prevCount + 1);
          }
        } else {
          // No shake detected
          setShakeDetected(false);
          //setShakeStrengthMessage('');
        }
      },
      (error) => {
        console.error('Error in accelerometer:', error);
      }
    );

    setSubscription(newSubscription);

    // Clean up the subscription when the component unmounts
    return () => {
      if (newSubscription) {
        newSubscription.unsubscribe();
      }
    };
  }, [shakeDetected]); // Re-run effect if shakeDetected changes

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        {shakeDetected ? shakeStrengthMessage : 'No Shake Detected'}
      </Text>
      <Text style={{ fontSize: 18 }}>
        Shake Count: {shakeCount}
      </Text>
      <TouchableOpacity onPress={() => setShakeCount(0)} style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, color: 'blue' }}>Reset Shake Count</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Shake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  }
});
