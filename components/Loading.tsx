import React, { useEffect, useState } from "react";
import { Button, View, Text } from "react-native";
import SignUp from "./SignUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const SendEmailVerificationListener = () => {
    const [emailVerified, setEmailVerified] = useState(false);
    const navigation = useNavigation();
        
    useEffect(() => {
        const intervalId=setInterval(() => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, async(user) => {
            try {            
                await user?.reload();
                if (user.emailVerified) {
                    setEmailVerified(true);
                    navigation.navigate("ChooseRole");
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error("Error reloading user data:", error);
            }     
        });                     
              console.log("This runs every 5 seconds");   
            }, 5000);
            return () => {clearInterval(intervalId)};
            //unsubscribe()};
        },[]);        
    return (
        <View>
            <Text style={{ fontFamily: 'Roboto', fontSize: 16}}>Väntar på mail-verifikation</Text>   

            


        </View>
    );
}

export default SendEmailVerificationListener;

