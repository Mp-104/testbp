import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  ImageBackground
} from 'react-native';
import { format, addDays, startOfWeek, isToday, addWeeks, subWeeks } from 'date-fns';
import { doc, getDoc, collection, getDocs, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sv } from 'date-fns/locale';
import { db, auth } from './firbaseConfig';
import Orientation from 'react-native-orientation-locker';


const bubbleBackground = require('../assets/bubbles3.png');

type Activity = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  completed: boolean;
  points?: number;
  isAllDay?: boolean;
  isWeekly?: boolean;
};

type CalendarViewProps = {
  parentId: string;
  childId?: string;
  isParentView?: boolean;
  navigation?: any;
  route?: any;
};

const CalendarScreen: React.FC<CalendarViewProps> = ({ 
  //parentId, 
  childId, 
  isParentView = false 
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [totalPoints, setTotalPoints] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weekDays, setWeekDays] = useState<{ date: string; day: string; isToday: boolean }[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, { marked: boolean; dotColor: string }>>({});
  const [loading, setLoading] = useState(false);
  const [showDayView, setShowDayView] = useState(false);
  const [bedtimeActive, setBedtimeActive] = useState(false);
  const [sleepRitualStep, setSleepRitualStep] = useState(0);
  const [newActivity, setNewActivity] = useState('');


  const currentUser = auth.currentUser

  const parentId = currentUser?.uid

  useEffect(()=> {
    Orientation.lockToPortrait();
    console.log("activities: ", activities)

    return ()=> Orientation.lockToLandscape();
  }, [])

  const bedtimeRoutine = [
    "Emmo: Jag är trött och vill sova... Hur var din dag?",
    "Låt oss göra en lugnande ritual tillsammans...",
    "Vi andas djupa andetag (blås på de lysande stjärnorna)",
    "Tandborstningstid! (Rita mönster med tandborsten)",
    "Godnattsaga (Välj en kort saga)",
    "Emmo: Godnatt! Tryck på lampan när du är redo."
  ];

  // Update week days when currentWeekStart changes
  useEffect(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(currentWeekStart, i);
      return { 
        date: format(day, 'yyyy-MM-dd'), 
        day: format(day, 'EEE', { locale: sv }).toUpperCase(),
        isToday: isToday(day)
      };
    });
    setWeekDays(days);
  }, [currentWeekStart]);

  useEffect(() => {
    if (!parentId) return;
    
    const fetchCalendarData = async () => {
      setLoading(true);
      try {
        const calendarRef = collection(db, "parents", parentId, "calendar");
        const querySnapshot = await getDocs(calendarRef);
        
        let newMarkedDates: Record<string, { marked: boolean; dotColor: string }> = {};
        querySnapshot.forEach((doc) => {
          newMarkedDates[doc.id] = { marked: true, dotColor: "#4287f5" };
        });
        setMarkedDates(newMarkedDates);

        if (childId && !isParentView) {
          const childRef = doc(db, "children", childId);
          const childSnap = await getDoc(childRef);
          if (childSnap.exists()) {
            setTotalPoints(childSnap.data()?.points || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        Alert.alert("Error", "Could not load calendar data");
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [parentId, childId, isParentView]);

  const handleDayPress = async (date: string) => {
    if (!parentId) {
      Alert.alert("Error", "Parent connection not available");
      return;
    }

    setSelectedDate(date);
    setLoading(true);
    try {
      console.log("parentId", parentId)
      const docRef = doc(db, "children", parentId, "calendar", date);
      const docSnap = await getDoc(docRef);

      console.log("docSnap: ", docSnap)
      console.log("docSnap.exists(): ", docSnap.exists())
      console.log("docSnap.data(): ", docSnap.data())
      
      if (docSnap.exists()) {
        const parentActivities = docSnap.data()?.activities || [];
        console.log("parentActivities: ", parentActivities)
        const formattedActivities = isParentView 
          ? parentActivities
          : parentActivities.map((activity: string, index: number) => ({
              id: `${date}-${index}`,
              title: activity,
              completed: false,
              points: 5
            }));
            console.log("activities2: ", formattedActivities)
        setActivities(formattedActivities);
      } else {
        setActivities([]);
      }
      setShowDayView(true);
    } catch (error) {
      console.error("Error loading activities:", error);
      Alert.alert("Error", "Could not load activities");
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async () => {
    if (!parentId || !selectedDate || newActivity.trim() === "") return;

    const activity: Activity = {
      id: Date.now().toString(),
      title: newActivity.trim(),
      date: selectedDate,
      isAllDay: true,
      completed: false
    };

    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);

    try {
      const docRef = doc(db, "parents", parentId, "calendar", selectedDate);
      await setDoc(docRef, { activities: updatedActivities }, { merge: true });
      
      setMarkedDates({ 
        ...markedDates, 
        [selectedDate]: { marked: true, dotColor: "#4287f5" } 
      });
      setNewActivity("");
    } catch (error) {
      console.error("Error adding activity:", error);
      Alert.alert("Error", "Failed to add activity");
      setActivities(activities);
    }
  };

  const handleActivityComplete = async (activityId: string) => {
    if (!childId) return;

    setLoading(true);
    try {
      const updatedActivities = activities.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: true } 
          : activity
      );
      setActivities(updatedActivities);

      const completedActivity = activities.find(a => a.id === activityId);
      if (completedActivity) {
        const newPoints = totalPoints + (completedActivity.points || 5);
        setTotalPoints(newPoints);
        
        const childRef = doc(db, "children", childId);
        await updateDoc(childRef, {
          points: newPoints,
          completedActivities: arrayUnion({
            activityId,
            date: selectedDate,
            title: completedActivity.title,
            points: completedActivity.points || 5
          })
        });
      }
    } catch (error) {
      console.error("Error completing activity:", error);
      Alert.alert("Error", "Could not update points");
      setActivities(activities);
    } finally {
      setLoading(false);
    }
  };

  const startBedtimeRoutine = () => {
    setBedtimeActive(true);
    setSleepRitualStep(0);
  };

  const nextRitualStep = () => {
    if (sleepRitualStep < bedtimeRoutine.length - 1) {
      setSleepRitualStep(sleepRitualStep + 1);
    } else {
      setBedtimeActive(false);
    }
  };

  const navigateWeek = (direction: 'next' | 'prev') => {
    setCurrentWeekStart(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const DayView = ({ 
    date, 
    events, 
    onBack, 
    onBedtime, 
    isParentView = false,
    newActivity = '',
    setNewActivity = () => {},
    onAddActivity = () => {},
    onActivityComplete = () => {}
  }: {
    date: Date;
    events: Activity[];
    onBack: () => void;
    onBedtime?: () => void;
    isParentView?: boolean;
    newActivity?: string;
    setNewActivity?: (text: string) => void;
    onAddActivity?: () => void;
    onActivityComplete?: (id: string) => void;
  }) => {
    const clockEvents = events.filter(event => !event.isAllDay);
    const allDayEvents = events.filter(event => event.isAllDay);
    
    return (
      <View style={styles.dayContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Tillbaka</Text>
        </TouchableOpacity>
        
        <Text style={styles.dayHeader}>
          {format(date, 'EEEE d MMMM', { locale: sv }).toUpperCase()}
        </Text>
        
        <View style={styles.clockView}>
          {clockEvents.map(event => (
            <View key={event.id} style={styles.clockEvent}>
              {event.time && <Text style={styles.clockTime}>{event.time}</Text>}
              <Text style={styles.clockTitle}>{event.title.title}</Text>
              {typeof event.title.title === 'string' && event.title.title.includes('Läggdags') && onBedtime && !isParentView && (

                <TouchableOpacity 
                  style={styles.bedtimeButton}
                  onPress={onBedtime}
                >
                  <Text style={styles.buttonText}>Starta nattning</Text>
                </TouchableOpacity>
              )}
              {!isParentView && (
                <TouchableOpacity 
                  onPress={() => !event.completed && onActivityComplete(event.id)}
                  style={styles.checkbox}
                  disabled={event.completed}
                >
                  <Icon 
                    name={event.completed ? "check-circle" : "radio-button-unchecked"} 
                    size={28} 
                    color={event.completed ? "#4CAF50" : "#ccc"} 
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        
        {isParentView && (
          <View style={styles.addActivityContainer}>
            <TextInput
              style={styles.input}
              placeholder="Lägg till aktivitet"
              value={newActivity}
              onChangeText={setNewActivity}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddActivity}
              disabled={!newActivity.trim()}
            >
              <Text style={styles.buttonText}>Lägg till</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {allDayEvents.length > 0 && (
          <View style={styles.dayAllDayEvents}>
            <Text style={styles.sectionTitle}>HELDAGSAKTIVITETER:</Text>
            {allDayEvents.map(event => (
              <View key={event.id} style={styles.allDayEvent}>
                <Text style={styles.eventText}>{event.title.title}</Text>
                {event.isWeekly && (
                  <Text style={styles.weeklyBadge}>Varje vecka</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (bedtimeActive && !isParentView) {
    return (
      <ImageBackground source={bubbleBackground} style={styles.background} resizeMode="cover">
        <View style={[styles.container, styles.bedtimeContainer]}>
          <Text style={styles.bedtimeText}>{bedtimeRoutine[sleepRitualStep]}</Text>
          <TouchableOpacity 
            style={styles.bedtimeButton}
            onPress={nextRitualStep}
          >
            <Text style={styles.buttonText}>
              {sleepRitualStep === bedtimeRoutine.length - 1 ? 'Släck lampan' : 'Fortsätt'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={bubbleBackground} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.header}>{isParentView ? 'FÖRÄLDRAKALENDERN' : 'MIN KALENDER'}</Text>
        
        <View style={styles.weekNavigation}>
          <TouchableOpacity onPress={() => navigateWeek('prev')}>
            <Icon name="chevron-left" size={30} color="#023e8a" />
          </TouchableOpacity>
          <Text style={styles.weekTitle}>
            {format(currentWeekStart, 'd MMM', { locale: sv })} -{' '}
            {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: sv })}
          </Text>
          <TouchableOpacity onPress={() => navigateWeek('next')}>
            <Icon name="chevron-right" size={30} color="#023e8a" />
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#4287f5" style={styles.loader} />}

        <FlatList
          horizontal
          data={weekDays}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.weekContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayBubble,
                selectedDate === item.date && styles.selectedBubble,
                item.isToday && styles.todayBubble,
                markedDates[item.date] && styles.hasActivitiesBubble
              ]}
              onPress={() => handleDayPress(item.date)}
            >
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.dateText}>{item.date.split('-')[2]}</Text>
              {markedDates[item.date] && <View style={styles.activityDot} />}
            </TouchableOpacity>
          )}
        />

        {showDayView ? (
          <DayView 
            date={new Date(selectedDate)}
            events={activities}
            onBack={() => setShowDayView(false)}
            onBedtime={startBedtimeRoutine}
            isParentView={isParentView}
            newActivity={newActivity}
            setNewActivity={setNewActivity}
            onAddActivity={addActivity}
            onActivityComplete={handleActivityComplete}
          />
        ) : (
          <View style={styles.allDayEventsContainer}>
            {activities
              .filter(event => event.isAllDay)
              .map(event => (
                <View key={event.id} style={styles.allDayEvent}>
                  <Text style={styles.eventText}>{event.title.title}</Text>
                  {event.isWeekly && (
                    <Text style={styles.weeklyBadge}>Varje vecka</Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {!isParentView && (
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>DINA POÄNG:</Text>
            <Text style={styles.pointsValue}>{totalPoints}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.7)'
  },
  bedtimeContainer: {
    backgroundColor: 'rgba(26, 35, 126, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  bedtimeText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20
  },
  bedtimeButton: {
    backgroundColor: '#5c6bc0',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#023e8a',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#023e8a'
  },
  weekContainer: {
    paddingBottom: 10,
    alignItems: 'center'
  },
  dayBubble: {
    width: 70,
    height: 90,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedBubble: {
    backgroundColor: 'rgba(66, 135, 245, 0.8)',
  },
  todayBubble: {
    borderWidth: 2,
    borderColor: '#FFA500'
  },
  hasActivitiesBubble: {
    position: 'relative'
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#023e8a',
    marginBottom: 5
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077b6'
  },
  activityDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#4287f5'
  },
  allDayEventsContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10
  },
  allDayEvent: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventText: {
    fontSize: 16,
  },
  weeklyBadge: {
    fontSize: 12,
    color: 'white',
    backgroundColor: '#4caf50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  dayContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 20,
    marginTop: 10
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#2196f3',
    fontSize: 16,
  },
  dayHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  clockView: {
    flex: 1,
  },
  clockEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clockTime: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 60,
  },
  clockTitle: {
    fontSize: 18,
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(66, 135, 245, 0.2)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4287f5'
  },
  pointsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#023e8a',
    marginRight: 10
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4287f5'
  },
  addActivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#fff'
  },
  addButton: {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  dayAllDayEvents: {
    marginTop: 20
  },
  checkbox: {
    padding: 5,
    marginLeft: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20
  }
});

export default CalendarScreen;