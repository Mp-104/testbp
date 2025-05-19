import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, AppState } from 'react-native';
import { checkForPermission, EventFrequency, queryUsageStats, showUsageAccessSettings } from '@brighthustle/react-native-usage-stats-manager';
import DeviceInfo from 'react-native-device-info';
import UsageStats from 'react-native-usage-stats';

const AppUsageStats = () => {
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const [deviceInfo, setDeviceInfo] = useState(DeviceInfo.getAndroidId);


  useEffect(() => {
    checkPermissionAndFetchStats();

    console.log("appState", appState);
    console.log("deviceInfo", deviceInfo);

    const appStateListener = AppState.addEventListener("change", nextAppStep => {
      if (appState.match("/inactive | background/")   && nextAppStep === "active") {
        checkPermissionAndFetchStats();
      }
      setAppState(nextAppStep);
    });

    return ()=> {
      appStateListener.remove();
    }

  }, [appState]);

  const checkPermissionAndFetchStats = async () => {
    setLoading(true);

    try {
      const hasPermission = await checkForPermission();
      setPermissionGranted(hasPermission);

      if (hasPermission) {

        
        // Define the date range
        const startDateString = '2025-01-20T12:34:56';
        const endDateString = '2023-02-20T12:34:56';
        const startMilliseconds = new Date(startDateString).getTime();
        const endMilliseconds = new Date(endDateString).getTime();

        

        // Query usage stats for the specified period
        const result = await queryUsageStats(1, startMilliseconds, endMilliseconds);
        setUsageStats(result);
      } else {
        setError('Permission not granted');
      }
    } catch (err) {
      console.error('Error fetching usage stats:', err);
      setError('Failed to fetch usage stats');
    } finally {
      setLoading(false);
    }
  };

  const handleEnablePermission = () => {
    console.log("test handleEnablePermission")
    showUsageAccessSettings("");
  };

  return (
    <View /* style={styles.container} */>
      <Text>Usage</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : permissionGranted ? (
        <View style={styles.statsContainer}>
          <Text style={styles.heading}>Usage Statistics</Text>
          {usageStats ? (
            <Text style={styles.statsText}>{JSON.stringify(usageStats, null, 2)}</Text>
          ) : (
            <Text>No usage stats available for the specified period.</Text>
          )}
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <Text style={styles.heading}>Permission Required</Text>
          <Text style={styles.permissionText}>
            To access app usage stats, please grant the required permission.
          </Text>
          <Button title="Go to Settings" onPress={handleEnablePermission} />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'left',
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default AppUsageStats;
