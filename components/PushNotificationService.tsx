import messaging from "@react-native-firebase/messaging"

async function requestUserPermission () {
    const authorisationStatus = await messaging().requestPermission();

    const enabled = 
    authorisationStatus === messaging.AuthorizationStatus.AUTHORIZED || 
    authorisationStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if(enabled) {
        console.log("permission granted");
    } else {
        console.log("permission denied");
    }
}

async function getFCMToken () {
    const token = await messaging().getToken();
    console.log("FCM Token: ", token);
    return token;
};

function setupPushNotification () {
    //foreground notification
    messaging().onMessage(async remoteMessage => {
        console.log("notification recieved in foreground", remoteMessage);
    });

    // background notifications
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log("notification caused app to open: ", remoteMessage);
    });

    // when app is fully closed
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log("notification received in background: ", remoteMessage);
    });

}

export {requestUserPermission, getFCMToken, setupPushNotification};