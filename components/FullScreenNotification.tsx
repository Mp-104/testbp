import React from "react";
import { Text, View } from "react-native";


export default function FullScreenNotification () {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text style={{ fontSize: 24}}>Incoming Notification</Text>
        </View>
    )
}