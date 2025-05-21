import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  ParentStartPage: undefined;
  ParentPage: undefined;
  Login: undefined;
};

const ParentStartPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Welcome to Parent Dashboard</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigation.navigate("ParentPage")}
          >
            <Text style={styles.menuText}>📅 Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>📖 Study Time</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("GametimeScreen")}>
            <Text style={styles.menuText}>🎮 Game Time</Text>
          </TouchableOpacity>

          {/* Logga ut-knapp längst ner */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    height: 80,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 130, 
    backgroundColor: "#2C3E50",
    paddingVertical: 10, 
    alignItems: "flex-start",
  },
  menuItem: {
    paddingVertical: 6, 
    paddingHorizontal: 12, 
  },
  menuText: {
    color: "#fff",
    fontSize: 14, 
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10, 
    alignSelf: "stretch", 
    marginHorizontal: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ParentStartPage;