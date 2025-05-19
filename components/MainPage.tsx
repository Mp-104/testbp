
import React, { Suspense, useState } from "react";
import { Button, View, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import { useNavigation } from "@react-navigation/native";

const {height, width} = Dimensions.get("screen");

function MainPage({ navigation }) {
  const [orientation, setOrientation] = useState(
    Dimensions.get("window").height > Dimensions.get("window").width
      ? "portrait"
      : "landscape"
  )

  const handleLayoutChange = () => {
    const {height, width} = Dimensions.get("window");
    setOrientation(height > width ? "portrait" : "landscape")
  }

  return (
   /*  <ImageBackground source={require("../assets/background.png")} style={styles.background} > */
    <View  onLayout={handleLayoutChange}>
      {/* <Text>Välkommen till din egen Backpack, ha så kul med Emmo {orientation}</Text> */}
      {/* <Button
                title="Du kan inte trycka button"

            /> */}

      <Dashboard></Dashboard>
    </View>
    /* </ImageBackground> */
  )
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      /* transform: [{ rotate: "90deg"}], */
    },
    container: {
      flex: 1, // Ensures the container takes up the full screen height
      justifyContent: 'center', // Centers children vertically
      //alignItems: 'center', // Centers children horizontally
      width: "100%",
      /* transform: [{ rotate: "45deg"}] */
      
    },
  });

export default MainPage;