import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';

const BalloonGame = ({onBalloonBurst = ()=> {}}) => {
  const [balloonSize, setBalloonSize] = useState(100);
  const [balloonBurst, setBalloonBurst] = useState(false);


  useEffect(()=> {
    if(balloonSize > 299) {
      setBalloonBurst(true);
      onBalloonBurst(true)
      setBalloonSize(0)
    }
  }, [balloonSize])

  const resetBalloon = () => {
    setBalloonBurst(false);
    setBalloonSize(100);
  }  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {balloonBurst ? 'The balloon burst! 🎉' : 'Blow into the mic to inflate the balloon! 🎈'}
      </Text>
      <View
        style={[
          styles.balloon,
          { width: balloonSize, height: balloonSize },
        ]}
      ><Text style={[styles.text2, {width: balloonSize, height: balloonSize}]}>Blås!</Text></View>
      {balloonBurst && (
        <Text style={styles.resetText} onPress={resetBalloon}>
          Tap here to reset the game.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  balloon: {
    top: 250,
    backgroundColor: 'lightblue',
    borderRadius: 150,
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
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default BalloonGame;