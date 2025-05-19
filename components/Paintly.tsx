import React, { useState } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
} from "react-native"
import Svg, { Path, G } from "react-native-svg"

const colors = ["red", "blue", "green", "yellow", "purple", "black", "white"]

const images = [
  {
    id: 1,
    name: "Stjärna",
    path: "M50,15 L61,35 H85 L66,50 L75,75 L50,60 L25,75 L34,50 L15,35 H39 Z",
  },
  {
    id: 2,
    name: "Hjärta",
    path: "M50,80 C30,50 0,30 25,10 C40,-10 50,10 50,10 C50,10 60,-10 75,10 C100,30 70,50 50,80 Z",
  },
  {
    id: 3,
    name: "Fisk",
    path: "M20,50 Q40,30 60,50 Q40,70 20,50 M60,50 L80,40 M60,50 L80,60",
  },
  {
    id: 4,
    name: "Sportbil",
    path: "M10,60 Q30,40 70,40 Q90,60 90,70 L10,70 Z M20,70 Q25,75 30,70 M70,70 Q75,75 80,70",
  },
  {
    id: 5,
    name: "Buss",
    path: "M10,60 H90 V30 H10 Z M20,60 Q25,70 30,60 M70,60 Q75,70 80,60",
  },
  { id: 6, name: "Hus", path: "M10,70 H90 V40 L50,10 L10,40 Z" },
  {
    id: 7,
    name: "Slott",
    path: "M20,70 H80 V40 L70,20 L50,40 L30,20 L20,40 Z",
  },
  {
    id: 8,
    name: "Ballong",
    path: "M50,20 Q70,40 50,60 Q30,40 50,20 M50,60 L50,80",
  },
]

const Paintly = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("black")
  const [lines, setLines] = useState<{ color: string; points: string }[]>([])
  const [isEraser, setIsEraser] = useState(false)
  const [eraserSize, setEraserSize] = useState(5);

  const SCALE_FACTOR = 100 / 390 // Manage offset, probably depends on screen size..

  const startDrawing = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent
    const x = locationX * SCALE_FACTOR
    const y = locationY * SCALE_FACTOR

    setLines([
      ...lines,
      { color: isEraser ? "#f0f0f0" : selectedColor, points: `${x},${y}` },
    ])
  }

  const continueDrawing = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent
    const x = locationX * SCALE_FACTOR
    const y = locationY * SCALE_FACTOR

    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines
      const newLines = [...prevLines]
      newLines[newLines.length - 1].points += ` ${x},${y}`
      return newLines
    })

    if (isEraser) {
      setLines((prevLines) => {
        const newLines = [...prevLines]
        const lastLine = newLines[newLines.length - 1]
        const points = lastLine.points.split(" ")
        const lastPoint = points[points.length - 1].split(",")
        const lastX = parseFloat(lastPoint[0])
        const lastY = parseFloat(lastPoint[1])

        newLines.push({
          color: "#f0f0f0",
          points: `${lastX - eraserSize},${lastY - eraserSize} ${
            lastX + eraserSize
          },${lastY + eraserSize}`,
        })

        return newLines
      })
    }
  }

  return (
    <View style={styles.container}>
      {!selectedImage ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => {
                setSelectedImage(item.path)
              }}
            >
              <Text style={styles.imageText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.canvasContainer}>
          <Svg
            width="100%"
            height="60%"
            viewBox="0 0 100 100"
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={startDrawing}
            onResponderMove={continueDrawing}
          >
            <G>
              {/* Användarens linjer under figuren */}
              {lines.map((line, index) => (
                <Path
                  key={index}
                  d={`M${line.points}`}
                  stroke={line.color}
                  strokeWidth="0.8"
                  fill="none"
                />
              ))}
              {/* Figuren ritas ovanpå linjerna */}
              <Path
                d={selectedImage}
                fill="none"
                stroke="black"
                strokeWidth="0.5"
              />
            </G>
          </Svg>

          <View style={styles.controlsContainer}>
            <View style={styles.colorPalette}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => {
                    setSelectedColor(color)
                    setIsEraser(false)
                  }}
                />
              ))}
              <TouchableOpacity
                style={[styles.eraserButton, isEraser && styles.selectedColor]}
                onPress={() => setIsEraser(true)}
              >
                <Text style={styles.buttonText}>Suddgummi</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.eraserSizeContainer}>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => setEraserSize(5)}
              >
                <Text style={styles.buttonText}>Liten</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => setEraserSize(10)}
              >
                <Text style={styles.buttonText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => setEraserSize(20)}
              >
                <Text style={styles.buttonText}>Stor</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={() => setLines([])}
              >
                <Text style={styles.buttonText}>Rensa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.backButton]}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.buttonText}>Tillbaka</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  listContainer: { padding: 20 },
  imageButton: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  imageText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  canvasContainer: { flex: 1, padding: 20 },
  controlsContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  eraserButton: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 10,
    alignItems: "center",
  },
  eraserSizeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginTop: 20,
  },
  sizeButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  resetButton: { backgroundColor: "#FF5733" },
  backButton: { backgroundColor: "#007BFF" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
})

export default Paintly;