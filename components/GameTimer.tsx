import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GameTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load the timer value from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTimerValue = async () => {
      try {
        const savedTime = await AsyncStorage.getItem("gameTimer");
        if (savedTime !== null) {
          setSeconds(JSON.parse(savedTime)); // Set the timer to the saved value
        }
      } catch (error) {
        console.error("Error loading timer value", error);
      }
    };

    loadTimerValue();
  }, []); // Runs only once when the component mounts

  // Save the timer value to AsyncStorage
  const saveTimerValue = async (value: number) => {
    try {
      await AsyncStorage.setItem("gameTimer", JSON.stringify(value));
      console.log("Timer saved:", value);
    } catch (error) {
      console.error("Error saving timer value", error);
    }
  };

  // Start the timer
  const startTimer = () => {
    if (intervalRef.current) return;

    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const newTime = prev + 1;
        saveTimerValue(newTime); // Save the updated time to AsyncStorage
        return newTime;
      });
    }, 1000);
  };

  // Pause the timer
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  // Reset the timer
  const resetTimer = () => {
    pauseTimer();
    setSeconds(0);
    saveTimerValue(0); // Reset the saved time in AsyncStorage
  };

  // Format time as MM:SS
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <View style={styles.buttons}>
        <Button
          title={isRunning ? "Pause" : "Start"}
          onPress={isRunning ? pauseTimer : startTimer}
        />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
};

export default GameTimer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 100,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 30,
  },
  buttons: {
    flexDirection: "row",
    gap: 20,
  },
});