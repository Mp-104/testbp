import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import { useNavigation } from "@react-navigation/native";
import DialogueTree from "./DialogueTree";


function TalkItOut({navigation}) {
    return (
               <View style={styles.container}>
                   <Text>Talk it out</Text>
                   <DialogueTree></DialogueTree>
                   <View style={styles.buttonContainer}>
                   <View style={styles.hemKnapp}>
                               <Button
                                 title="Tillbaka"
                               onPress={() => navigation.navigate("EmoSpace")}
                               />                        
                           </View>
                           </View>
               </View>
           );
       }
       
       const styles = StyleSheet.create({
           container: {
             flex: 1, // Takes up the full screen height
             justifyContent: 'space-between', // Ensures the button goes to the bottom
             padding: 10, // Optional padding for spacing
           },
           hemKnapp: {
             alignSelf: 'center', // Center the button horizontally
             width: '100%', // Take the full width available
           },
           buttonContainer: {
             flex: 1, // This container takes up the remaining space
             justifyContent: 'flex-end', // Places the button at the bottom
             marginBottom: 20, // Optional margin for spacing from the bottom
           },
         });

export default TalkItOut;