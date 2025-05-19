import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native"

interface Card {
  id: string
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJI_PAIRS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]
const EMOJI_PAIRS2 = ["🇨🇺", "🇧🇾", "🇰🇵", "🇸🇪", "🇸🇴", "🇺🇿", "🇦🇫", "🇷🇺"]

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5)
}

const createDeck = (): Card[] => {
  let deck: Card[] = EMOJI_PAIRS.flatMap((emoji, index) => [
    { id: `${emoji}-1`, emoji, isFlipped: false, isMatched: false },
    { id: `${emoji}-2`, emoji, isFlipped: false, isMatched: false },
  ])

  return shuffleArray(deck)
}

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(createDeck())
  const [flippedCards, setFlippedCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [disableClick, setDisableClick] = useState(false)

  const handleCardPress = (card: Card) => {
    if (disableClick || card.isFlipped || card.isMatched) return

    const newFlipped = [...flippedCards, card]
    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )

    setCards(newCards)
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setDisableClick(true)
      setMoves((m) => m + 1)
      checkForMatch(newFlipped)
    }
  }

  const checkForMatch = (flippedPair: Card[]) => {
    const [first, second] = flippedPair

    setTimeout(() => {
      setCards((prevCards) => {
        const updatedCards = prevCards.map((c) => {
          if (c.emoji === first.emoji && c.emoji === second.emoji) {
            return { ...c, isMatched: true, isFlipped: true }
          } else if (c.id === first.id || c.id === second.id) {
            return { ...c, isFlipped: false }
          }
          return c
        })

        return updatedCards
      })

      setFlippedCards([])
      setDisableClick(false)
    }, 1000)
  }

  useEffect(() => {
    if (cards.every((c) => c.isMatched)) {
      setTimeout(() => {
        Alert.alert("Bra jobbat!", `Du matchade alla par på ${moves} drag! 🎉`)
      }, 500)
    }
  }, [cards])

  const resetGame = () => {
    setCards(createDeck())
    setFlippedCards([])
    setMoves(0)
    setDisableClick(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match 🧠</Text>
      <Text style={styles.moves}>Drag: {moves}</Text>

      <FlatList
        data={cards}
        numColumns={4}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.isFlipped || item.isMatched ? styles.cardFlipped : null,
            ]}
            onPress={() => handleCardPress(item)}
            disabled={item.isMatched || disableClick}
          >
            <Text style={styles.emoji}>
              {item.isFlipped || item.isMatched ? item.emoji : "?"}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Starta om spelet</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2c3e50",
  },
  moves: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "#34495e",
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    margin: 10,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 3,
  },
  cardFlipped: {
    backgroundColor: "#fff",
  },
  emoji: {
    fontSize: 34,
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    alignSelf: "center",
  },
  resetText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})