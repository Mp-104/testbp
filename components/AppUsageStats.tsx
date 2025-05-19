import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import UsageStats from 'react-native-usage-stats';
import { checkForPermission, EventFrequency, queryUsageStats, showUsageAccessSettings } from '@brighthustle/react-native-usage-stats-manager';
import { useUsageStats } from './UsageStatsContext';


interface UsageStatsData {
  lastTimeStamp: number;
  firstTimeStamp: number;
  totalTimeVisible: number;
  lastTimeUsed: number;
  packageName: string;
  totalTimeInForeground: number;
  lastTimeForegroundServiceUsed: number;
  totalTimeForegroundServiceUsed: number;
  lastTimeVisible: number;

}

function millisecondsToTime(milliseconds: number): string {
  const date = new Date(milliseconds); // Create a Date object from the milliseconds
  const hours = date.getUTCHours();    // Get hours (UTC)
  const minutes = date.getUTCMinutes(); // Get minutes (UTC)
  const seconds = date.getUTCSeconds(); // Get seconds (UTC)

  // Pad single digits with leading zeros
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

function millisecondsToFullDate(milliseconds: number): string {
  const date = new Date(milliseconds); // Create a Date object from the milliseconds

  // Get the components of the date
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed (0-11)
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Format the date and time
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const AppUsageStats = () => {
  const [loading, setLoading] = useState(false);
  //const [usageStats, setUsageStats] = useState<any>();
  const {usageStats, setUsageStats} = useUsageStats();
  const [localUsageStats, setLocalUsageStats] = useState();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        checkPermissionAndFetchStats();
        checkPermissionAndFetchStatsFor24Hours();
    }, 1000 );
    
    return () => clearInterval(interval);
    //checkPermissionAndFetchStats();
  }, []);

  const checkPermissionAndFetchStatsFor24Hours = async () => {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
    const currentTime = new Date().getTime();
    
    // Query for hourly intervals
    const intervals = [];
    const intervalDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    let startInterval = startOfDay;
  
    while (startInterval < currentTime) {
      const endInterval = Math.min(startInterval + intervalDuration, currentTime);
      intervals.push([startInterval, endInterval]);
      startInterval = endInterval;
    }
  
    const allUsageStats = [];
    for (let [start, end] of intervals) {
      const result = await UsageStats.queryUsageStats(start, end);
      allUsageStats.push(...result);
    }
  
    console.log(allUsageStats[2].totalTimeInForeground); // Combine or aggregate results as needed
  };

  const checkPermissionAndFetchStats = async () => {
    setLoading(true);
    try {
      const hasPermission = await UsageStats.checkPermission();
      setPermissionGranted(hasPermission);
      if (hasPermission) {
        /* const startDate = new Date('2025-02-21').getTime();
        const endDate = new Date('2025-02-22').getTime(); */

        const currentDate = new Date();
        const currentTime = currentDate.getTime();

        const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();//new Date(currentDate.setHours(0, 0, 0, 0)).getTime();

        const endTime = new Date().getTime();  // Current time in milliseconds
        const startTime = endTime - (60 * 60 * 1000);

        /* console.log("startOfDay: ", millisecondsToTime(startOfDay));
        console.log("currentTime: ", millisecondsToTime(currentTime));

        console.log("startTime: ", millisecondsToTime(startTime));
        console.log("endTime: ", millisecondsToTime(endTime)); */
        // UsageStats.queryUsageStats(beginTime, endTime) counts in milliseconds
        const result2: UsageStatsData[] = await UsageStats.queryUsageStats(startOfDay, currentTime);
        const result: UsageStatsData[] = await UsageStats.queryUsageStats( startTime, endTime);

        // queryUsageStats(interval, beginTime, endTime) from @brighthustle counts in seconds, last 24 hours
        const result3 = await queryUsageStats(0, startOfDay, currentTime ); // 0 = daily, 1 = weekly, 2 = monthly, 3 = yearly, 4 = best considering the time period
        const result4 = await queryUsageStats(0, startTime, endTime);
        
        /* const index = 62   //33 new-backpack

        const resultInHumanTime = millisecondsToTime(result[index].totalTimeInForeground);
        const resultInFullDate = millisecondsToFullDate(result[2].totalTimeInForeground); */
        //setUsageStats(result[index].packageName + ": " + resultInHumanTime);
        //setUsageStats(result[index]);
        //setUsageStats(result3["com.hsv.freeadblockerbrowser"].appName + ": " + result3["com.hsv.freeadblockerbrowser"].totalTimeInForeground + " seconds");
        
        //console.log("result3: ", result3);


        const apps = Object.entries(result3).map(([packageName, appData]) => ({
          packageName,
          ...appData
        }));

        const sortedApps = apps.sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);

        setLocalUsageStats(sortedApps)
        console.log("sortedApps: ", sortedApps);
      } else {
        console.error("Permission not granted");
      }
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    } finally {
      setLoading(false);
    }
  };
  const convertToMinutes = (seconds: number) => {
    return (seconds / 60).toFixed(2); // Converts to minutes and keeps 2 decimal places
  };
  const handleEnablePermission = () => {
      console.log("test handleEnablePermission")
      showUsageAccessSettings("");
    };

  return (
    <View>
     {/*  <Text>Usage Stats for last hour</Text>
      {loading ? <ActivityIndicator /> : (
        permissionGranted ? (
          <ScrollView>
            <Text>{JSON.stringify(usageStats, null, 2)}</Text>
          </ScrollView>
        ) : (
          <Text>Permission required to access usage stats</Text>
        )
      )} */}

      {permissionGranted ? (<></>): (<Button title="Ge tillstånd" onPress={handleEnablePermission} />
)}

      {/* <Button title="Ge tillstånd" onPress={handleEnablePermission} /> */}
      


      <ScrollView style={styles.container}>
        {localUsageStats ? localUsageStats.map((stat, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>App: {stat.appName}</Text>
            <Text>Användning senaste dygnet: {convertToMinutes(stat.totalTimeInForeground)} minuter</Text>
          </View>
        )): (<Text>laddar</Text>)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: "6%",
  }
})
export default AppUsageStats;
