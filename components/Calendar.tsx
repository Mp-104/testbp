import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firbaseConfig';


// Define types for navigation props
interface CalendarScreenProps {
  navigation: StackNavigationProp<any>;
}

// Define the structure of an activity (including time)
interface Activity {
  description: string;
  time: string;
}

// Define type for storing activities
interface Activities {
  [key: string]: Activity[];
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activity, setActivity] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [activities, setActivities] = useState<Activities>({});
  const [userId, setUserId] = useState<string | null>(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadActivities(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load activities from Firebase per user
  const loadActivities = async (userId: string) => {
    try {
      const docRef = doc(db, 'activities', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setActivities(data.activities || {});
        console.log('✅ Activities loaded successfully:', data);
      } else {
        console.log("ℹ️ No activities found in Firestore.");
      }
    } catch (error) {
      console.error('❌ Error loading activities:', error);
    }
  };

  // Save activities per user
  const saveActivities = async (updatedActivities: Activities) => {
    if (!userId) return;
    try {
      const docRef = doc(db, 'activities', userId);
      await setDoc(docRef, { activities: updatedActivities }, { merge: true });
      console.log('✅ Activities saved successfully!');
    } catch (error) {
      console.error('❌ Error saving activities:', error);
    }
  };

  // Handle selecting a date
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // Add a new activity with time
  const addActivity = () => {
    if (!userId || activity.trim() === '' || time.trim() === '') return;
    const updatedActivities = {
      ...activities,
      [selectedDate]: [...(activities[selectedDate] || []), { description: activity, time }],
    };
    setActivities(updatedActivities);
    saveActivities(updatedActivities);
    setActivity('');
    setTime('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Calendar
        onDayPress={handleDayPress}
        markedDates={Object.keys(activities).reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: 'blue' };
          return acc;
        }, {} as Record<string, { marked: boolean; dotColor: string }>)}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Activities for {selectedDate}</Text>
          <FlatList
            data={activities[selectedDate] || []}
            renderItem={({ item }) => <Text>{item.time} - {item.description}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <TextInput
            placeholder="Activity description"
            value={activity}
            onChangeText={setActivity}
            style={styles.input}
          />
          <TextInput
            placeholder="Time (e.g., 10:00 AM)"
            value={time}
            onChangeText={setTime}
            style={styles.input}
          />
          <Button title="Add" onPress={addActivity} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { borderWidth: 1, width: 200, marginVertical: 10, padding: 5 },
});

export default CalendarScreen;
