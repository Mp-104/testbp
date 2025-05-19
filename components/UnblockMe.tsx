import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"

const levels = [
  [
    { id: "red", x: 0, y: 2, width: 2, height: 1, isRed: true },
    { id: "block1", x: 2, y: 0, width: 1, height: 2, isRed: false },
    { id: "block2", x: 3, y: 1, width: 1, height: 2, isRed: false },
  ],
  [
    { id: "red", x: 1, y: 2, width: 2, height: 1, isRed: true },
    { id: "block1", x: 3, y: 1, width: 1, height: 2, isRed: false },
    { id: "block2", x: 4, y: 3, width: 1, height: 2, isRed: false },
  ],
]

const gridSize = 6
const exitX = gridSize - 1
const exitY = 2

const UnblockMe = () => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [blocks, setBlocks] = useState([...levels[currentLevel]])
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)

  console.log("SelectedBlock", selectedBlock)

  const moveBlock = (
    id: string,
    direction: "left" | "right" | "up" | "down"
  ) => {
    setBlocks((prevBlocks) => {
      return prevBlocks.map((block) => {
        if (block.id === id) {
          let newX = block.x
          let newY = block.y

          const isHorizontal = block.width > block.height
          const isVertical = block.height > block.width

          if (direction === "left" && isHorizontal) newX -= 1
          if (direction === "right" && isHorizontal) newX += 1
          if (direction === "up" && isVertical && !block.isRed) newY -= 1
          if (direction === "down" && isVertical && !block.isRed) newY += 1

          if (
            newX >= 0 &&
            newX + block.width <= gridSize &&
            newY >= 0 &&
            newY + block.height <= gridSize &&
            !prevBlocks.some(
              (b) =>
                b.id !== id &&
                b.x < newX + block.width &&
                b.x + b.width > newX &&
                b.y < newY + block.height &&
                b.y + b.height > newY
            )
          ) {
            return { ...block, x: newX, y: newY }
          }
        }
        return block
      })
    })
    setTimeout(checkWin, 100)
  }

  const checkWin = () => {
    const redBlock = blocks.find((block) => block.isRed)
    if (redBlock && redBlock.x + redBlock.width === gridSize) {
      Alert.alert("Bra jobbat!", "Vill du gå till nästa nivå?", [
        { text: "Nästa nivå", onPress: nextLevel },
        { text: "Stanna", style: "cancel" },
      ])
    }
  }

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prevLevel) => prevLevel + 1)
      setBlocks([...levels[currentLevel + 1]])
    } else {
      Alert.alert("Spelet klart!", "Alla nivåer är klara!")
    }
  }

  const resetGame = () => {
    setBlocks([...levels[currentLevel]])
  }

  const onPress = (blockId) => {
    setSelectedBlock(blockId)
    console.log("button pressed with blockId: ", blockId);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unblock Me - Level {currentLevel + 1}</Text>
      <View style={styles.grid}>
        <View style={[styles.exit, { left: exitX * 50, top: exitY * 50 }]} />
        {blocks.map((block) => (
          <TouchableOpacity
            key={block.id}
            /* onPress={() => onPress(block.id)} */
            onPressIn={()=> onPress(block.id)}
          >
            <View
              style={[
                styles.block,
                {
                  backgroundColor: block.isRed ? "red" : "blue",
                  width: block.width * 50,
                  height: block.height * 50,
                  position: "absolute",
                  left: block.x * 50,
                  top: block.y * 50,
                  borderColor:
                    selectedBlock === block.id ? "yellow" : "transparent",
                  borderWidth: selectedBlock === block.id ? 3 : 0,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => selectedBlock && moveBlock(selectedBlock, "up")}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectedBlock && moveBlock(selectedBlock, "left")}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectedBlock && moveBlock(selectedBlock, "right")}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>Right</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectedBlock && moveBlock(selectedBlock, "down")}
          style={styles.controlButton}
        >
          <Text style={styles.controlButtonText}>Down</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
        <Text style={styles.controlButtonText}>Återställ</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  title: { fontSize: 24, marginBottom: 20 },
  grid: {
    width: 300,
    height: 300,
    position: "relative",
    backgroundColor: "#ddd",
  },
  block: { position: "absolute" },
  exit: {
    width: 50,
    height: 50,
    backgroundColor: "green",
    position: "absolute",
  },
  controls: { flexDirection: "row", marginTop: 20 },
  controlButton: { backgroundColor: "lightblue", padding: 10, margin: 5 },
  resetButton: { backgroundColor: "red", padding: 10, marginTop: 20 },
  controlButtonText: { fontSize: 16, fontWeight: "bold" },
})

export default UnblockMe