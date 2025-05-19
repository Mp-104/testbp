import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  Button, 
  TextInput, 
  Modal, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Calendar, DateData } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getUserId } from "./firebaseServices";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firbaseConfig";
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ParentPage: undefined;
};

type Activity = { 
  id: string;
  title: string; 
  date: string; 
  time: string;
  completed: boolean;
};

type MarkedDate = {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
};

const ParentPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [dailyActivities, setDailyActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [bedtime, setBedtime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [activityTime, setActivityTime] = useState<Date>(new Date());
  const [showBedtimePicker, setShowBedtimePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = getUserId((id) => {
      if (id) {
        setUserId(id);
        // Load bedtime if exists
        loadBedtime(id);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadBedtime = async (userId: string) => {
    try {
      const docRef = doc(db, "children", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().bedtime) {
        const [hours, minutes] = docSnap.data().bedtime.split(':');
        const newBedtime = new Date();
        newBedtime.setHours(parseInt(hours, 10));
        newBedtime.setMinutes(parseInt(minutes, 10));
        setBedtime(newBedtime);
      }
    } catch (error) {
      console.error("Error loading bedtime: ", error);
    }
  };

  const handleDayPress = async (day: DateData) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    
    // Update marked dates to show selected date
    const newMarkedDates = { ...markedDates };
    Object.keys(newMarkedDates).forEach(date => {
      newMarkedDates[date].selected = false;
    });
    newMarkedDates[dateString] = { 
      ...newMarkedDates[dateString], 
      marked: true, 
      dotColor: "#4287f5",
      selected: true
    };
    setMarkedDates(newMarkedDates);
    
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    
    setLoading(true);
    try {
      const docRef = doc(db, "children", userId, "calendar", dateString);
      const docSnap = await getDoc(docRef);
      setDailyActivities(docSnap.exists() ? docSnap.data().activities : []);
    } catch (error) {
      console.error("Error fetching activities: ", error);
      Alert.alert("Error", "Failed to load activities");
    } finally {
      setLoading(false);
    }
    setModalVisible(true);
  };

  const addActivity = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    
    if (!selectedDate) {
      Alert.alert("Error", "No date selected");
      return;
    }
    
    if (newActivity.trim() === "") {
      Alert.alert("Error", "Please enter an activity");
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(), // More reliable than Math.random()
      title: newActivity.trim(),
      date: selectedDate,
      time: activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: false
    };

    const updatedActivities = [...dailyActivities, activity];
    setDailyActivities(updatedActivities);

    setLoading(true);
    try {
      const docRef = doc(db, "children", userId, "calendar", selectedDate);
      await setDoc(docRef, { activities: updatedActivities }, { merge: true });
      
      setMarkedDates({ 
        ...markedDates, 
        [selectedDate]: { marked: true, dotColor: "#4287f5", selected: true } 
      });
      setNewActivity("");
      setActivityTime(new Date());
    } catch (error) {
      console.error("Error adding activity: ", error);
      Alert.alert("Error", "Failed to add activity");
      // Revert UI if save fails
      setDailyActivities(dailyActivities);
    } finally {
      setLoading(false);
    }
  };

  const removeActivity = async (activityId: string) => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    
    setLoading(true);
    const updatedActivities = dailyActivities.filter(activity => activity.id !== activityId);
    setDailyActivities(updatedActivities);

    try {
      const docRef = doc(db, "children", userId, "calendar", selectedDate);
      await setDoc(docRef, { activities: updatedActivities }, { merge: true });

      if (updatedActivities.length === 0) {
        const newMarkedDates = { ...markedDates };
        delete newMarkedDates[selectedDate];
        setMarkedDates(newMarkedDates);
      }
    } catch (error) {
      console.error("Error removing activity: ", error);
      Alert.alert("Error", "Failed to remove activity");
      // Revert UI if save fails
      setDailyActivities(dailyActivities);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivityCompletion = async (activityId: string) => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    
    setLoading(true);
    const updatedActivities = dailyActivities.map(activity => 
      activity.id === activityId 
        ? { ...activity, completed: !activity.completed } 
        : activity
    );
    setDailyActivities(updatedActivities);

    try {
      const docRef = doc(db, "children", userId, "calendar", selectedDate);
      await setDoc(docRef, { activities: updatedActivities }, { merge: true });
    } catch (error) {
      console.error("Error updating activity: ", error);
      Alert.alert("Error", "Failed to update activity");
      // Revert UI if save fails
      setDailyActivities(dailyActivities);
    } finally {
      setLoading(false);
    }
  };

  const saveBedtime = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    
    const bedtimeString = bedtime.toTimeString().split(" ")[0].slice(0, 5);
    setLoading(true);
    try {
      const docRef = doc(db, "children", userId);
      await setDoc(docRef, { bedtime: bedtimeString }, { merge: true });
      setShowBedtimePicker(false);
      Alert.alert("Success", "Bedtime set successfully!");
    } catch (error) {
      console.error("Error saving bedtime: ", error);
      Alert.alert("Error", "Failed to save bedtime");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Parent Calendar</Text>

      {loading && <ActivityIndicator size="large" color="#4287f5" style={styles.loader} />}

      <Calendar 
        onDayPress={handleDayPress} 
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#4287f5',
          todayTextColor: '#4287f5',
          arrowColor: '#4287f5',
          dotColor: '#4287f5',
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeader}>
                {new Date(selectedDate).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#4287f5" style={styles.loader} />
            ) : (
              <>
                <FlatList
                  data={dailyActivities}
                  renderItem={({ item }) => (
                    <View style={styles.activityItem}>
                      <TouchableOpacity 
                        onPress={() => toggleActivityCompletion(item.id)}
                        style={styles.checkbox}
                      >
                        <Icon 
                          name={item.completed ? "check-box" : "check-box-outline-blank"} 
                          size={24} 
                          color={item.completed ? "#4CAF50" : "#333"} 
                        />
                      </TouchableOpacity>
                      <View style={styles.activityTextContainer}>
                        <Text style={[
                          styles.activityText, 
                          item.completed && styles.completedActivity
                        ]}>
                          {item.time} - {item.title}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => removeActivity(item.id)}
                        style={styles.deleteButton}
                      >
                        <Icon name="delete" size={24} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <Text style={styles.noActivitiesText}>No activities for this day</Text>
                  }
                  contentContainerStyle={dailyActivities.length === 0 && styles.emptyList}
                />

                <View style={styles.addActivityContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Activity"
                    value={newActivity}
                    onChangeText={setNewActivity}
                    placeholderTextColor="#888"
                  />
                  
                  <TouchableOpacity 
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.timeButtonText}>
                      {activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Icon name="access-time" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {showTimePicker && (
                  <DateTimePicker
                    value={activityTime}
                    mode="time"
                    display="spinner"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) setActivityTime(selectedTime);
                    }}
                  />
                )}

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !newActivity.trim() && styles.disabledButton
                  ]}
                  onPress={addActivity}
                  disabled={!newActivity.trim()}
                >
                  <Text style={styles.buttonText}>Add Activity</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.bedtimeSection}>
        <Text style={styles.sectionTitle}>Child's Bedtime</Text>
        <View style={styles.bedtimeControls}>
          <TouchableOpacity 
            style={styles.bedtimeButton}
            onPress={() => setShowBedtimePicker(true)}
          >
            <Text style={styles.bedtimeButtonText}>
              {bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Icon name="edit" size={18} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveBedtime}
          >
            <Text style={styles.buttonText}>Save Bedtime</Text>
          </TouchableOpacity>
        </View>

        {showBedtimePicker && (
          <DateTimePicker
            value={bedtime}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowBedtimePicker(false);
              if (selectedDate) setBedtime(selectedDate);
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: '#333'
  },
  loader: {
    marginVertical: 20
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "white", 
    padding: 20, 
    borderRadius: 10, 
    width: "90%",
    maxHeight: "80%"
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  modalHeader: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#333',
    flex: 1
  },
  closeButton: {
    padding: 5
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 10, 
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#333'
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  checkbox: {
    padding: 5
  },
  activityTextContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  activityText: {
    fontSize: 16,
    color: '#333'
  },
  completedActivity: {
    textDecorationLine: 'line-through',
    color: '#888'
  },
  deleteButton: {
    padding: 5
  },
  noActivitiesText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 16
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center'
  },
  addActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4287f5',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
    width: 100
  },
  timeButtonText: {
    color: '#fff',
    marginRight: 8
  },
  bedtimeSection: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  bedtimeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bedtimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4287f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  bedtimeButtonText: {
    color: '#fff',
    marginRight: 8,
    fontSize: 16
  },
  addButton: {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1
  },
  disabledButton: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ParentPage;