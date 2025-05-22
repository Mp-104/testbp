import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firbaseConfig";

// Custom hook to manage unaccepted apps state with Firestore and AsyncStorage
const useUnacceptedApps = () => {
  const [unacceptedApps, setUnacceptedApps] = useState([]);
  const [childId, setChildId] = useState(null);

  // Wait for Firebase Auth to be ready
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setChildId(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  // Load unaccepted apps from Firestore or AsyncStorage
  useEffect(() => {
    if (!childId) return; // Avoid running Firestore queries without a valid ID

    const loadUnacceptedApps = async () => {
      try {
        const ref = collection(db, "children", childId, "appPermissions");
        const snap = await getDocs(ref);
        const firestoreUnacceptedApps = [];

        snap.forEach((doc) => {
          const { packageName, status } = doc.data();
          if (status === "unaccepted") {
            firestoreUnacceptedApps.push(packageName);
          }
        });

        if (firestoreUnacceptedApps.length > -1) {
          setUnacceptedApps(firestoreUnacceptedApps);
          await AsyncStorage.setItem("unacceptedApps", JSON.stringify(firestoreUnacceptedApps));
        } else {
          //const stored = await AsyncStorage.getItem("unacceptedApps");
          //if (stored) setUnacceptedApps(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading unaccepted apps:", error);
      }
    };

    loadUnacceptedApps();
  }, [childId]);

  const toggleAppStatus = async (appName, status) => {
    if (!childId) return;
  
    try {
      // Update Firestore
      await setDoc(doc(db, "children", childId, "appPermissions", appName), {
        packageName: appName,
        status,
      });
  
      // Re-fetch all unaccepted apps from Firestore
      const ref = collection(db, "children", childId, "appPermissions");
      const snap = await getDocs(ref);
      const updatedUnacceptedApps = [];
  
      snap.forEach((doc) => {
        const data = doc.data();
        if (data.status === "unaccepted") {
          updatedUnacceptedApps.push(data.packageName);
        }
      });
  
      // Update AsyncStorage and local state
      await AsyncStorage.setItem("unacceptedApps", JSON.stringify(updatedUnacceptedApps));
      setUnacceptedApps(updatedUnacceptedApps);
    } catch (error) {
      console.error("Error updating app status:", error);
    }
  };
  

  return { unacceptedApps, toggleAppStatus };
};

export default useUnacceptedApps;
