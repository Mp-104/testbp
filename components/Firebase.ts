import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { firebaseConfig } from "./FirebaseConfig"

/* import { getAnalytics, logEvent} from "firebase/analytics" */




const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

/* const analytics = getAnalytics(firebaseApp);
logEvent(analytics, "notification received") */

export { auth, db }
