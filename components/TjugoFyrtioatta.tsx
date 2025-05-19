import React, { useState } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native"

const GRID_SIZE: number = 4
const WINNING_TILE: number = 2048

type Board = number[][]

const generateEmptyBoard = (): Board =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0))

const getRandomEmptyCell = (board: Board): { row: number; col: number } | null => {
  let emptyCells: { row: number; col: number }[] = []
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) emptyCells.push({ row: rowIndex, col: colIndex })
    })
  })
  return emptyCells.length > 0
    ? emptyCells[Math.floor(Math.random() * emptyCells.length)]
    : null
}

const addRandomTile = (board: Board): Board => {
  let newBoard = board.map((row) => [...row])
  const cell = getRandomEmptyCell(newBoard)
  if (cell) newBoard[cell.row][cell.col] = Math.random() < 0.9 ? 2 : 4
  return newBoard
}

const moveLeft = (board: Board): Board => {
  let newBoard = board.map((row) => {
    let filteredRow = row.filter((num: number) => num)
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2
        filteredRow[i + 1] = 0
      }
    }
    return [
      ...filteredRow.filter((num: number) => num),
      ...Array(GRID_SIZE - filteredRow.length).fill(0),
    ]
  })
  return newBoard
}

const rotateBoard = (board: Board): Board => {
  return board[0].map((_, colIndex) =>
    board.map((row) => row[colIndex]).reverse()
  )
}

const moveBoard = (direction: number, board: Board): Board => {
  let newBoard: Board = [...board]
  for (let i = 0; i < direction; i++) newBoard = rotateBoard(newBoard)
  newBoard = moveLeft(newBoard)
  for (let i = 0; i < (4 - direction) % 4; i++) newBoard = rotateBoard(newBoard)
  return newBoard
}

const checkGameOver = (board: Board): boolean => {
  if (getRandomEmptyCell(board)) return false
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (
        (col < GRID_SIZE - 1 && board[row][col] === board[row][col + 1]) ||
        (row < GRID_SIZE - 1 && board[row][col] === board[row + 1][col])
      ) {
        return false
      }
    }
  }
  return true
}

const checkWin = (board: Board): boolean => {
  return board.some((row) => row.includes(WINNING_TILE))
}

export default function Game2048() {
  const [board, setBoard] = useState<Board>(addRandomTile(generateEmptyBoard()))
  const [gameOver, setGameOver] = useState(false)
  const [hasWon, setHasWon] = useState(false)

  const handleMove = (direction: number) => {
    if (gameOver || hasWon) return // Disable move if game is over or won
    let newBoard = moveBoard(direction, board)
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      newBoard = addRandomTile(newBoard)
      setBoard(newBoard)
      if (checkWin(newBoard)) {
        setHasWon(true)
        Alert.alert("Bra jobbat!", "Du nådde 2048!")
      }
      if (checkGameOver(newBoard)) {
        setGameOver(true)
        Alert.alert("Game Over", "Try again!")
      }
    }
  }

  const resetGame = () => {
    setBoard(addRandomTile(generateEmptyBoard()))
    setGameOver(false)
    setHasWon(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameBoard}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[styles.tile, { backgroundColor: getTileColor(cell) }]}
              >
                <Text style={styles.tileText}>{cell !== 0 ? cell : ""}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove(3)} // Up
          >
            <Text style={styles.controlButtonText}>Up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove(0)} // Left
          >
            <Text style={styles.controlButtonText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove(1)} // Down
          >
            <Text style={styles.controlButtonText}>Down</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleMove(2)} // Right
          >
            <Text style={styles.controlButtonText}>Right</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.buttonText}>Återställ</Text>
      </TouchableOpacity>
    </View>
  )
}

const getTileColor = (value: number) => {
  switch (value) {
    case 2:
      return "#eee4da"
    case 4:
      return "#ede0c8"
    case 8:
      return "#f2b179"
    case 16:
      return "#f59563"
    case 32:
      return "#f67c5f"
    case 64:
      return "#f65e3b"
    case 128:
      return "#edcf72"
    case 256:
      return "#edcc61"
    case 512:
      return "#edc850"
    case 1024:
      return "#edc53f"
    case 2048:
      return "#edc22e"
    default:
      return "#ccc0b3"
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8ef",
  },
  gameBoard: {
    width: GRID_SIZE * 80, 
    height: GRID_SIZE * 80,
    backgroundColor: "#bbada0",
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#776e65",
  },
  controls: {
    marginTop: 20,
    alignItems: "center",
  },
  controlButton: {
    backgroundColor: "#8f7a66",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#8f7a66",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})



