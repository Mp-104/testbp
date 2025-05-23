import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Snackbar } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { auth } from "./Firebase";
import useUnacceptedApps from "./useUnnacceptedApps";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define navigation stack types
type RootStackParamList = {
    SignUp: undefined;
    Login: undefined;
    ParentPage: undefined; 
  };

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const { unacceptedApps, toggleAppStatus, loadUnacceptedApps } = useUnacceptedApps();
  

  const handleLogin = async () => {
    setLoading(true);
    setShowErrorMessage(false);
    setShowSuccessMessage(false);
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      Alert.alert("Inloggning lyckades", `Välkommen tillbaka, ${email}!`);
      setShowSuccessMessage(true);
      console.log("User logged in successfully");
      loadUnacceptedApps();
      // Navigate to ParentPage after login
      navigation.navigate("ParentPage");
  
    } catch (error: any) {
      setShowErrorMessage(true);
      Alert.alert("Fel", "Felaktig e-postadress eller lösenord.");
      console.error("Error logging in:", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Logga in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Lösenord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
          Logga in
        </Button>
      )}

      {/* Navigate to SignUp Page */}
      <Button mode="outlined" onPress={() => navigation.navigate("SignUp")} style={styles.signUpButton}>
        Har du inget konto? Registrera dig här
      </Button>

      {/* Success Message */}
      <Snackbar
        style={styles.snackbar}
        visible={showSuccessMessage}
        onDismiss={() => setShowSuccessMessage(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        <Text>Inloggad, {email}!</Text>
      </Snackbar>

      {/* Error Message */}
      <Snackbar
        style={styles.snackbar}
        visible={showErrorMessage}
        onDismiss={() => setShowErrorMessage(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        <Text>Felaktig e-postadress eller lösenord</Text>
      </Snackbar>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  loginButton: {
    marginTop: 20,
    width: "100%",
    padding: 10,
  },
  signUpButton: {
    marginTop: 20,
    width: "100%",
  },
  snackbar: {
    backgroundColor: "white",
  },
});
