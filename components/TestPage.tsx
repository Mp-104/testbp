import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

function TestPage({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menyval</Text>

            <Button 
                mode="contained" 
                onPress={() => navigation.navigate("Home")} 
                style={styles.button}
            >
                Hem meny
            </Button>

            <Button 
                mode="contained" 
                onPress={() => navigation.navigate("SignUp")} 
                style={styles.button}
            >
                Registrera
            </Button>
        </View>
    );
}

export default TestPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    button: {
        marginVertical: 10,
        width: "80%",
    },
});
