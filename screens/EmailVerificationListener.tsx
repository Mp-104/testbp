import { useEffect, useState } from "react"
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, getAuth, onAuthStateChanged } from "firebase/auth";
import { View, Text } from "react-native";



const EmailVerificationListener = () => {
    const [emailVerified, setEmailVerified] = useState("test");

    console.log("Email Verified1", emailVerified);
      
    useEffect(() => {
        
        
        const intervalId = setInterval(() => {

            const auth = getAuth();

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                
                if (user) {
                    try {
                        // Reload user data to ensure email verification status is updated
                        await user.reload(); // Refresh the user's data from the Firebase server
                        if (user.emailVerified) {
                            setEmailVerified("true");
                            clearInterval(intervalId); // stops interval loop
                        } else {
                            setEmailVerified("false");
                        }
                        //setEmailVerified(user.emailVerified); // Update the state with the latest email verification status
                        console.log("verified? ", user.emailVerified);
                    } catch (error) {
                        console.error("Error reloading user data:", error);
                    }
                } else {
                    setEmailVerified("false"); // If no user, set to false
                }
            });

            console.log("This runs every second");
            return () => unsubscribe();
            
        }, 1000);

        // Cleanup function to clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); 

    return(

       <View>
            <Text>Verified? {emailVerified}</Text>
        
       </View>

    )

}

export default EmailVerificationListener;