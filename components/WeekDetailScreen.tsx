import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const msToMinutes = (ms) => Math.floor(ms / 60);

const WeekDetailScreen = ({ route }) => {
  const { weekId, weekData } = route.params;

  const screenTimeEntries = Object.entries(weekData.screenTime || {}).map(
    ([packageName, data]) => ({
      packageName,
      appName: data.appName || packageName,
      timeInForeground: data.totalTimeInForeground || 0,
      lastTimeUsed: data.lastTimeUsed || null,
    })
  );

  // Sort apps by time used (descending)
  screenTimeEntries.sort((a, b) => b.timeInForeground - a.timeInForeground);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Week: {weekId}</Text>
      <Text style={styles.subtitle}>App Usage:</Text>

      <FlatList
        data={screenTimeEntries}
        keyExtractor={(item) => item.packageName}
        renderItem={({ item }) => (
          <View style={styles.appItem}>
            <Text style={styles.appName}>{item.appName}</Text>
            <Text style={styles.appTime}>
              Used for {msToMinutes(item.timeInForeground)} min
            </Text>
            {/* Optional: show last time used as readable date */}
            {item.lastTimeUsed && (
              <Text style={styles.lastUsed}>
                Last used: {new Date(item.lastTimeUsed).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  appItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  appName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  appTime: {
    fontSize: 14,
    color: "#555",
  },
  lastUsed: {
    fontSize: 12,
    color: "#888",
  },
});

export default WeekDetailScreen;
