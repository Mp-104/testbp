import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firbaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const autoLogin = async () => {

    try {

        const email = await AsyncStorage.getItem("email");
        const password = await AsyncStorage.getItem("password");

        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log("failed auto login: ", error);
    }

    

}