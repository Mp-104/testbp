import React, { Suspense } from 'react';
import { Button, View, Text, StyleSheet} from 'react-native';

import Room from './Room';
import ErrorBoundry from './ErrorBoundry';


const RoomScreen = () => {

    return(
        <View style={styles.container}>
            <Suspense fallback={<Text>Laddar...</Text>}>
                
                    <Room></Room>
               
            </Suspense>
        </View>
    )
}

export default RoomScreen

const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the container takes up the full screen height
      justifyContent: 'center', // Centers children vertically
      //alignItems: 'center', // Centers children horizontally
      width: "100%",
      
    },
  });