import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, FlatList } from "react-native"
import { getUserId } from "./firebaseServices";
import { doc, setDoc, getDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firbaseConfig";
import { useNavigation } from "@react-navigation/native";
import useUnacceptedApps from "./useUnnacceptedApps";


const Warnings = () => {
    const [warnings, setWarnings] = useState<Timestamp[]>([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const unsubscribe = getUserId((id) => {
            if (id) {
                setUserId(id);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async () => {

        try {
            const docRef = doc(db, "warnings", userId);
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
              const data = docSnap.data();
              const timestamps = data.timestamps || [];
              console.log("Fetched warnings:", timestamps);
              setWarnings(timestamps)
            } else {
              console.log("No warnings found for this user.");
              return [];
            }
        } catch (error) {
            console.log("error fetching warnings: ", error)
        }
    }

    useEffect(() => {
        if(userId) {
            fetchData();
        }
        
    }, [userId])


    return (
        <View style={styles.container}>
        <Text style={styles.title}>Warnings</Text>
        <FlatList
          data={warnings}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.warningItem}>
              <Text>{new Date(item.seconds * 1000).toLocaleString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No warnings found.</Text>}
        />
      </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    warningItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    empty: {
      textAlign: "center",
      marginTop: 20,
      color: "#666",
    },
  });

export default Warnings;