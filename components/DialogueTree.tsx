import React from "react";
import { SetStateAction, useState } from "react"
import { Button, ScrollView, View, Text, StyleSheet, Touchable, TouchableOpacity } from "react-native";

const dialogueTree = {
    start: {
      text: "Hej, mitt namn är Emmo, vad heter du?",
      choices: [
        { text: "Hej, jag heter {realName}", next: "realName" },
        { text: "Jag heter Peder", next: "falseName" },
        { text: "Jag vill inte säga", next: "noName" },

        { text: "Hej då.", next: "goodbye" },
      ],
    },
    realName: {
      text: "Trevilgt att lära känna dig, {realName}! Vad vill du prata om idag?",
      choices: [
        { text: "Berätta mer om dig!", next: "aboutEmmo" },
        { text: "Vad är det här för app?", next: "aboutBackpack" },
        { text: "Varför ska jag vara här?", next: "whyHere" },

        { text: "Goodbye.", next: "goodbye" },
      ],
    },
    falseName: {
      text: "... är det verkligen ditt riktiga namn?",
      choices: [
        { text: "Ja", next: "lie" },
        { text: "Nej, mitt namn är {realName}", next: "realName" },

        { text: "Hej då.", next: "goodbye" },
      ],
    },
    noName: {
        text: "Jag förstår, det kan vara svårt att öppna upp sig till ny person.. eh varelse",
        choices: [
            {text: "...", next: "noName"},
            {text: "{realName}", next: "realName"},

            {text: "hejdå", next: "goodbye"},
        ],
    },
    lie: {
      text: "Emmo är tveksam..",
      choices: [
        { text: "det är sant, jag lovar", next: "lie" },
        { text: "..okej då, mitt namn är {realName}", next: "realName" },
        { text: "Ses.", next: "goodbye" },
      ],
    },
    aboutEmmo: {
      text: "Jag är Emmo, din mentala hjälpare! ",
      choices: [
        { text: "Du ska hjälpa mig? Tack så mycket!", next: "gratitude" },
        { text: "Vad kan du göra egentligen?", next: "doubt" },
        { text: "Jag beehöver inte DIN hjälp", next: "rejectHelp" },
        { text: "Hej då!", next: "goodbye" },
      ],
    },
    aboutBackpack: {
      text: "Den här appen ska hjälpa dig att förbättra din mentala hälsa, ta ner din skärmtid samt få dig att leva mer hälsosamt!",
      choices: [
        { text: "Låter spännande! Jag vill vara med.", next: "excited"},
        { text: "Då kör vi", next: "excited"},
        { text: "Javisst", next: "excited"},
        { text: "Hej då.", next: "goodbye" },
      ],
    },
    whyHere : {
        text: "För att det blir bra för dig!",
        choices: [
            { text: "Låter bra", next: "excited"},
            { text: "Du vet inte vad som är bra för mig..", next: "rejectHelp"},

            { text: "Hej då", next: "goodbye"}
        ]
    },
    gratitude: {
        text: "Det var fint. [ingen mer dialog]",
        choices: [
            { text: "start om", next: "start"},
            { text: "hejdå", next: "goodbye"}
        ]
    },
    excited: {
        text: "Din entusiast gör Emmo glad! [slut på dialog]",
        choices: [
            { text: "starta om", next: "start"},
            { text: "Hej då!", next: "goodbye"},
        ]
    },
    doubt: {
        text: "Du tvivlar på Emmo..? Jag ska allt visa dig.. om du get mig en chans :) [slut på dialog]",
        choices: [
            { text: "starta om", next: "start"},
            { text: "hed jå", next: "goodbye"}
        ]
    },
    rejectHelp: {
        text: "Du tror du klarar dig utan Emmo.. *spit* javla din land ", 
        choices: [
            { text: "jävla min land? Jävla ditt land!", next: "fuckYourCountry" },
            { text: "Det var inte fint sagt", next: "notNice"},
            { text: "*sobs* jag trodde vi var vänner", next: "sad"},

            { text: "hej då", next: "goodbye"},
        ]
    },
    fuckYourCountry: {
        text: "vem fan tror du att du är",
        choices: [
            { text: "hej då", next: "goodbye"}
        ]
    },
    notNice: {
        text: " håll käften ",
        choices: [
            { text: "hej då", next: "goodbye"}

        ]
    },
    sad: {
        text: " you gonna cwy, are you a little cwybaby, go ahead cwy little cwybaby",
        choices: [
            { text: "hej då", next: "goodbye"}
        ]
    },
    goodbye: {
      text: "Hej då, det var kul att umgås!",
      choices: [],
    },
  };


  const DialogueTree = () => {
    // State to track the current dialogue node
    const [currentNode, setCurrentNode] = useState('start');
    const [history, setHistory] = useState([]); // To store the history of dialogues
  
    // Function to handle when a choice is selected
    const handleChoice = (nextNode) => {
      // Push the current node to history before transitioning
      setHistory([...history, currentNode]);
      setCurrentNode(nextNode);
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
    const currentDialogue = dialogueTree[currentNode];
  
    return (
      <View style={styles.container}>
        <ScrollView>
          {/* Displaying the dialogue text */}
          <Text style={styles.dialogueText}>{currentDialogue.text}</Text>
  
          {/* Displaying the choices */}
          {currentDialogue.choices.map((choice, index) => (
            <TouchableOpacity key={index} style={styles.button}>
              <Button
              key={index}
              title={choice.text}
              onPress={() => handleChoice(choice.next)}
            />
            </TouchableOpacity>
            
          ))}
        </ScrollView>
  
        {/* Back button to go to previous dialogue */}
        {history.length > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
          />
        )}
      </View>
    );
  };

export default DialogueTree;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    dialogueText: {
      fontSize: 18,
      marginBottom: 20,
    },
    button: {
      marginBottom: 10
    }
  });