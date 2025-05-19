import React, { useEffect, useState, SetStateAction } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity, ScrollView, Touchable, Image, ImageBackground, Dimensions, StatusBar,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import EnergyBar from "./EnergyBar";
import { useUsageStats } from "./UsageStatsContext";
import Orientation from 'react-native-orientation-locker';


const questions = {
    START: {
        text: "HUR MÅR DU?",
        choices: [
          { text: "BRA", next: "BRA" },
          { text: "INTE BRA", next: "DÅLIG" },
          { text: "VET INTE", next: "VETINTEVAL" },
          { text: "VILL INTE SÄGA", next: "VILLINTESÄGA" },
        ],
      },
    BRA: {
        text: "JAG MED! VAD KÄNNER DU MEST?",
        choices: [
          { text: "GLAD", next: "SVAR1" },
          { text: "UPPSPELT", next: "SVAR1" },
          { text: "LUGN", next: "SVAR1" },
          { text: "NYFIKEN", next: "SVAR1" },
          { text: "TACKSAM", next: "SVAR1" },
          { text: "STOLT", next: "SVAR1" },
          { text: "VI HÖRS", next: "HEJDÅ" },
        ],
      },
    DÅLIG: {
      text: "ÄR DU SJUK?",
      choices: [
        { text: "JA", next: "SJUK" },
        { text: "NEJ", next: "DÅLIGFRISK" },
      ],
    },
    SJUK: {
      text: "VAD JOBBIGT! VILL DU HITTA PÅ NÅGOT MED MIG ELLER BARA VILA?",
      choices: [
        { text: "HITTA PÅ NÅGOT", next: "GamesScreen" },
        { text: "VILA", next: "HEJDÅ" },
      ],
    },
    DÅLIGFRISK: {
      text: "KAN VI PRATA OM HUR DET KÄNNS?",
      choices: [
        { text: "JA", next: "DÅLIGFRISKJA" },
        { text: "NEJ", next: "PANGABUBBLOR" },
      ],
    },
    PANGABUBBLOR: {
      text: "VILL DU HJÄLPA MIG PANGA SÅPBUBBLOR? VAR BEREDD PÅ ATT DET GÅR GANSKA SNABBT SÅ DU MÅSTE VARA BEREDD!",
      choices: [
        { text: "JA", next: "BalloonPop" },
        { text: "NEJ", next: "HEJDÅ" },
      ],
    },
    DÅLIGFRISKJA: {
      text: "KAN VI PRATA OM HUR DET KÄNNS?",
      choices: [
        { text: "STRESSAD", next: "MEDITATION" },
        { text: "LEDSEN", next: "INTENSIVITET" },
        { text: "BESVIKEN", next: "INTENSIVITET" },
        { text: "ARG", next: "HOPPA" },
        { text: "TRÖTT", next: "HOPPA" },
        { text: "RÄDD", next: "INTENSIVITET" },
        { text: "ENSAM", next: "INTENSIVITET" },
        { text: "OROLIG", next: "MEDITATION" },
        { text: "NÄRVÖS", next: "BUBBELPICK" },
      ],
    },
    MEDITATION: {
      text: "DET FINNS LUGNARE KÄNSLOR GÖMDA I KROPPEN- SKA VI HITTA DEM? DU KAN BLUNDA OCH LYSSNA PÅ MIG SÅ BERÄTTAR JAG HUR VI SKA ANDAS OCH LETA RÄTT PÅ DEM.",
      choices: [
        { text: "JA(MEDITATIONSÖVNING?)", next: "PH"},
        { text: "NEJ", next: "BUBBELPICK"},
      ]
    },
    BUBBELPICK: {
      text: "OM DU VILL ATT KÄNSLAN SKA BLI LITE LUGNARE KAN VI BLÅSA BUBBLOR IHOP?",
      choices: [
        { text: "JA", next: "BalloonPop"},
        { text: "KANSKE SENARE", next: "HEJDÅ"},
      ]
    },    
    HOPPA: {
      text: "SKA VI SE VEM SOM KAN HOPPA HÖGST?",
      choices: [
        { text: "NEJ", next: "INTLOW"},
        { text: "Tillbaka", next: "HEJDÅ"},
      ]
    },
    INTENSIVITET: {
      text: "Intensivitetsmätare---------------------",
      choices: [
        { text: "50-100%", next: "INTHIGH"},
        { text: "0-50%", next: "INTLOW"},
      ]
    },
    INTHIGH: {
      text: "DET ÄR NOG SKÖNT ATT PRATA OM DET, FINNS DET NÅGON DU KAN PRATA MED?",
      choices: [
        { text: "JA", next: "INTHIGHPRAT"},
        { text: "NEJ", next: "MEDITATION"},
      ]
    },
    INTLOW: {
      text: "DET FINNS GLADA KÄNSLOR GÖMDA I KROPPEN, SKA VI SKAKA FRAM DEM?",
      choices: [
        { text: "JA(LYCKOTRÄDET)", next: "PH"},
        { text: "NEJ", next: "BUBBELPICK"},
      ]
    },
    INTHIGHPRAT: {
      text: "KOM SÅ GÅR VI PRATAR MED DEM.(WIP, HEJDÅ ATM)",
      choices: [
        { text: "JA", next: "HEJDÅ"},
      ]
    },
    VETINTEVAL: {
      text: "SKA VI SE OM VI KAN HITTA VAR I KROPPEN KÄNSLAN SITTER MEST?",
      choices: [
        { text: "JA", next: "VETINTEMAIN"},
        { text: "NEJ", next: "VILLINTESÄGA"},
      ]
    },
    VETINTEMAIN: {
      text: "SKA VI SE OM VI KAN HITTA VAR I KROPPEN KÄNSLAN SITTER MEST?",
      choices: [
        { text: "MAGEN", next: "MAGE"},
        { text: "HJÄRTAT", next: "HJÄRTA"},
        { text: "HUVUDET", next: "HUVUD"},
        { text: "JAG VET INTE", next: "BUBBELPICK"},
      ]
    },
    MAGE: {
      text: "KÄNNS DET MEST BRA?",
      choices: [
        { text: "JA(UPPSPELT)", next: "BUBBELPICK"},
        { text: "NEJ", next: "INTENSIVMAGE"},
      ]
    },
    INTENSIVMAGE: {
      text: "Intensivitetsmätare---------------------",
      choices: [
        { text: "1-50%", next: "MEDITATION"},
        { text: "50-100%(NERVÖS)", next: "BUBBELPICK"},
        { text: "50-100%(NERVÖS)", next: "BUBBELPICK"},
      ]
    },
    HJÄRTA: {
      text: "KÄNNS DET MEST BRA?",
      choices: [
        { text: "NEJ", next: "HJÄRTANEJ"},
        { text: "JA", next: "HJÄRTAJA"},
      ]
    },
    HJÄRTANEJ: {
      text: "KÄNNS DET MEST BRA?",
      choices: [
        { text: "JAG ÄR LEDSEN", next: "INTENSIVITET"},
        { text: "JAG ÄR BESVIKEN", next: "INTENSIVITET"},
      ]
    },
    HJÄRTAJA: {
      text: "KÄNNS DET MEST BRA?",
      choices: [
        { text: "JAG ÄR GLAD", next: "HJÄRTAJAGLAD"},
        { text: "JAG ÄR STOLT", next: "HJÄRTAJASTOLT"},
        { text: "JAG ÄR TACKSAM", next: "HJÄRTATACKSAM"},
      ]
    },
    HJÄRTAJAGLAD: {
      text: "ÅH VAD HÄRLIGT! DET SMITTAR LITE, NU KÄNNER JAG MIG OCKSÅ GLAD!",
      choices: [
        { text: "TILLBAKA", next: "HEJDÅ"},
      ]
    },
    HJÄRTAJASTOLT: {
      text: "ÅH VAD HÄRLIGT! DET SMITTAR LITE, NU KÄNNER JAG MIG OCKSÅ STOLT!",
      choices: [
        { text: "TILLBAKA", next: "HEJDÅ"},
      ]
    },
    HJÄRTATACKSAM: {
      text: "ÅH VAD HÄRLIGT! DET SMITTAR LITE, NU KÄNNER JAG MIG OCKSÅ TACKSAM!",
      choices: [
        { text: "TILLBAKA", next: "HEJDÅ"},
      ]
    },
    HUVUD: {
      text: "HAR DU MÅNGA TANKAR SAMTIDIGT?",
      choices: [
        { text: "JA", next: "HUVUDJA"},
        { text: "NEJ", next: "HUVUDNEJ"},
      ]
    },
    HUVUDJA: {
      text: "ÄR DU OKEJ?",
      choices: [
        { text: "JA", next: "HUVUDOK"},
        { text: "NEJ", next: "HUVUDINTEOK"},
      ]
    },
    HUVUDOK: {
      text: "ÄR DU OKEJ?",
      choices: [
        { text: "JAG ÄR NERVÖS", next: "BUBBELPICK"},
        { text: "JAG ÄR UPPSPELT", next: "SVAR1"},
        { text: "JAG ÄR NYFIKEN", next: "SVAR1"},
      ]
    },
    HUVUDINTEOK: {
      text: "ÄR DU OKEJ?",
      choices: [
        { text: "JAG ÄR OROLIG", next: "MEDITATION"},
        { text: "JAG ÄR STRESSAD", next: "MEDITATION"},
        { text: "JAG ÄR RÄDD", next: "INTENSIVITET"},
        { text: "JAG ÄR LEDSEN", next: "INTENSIVITET"},
        { text: "JAG ÄR BESVIKEN", next: "INTENSIVITET"},
      ]
    },
    HUVUDNEJ: {
      text: "HAR DU MÅNGA TANKAR SAMTIDIGT?",
      choices: [
        { text: "JAG ÄR TRÖTT", next: "HOPPA"},
      ]
    },
    VILLINTESÄGA: {
      text: "KÄNNER DU DIG OKEJ?",
      choices: [
        { text: "JA", next: "HEJDÅ"},
        { text: "NEJ", next: "INTHIGH"},
      ]
    },

    
    PH: {
      text: "Woops, du har kommit till en sida som är work in progress. Dags att börja om.",
      choices: [
        { text: "Tillbaka", next: "START"},
      ]
    },
    SVAR1: {
      text: "VILKEN BRA DAG DET HÄR KOMMER BLI!",
      choices: [
        { text: "TILLBAKA", next: "EmoSpace"},
        { text: "GÖR OM", next: "START"},
      ]
    },
    HEJDÅ: {
      text: "OK! VI SES SNART",
      choices: [
        { text: "TILLBAKA", next: "EmoSpace"},
        { text: "GÖR OM", next: "START"},
      ]
    },
}

const {height, width} =Dimensions.get("screen");

const EmoInvestigation = () => {
    const navigation = useNavigation();
    const Emmo = "https://cdn.discordapp.com/attachments/1336699609501929482/1351198619306430535/image.png?ex=67de1e86&is=67dccd06&hm=632fd45b6bafe1b97e7f97f7eb3965d55541a62591a071c5e97dd89d0d73ae05&";
    const Energy = useUsageStats().energy;
    const setEnergy =useUsageStats().setEnergy; //to make energy effected by something 1
    // State to track the current dialogue node
    const [currentNode, setCurrentNode] = useState('START');
    const [history, setHistory] = useState([]); // To store the history of dialogues

    useEffect(() => {
      Orientation.lockToLandscape();
      
    }, []);
  
    // Function to handle when a choice is selected
    const handleChoice = (nextNode) => {
      if (nextNode === "MemoryMatch") {
        navigation.navigate("MemoryMatch");
      } else {
        if (nextNode === "EndlessAlphabet") {
          navigation.navigate("EndlessAlphabet");
        } else {
          if (nextNode === "EmoSpace") {
            navigation.navigate("EmoSpace");
          } else {
            if (nextNode === "GamesScreen") {
              navigation.navigate("GamesScreen");
            } else {
              if (nextNode === "BalloonPop") {
                navigation.navigate("BalloonPop");
              } else {
      // Push the current node to history before transitioning
      setHistory([...history, currentNode]);
      setCurrentNode(nextNode);
              }
            }
          }
        }
      }
    };  
    // Function to handle going back to the previous dialogue node
    const handleBack = () => {
      if (history.length > 0) {
        const previousNode = history[history.length - 1];
        setHistory(history.slice(0, -1)); // Remove the last node from history
        setCurrentNode(previousNode);
      }
    };  
    // Get the current dialogue node
    const currentQuestion = questions [currentNode];
  
    return (
      
      <ImageBackground 
        source={require("../assets/EmoInvestBackground2.png")}
        style={styles.imagebk}>
          <View style={styles.container}> 
          <StatusBar barStyle="dark-content" hidden={true} />
           <View style={styles.leftContainer}>
          
          <View style={styles.textContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text> 
          </View>
         <Image 
        source={require("../assets/emoInvesting.png")} 
        style={styles.image}
        
      />
      <TouchableOpacity style={styles.eBar}>
          <EnergyBar value={Energy} labelColor="white"/>
      </TouchableOpacity>

      </View>
      <View style={styles.rightContainer}>
      <View>
      {/*
          {currentQuestion.choices.map((choice, index) => (
            <TouchableOpacity key={index} onPress={() => handleChoice(choice.next)}>
              <Text style={styles.optionButton}>{choice.text}</Text>              
            </TouchableOpacity>            
          ))}
*/}

          
              {currentNode === "INTENSIVMAGE" ? (
                currentQuestion.choices.map((choice, index) => (
                  <View >
                    <TouchableOpacity key={index} onPress={() => handleChoice(choice.next)}>
                      <ImageBackground
                        source={require('../assets/Bubble1.png')}
                        style={styles.bubbleButton}
                        imageStyle={{resizeMode: 'stretch', borderRadius: 20}}
                        >





                    {/*<ImageBackground
      source={require('../assets/bubble.png')} // <- Your bubble image
      style={styles.bubbleButton}
      imageStyle={{ resizeMode: 'stretch', borderRadius: 20 }}
    >
*/}


                      <Text style={styles.bubbleText}>{choice.text}</Text>  
                       </ImageBackground>       
                    </TouchableOpacity>
                  </View>
                )
              )
            ) : (
              <View style={styles.buttonContainer}>
                {currentQuestion.choices.map((choice, index) => {
                  const offsetStyle = {
                    marginLeft: index % 2 === 0 ? 0 : -70,
                    //marginLeft: index % 3 === 0 ? 10 : index % 3 === 1 ? 0 : -20,
                    transform: [{ translateY: index * 10}]
                  };
                  
                  return (
                  <View key={index}>
                    <TouchableOpacity key={index} onPress={() => handleChoice(choice.next)} style={[styles.buttonWrapper, offsetStyle]}>
                    <ImageBackground
                        source={require('../assets/Bubble1.png')}
                        style={styles.bubbleButton}
                        imageStyle={{resizeMode: 'contain', borderRadius: 20}}
                        >
                      <Text  style={styles.bubbleText}>{choice.text}</Text>  
                      </ImageBackground>            
                    </TouchableOpacity>
                  </View>
                )})}
                </View>
              )}
        </View>
        {history.length > 0 && (

<TouchableOpacity onPress={handleBack} style={styles.backButton}>
  <Text style={styles.backButtonText}>BACK</Text>
</TouchableOpacity>


          
        )}
        <View style={styles.bottomContainer}>
        <TouchableOpacity
              onPress={() => navigation.navigate("EmoSpace")}
              
            >
              <Text style={styles.dialogueText}>TILLBAKA TILL EMOSPACE</Text>
        </TouchableOpacity>
        </View>
      </View>
      </View>
      </ImageBackground>
      
    );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',       
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingLeft: 20,
    height: '100%',
    //backgroundColor: 'rgba(0, 0, 255, 0.3)',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //backgroundColor: 'blue',
    borderRadius: 25,
    height: 50,
    marginTop: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  questionText: {
    padding: 1,
    borderRadius: 50,
    //backgroundColor: 'rgba(0, 255, 0, 0.3)',
    color: 'white',
    fontWeight: 'bold',
    height: 40,
    fontSize: 15,
    margin: 5,
    textAlign: 'center',
  },
  dialogueText: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',    
    fontSize: 15,
  },
  intMageOptionButton: {    
    padding: 1,
    backgroundColor: 'white',
    color: 'white',
    height: 25,
    fontSize: 15,
    margin: 5,
    flexDirection: 'row',
    textAlign: 'center',
  },
  optionButton: {    
    padding: 1,
    borderRadius: 5,
    backgroundColor: '#2296f3',
    color: 'white',
    height: 25,
    fontSize: 15,
    margin: 5,
    textAlign: 'center',
  },
  imagebk: {    
    height: "100%",
    justifyContent: 'center',      
  },
  image: {
    justifyContent: 'center',
  },
  eBar: {
    width: '70%',
    alignItems: "flex-end",
    bottom: 150,
    //backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bubbleButton: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    //backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: '75%',
    margin: 'auto',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  buttonWrapper: {
    //backgroundColor: 'rgba(196, 6, 6, 0.5)',
    right: 25,
    width: 100,
    margin: 5,
  },
  backButton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',    
    fontSize: 15,

  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default EmoInvestigation; 