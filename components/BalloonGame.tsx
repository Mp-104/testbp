import React, { useEffect, useRef, useState } from 'react';
import {Animated, View, Text, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Image } from 'react-native';
import SoundLevel from 'react-native-sound-level';
import DeviceBrightness from '@adrianso/react-native-device-brightness'

const BalloonGame = ({onBalloonBurst = () => {}}) => {// added = () => {} a fallback in case BalloonGame is accessed outside its parent component
  const [balloonSize, setBalloonSize] = useState(100); // this way, if onBalloonBurst is not passed as a prop, it won’t throw an error since the default function will be an empty function () => {}.
  const [balloonBurst, setBalloonBurst] = useState(false);
  const [balloonColour, setBalloonColour] = useState("")
  const [balloonSize2, setBalloonSize2] = useState(0);
  const [balloonSize3, setBalloonSize3] = useState(0);
  const [balloonSize4, setBalloonSize4] = useState(0);
  const [balloonSize5, setBalloonSize5] = useState(0);
  const [balloonSize6, setBalloonSize6] = useState(0);
  const [balloonSize7, setBalloonSize7] = useState(0);
  const [balloonSize8, setBalloonSize8] = useState(0);

  const [soundLevel, setSoundLevel] = useState(0);

  const [balloonOrder, setBalloonOrder] = useState(1);

  const moveBalloon = useRef(new Animated.Value(0)).current;

  //DeviceBrightness.setBrightnessLevel(0.1)

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'We need access to your microphone to record audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  useEffect(()=> {
    requestMicrophonePermission();
  }, [])

  useEffect(()=> {
    const moveBalloonAnimation = ()=> {
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveBalloon, {
            toValue: 5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(moveBalloon, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      ).start();
    }
    moveBalloonAnimation();
  }, [])
  /* Animated.loop(
        Animated.sequence([
          Animated.timing(moveBalloon, {
            toValue: 5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(moveBalloon, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          
        ])
      ).start(); */

  /* useEffect(()=> {
    if(balloonSize2 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize2(40);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize2, balloonBurst])

  useEffect(()=> {
    if(balloonSize3 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize3(50);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize3, balloonBurst])

  useEffect(()=> {
    if(balloonSize4 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize4(60);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize4, balloonBurst])

  useEffect(()=> {
    if(balloonSize5 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize5(70);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize5, balloonBurst])

  useEffect(()=> {
    if(balloonSize6 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize6(80);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize6, balloonBurst])

  useEffect(()=> {
    if(balloonSize7 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize7(90);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize7, balloonBurst])

  useEffect(()=> {
    if(balloonSize8 === 0 && balloonBurst) {
      const interval = setInterval(()=> {
        setBalloonSize8(100);
      }, 5000)
      return ()=> clearInterval(interval);
    }
  }, [balloonSize8, balloonBurst]) */

  useEffect(()=> {

    const brightness = async()=>{
      await DeviceBrightness.setBrightnessLevel(0.05)
    }
    if(balloonSize > 299) {
      setBalloonBurst(true);
      onBalloonBurst(true);
      setBalloonSize(0);
      
      
        
      setBalloonSize2(40);
      setBalloonSize3(50);
      setBalloonSize4(60);
      setBalloonSize5(70);
      setBalloonSize6(80);
      setBalloonSize7(90);
      setBalloonSize8(100);
      
      
      brightness();
    }
    
  }, [balloonSize, balloonBurst])

  useEffect(() => {
    //requestMicrophonePermission();
    if (SoundLevel) {
      SoundLevel.start();
  
      SoundLevel.onNewFrame = (data) => {
        const soundLevel = data.value;
        const rawValue = data.rawValue
        const id = data.id
        console.log('Sound Level:', rawValue);
        //console.log('Sound LevelRaw:', soundLevel);
        //console.log('Sound id:', id);
        setSoundLevel(rawValue);
  
        if(!balloonBurst) {
           if (rawValue > 26000 ) {
            console.log("soundlevel:" ,rawValue)
            //setBalloonColour("lightblue")
            setBalloonSize((prevSize) => Math.min(prevSize + 100, 300));
             } else {
              setBalloonSize((prevSize) => Math.max(prevSize - 20, 50));
             } 
             if(rawValue > 27000) {
              setBalloonColour("red");
              setBalloonSize((prevSize) => Math.max(prevSize - 5, 50));
              //setBalloonBurst(true);
             }
        }
        //console.log("balloon size: ", balloonSize )
        /* if(balloonSize > 299) {
            setBalloonBurst(true)
        } */
      };
  
      return () => {
        SoundLevel.stop();
      };
    } else {
      console.error('SoundLevel is not initialized');
    }
  }, [balloonBurst]);

  const resetBalloon = async () => {
    setBalloonBurst(false);
    setBalloonSize(100);
    //await DeviceBrightness.setBrightnessLevel(0.1)
  }

  const handleBalloonPop = async (size) => {

    if(balloonOrder === size) {
      switch (size) {
        case 1:
          setBalloonSize2(0)
          await DeviceBrightness.setBrightnessLevel(0.1)
          break;
        case 2: 
          setBalloonSize3(0)
          await DeviceBrightness.setBrightnessLevel(0.2)

          break;
        case 3: 
          setBalloonSize4(0);
          await DeviceBrightness.setBrightnessLevel(0.3)

          break;
        case 4:
          setBalloonSize5(0);
          await DeviceBrightness.setBrightnessLevel(0.5)

          break;
        case 5: 
          setBalloonSize6(0);
          await DeviceBrightness.setBrightnessLevel(0.7)

          break;
        case 6:
          setBalloonSize7(0);
          await DeviceBrightness.setBrightnessLevel(1)

          break;
        case 7: 
          setBalloonSize8(0)
          setBalloonOrder(0);
          break;
        default:
          break;
      }

      setBalloonOrder((prevOrder) => prevOrder + 1);
    }

  }
  

  return (
    <View>
    <View style={styles.container}>
      <Text style={styles.text}>
        {balloonBurst ? 'The balloon burst! 🎉' : 'Blow into the mic to inflate the balloon! 🎈'}
      </Text>

      <Animated.View style={[styles.balloon2, {width: balloonSize2, height: balloonSize2, transform: [{translateX: moveBalloon}]}]}>
        <TouchableOpacity style={{flex: 1}}
          onPress={()=>handleBalloonPop(1)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize2, height: balloonSize2}}></Image>
        </TouchableOpacity>
      </Animated.View>
      

      <Animated.View style={[styles.balloon3, {width: balloonSize3, height: balloonSize3, transform: [{translateX: moveBalloon}]}]}>
          <TouchableOpacity style={{flex: 1}}
            onPress={()=>handleBalloonPop(2)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize3, height: balloonSize3}}></Image>

          </TouchableOpacity>
      </Animated.View>
      
      
      <Animated.View style={[styles.balloon4, {width: balloonSize4, height: balloonSize4, transform: [{translateX: moveBalloon}]}]}>
        <TouchableOpacity 
          onPress={()=>handleBalloonPop(3)} style={{flex: 1}}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize4, height: balloonSize4}}></Image>

        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={[styles.balloon5, {width: balloonSize5, height: balloonSize5, transform: [{translateX: moveBalloon}]}]}>
        <TouchableOpacity style={{flex: 1}}
          onPress={()=>handleBalloonPop(4)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize5, height: balloonSize5}}></Image>

        </TouchableOpacity>
      </Animated.View>
      

      <Animated.View style={[styles.balloon6, {width: balloonSize6, height: balloonSize6, transform: [{translateX: moveBalloon}]}]}>
          <TouchableOpacity style={{flex: 1}}
            onPress={()=>handleBalloonPop(5)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize6, height: balloonSize6}}></Image>

          </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.balloon7, {width: balloonSize7, height: balloonSize7, transform: [{translateX: moveBalloon}]}]}>
          <TouchableOpacity style={{flex: 1}}
            onPress={()=>handleBalloonPop(6)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize7, height: balloonSize7}}></Image>

          </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.balloon8, {width: balloonSize8, height: balloonSize8, transform: [{translateX: moveBalloon}]}]}>
          <TouchableOpacity style={{flex: 1}}
            onPress={()=>handleBalloonPop(7)}>
            <Image source={require("../assets/Bubble1.png")} style={{width: balloonSize8, height: balloonSize8}}></Image>

          </TouchableOpacity>
      </Animated.View>
      

      <View
        style={[
          styles.balloon,
          { width: balloonSize, height: balloonSize, backgroundColor: balloonColour },
        ]}
      >
        <Image
                    source={require("../assets/Bubble1.png")}
                    style={[/* styles.balloon, */ {width: balloonSize, height: balloonSize}]}
                  />
        <Text style={[styles.text2, {width: 80, height: 80, /* backgroundColor: "red", */}]}>Blow Me! {soundLevel}</Text></View>
      {balloonSize8 === 0 && balloonBurst && (
        <Text style={styles.resetText} onPress={resetBalloon}>
          Tap here to reset the game.
        </Text>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  balloon: {
    top: 150,
    backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,
    
  },
  balloon2: {
    position: "absolute",
    top: 110,
    left: 200,
    //backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon3: {
    position: "absolute",
    top: 200,
    left: 200,
   // backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon4: {
    position: "absolute",
    top: 190,
    right: 470,
    //backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon5: {
    position: "absolute",
    top: 200,
    right: 300,
   // backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon6: {
    position: "absolute",
    top: 260,
    right: 180,
    //backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon7: {
    position: "absolute",
    top: 60,
    right: 480,
    //backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,

  },
  balloon8: {
    position: "absolute",
    top: 90,
    right: 200,
    //backgroundColor: 'lightblue',
    borderRadius: 150,
    zIndex: 1,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
  text2: {
    
    position: 'absolute', // Absolutely position the text inside the balloon
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    /* transform: [{ translateX: -50% }, { translateY: -50% }],  */// Offset by half of the text's width/height
    fontSize: 18,
  },
  resetText: {
    position: "absolute",
    top: 200,
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default BalloonGame;
