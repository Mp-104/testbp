import { Box, Environment, OrbitControls, Plane, Sphere, Texture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { View } from "react-native";
import { Image, StyleSheet, Platform } from 'react-native';
import { Asset } from 'expo-asset';



const Room = () => {

  const reactLogo = Asset.fromModule(require('../assets/images/partial-react-logo.png')).uri;


    return (
        <View>
            <Canvas style={{ flex: 1 }} camera={{ position: [0, 1, 4], fov: 50 }}>
                <Environment preset="sunset" />

                <Plane args={[5, 5]} position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="lightgray" />
                </Plane>

                <Box position={[-2.5, -0.75, 0]} args={[0.2, 3.5, 5]}>
                    <meshStandardMaterial color="lightblue" />
                </Box>

                <OrbitControls></OrbitControls>

            </Canvas>

        </View>

    )

}

export default Room;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
