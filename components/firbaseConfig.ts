import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDXfN-1Al-Qg9Se8GnSpPT9cxpXStoXtxI",
    authDomain: "new-backpack.firebaseapp.com",
    //databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "new-backpack",
    storageBucket: "new-backpack.firebasestorage.app",
    messagingSenderId: "1030464807041",
    appId: "1:1030464807041:android:ca9690217ded349c65ed80",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 
export { db, auth, firebaseConfig };
