import React, { useEffect, useState, SetStateAction } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView, Touchable, Image, ImageBackground, Dimensions, StatusBar,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import EnergyBar from "./EnergyBar";
import { useUsageStats } from "./UsageStatsContext";
import Orientation from 'react-native-orientation-locker';
import BalloonGame from "./BalloonGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import GamesScreen from "./GamesScreen";

const {height, width} =Dimensions.get("screen");

const WipAlert = () => {
  const [timeLeft, setTimeLeft]=useState('');

  const navigation = useNavigation();
  const Emmo = "https://cdn.discordapp.com/attachments/1336699609501929482/1351198619306430535/image.png?ex=67de1e86&is=67dccd06&hm=632fd45b6bafe1b97e7f97f7eb3965d55541a62591a071c5e97dd89d0d73ae05&";
  const [currentNode, setCurrentNode] = useState('START');
  const [history, setHistory] = useState([]); // To store the history of dialogues
  const navPath = ["MemoryMatch","EndlessAlphabet","EmoSpace","GamesScreen","BalloonPop","BalloonGame","StompGame",];
  const [emotionData, setEmotionData] = useState<Record<string, string>>({});
  const [morningEmotionData, setMorningEmotionData] = useState<Record<string, string>>({});
  const [feelEmotionData, setFeelEmotionData] = useState<Record<string, string>>({});     
  const route = useRoute();
  const {source} = route.params ?? {};
  const { energy, setEnergy, remainingGametime, allotedGametime, resetTime } = useUsageStats();

    let backgroundImage;
    let message;
    let time;
    let storedTime;
    
    switch (source) {
      case 'EmoSpace':
        backgroundImage =require('../assets/EmoInvestBkground.png');
        message = 'Hej! Jag vill gärna veta mer om hur du känner och mår! Jag är inte klar än men så snart appen är färdig kommer vi lära oss mer om känslor här!';
        time = ''
        break;
      case 'HomeworkTimer':
        backgroundImage =require('../assets/GameTimeBG.jpg');
        message = 'HEJ! SÅ HÄR MYCKET TID HAR DU KVAR ATT SPELA:';
        time = '1337'
        break;
      case 'GamesScreen':
        backgroundImage =require('../assets/SpelBackground.png');
        message = 'Hej! Här finns spel och övningar som är bra träning! Jag är inte klar än men så snart appen är färdig hittar du dem här!';
        time = ''
        break;
      case 'Activities':
        backgroundImage =require('../assets/GungaBackground.png');
        message = 'Hej! Det här är var jag har samlat alla mina bra förslag på roliga saker att göra! Jag är inte klar än men så snart appen är färdig hittar du dem här';
        time = ''
        break;
      default:
        backgroundImage =require('../assets/Bubble1.png');
        message = 'Default!';
    }

    useEffect(() => {
      Orientation.lockToLandscape();  
      console.log("hello world1223:")
      const loadTimerValue = async () => {
        console.log("hello world:")
        try {
          const storedTime = await AsyncStorage.getItem('gameTimer');
          console.log("storedTime", storedTime);
          if (storedTime !== null) {
            setTimeLeft(JSON.parse(storedTime));
            console.log("timeLeft", timeLeft);
          }
        } catch (e) {
          console.error('error loading timer:', e);
        }
      };
      if (source === 'HomeworkTimer') {
        loadTimerValue();
      }
    }, []);
   
      return (
        <ImageBackground source={backgroundImage} style={styles.imagebk}>
          <View style={styles.backarrow}>
            <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
              <Text style={styles.dialogueText}>    GÅ TILLBAKA</Text>
            </TouchableOpacity>
          </View>  

          <View style={styles.Emmo}>
            <Image 
              source={require("../assets/emoInvesting.png")} 
              style={styles.image}
            />
          </View>

          <View style={styles.speechBubble}>
            <Image 
              source={require("../assets/Pratbubbla2.png")} 
              style={styles.pratbubbla}
            />
          
          <View style={styles.bubbleTextContainer}>
            <Text style={styles.bubbleText}>{message}</Text>
            <Text style={styles.gameTimeGreen}>{remainingGametime}</Text>
            <Text style={styles.gameTimeGreen}>{allotedGametime}</Text>
          </View>
        </View>
      </ImageBackground>
      )
}

const styles = StyleSheet.create({
    backarrow: {
        flex: 1,
      },
    Emmo: {        
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',       
      },
    speechBubble: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      },
    imagebk: {  
        flexDirection: 'row',
        height: "100%",
        justifyContent: 'center',      
      },
    image: {
        justifyContent: 'center',
        resizeMode: 'contain',
        width: '150%',
        padding: '100%',
        marginBottom: '-50%',
      },
    pratbubbla: {
        width: 350, 
        height: 230, 
        opacity: 0.5,
        marginTop: '4%',
        resizeMode: 'contain',
        transform: [{scaleX: -1}],
      },
    pratbubbla2: {
        width: 300, 
        height: 250, 
        resizeMode: 'contain',
      },
    bubbleTextContainer: {
        position: 'absolute',
        width: '50%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
    bubbleText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
      },
    gameTimeGreen: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: 'green',
      },
    gameTimeRed: {
        textAlign: 'center',
        fontSize: 36,
        fontWeight: 'bold',
        color: 'red',
      },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',       
      },  
    dialogueText: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        fontWeight: 'bold',
        borderColor: 'white',
        borderWidth: 1,
        color: 'white',    
        fontSize: 15,
      },  
});

export default WipAlert; 