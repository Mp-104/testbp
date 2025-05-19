import React from "react";
import { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
//import { doc, setDoc } from "firebase/firestore/lite";
//import firebase from '@react-native-firebase/app'
//import '@react-native-firebase/auth'
import {auth, db} from "./Firebase"


const NavTest=()=>{

    

return(
                <Button mode="contained" onPress={NavTest} style={styles.loginButton}>
                    Submit                
                </Button>



)
}

export default NavTest;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingLeft: 10,
    },
    loginButton: {
      marginTop: 20,
      width: '100%',
      padding: 10,
    },
    snackbar: {

        backgroundColor: 'white'
    }
  });