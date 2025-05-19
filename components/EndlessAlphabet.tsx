import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from "react-native"

const words = ["APPLE", "BANANA", "ORANGE", "GRAPE", "MANGO"]

const shuffleArray = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5)
}

const AlphabetGame = () => {
  const [currentWord, setCurrentWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  )
  const [shuffledLetters, setShuffledLetters] = useState(
    shuffleArray([...currentWord])
  )
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [fadeAnim] = useState(new Animated.Value(0))
  const [blinkAnim] = useState(new Animated.Value(1))

  useEffect(() => {
    if (selectedLetters.join("") === currentWord) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()

      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [selectedLetters])

  const handleLetterPress = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter])
    setShuffledLetters(shuffledLetters.filter((_, i) => i !== index))
  }

  const handleUndo = () => {
    if (selectedLetters.length > 0) {
      const lastLetter = selectedLetters[selectedLetters.length - 1]
      setSelectedLetters(selectedLetters.slice(0, -1))
      setShuffledLetters([...shuffledLetters, lastLetter])
    }
  }

  const resetGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(newWord)
    setShuffledLetters(shuffleArray([...newWord]))
    setSelectedLetters([])
    fadeAnim.setValue(0)
    blinkAnim.setValue(1)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Endless Alphabet</Text>
      <View style={styles.wordContainer}>
        {currentWord.split("").map((letter, index) => (
          <Text key={index} style={styles.letter}>
            {selectedLetters[index] || "_"}
          </Text>
        ))}
      </View>
      <FlatList
        data={shuffledLetters}
        numColumns={5}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.letterButton}
            onPress={() => handleLetterPress(item, index)}
          >
            <Text style={styles.letterText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.undoButton} onPress={handleUndo}>
        <Text style={styles.undoText}>Ta bort sista bokstaven</Text>
      </TouchableOpacity>
      {selectedLetters.join("") === currentWord && (
        <View style={styles.successContainer}>
          <Animated.Text
            style={[
              styles.successText,
              { opacity: fadeAnim, transform: [{ scale: blinkAnim }] },
            ]}
          >
            🎆 Bra jobbat! 🎆
          </Animated.Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>Nytt Ord!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  wordContainer: { flexDirection: "row", marginBottom: 20 },
  letter: { fontSize: 32, marginHorizontal: 5 },
  letterButton: {
    padding: 15,
    margin: 5,
    backgroundColor: "#f0a",
    borderRadius: 5,
  },
  letterText: { fontSize: 24, color: "#fff" },
  undoButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 5,
  },
  undoText: { fontSize: 18, color: "#fff" },
  resetButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0a0",
    borderRadius: 5,
  },
  resetText: { fontSize: 20, color: "#fff" },
  successContainer: { alignItems: "center", marginTop: 20 },
  successText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "bold",
    textAlign: "center",
  },
})

export default AlphabetGame