import React, { useRef, useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import Matter from "matter-js"

const { width, height } = Dimensions.get("window")

type Line = { x: number; y: number }

const createWorld = () => {
  let engine = Matter.Engine.create({ gravity: { y: 0.5 } })
  let world = engine.world

  let ballA = Matter.Bodies.circle(width * 0.3, height * 0.5, 20, {
    restitution: 0.8,
  })
  let ballB = Matter.Bodies.circle(width * 0.7, height * 0.5, 20, {
    restitution: 0.8,
  })

  let ground = Matter.Bodies.rectangle(width / 2, height, width, 20, {
    isStatic: true,
  })
  let ceiling = Matter.Bodies.rectangle(width / 2, 0, width, 20, {
    isStatic: true,
  })
  let leftWall = Matter.Bodies.rectangle(0, height / 2, 20, height, {
    isStatic: true,
  })
  let rightWall = Matter.Bodies.rectangle(width, height / 2, 20, height, {
    isStatic: true,
  })

  Matter.World.add(world, [ballA, ballB, ground, ceiling, leftWall, rightWall])
  return { engine, world, ballA, ballB }
}

const BrainDotsGame = () => {
  const [path, setPath] = useState<string>("")
  const [lines, setLines] = useState<Line[]>([])
  const { engine, world, ballA, ballB } = useRef(createWorld()).current
  const [ballAPosition, setBallAPosition] = useState({
    x: width * 0.3,
    y: height * 0.5,
  })
  const [ballBPosition, setBallBPosition] = useState({
    x: width * 0.7,
    y: height * 0.5,
  })
  const [lineBodies, setLineBodies] = useState<Matter.Body[]>([])
  const [collisionDetected, setCollisionDetected] = useState(false)  // Track collision status

  useEffect(() => {
    const interval = setInterval(() => {
      Matter.Engine.update(engine)
      setBallAPosition({ x: ballA.position.x, y: ballA.position.y })
      setBallBPosition({ x: ballB.position.x, y: ballB.position.y })

      const collisionResult = Matter.SAT.collides(ballA, ballB)
      if (collisionResult && collisionResult.collided && !collisionDetected) {
        alert("Bra jobbat! Bollarna har mötts! 🎉")
        setCollisionDetected(true)  // Set the flag to prevent further alerts
      }
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [collisionDetected])  // Add collisionDetected as dependency

  const handleTouch = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent
    setLines((prevLines: Line[]) => [
      ...prevLines,
      { x: locationX, y: locationY },
    ])
    setPath(
      (prevPath: string) =>
        prevPath +
        (prevPath
          ? ` L${locationX},${locationY}`
          : `M${locationX},${locationY}`)
    )

    if (lines.length > 0) {
      const lastPoint = lines[lines.length - 1]
      const lineBody = Matter.Bodies.rectangle(
        (lastPoint.x + locationX) / 2,
        (lastPoint.y + locationY) / 2,
        Math.sqrt(
          Math.pow(locationX - lastPoint.x, 2) +
            Math.pow(locationY - lastPoint.y, 2)
        ),
        5,
        { isStatic: true }
      )
      Matter.World.add(world, lineBody)
      setLineBodies((prevBodies) => [...prevBodies, lineBody])
    }
  }

  const resetGame = () => {
    setLines([])
    setPath("")
    Matter.Body.setPosition(ballA, { x: width * 0.3, y: height * 0.5 })
    Matter.Body.setPosition(ballB, { x: width * 0.7, y: height * 0.5 })
    setCollisionDetected(false)  // Reset collision detection state

    lineBodies.forEach((body) => Matter.World.remove(world, body))
    setLineBodies([])
  }

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderMove={handleTouch}
      /* onResponderRelease={() => setPath((prevPath: string) => prevPath + " Z")} */
    >
      {/* Render lines using Svg */}
      <Svg style={styles.svgCanvas}>
        <Path d={path} stroke="black" strokeWidth={5} fill="none" />
      </Svg>

      {/* Render balls using View and absolute positioning */}
      <View style={styles.ballsContainer}>
        <View
          style={[styles.ball, { left: ballAPosition.x - 20, top: ballAPosition.y - 20, backgroundColor: "blue" }]}
        />
        <View
          style={[styles.ball, { left: ballBPosition.x - 20, top: ballBPosition.y - 20, backgroundColor: "red" }]}
        />
      </View>

      {/* Reset button */}
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Återställ</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  svgCanvas: { position: "absolute", width: "100%", height: "100%" },
  ballsContainer: { position: "absolute", width: "100%", height: "100%" },
  ball: { position: "absolute", width: 40, height: 40, borderRadius: 20 },
  button: { position: "absolute", bottom: 30, alignSelf: "center", padding: 10, backgroundColor: "blue", borderRadius: 5 },
  buttonText: { color: "white", fontSize: 18 },
})

export default BrainDotsGame
