import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { getUserId } from "./firebaseServices";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firbaseConfig";
import { useNavigation } from "@react-navigation/native";
import useUnacceptedApps from "./useUnnacceptedApps";

const GametimeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [seconds, setSeconds] = useState<number | undefined>(undefined);
  const [weeks, setWeeks] = useState([]);
  const [resetGametime, setResetGametime] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = getUserId((id) => {
      if (id) {
        setUserId(id);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "children", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSeconds(data.gameTime);
          setResetGametime(data.resetTime || false);
        }

        const collectionRef = collection(db, "children", userId, "weeks");
        const collectionSnap = await getDocs(collectionRef);
        const weekList = collectionSnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setWeeks(weekList);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const saveGametime = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "children", userId);
      await setDoc(docRef, { gameTime: seconds, resetTime: resetGametime }, { merge: true });
      Alert.alert("Success", "Gametime set successfully!");
    } catch (error) {
      console.error("Error saving gametime: ", error);
      Alert.alert("Error", "Failed to save gametime");
    } finally {
      setLoading(false);
    }
  };

  const saveResetTime = async (value: boolean) => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      const docRef = doc(db, "children", userId);
      await setDoc(docRef, { resetTime: value }, { merge: true });
      console.log("resetTime updated to:", value);
    } catch (error) {
      console.log("Error updating resetTime:", error);
      Alert.alert("Error", "Failed to update resetTime");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Gametime Screen</Text>
      <Text style={styles.label}>Sekunder:</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={seconds?.toString() || ""}
        onChangeText={(text) => setSeconds(Number(text))}
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: resetGametime ? "#f44336" : "#4CAF50" },
        ]}
        onPress={() => {
          const newResetTime = !resetGametime;
          setResetGametime(newResetTime);
          saveResetTime(newResetTime);
        }}
      >
        <Text style={styles.buttonText}>
          {resetGametime ? "Reset Time: ON" : "Reset time: OFF"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPressIn={saveGametime}>
        <Text style={styles.buttonText}>Bekräfta speltid</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPressIn={() => navigation.navigate("Warnings")}>
        <Text style={styles.buttonText}>Varningar</Text>
      </TouchableOpacity>

      {/* <Text style={styles.result}>{seconds}</Text> */}

      {seconds != null && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate("Permissions")}
        >
          <Text style={styles.buttonText}>App permissions</Text>
        </TouchableOpacity>
      )}

      {/* Scrollable Weeks Section */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Weeks</Text>
        <View style={{ height: 300 }}>
          <ScrollView>
            {weeks.map((week) => (
              <View key={week.id} style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() =>
                    navigation.navigate("WeekDetails", {
                      weekId: week.id,
                      weekData: week.data,
                    })
                  }
                >
                  <Text style={styles.buttonText}>{week.id}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  result: {
    marginTop: 20,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GametimeScreen;
