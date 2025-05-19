import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Define navigation prop type
type RootStackParamList = {
  MainPage: undefined;
  Parent: undefined;
};

type ChooseRoleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "MainPage">;

const ChooseRole: React.FC = () => {
  const navigation = useNavigation<ChooseRoleScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Välj roll</Text>
      <Text style={styles.description}>
        Välj om du vill logga in som barn eller förälder.{"\n"}Barn behöver endast logga in en gång.{"\n"}Förälder behöver email och lösenord.
      </Text>

      <TouchableOpacity style={styles.childButton} onPress={() => navigation.navigate("MainPage")}>
        <Text style={styles.buttonText}>Barn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.parentButton} onPress={() => navigation.navigate("ParentStartPage")}>
        <Text style={styles.buttonText}>Förälder</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8", 
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  childButton: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  parentButton: {
    backgroundColor: "#007AFF", 
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});