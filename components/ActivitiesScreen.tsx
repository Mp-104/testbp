import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image
} from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useUsageStats } from "./UsageStatsContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import EnergyBar from "./EnergyBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BalloonGame from "./BalloonGame";



const ActivitiesScreen = () => {
    const { energy, setEnergy } = useUsageStats();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityOptions, setActivityOptions] = useState([]);
    const [balloonBurstCompleted, setBalloonBurstCompleted] = useState(false);
    const blinkAnim = useRef(new Animated.Value(1)).current;
    
    // State to store cooldown info for each activity
    const [cooldowns, setCooldowns] = useState({});
  
    const navigation = useNavigation();
  
    // Function to load the cooldowns from AsyncStorage
    const loadCooldowns = useCallback(async () => {
      try {
        const storedCooldowns = await AsyncStorage.getItem("cooldowns");
        if (storedCooldowns) {
          setCooldowns(JSON.parse(storedCooldowns));
        }
      } catch (error) {
        console.error("Failed to load cooldowns from AsyncStorage:", error);
      }
    }, []);
  
    // Function to save cooldowns to AsyncStorage
    const saveCooldowns = useCallback(async (newCooldowns) => {
      try {
        await AsyncStorage.setItem("cooldowns", JSON.stringify(newCooldowns));
      } catch (error) {
        console.error("Failed to save cooldowns to AsyncStorage:", error);
      }
    }, []);
  
    // Load cooldowns when the component mounts
    useEffect(() => {
      loadCooldowns();
    }, [loadCooldowns]);
  
    const startBlinking = useCallback(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [blinkAnim]);
  
    useEffect(() => {
      if (activityOptions.length === 0 && !selectedActivity) {
        startBlinking();
      } else {
        blinkAnim.stopAnimation();
      }
    }, [activityOptions, selectedActivity, startBlinking, blinkAnim]);
  
    const individualGames = [
      "Skuggfigurer",
      "Gå på linjen",
      "Djurimitationer",
      "Andningsövningar",
      "Dansstopp",
    ];
    const socialGames = [
      "Kurragömma",
      "Sten, sax, påse",
      "Gissa ljudet",
      "Berättelsekedja",
      "Armhävningar",
    ];
  
    const refillEnergy = useCallback((activity) => {
      //console.log("Activity: ", activity)
      //navigation.navigate("Balloon")
      // Increase energy

      if(activity === "Andningsövningar" && balloonBurstCompleted) {
        if(isCooldownActive("Andningsövningar")) {
          console.log("kan ej energi, måste vänta")
          return;
        }
        setEnergy((prevEnergy) => {
        const newEnergy = prevEnergy + 10;
        return newEnergy > 100 ? 100 : newEnergy;
      });
  
      // Start cooldown for the specific activity
      const newCooldowns = {
        ...cooldowns,
        [activity]: Date.now() + 60000,  // Set cooldown end time (1 minute)
      };
      
      // Save cooldown to AsyncStorage
      setCooldowns(newCooldowns);
      saveCooldowns(newCooldowns);
      } else if (activity != "Andningsövningar") {
        
        setEnergy((prevEnergy) => {
          const newEnergy = prevEnergy + 10;
          return newEnergy > 100 ? 100 : newEnergy;
        });
    
        // Start cooldown for the specific activity
        const newCooldowns = {
          ...cooldowns,
          [activity]: Date.now() + 60000,  // Set cooldown end time (1 minute)
        };
        
        // Save cooldown to AsyncStorage
        setCooldowns(newCooldowns);
        saveCooldowns(newCooldowns);

      }
      
    }, [balloonBurstCompleted, setEnergy, cooldowns, saveCooldowns]);
  
    const animatedButtons = useMemo(() => {
      return activityOptions.map((button, index) => {
        const blinkValue = new Animated.Value(0);
  
        setTimeout(() => {
          Animated.timing(blinkValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, index * 1000);
  
        return (
          <Animated.View key={index} style={[styles.blinkButton, { opacity: blinkValue }]}>
            <TouchableOpacity onPress={() => setSelectedActivity(button)}>
              <Text style={styles.blinkButtonText}>{button}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      });
    }, [activityOptions]);
  

    useEffect(()=> {
      if(balloonBurstCompleted) {
        refillEnergy("Andningsövningar");
        setBalloonBurstCompleted(false);
      }
    }, [balloonBurstCompleted])

    const angry = "https://t4.ftcdn.net/jpg/00/68/33/03/360_F_68330331_dKqChy33w0TcNHJEkqT5iw97QOX8la7F.jpg";
    const neutral = 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp';
    const happy = "https://thumbs.dreamstime.com/b/cheerful-cartoon-style-orange-white-cat-big-joyful-smile-closed-eyes-as-if-laughing-cheerful-cartoon-style-341221817.jpg";
  
    let emotion = "";
  
    if (energy < 50) {
      emotion = angry;
    } if (energy > 80) {
      emotion = happy;
    } if (energy >= 50 && energy <= 80) {
      emotion = neutral;
    }
  
    // Helper function to calculate remaining time in seconds
    const calculateRemainingTime = (activity) => {
      const cooldownEnd = cooldowns[activity];
      if (!cooldownEnd) return 0;
      const remainingTime = cooldownEnd - Date.now();
      return Math.max(0, Math.floor(remainingTime / 1000));  // Return time in seconds
    };
  
    // Hook to handle countdown timer updates
    useEffect(() => {
      const interval = setInterval(() => {
        setCooldowns((prevCooldowns) => ({ ...prevCooldowns }));
      }, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);
  
    const isCooldownActive = (activity) => {
      const cooldownEnd = cooldowns[activity];
      return cooldownEnd && Date.now() < cooldownEnd;
    };
  
    return (
      <View>
        {/* <Image 
          source={{ uri: emotion }} 
          style={styles.image} 
        /> */}
        <TouchableOpacity style={styles.energy}>
          <EnergyBar value={energy}/>
        </TouchableOpacity>
        <Text style={styles.header}>Välj en aktivitet</Text>
  
        {selectedActivity ? (
          <>
            <Text style={styles.activityText}>Aktivitet: {selectedActivity}</Text>
            {selectedActivity === "Andningsövningar" && (<BalloonGame onBalloonBurst={setBalloonBurstCompleted}></BalloonGame>)}
            <TouchableOpacity 
              style={[styles.refillButton, isCooldownActive(selectedActivity) && styles.disabledButton]} 
              onPress={() => refillEnergy(selectedActivity)} 
              disabled={isCooldownActive(selectedActivity)}  // Disable button during cooldown
            >
              <Text style={styles.refillButtonText}>
                {isCooldownActive(selectedActivity)
                  ? `Väntar... ${calculateRemainingTime(selectedActivity)}s`
                  : 'Övning gjord (10 energi)'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setSelectedActivity(null)}>
              <Text style={styles.buttonText}>Tillbaka</Text>
            </TouchableOpacity>
          </>
        ) : activityOptions.length > 0 ? (
          <>
            {animatedButtons}
            <TouchableOpacity style={styles.button} onPress={() => setActivityOptions([])}>
              <Text style={styles.buttonText}>Tillbaka</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Animated.View style={[styles.blinkButton, { opacity: blinkAnim }]}>
              <TouchableOpacity onPress={() => setActivityOptions(individualGames)}>
                <Text style={styles.blinkButtonText}>Individuella lekar</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.blinkButton, { opacity: blinkAnim }]}>
              <TouchableOpacity onPress={() => setActivityOptions(socialGames)}>
                <Text style={styles.blinkButtonText}>Sociala lekar</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Tillbaka till Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f8ff",
    },
    header: {
      right: -60,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    activityText: {
      fontSize: 20,
      marginBottom: 20,
      fontWeight: "bold",
    },
    blinkButton: {
      backgroundColor: "#ADD8E6",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 5,
    },
    blinkButtonText: {
      fontSize: 16,
      color: "#000",
      textAlign: "center",
      fontWeight: "bold",
    },
    refillButton: {
      backgroundColor: "#90EE90",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginVertical: 5,
    },
    refillButtonText: {
      fontSize: 14,
      color: "#000",
      textAlign: "center",
      fontWeight: "bold",
    },
    disabledButton: {
      backgroundColor: "#D3D3D3", // Grey color to show the button is disabled
    },
    button: {
      backgroundColor: "#007bff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginVertical: 5,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      top: 10,
      right: 0,
      marginBottom: -200,
      zIndex: 1,
    },
    rightTop: {
      right: 100,
      top: -0,
      transform: [{ translateY: -50 }],
      width: 500,
      marginRight: 10,
    },
    buttonText: {
      fontSize: 16,
      color: "#fff",
      textAlign: "center",
    },
    energy: {
      right: -360,
      marginTop: -55,
      marginBottom: -200,
      top: -0,
      transform: [{ translateY: -50 }],
      width: 500,
      marginRight: 10,
      //backgroundColor: "red"
    },
  });
  
  export default ActivitiesScreen;