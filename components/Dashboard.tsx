import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Image, Button, StyleSheet, TouchableOpacity, Alert, ImageBackground, Dimensions, Pressable, StatusBar } from 'react-native';
import EnergyBar from './EnergyBar';
import { useUsageStats } from "./UsageStatsContext";
import Orientation from 'react-native-orientation-locker';

const { height, width } = Dimensions.get("screen");


const App = () => {
  const navigation = useNavigation();
  const { energy, setEnergy } = useUsageStats();

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => Orientation.lockToPortrait();
  }, []);


  const refillEnergy = () => {
    setEnergy((prevEnergy) => {
      const newEnergy = prevEnergy + 10
      return newEnergy > 100 ? 100 : newEnergy
    })
  }
  const angry =
    "https://t4.ftcdn.net/jpg/00/68/33/03/360_F_68330331_dKqChy33w0TcNHJEkqT5iw97QOX8la7F.jpg"

  const neutral =
    "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"

  const happy =
    "https://thumbs.dreamstime.com/b/cheerful-cartoon-style-orange-white-cat-big-joyful-smile-closed-eyes-as-if-laughing-cheerful-cartoon-style-341221817.jpg"
  let emotion = ""

  if (energy < 50) {
    emotion = angry
  }
  if (energy > 80) {
    emotion = happy
  }
  if (energy >= 50 && energy <= 80) {
    emotion = neutral
  }

  return (
    <ImageBackground source={require("../assets/background.png")} style={styles.background}>
      <View style={styles.container} >
        <View style={styles.containTop}>
          <View style={styles.containTop1}>

            <StatusBar hidden={true}></StatusBar>
            <View style={styles.navButtons}>

              <TouchableOpacity onPressIn={() => navigation.navigate("WipAlert", { source: "HomeworkTimer" })}>
                <Image
                  source={require("../assets/sandglass.png")}
                  style={styles.sandglass}
                />
              </TouchableOpacity>

              <TouchableOpacity onPressIn={() => navigation.navigate("GameTimer", { source: "GamesScreen" })}>
                <Image
                  source={require("../assets/star.png")}
                  style={styles.star}
                />
              </TouchableOpacity>

              <TouchableOpacity onPressIn={() => { navigation.navigate("WipAlert", { source: "Activities" }) }}>
                <Image
                  source={require("../assets/lamp.png")}
                  style={styles.lamp}
                />
              </TouchableOpacity>

              <TouchableOpacity onPressIn={() => navigation.navigate("EmoSpace", { source: "EmoSpace" })}>
                <Image
                  source={require("../assets/heart2.png")}
                  style={styles.heart}
                />
              </TouchableOpacity>

            </View>
          </View>
          <View style={styles.containTop2}>



            {/* Buttons */}
            <ImageBackground style={[styles.button, styles.rightTop]} >
              <EnergyBar value={energy} />
            </ImageBackground>
          </View>
        </View>
        <View style={styles.containBott}>
          <View style={styles.containBott1}>

            <Image
              source={require("../assets/emo.png")}
              style={styles.emo}
            />

          </View>
          <View style={styles.containBott2}>

            <View style={styles.Emmo}>

              <TouchableOpacity style={[styles.button, styles.bottom]}>
                <Button
                  title="Activities"
                  onPress={() => navigation.navigate("Activities")}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.bottom2]}>
                <Button title="Main" onPress={() => navigation.navigate("Home")} />
              </TouchableOpacity>

              {/* <TouchableOpacity style={[styles.button, styles.left]}>
            <Button
            title="emo space"
            onPress={() => navigation.navigate("EmoSpace")}
            />
            </TouchableOpacity> */}

              <TouchableOpacity style={[styles.button, styles.left2]}>
                <Button
                  title="Calendar"
                  onPress={() => navigation.navigate("Calendar")}
                />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.right3]}>
                <Button
                  title="Screen time."
                  onPress={() => navigation.navigate("Stats")}
                />
              </TouchableOpacity>

              {/* <TouchableOpacity style={[styles.button, styles.right2]}>
            <Button title="Games" onPress={()=> navigation.navigate("GamesScreen")} />
            </TouchableOpacity> */}

              <TouchableOpacity style={[styles.button, styles.right4]}>
                <Button
                  title="Balloon"
                  onPress={() => navigation.navigate("Balloon")}
                />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity style={[styles.button, styles.left3]}>
              <Button
              title="HomeworkTimer"
              onPress={() => navigation.navigate("HomeworkTimer")}
              />
              </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: '1%',
    marginVertical: '3%',
    //justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    /* position: 'relative', */
    //transform: [{ rotate: "0deg"}],
    //backgroundColor: 'rgba(255, 5, 222, 0.8)',
  },
  containTop: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'rgba(217, 255, 0, 0.3)',
  },
  containTop1: {
    flex: 1,
    //flexDirection: 'row',
    //backgroundColor: 'rgba(53, 241, 28, 0.3)',
  },
  containTop2: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    //backgroundColor: 'rgba(243, 1, 1, 0.3)',
  },
  containBott1: {
    flex: 1,
    //backgroundColor: 'rgba(118, 175, 3, 0.3)',
  },
  containBott2: {
    flex: 1,
    //backgroundColor: 'rgba(245, 46, 202, 0.3)',
  },
  containBott: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'rgba(233, 9, 9, 0.3)',
  },
  navButtons: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'rgba(189, 255, 8, 0.3)',
  },
  Emmo: {
    flex: 1,
    //backgroundColor: 'rgba(88, 5, 243, 0.3)',
  },
  background: {
    /* transform: [{ rotate: "90deg"}], */
    /* width: width ,
    height: height + 1, */
    //right: 0,
    //top: -20
    height: "100%",
    //backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heart: {
    width: 100,
    height: 100,
    /* borderRadius: 100, */
    //bottom: 100,
    //right: 190,
    //marginBottom: -100,
    zIndex: 1,
    //backgroundColor: 'rgba(203, 235, 22, 0.3)',
    //left: -0,
    //top: -150,
    //transform: [{ translateY: -50 }],
  },
  sandglass: {
    width: 100,
    height: 100,
    /* borderRadius: 100, */
    //bottom: 190,
    //right: 450,
    //marginBottom: -100,
    zIndex: 1,
    //backgroundColor: 'rgba(255, 0, 0, 0.73)',
  },
  star: {
    width: 100,
    height: 100,
    /* borderRadius: 100, */
    //bottom: 190,
    //right: 370,
    //marginBottom: -100,
    zIndex: 1,
    //backgroundColor: 'rgba(25, 0, 255, 0.3)',
  },
  lamp: {
    width: 100,
    height: 100,
    /* borderRadius: 100, */
    //bottom: 190,
    //right: 280,
    //marginBottom: -100,
    zIndex: 1,
    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  emo: {
    alignContent: 'center',
    //width: 200,
    //height: 200,
    /* borderRadius: 100, */
    //bottom: 10,
    //right: 300,
    bottom: '10%',
    //zIndex: 0,
    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  button: {
    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
    position: 'static',
  },
  rightTop: {
    right: 20,
    top: 30,
    marginTop: -90,
    marginRight: "1%",
    //backgroundColor: "red",

    width: 200,
  },
  bottom: {
    marginBottom: 10,
    bottom: -200,
    left: "52.5%",

    transform: [{ translateX: -50 }],
  },
  bottom2: {
    bottom: -200,
    left: "22.5%",
    marginBottom: 20,
    transform: [{ translateX: -50 }],
  },
  left: {
    left: -0, // Move further left to avoid off-screen issue
    top: 130,
    transform: [{ translateY: -50 }],
  },
  left2: {
    position: "absolute",
    left: 100,

    top: 0,
    transform: [{ translateY: -50 }],
  },
  left3: {
    left: -0,

    top: 220,
    transform: [{ translateY: -50 }],
  },
  right: {
    right: -0, // Move further right to avoid off-screen issue
    top: "60%",
    transform: [{ translateY: -50 }],
  },

  right3: {
    top: 85,
    left: "86%",
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  right2: {
    right: 0,
    top: 36,
    transform: [{ translateY: -50 }],
  },
  right4: {
    position: "absolute",
    right: 70,
    top: 6,

    transform: [{ translateY: -50 }],
  },

})

export default App