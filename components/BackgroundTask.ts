import { queryUsageStats } from "@brighthustle/react-native-usage-stats-manager";
import { useEffect, useState } from "react";
import BackgroundTimer from "react-native-background-timer"
import notifee, { EventType } from "@notifee/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";
import { db } from "./Firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"
import { navigate } from './NavigationService';



export const backgroundTask = () => {
    /* const [sent, setSent] = useState(false);
    const [prevStat, setPrevStat] = useState(0); */
    const {OverlayModule} = NativeModules;
    let seconds = 0;
    
    
        const checkAppUsage = async () => {
          console.log("process started")
          const currentDate = new Date();
          const currentTime = currentDate.getTime();
          const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
      
          const result3 = await queryUsageStats(0, startOfDay, currentTime);
      
          const YT = Object.values(result3).filter(item => item.appName === "YouTube").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const Instagram = Object.values(result3).filter(item => item.appName === "Instagram").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const TikTok = Object.values(result3).filter(item => item.appName === "TikTok").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const Snapchat = Object.values(result3).filter(item => item.appName === "Snapchat").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const Triller = Object.values(result3).filter(item => item.appName === "Triller").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const Roblox = Object.values(result3).filter(item => item.appName === "Roblox").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const Fortnite = Object.values(result3).filter(item => item.appName === "Fortnite").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
          const AmongUs = Object.values(result3).filter(item => item.appName === "Among Us").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
    
          const MyBoy = Object.values(result3).filter(item => item.appName === "My Boy! Free").reduce((sum, item) => sum + item.totalTimeInForeground, 0);
            console.log("MyBoy", MyBoy)
          let gameTime = 0;
          const prevStat = await AsyncStorage.getItem("prevStat")
    
          console.log("prevStat: ", prevStat)
          const playDifference = MyBoy - prevStat;
    
          console.log("gameTime1: ", gameTime)

          console.log("---------UsageEvents--------")
          const events = await OverlayModule.getRecentUsageEvents();
          //console.log("allEvents: ", events);
          /* console.log("events: ", events[0]["packageName"], "Timestamp: ", events[0]["timestamp"]);
          console.log("events: ", events[1]["packageName"], "Timestamp: ", events[1]["timestamp"]);
          console.log("events: ", events[2]["packageName"], "Timestamp: ", events[2]["timestamp"]);
          console.log("events: ", events[3]["packageName"], "Timestamp: ", events[3]["timestamp"]);
          console.log("events: ", events[4]["packageName"], "Timestamp: ", events[4]["timestamp"]);
          console.log("events: ", events[5]["packageName"], "Timestamp: ", events[5]["timestamp"]);
          console.log("events: ", events[6]["packageName"], "Timestamp: ", events[6]["timestamp"]);
          console.log("events: ", events[7]["packageName"], "Timestamp: ", events[7]["timestamp"]);
          console.log("events: ", events[8]["packageName"], "Timestamp: ", events[8]["timestamp"]);
          console.log("events: ", events[9]["packageName"], "Timestamp: ", events[9]["timestamp"]);
          console.log("events: ", events[10]["packageName"], "Timestamp: ", events[10]["timestamp"]);
          console.log("events: ", events[11]["packageName"], "Timestamp: ", events[11]["timestamp"]); */

          const socialTargetPackages = ["com.google.android.youtube", "com.fastemulator.gbafree"]; // insert unwanted apps
          const gameTargetPackages = ["com.fastemulator.gbafree"];
          
          const matchingTimestamps = events
            .filter(event => socialTargetPackages.includes(event.packageName))
            .map(event => event.eventType);

          console.log("matchingTimeStampes[..length -1]: ",matchingTimestamps[matchingTimestamps.length - 1]);

          const appActive = matchingTimestamps[matchingTimestamps.length - 1];

          console.log("appActive: ", appActive);

          const filteredGamePackages = events.filter(event => gameTargetPackages.includes(event.packageName)).map(event => event.eventType);
          
          const gameActive = filteredGamePackages[filteredGamePackages.length - 1];
          // Manually keeping count after a "bad" app has got into foreground
          // UsageStats updates either every time app state has changed, or in a 20 minute interval
          // if same app is already open. Therefore a manual counter was added to calculate app usage
          // in a more fine grained manner
          if(appActive === 1) {
            if (seconds >= 0) {
              seconds+=6
            }
            
            console.log("You are using bad apps: ", seconds);
            if(seconds > 60 && seconds < 100) { // 900 instead of 60
              OverlayModule.showOverlay(); 
              seconds= 100
              navigate("Black");
             
            }
            if(seconds > 160 && seconds < 200) { // 1800 instead of 160
              OverlayModule.showOverlay();
              seconds= 200
              navigate("HomeworkTimer");

              
            }
            if(seconds > 260 && seconds < 300) { // 2700 instead of 260
              OverlayModule.showOverlay();
              seconds= 300
              navigate("Balloon");

              
            }
            if(seconds > 360 && seconds < 400) { // 3600 // instead of 360
              OverlayModule.showOverlay();
              seconds = -60 // set to -3600, an hour delay, move after try catch
              navigate("Stats");

              
              // Log behaviour
              try {
                await addDoc(collection(db, "warning"), {
                  timestamp: Timestamp.now(),
                  duration: seconds
                })
                
              } catch (error) {
                console.error("Kunde inte logga övertid app användning: ", error)
              }
              
            }
          }

          if (seconds < 0 ) {
            seconds += 6
          }

          console.log("seconds: ", seconds);

          //const event = OverlayModule.getForegroundApp();
          /* const LoopHandler = await OverlayModule.startTrackingUsage( (currentApp: string, timeSpent: number) => {
            // Handle success callback from native
            //successCallback(currentApp, timeSpent);
            console.log("CurrentApp: ", currentApp, timeSpent);
          },
        (errorMessage: string) => {
          console.log("error: ", errorMessage)
            // Handle error callback from native
            //errorCallback(errorMessage);
        }) */
          //console.log("LoopHandler: ", LoopHandler)
          //console.log("RootEvent: ", event);
          console.log("---------/UsageEvents--------")

          console.log("gameActive: ", gameActive )
          if (gameActive === 1) {
            OverlayModule.launchApp();
            navigate("WipAlert", { source: "HomeworkTimer" });

            const channelId = await notifee.createChannel({
              id: "default",
              name: "Default Channel",
              vibration: true,
            }) 
            await notifee.displayNotification({
              title: "Du vill spel?",
              body: "Spel: " + MyBoy,
              android: {
                channelId,
                actions: [{
                  title: "20 minuter",
                  pressAction: {
                    id: "20",
                    launchActivity: "default"
                  },
                  //input: true
                },
                {
                  title: "1 timme",
                  pressAction: {
                    id: "60",
                    launchActivity: "default"
                  }, 
                  input: {
                    allowFreeFormInput: false,
                    choices: ["yes", "no", "albanie"],
                    placeholder: "replay ja vet inte"
                  } 
                }
                ],
                pressAction: {
                  id: "default",
                  mainComponent: "custom-component"
                }
              }
            }) 
            
          }
          

          /* const dontSend = await AsyncStorage.getItem("dontSend");
          const overlayShown = await AsyncStorage.getItem("overlay"); */
    
          //if(playDifference > 0 && dontSend != "dontSend"/*  && overlayShown != "shown" */) {

            /* OverlayModule.showOverlay();
            await AsyncStorage.setItem("overlay", "shown") */

            //console.log(OverlayModule)
           /*  gameTime += playDifference
            console.log("gameTime2", gameTime) */
            // insert notification
    
            /* const channelId = await notifee.createChannel({
              id: "default",
              name: "Default Channel",
              vibration: true,
            }) 
            await notifee.displayNotification({
              title: "Du vill spel?",
              body: "Spel: " + MyBoy,
              android: {
                channelId,
                actions: [{
                  title: "20 minuter",
                  pressAction: {
                    id: "20",
                    launchActivity: "default"
                  },
                  //input: true
                },
                {
                  title: "1 timme",
                  pressAction: {
                    id: "60",
                    launchActivity: "default"
                  }, 
                  input: {
                    allowFreeFormInput: false,
                    choices: ["yes", "no", "albanie"],
                    placeholder: "replay ja vet inte"
                  } 
                }
                ],
                pressAction: {
                  id: "default",
                  mainComponent: "custom-component"
                }
              }
            }) 
            
          }  */

          //await AsyncStorage.setItem("dontSend", "send")
    
          //setPrevStat(MyBoy)
          /* AsyncStorage.setItem("prevStat", JSON.stringify(MyBoy))
          console.log("prevstat2: ", prevStat) */
    
          //console.log("myBoy: ", MyBoy)
          const badAppsTotalTimeInForeground = YT + Instagram + TikTok + Snapchat + Triller + Roblox + Fortnite + AmongUs;
          console.log("backgroundApp: ", badAppsTotalTimeInForeground)
          const sent = true;
          console.log("sent: ", sent);
          const remainingGametime = await AsyncStorage.getItem("gameTime");
         // console.log("GameTime: ", remainingGametime)
          if (badAppsTotalTimeInForeground > 360 && !sent) { // Notify if > 1 hour
            /* PushNotification.localNotification({
              title: "App Usage Alert",
              message: "You've spent too much time on social/gaming apps!",
              playSound: true,
              soundName: "default",
              vibrate: true,
              channelId: "default-channel-id",
             // bigPictureUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvnbGXAzowHiN-JrPfFC0hmWh_B3FRhA7tgA&s",
              actions: ["albanie", "Dismiss"],
              invokeApp: true,
              allowWhileIdle: true,
              //picture: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmR6M3B4anJyY2twMTFrb2w4cmkxbng3bnFlemFyYjJ0bncyOGU3aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/X7s4uckfyihGJDrSpo/giphy.gif",
              bigPictureUrl: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmR6M3B4anJyY2twMTFrb2w4cmkxbng3bnFlemFyYjJ0bncyOGU3aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/X7s4uckfyihGJDrSpo/giphy.gif"
              //bigPictureUrl: "background.png"
            }); */
            /* const channelId = await notifee.createChannel({
              id: "default",
              name: "Default Channel",
              vibration: true,
            })
            await notifee.displayNotification({
              title: "Notification Title",
              body: "appUsage " + badAppsTotalTimeInForeground,
              android: {
                channelId,
                actions: [{
                  title: "albanie",
                  pressAction: {
                    id: "albanie",
                  },
                  input: true
                },
                {
                  title: "Main",
                  pressAction: {
                    id: "main",
                    launchActivity: "default"
                  },
                  input: {
                    allowFreeFormInput: false,
                    choices: ["yes", "no", "albanie"],
                    placeholder: "replay ja vet inte"
                  }
                }
                ],
                pressAction: {
                  id: "default",
                  mainComponent: "custom-component"
                }
              }
            })  */
            /* PushNotification.invokeApp({
              message:"test",
              allowWhileIdle: true,
              actions: ["albanie", "Dismiss"],
              visibility: "public",
              channelId: "default-channel-id"
            }) */
           // setSent(true);
          }
        };
        
      
        // Check app usage every minute
       //BackgroundTimer.setInterval(checkAppUsage, 6000);
       
      // BackgroundTimer checks if there is a pause interval through the AsyncStorage
      BackgroundTimer.setInterval(async ()=> {
        const pauseUntil = await AsyncStorage.getItem("pauseUntil");
        const now = new Date().getTime();

        if(pauseUntil && now < Number(pauseUntil)) {
          const remainingTimeInMinutes = Number(pauseUntil) - now;
          if(remainingTimeInMinutes <= 5 * 60 * 1000 && remainingTimeInMinutes >= 4 * 60 * 1000 + 54 * 1000) {
            console.log("Mindre än 5 minuter kvar");
            OverlayModule.showOverlayWarning();
          }
          if(remainingTimeInMinutes <= 4 * 60 * 1000 + 50 * 1000 && remainingTimeInMinutes >= 4 * 60 * 1000 + 44 * 1000) {
            console.log("Stäng overlay");
            OverlayModule.removeOverlay();
          }
            console.log("Task paused until: ", new Date(Number(pauseUntil)).toLocaleTimeString());
            await AsyncStorage.setItem("dontSend", "dontSend")
            return;
        }

        await checkAppUsage()
       }, 6000)
      
      //  return () => {BackgroundTimer.clearInterval(interval);}
    
}