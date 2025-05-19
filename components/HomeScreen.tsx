import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Dashboard from "./Dashboard";
import { useUsageStats } from "./UsageStatsContext";
import EnergyBar from "./EnergyBar";

import MainPage from "./MainPage";
import Orientation from "react-native-orientation-locker";

// Define the navigation type for the stack
type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
};

// Define the navigation prop type
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;
type HomeScreenRouteProp = RouteProp<RootStackParamList, "SignUp">;

// Define the props type for the component
type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

function HomeScreen({ navigation }: Props) {
  const {usageStats, setUsageStats, energy} = useUsageStats();

  useEffect(()=> {
    Orientation.lockToPortrait();
    return ()=> Orientation.lockToLandscape();
  }, [])
  
  
  return (
    <View style={styles.container}>
      {/* <EnergyBar value={0}></EnergyBar> */}
      <Text style={styles.welcomeText}>VÄLKOMMEN TILL BACKPACK</Text>
      

      <Button mode="contained" onPress={() => navigation.navigate("SignUp")} style={styles.button}>
        Registrering
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate("Login")} style={styles.button}>
        Har du redan ett konto? Logga in här
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("MainPage")} style={styles.button}>
        Lobby
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate("Stats")} style={styles.button}>
        AppUsageStats
      </Button>

      <Button mode="outlined" onPress={() => navigation.navigate("ParentStartPage")} style={styles.button}>
        ParentStartPage
      </Button>

      {/* <Button mode="outlined" onPress={() => navigation.navigate("MainPage")} style={styles.button}>
        Daesh
      </Button> */}
      <Button mode="outlined" onPress={() => navigation.navigate("Room")} style={styles.button}>
        Room
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Screen")} style={styles.button}>
        Screen
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("UsageTracker")} style={styles.button}>
        UsageTracker
      </Button>


      <ScrollView>
       {/*  <EnergyBar value={usageStats && usageStats[0] ? 100 - usageStats[0].totalTimeInForeground / 1000 : 100}></EnergyBar>
         */}
        
        <EnergyBar value={energy}></EnergyBar>

        <Text>{JSON.stringify(usageStats, null, 2)}</Text>
      </ScrollView>
      
      
      {/* <AppUsageStats></AppUsageStats> */}
      
      
    
      {/* <Dashboard></Dashboard> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: "#666",
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 10,
  },
});

export default HomeScreen;
