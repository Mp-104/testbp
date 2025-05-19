import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firbaseConfig';
import { onAuthStateChanged } from "firebase/auth";

// ✅ Function to get the logged-in user ID
export const getUserId = (callback: (userId: string | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(user.uid);
    } else {
      callback(null);
    }
  });
};

// ✅ Function to load activities for a user
export const loadActivities = async (userId: string) => {
  try {
    const docRef = doc(db, 'activities', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.activities || {};
    } else {
      console.log("ℹ️ No activities found in Firestore.");
      return {};
    }
  } catch (error) {
    console.error('❌ Error loading activities:', error);
    return {};
  }
};

// ✅ Function to save activities for a user
export const saveActivities = async (userId: string, updatedActivities: any) => {
  try {
    const docRef = doc(db, 'activities', userId);
    await setDoc(docRef, { activities: updatedActivities }, { merge: true });
    console.log('✅ Activities saved successfully!');
  } catch (error) {
    console.error('❌ Error saving activities:', error);
  }
};
