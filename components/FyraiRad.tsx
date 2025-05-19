import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"

const ROWS = 6
const COLS = 7
const EMPTY = 0
const PLAYER1 = 1
const PLAYER2 = 2

const FyraiRad = () => {
  const [board, setBoard] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY))
  )
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER1)
  const [gameMode, setGameMode] = useState<"AI" | "2P" | null>(null)

  const startGame = (mode: "AI" | "2P") => {
    setGameMode(mode)
    resetGame()
  }

  const dropPiece = (col: number) => {
    if (!gameMode) return

    const newBoard = [...board.map((row) => [...row])]
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === EMPTY) {
        newBoard[row][col] = currentPlayer
        setBoard(newBoard)

        if (checkWinner(newBoard, row, col, currentPlayer)) {
          // Lägg till fördröjning innan spelet återställs
          Alert.alert("Bra jobbat!", `Spelare ${currentPlayer} vinner!`, [
            { text: "OK", onPress: resetGame },
          ])
          return
        }

        if (gameMode === "AI" && currentPlayer === PLAYER1) {
          setCurrentPlayer(PLAYER2)
          setTimeout(() => aiMove(newBoard), 500)
        } else {
          setCurrentPlayer(currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1)
        }
        return
      }
    }
  }

  const aiMove = (newBoard: number[][]) => {
    const availableCols = newBoard[0]
      .map((_, col) => col)
      .filter((col) => newBoard[0][col] === EMPTY)

    if (availableCols.length === 0) return

    const randomCol =
      availableCols[Math.floor(Math.random() * availableCols.length)]

    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][randomCol] === EMPTY) {
        newBoard[row][randomCol] = PLAYER2 // AI spelar sitt drag
        setBoard([...newBoard])

        if (checkWinner(newBoard, row, randomCol, PLAYER2)) {
          Alert.alert("Bra jobbat!", "Datorn vinner!", [
            { text: "OK", onPress: resetGame },
          ])
          return
        }

        setCurrentPlayer(PLAYER1) // Byt tillbaka till spelaren
        return
      }
    }
  }

  const checkWinner = (
    board: number[][],
    row: number,
    col: number,
    player: number
  ) => {
    const directions = [
      { dr: 1, dc: 0 },
      { dr: 0, dc: 1 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ]

    for (let { dr, dc } of directions) {
      let count = 1
      for (let step = 1; step < 4; step++) {
        const r = row + dr * step,
          c = col + dc * step
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player)
          count++
        else break
      }
      for (let step = 1; step < 4; step++) {
        const r = row - dr * step,
          c = col - dc * step
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player)
          count++
        else break
      }
      if (count >= 4) return true
    }
    return false
  }

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY)))
    setCurrentPlayer(PLAYER1)
  }

  if (!gameMode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fyra i Rad</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => startGame("2P")}
        >
          <Text style={styles.menuText}>Spela mot en vän</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => startGame("AI")}
        >
          <Text style={styles.menuText}>Spela mot datorn</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fyra i Rad</Text>
      <Text style={styles.turnText}>Spelare {currentPlayer}'s tur</Text>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.cell,
                cell === PLAYER1
                  ? styles.player1
                  : cell === PLAYER2
                  ? styles.player2
                  : {},
              ]}
              onPress={() => dropPiece(colIndex)}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Starta om spelet</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  turnText: { fontSize: 20, marginBottom: 10 },
  row: { flexDirection: "row" },
  cell: {
    width: 50,
    height: 50,
    margin: 2,
    backgroundColor: "#ddd",
    borderRadius: 25,
  },
  player1: { backgroundColor: "red" },
  player2: { backgroundColor: "yellow" },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  resetText: { color: "#fff", fontSize: 18 },
  menuButton: {
    padding: 15,
    backgroundColor: "#28a745",
    marginVertical: 10,
    borderRadius: 5,
  },
  menuText: { color: "#fff", fontSize: 20 },
})

export default FyraiRad;