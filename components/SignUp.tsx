import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Snackbar } from "react-native-paper";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [showWarningPasswordMessage, setShowWarningPasswordMessage] = useState<boolean>(false);
    const [showUnmatchedPassword, setUnmatchedPassword] = useState<boolean>(false);
    const navigation = useNavigation();

    const handleSignUp = async () => {
        try {
            const emailRegex: RegExp = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;

            if (emailRegex.test(email) && password.length > 5 && password === password2) {              
                const user = await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert('Registrering lyckades', `Välkommen, ${email}!`);
                setShowSuccessMessage(true);  
                sendEmailVerification(user.user);
                navigation.navigate("Loading");
                console.log("User registered successfully");

            } else if (password !== password2) {
                Alert.alert('Lösenorden stämmer inte överens');
                setUnmatchedPassword(true);
                console.log("Password mismatch error");

            } else if (password.length < 6) {
                Alert.alert('Lösenordet är för kort');
                console.log("Password length error");

            } else if (!emailRegex.test(email)) {
                Alert.alert('Felaktigt e-postformat');
            }   
                
        } catch (error: any) {
            Alert.alert('Error', error.message);
            setShowWarningPasswordMessage(true);
            console.log("Error registering user: ", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Registrera användare</Text>

            <TextInput
                style={styles.input}
                placeholder="Mailadress"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Lösenord"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Repetera lösenord"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry
            />

            <Button mode="contained" onPress={handleSignUp} style={styles.loginButton}>
                SignUp                
            </Button>

            <Snackbar
                style={styles.snackbar}
                visible={showSuccessMessage}
                onDismiss={() => setShowSuccessMessage(false)}
                duration={Snackbar.DURATION_SHORT}>
                <Text>Registrering lyckad {email}!</Text>
            </Snackbar>

            <Snackbar
                style={styles.snackbar}
                visible={showWarningPasswordMessage}
                onDismiss={() => setShowWarningPasswordMessage(false)}
                duration={Snackbar.DURATION_SHORT}>
                <Text>Måste ange användarnamn och lösenord</Text>
            </Snackbar>

            <Snackbar
                style={styles.snackbar}
                visible={showUnmatchedPassword}
                onDismiss={() => setUnmatchedPassword(false)}
                duration={Snackbar.DURATION_SHORT}>
                <Text>Lösenord stämmer ej överens</Text>
            </Snackbar>
        </View>
    );
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
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
        backgroundColor: 'white',
    },
});
