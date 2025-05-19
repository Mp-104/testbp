import React, { useEffect, useState } from "react";
import { Button, View, Text } from "react-native";
import notifee, { AndroidCategory, AndroidColor, AndroidImportance, AndroidStyle, AndroidVisibility } from "@notifee/react-native"


// Documentation for notifee notifications, works with action buttons, better than react-native-push-notifications
// https://notifee.app/react-native/docs/overview 


export function Screen() {

  const [channels, setChannels] = useState([]);
  const [number, setNumber] = useState(1);

  // Fetch all channels and store them in state
  useEffect(() => {
    // Assuming you have a method to fetch channels
    const allChannels = notifee.getChannels();
    allChannels.then((channles) => {
      //console.log("Channels: ", channles);
      setChannels(channles); // Set the channels in state
    });
  }, [channels]);

  // Function to handle button press (for example, showing a notification for a specific channel)
    const handleChannelPress = (channelId) => {
        console.log('Channel selected:', channelId);
        notifee.deleteChannel(channelId);
    // Here you could trigger an action based on the channelId (like sending a notification)
  };

    /* notifee.deleteChannel("default20")
    
    console.log("allChannels,", allChannels)
    allChannels.then((channles)=> console.log("channels: ", channles ) ) */

    async function onDisplayNotification () {
        console.log("onDisplayNotification")
        await notifee.requestPermission();

        /* const channelId = await notifee.createChannel({
            id: "default",
            name: "Default Channel",
            vibration: true,
            vibrationPattern: [100, 900]
            
        }) */
            const jinglePattern = [100, 100, 150, 100, 150, 100];
            const jinglePattern2 = [150, 50, 150, 50, 200, 50];
            const jingleBellsPattern = [
                200, 100, 200, 100, 250, 100, 200, 100, 200, 100, 150, 100, 150, 100, 200, 100, 
                300, 50, 200, 50, 200, 100, 150, 50, 200, 100
              ];

            const livelyJinglePattern = [
                100, 50, 100, 50, 150, 50, 100, 50, 100, 50, 150, 50, 100, 50, 100, 50, 200, 50, 
                150, 50, 150, 50, 200, 50, 100, 50
              ];
            
            const slowJinglePattern = [
                300, 150, 250, 150, 300, 200, 250, 200, 300, 150, 250, 150, 300, 100, 200, 100
              ];
              
              
              

        setNumber(number + 1)

        // Once a channel is created, it is saved on the device. Altering settings such as vibration
        // will not yield any results, unless a new channel is created with the desired updates.
        const channelId = await notifee.createChannel({
            id: "default"+number,
            name: "Default Channel"+number,
            vibration: true,
            vibrationPattern: slowJinglePattern, //[100, 150, 150, 200, 200, 250], // must be an even amount of numbers
            visibility: AndroidVisibility.PUBLIC,
            //sound: "default",
            lights: true,
            lightColor: AndroidColor.RED,
            badge: true,
            bypassDnd: true,
            description: "test",
            importance: AndroidImportance.HIGH,  // sets whether the notification pops up on the screen. HIGH does, DEFAULT does not.
            //sound: "blue.mp3",
            sound: "blue",
            soundURI: require("../assets/blue.mp3"),
            
            
        })

        console.log("channelId: ", channelId)
        await notifee.displayNotification({
            title: "Notification Title",
            body: "Main body content of the notification",
            android: {
                //sound: "blue",
                progress: {max: 5, current: 1, indeterminate: false},
                channelId,
                category: AndroidCategory.MESSAGE,
                importance: AndroidImportance.HIGH,
                lightUpScreen: true,
                fullScreenAction: {id: "default", mainComponent: "fullScreen"},
                visibility: AndroidVisibility.PUBLIC,
                style: {
                    type: AndroidStyle.BIGPICTURE, 
                    title: "testAl", 
                    picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvnbGXAzowHiN-JrPfFC0hmWh_B3FRhA7tgA&s"
                    //picture: require("../assets/download.gif")
                },
                showChronometer: true,
                actions: [{
                    title: "albanie",
                    pressAction: {
                        id: "albanie",
                    },
                    input: true
                },
                {
                    title: "test",
                    pressAction: {
                        id: "test",
                        launchActivity: "default"
                    },
                    input: {
                        allowFreeFormInput: false,
                        choices: ["yes", "no", "albanie"],
                        placeholder: "replay ja vet inte"
                    }
                },
            ],
                pressAction: {
                    id: "default",
                    mainComponent: "custom-component"
                },
            }
        })
    }
    return(
        <View>
            <Button title="Display notification" onPress={()=> onDisplayNotification()}></Button>
            <View style={{ padding: 20 }}>
      {channels.length > 0 ? (
        channels.map((channel, index) => (
          <Button
            key={index}
            title={`Delete Channel: ${channel.name}`}
            onPress={() => handleChannelPress(channel.id)} // Handle channel selection
          />
        ))
      ) : (
        <Text>No channels available</Text>
      )}
    </View>
        </View>
    )
}