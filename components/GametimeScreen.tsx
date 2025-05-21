import React, { useEffect, useState } from "react"
import { Alert, Text, View, StyleSheet, Touchable, TouchableOpacity } from "react-native"
import { getUserId } from "./firebaseServices";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firbaseConfig";
import { TextInput } from "react-native-gesture-handler";



const GametimeScreen = () => {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>();
    const [seconds, setSeconds] = useState<number | undefined>(undefined)

    useEffect(() => {
        const unsubscribe = getUserId((id) => {
            if (id) {
                setUserId(id);
                // Load bedtime if exists
                //loadBedtime(id);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef2 = doc(db, "children", userId);
                //const docSnap = await getDoc(docRef);
                const docSnap2 = await getDoc(docRef2);

                if (docSnap2.exists()) {
                    const data = docSnap2.data();
                    data.gameTime;
                    console.log("data.gameTime: ", data.gameTime);
                    setSeconds(data.gameTime);
                }

                console.log("context, docSnap2: ", docSnap2.data())
            } catch (error) {
                console.log("fel med att hämta data: ", error);

            }
        }
        fetchData()

    }, [userId])

    const saveGametime = async () => {

        if (!userId) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        const gameTime = seconds;// bedtime.toTimeString().split(" ")[0].slice(0, 5);
        setLoading(true);
        try {
            const docRef = doc(db, "children", userId);
            await setDoc(docRef, { gameTime: gameTime }, { merge: true });
            //setShowBedtimePicker(false);
            Alert.alert("Success", "Gametime set successfully!");
        } catch (error) {
            console.error("Error saving gametime: ", error);
            Alert.alert("Error", "Failed to save gametime");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Gametime Screen</Text>
            <Text style={styles.label}>Sekunder: </Text>

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={seconds?.toString() || ""}
                onChangeText={text => setSeconds(Number(text))}
            />



            <TouchableOpacity style={styles.saveButton} onPress={saveGametime}>
                <Text style={styles.buttonText}>Bekräfta speltid</Text>
            </TouchableOpacity>

            <Text style={styles.result}>{seconds}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        padding: 10,
        borderRadius: 5,
        marginBottom: 5
    },
    result: {
        marginTop: 20,
        fontWeight: "bold",
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        //flex: 1
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
})

export default GametimeScreen;