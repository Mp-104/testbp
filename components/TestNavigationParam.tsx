import { queryUsageStats } from "@brighthustle/react-native-usage-stats-manager";
import React, { useEffect, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import BackgroundTimer from "react-native-background-timer"
import notifee, { EventType } from "@notifee/react-native"

import { NativeModules } from "react-native";




const TestNavigationParam = ({route}) => {

    const {OverlayModule} = NativeModules;
    const [sent, setSent] = useState(false);
    const [prevStat, setPrevStat] = useState(0);

    const showOverlay = () => {
        console.log(OverlayModule)
        OverlayModule.showOverlay();
    }

    const requestPermission = () => {
        OverlayModule.requestOverlayPermission();
    }

    const removeOverlay = () => {
        OverlayModule.removeOverlay();
    }

    const routeParams = route.params;
    
    const pauseUntil = new Date(Number(routeParams.time)).toLocaleTimeString();
    
    return(
        <View>
            <Text>Input value: {routeParams.name}</Text>
            <Text style={{marginBottom: 20}}>Du får spela tills: {pauseUntil}</Text>
            <TouchableOpacity style={{marginBottom: 50, left: 180, bottom: 50}} onPress={showOverlay}><Text>Overlay show</Text></TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 50}} onPress={requestPermission}><Text>Permission show</Text></TouchableOpacity>
            <TouchableOpacity style={{marginBottom: 50, top: 400}} onPress={removeOverlay}><Text>Overlay not show</Text></TouchableOpacity>
        </View>
    )
}

export default TestNavigationParam;