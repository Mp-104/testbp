import { registerRootComponent } from 'expo';

import App from './App';
import notifee, { EventType } from "@notifee/react-native"
import { navigate } from './components/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

notifee.onBackgroundEvent(async ({ type, detail}) => {
    const {notification, pressAction} = detail;

    console.log("index.ts")
    navigate("NavParam", {name: "Max", time: new Date().getDate()})

    if(type === EventType.ACTION_PRESS) {
        console.log("pressed action: ", pressAction?.id, " input: ", detail.input)
        if(pressAction?.id === "60" || pressAction?.id === "20") {
            //navigate("MainPage")
            //alert("pressed main: " + detail.input )
            console.log("detail.pressAction?.id:", detail.pressAction?.id)
            navigate("NavParam", {name: detail.pressAction?.id})
            if(detail.pressAction?.id === "60" || detail.pressAction?.id === "20") {
                
                const timePause = Number(detail.pressAction.id);

                const pauseUntil = new Date().getTime() + 60 * 1000 * timePause/1; // Hard coded value, may make it dynamic based on what the user pressed
                

                navigate("NavParam", {name: detail.pressAction?.id, time: pauseUntil}) // Params just for a visual representation

                // AsyncStorage as a way to communicate with BackgroundTask.ts, and pause it 
                await AsyncStorage.setItem("pauseUntil", pauseUntil.toString());
            }

            
             // sends detail.input to the designated page,
                                                       //  the receiving page needs to be able to receive it as a param
        }
        
    }
})


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
