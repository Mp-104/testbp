import React, { useState } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmoGame = () => {
  const navigation = useNavigation();  
  const [blueEmotionData, setBlueEmotionData] = useState<Record<string, string>>({});
  const [yellowEmotionData, setYellowEmotionData] = useState<Record<string, string>>({});
  const [redEmotionData, setRedEmotionData] = useState<Record<string, string>>({});
  const [greyEmotionData, setGreyEmotionData] = useState<Record<string, string>>({});

  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [feelingResult, setFeelingResult] = useState("");
  const [isFeelingResultVisible, setIsFeelingResultVisible] = useState(false);

  const emotions = [
    { label: "Glad", value: "😊"},
    { label: "Kärleksfull", value: "❤️"},
    { label: "Avslappnad", value: "😌"},
    { label: "Arg", value: "😠"},
    { label: "Ledsen", value: "😢"},
];

const feelings = [
    { label: "GLAD", value: "😊"},
    { label: "ARG", value: "😡"},
    { label: "LEDSEN", value: "🥺"},
    { label: "RÄDD", value: "😨"},
    { label: "NERVÖS", value: "😲"},
    { label: "BESVIKEN", value: "😤"},
    { label: "ENSAM", value: "😞"},
    { label: "LUGN", value: "😡"},
    { label: "NYFIKEN", value: "🥺"},
    { label: "STOLT", value: "😨"},
    { label: "PIRRIG", value: "😲"},
    { label: "TACKSAM", value: "😤"},
    { label: "TRÖTT", value: "😞"},
];

 

  const handleSubmit = () => {
    if(answers.q1 == true && answers.q2 == true && answers.q3 == true && answers.q4 == true && answers.q5 == true) {setFeelingResult (emotions[0].value);}
    if(answers.q1 == true && answers.q2 == true && answers.q3 == true && answers.q4 == true && answers.q5 == false) {setFeelingResult (emotions[1].value);}
    if(answers.q1 == true && answers.q2 == true && answers.q3 == true && answers.q4 == false && answers.q5 == true) {setFeelingResult (emotions[2].value);}
    if(answers.q1 == true && answers.q2 == true && answers.q3 == true && answers.q4 == false && answers.q5 == false) {setFeelingResult (emotions[3].value);}
    if(answers.q1 == false && answers.q2 == false && answers.q3 == false && answers.q4 == false && answers.q5 == true) {setFeelingResult (emotions[4].value);}
    if(answers.q1 == false && answers.q2 == false && answers.q3 == false && answers.q4 == false && answers.q5 == false) {setFeelingResult (emotions[1].value);}
    }

  const handleAnswer = (q: string, value: boolean) => {    
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [q]: value,
    }));    
  };

  const renderAnswerText = (q: string) => {
    const answer = answers[q];    
    return answer ? "True" : "False";
  };

  const getButtonStyle = (q: string, value: boolean) => {
    const isSelected = answers[q] === value;
    return isSelected ? { ...styles.button, backgroundColor: 'green' } : styles.button;
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "left", fontSize: 20 }}>
        - KÄNNS KROPPEN LÄTT OCH STILLA?
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={getButtonStyle("q1", true)}
          onPress={() => handleAnswer("q1", true)}
        >
          <Text style={styles.buttonText}>JA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("q1", false)}
          onPress={() => handleAnswer("q1", false)}
        >
          <Text style={styles.buttonText}>NEJ</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: "left", fontSize: 20 }}>
        - SKA DU TRÄFFA NÅGON DU INTE TRÄFFAT FÖRUT OCH DET KÄNNS ROLIGT?
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={getButtonStyle("q2", true)}
          onPress={() => handleAnswer("q2", true)}
        >
          <Text style={styles.buttonText}>JA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("q2", false)}
          onPress={() => handleAnswer("q2", false)}
        >
          <Text style={styles.buttonText}>NEJ</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: "left", fontSize: 20 }}>
        - GICK NÅGOT DÅLIGT SOM DU HOPPATS SKULLE GÅ BRA?
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={getButtonStyle("q3", true)}
          onPress={() => handleAnswer("q3", true)}
        >
          <Text style={styles.buttonText}>JA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("q3", false)}
          onPress={() => handleAnswer("q3", false)}
        >
          <Text style={styles.buttonText}>NEJ</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: "left", fontSize: 20 }}>
        - HAR DU SOVIT DÅLIGT?
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={getButtonStyle("q4", true)}
          onPress={() => handleAnswer("q4", true)}
        >
          <Text style={styles.buttonText}>JA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("q4", false)}
          onPress={() => handleAnswer("q4", false)}
        >
          <Text style={styles.buttonText}>NEJ</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ textAlign: "left", fontSize: 20 }}>
        - Har du haft en jobbig dag?
      </Text>
      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={getButtonStyle("q5", true)}
          onPress={() => handleAnswer("q5", true)}
        >
          <Text style={styles.buttonText}>JA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle("q5", false)}
          onPress={() => handleAnswer("q5", false)}
        >
          <Text style={styles.buttonText}>NEJ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.answerContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EmoGameQ4")
          }
        >
          <Text style={styles.buttonText}>NÄSTA</Text>
        </TouchableOpacity>
      </View>
        {/*<Text>
          Question 1: {renderAnswerText("q1")}{"\n"}        
          Question 2: {renderAnswerText("q2")}{"\n"}        
          Question 3: {renderAnswerText("q3")}{"\n"}
          Question 4: {renderAnswerText("q4")}{"\n"}        
          Question 5: {renderAnswerText("q5")}
        </Text>*/}
      <Text style={{ textAlign: "center", fontSize: 200 }}>
       {feelingResult }
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EmoSpace")}
        >
          <Text style={styles.buttonText}>TILLBAKA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: 10,
    bottom: 70
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
});

export default EmoGame;