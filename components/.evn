import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const firebaseConfig = {

    apiKey: "AIzaSyDXfN-1Al-Qg9Se8GnSpPT9cxpXStoXtxI",
    authDomain: "new-backpack.firebaseapp.com",
    //databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "new-backpack",
    storageBucket: "new-backpack.firebasestorage.app",
    messagingSenderId: "1030464807041",
    appId: "1:1030464807041:android:ca9690217ded349c65ed80",

};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp);

export {auth, db}
