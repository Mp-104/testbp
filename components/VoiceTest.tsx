import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import Vosk from 'react-native-vosk';
//https://github.com/riderodd/react-native-vosk?tab=readme-ov-file

const VoiceTest = () => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const resultEventRef = useRef<any>(null);

  // Initialize Vosk
  const voskRef = useRef(new Vosk());

  // Request microphone permission (Android)
  const requestAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  // Load model and setup listeners
  const initModel = async () => {
    try {
      // Additional models: https://alphacephei.com/vosk/models
      await voskRef.current.loadModel('vosk-model-small-en-us-0.15'); // path: "android/app/src/main/assets/models/vosk-model-small-en-us-0.15"?
      setModelLoaded(true);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Model loading error:', error);
      Alert.alert('Error', 'Failed to load voice model');
    }
  };

  // Start recognition
  const startRecognition = async () => {
    if (!modelLoaded) {
      Alert.alert('Warning', 'Model not loaded yet');
      return;
    }

    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert('Permission required', 'Microphone access is needed for voice recognition');
      return;
    }

    try {
      const options = {
        grammar: ['left', 'right', 'down', 'upp', 'fuck', 'my', 'life', "trump", "max", "sergej", "natasha", "haidar", "soviet", "soyuz", "net", "da", "irma", "kalle", "back", "pack", "bla", "emo", "hey", "rossiya", "luna", "zvezda", "flag", "bok", "you", "no", "me", "albany", "sega", "dream", "cast", "mega", "drive", "saturn", "t", "master", "system", "test", "union", "socialist", "republics", "of", "send", "air", "force", "sonic", "tails", "knuckles", "egg", "man" ,'[unk]'], // Your custom commands
      };

      await voskRef.current.start(options);
      setIsListening(true);
      
      // Setup result listener
      resultEventRef.current = voskRef.current.onResult((res) => {
        console.log('Recognition result:', res);
        setResult(res || res.partialResult || '');
      });

    } catch (error) {
      console.error('Recognition error:', error);
      setIsListening(false);
    }
  };

  // Stop recognition
  const stopRecognition = async () => {
    try {
      if (resultEventRef.current) {
        resultEventRef.current.remove(); // Cleanup listener
        resultEventRef.current = null;
      }
      
      await voskRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    initModel();
    
    return () => {
      if (resultEventRef.current) {
        resultEventRef.current.remove();
      }
      voskRef.current.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {modelLoaded ? 'Model loaded' : 'Loading model...'}
      </Text>
      
      <Text style={styles.result}>
        {result || (isListening ? 'Listening...' : 'Press start to begin')}
      </Text>

      {isListening ? (
        <Button title="Stop Listening" onPress={stopRecognition} />
      ) : (
        <Button 
          title="Start Listening" 
          onPress={startRecognition} 
          disabled={!modelLoaded}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  result: {
    fontSize: 18,
    marginVertical: 30,
    minHeight: 60,
    textAlign: 'center',
    color: '#333',
  },
});

export default VoiceTest;