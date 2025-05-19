import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";


interface EnergyBarProps {
    value: number;
}

const EnergyBar = ( {value}: EnergyBarProps) => {
    const clampedValue = Math.min(100, Math.max(0, value));

    const remaingValue = 100 - clampedValue;

    return (
        <View style={styles.container}>
        <Text style={styles.label}>{clampedValue}%</Text>
        <ImageBackground
            source={require('../assets/bar.png')} // Replace with the correct path to your image
            style={[styles.barBackground, ]}
            imageStyle={[styles.barBackgroundImage, /* { width: `${clampedValue}%`} */]}
        >
            <View
                style={[
                    styles.barFill,
                    {
                        width: `${remaingValue}%`,
                        backgroundColor: "red"
                    },
                ]}
            />
        </ImageBackground>
    </View>
    )
};

export default EnergyBar;

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end",
        marginVertical: 100,
        
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    barBackground: {
        width: 100,
        height: 20,
        backgroundColor: "red",
        borderRadius: 10,
        overflow: "hidden",
        flexDirection: "row-reverse",
    },
    barBackgroundImage: {
        borderRadius: 10, // Ensure the image has rounded corners like your previous design
    },
    barFill: {
        height: "100%",
       /*  backgroundColor: "#4caf50",
        borderRadius: 10, */
    }


})
