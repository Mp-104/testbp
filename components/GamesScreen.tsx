import React from "react"
import { View, Button, StyleSheet } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { ScrollView } from "react-native-gesture-handler"

type RootStackParamList = {
  EndlessAlphabet: undefined
  BrainDots: undefined
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList>
}

export default function GamesScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container} /* style={styles.container} */>
      <Button
        title="Play EndlessAlphabet"
        onPress={() => navigation.navigate("EndlessAlphabet")}
      />
      <Button
        title="Play BrainDots"
        onPress={() => navigation.navigate("BrainDots")}
      />

      <Button
        title="Play MemoryMatch"
        onPress={() => navigation.navigate("MemoryMatch")}
      />

      <Button
        title="Play UnblockMe"
        onPress={() => navigation.navigate("UnblockMe")}
      />
      <Button
        title="Play TjugoFyrtioatta"
        onPress={() => navigation.navigate("TjugoFyrtioatta")}
      />
      <Button
        title="Play SimonSays"
        onPress={() => navigation.navigate("SimonSays")}
      />
      <Button
        title="Play Fyra i rad"
        onPress={() => navigation.navigate("FyraiRad")}
      />
      <Button
        title="Play Paintly"
        onPress={() => navigation.navigate("Paintly")}
      />
      <Button
        title="BlackJack"
        onPress={() => navigation.navigate("Black")}
      />
      <Button
        title="Fit"
        onPress={() => navigation.navigate("Fit")}
      />
      <Button
        title="Voice"
        onPress={() => navigation.navigate("Voice")}
      />
      <Button
        title="Shake"
        onPress={() => navigation.navigate("Shake")}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
})