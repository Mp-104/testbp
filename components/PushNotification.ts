import PushNotification from "react-native-push-notification";

PushNotification.configure({
    onNotification: function(notification) {
        console.log("NOTIFICATION: ", notification);
    }
});