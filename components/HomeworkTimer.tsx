import React, { useState, useEffect } from "react"
import { View, Text, Button, Alert } from "react-native"
import { db } from "./Firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore"

const HomeworkTimer = () => {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalStudyTime, setTotalStudyTime] = useState(0)

  // Timer-logik
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])
  // Pausvarning
  useEffect(() => {
    if (seconds > 0 && seconds % 1200 === 0) {
      Alert.alert("Dags för en paus!", "Ta en paus i 5 minuter.")
    }
  }, [seconds])

  // Starta/stoppa timer + spara till Firestore
  const handleStartStop = async () => {
    if (isRunning) {
      try {
        await addDoc(collection(db, "studySessions"), {
          duration: seconds,
          timestamp: Timestamp.now(),
        })
        setTotalStudyTime((prev) => prev + seconds)
      } catch (e) {
        console.error("Kunde inte spara session:", e)
      }
    }
    setIsRunning(!isRunning)
    if (!isRunning) setSeconds(0)
  }

  // Hämta tid senaste 7 dagarna
  useEffect(() => {
    const fetchWeeklyTime = async () => {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const q = query(
        collection(db, "studySessions"),
        where("timestamp", ">=", Timestamp.fromDate(oneWeekAgo))
      )
      try {
        const snapshot = await getDocs(q)
        let total = 0
        snapshot.forEach((doc) => {
          total += doc.data().duration
        })
        setTotalStudyTime(total)
      } catch (e) {
        console.error("Kunde inte hämta studietid:", e)
      }
    }

    fetchWeeklyTime()
  }, [])

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>Läxtimer</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        Tid: {Math.floor(seconds / 60)} min {seconds % 60} sek
      </Text>
      <Button
        title={isRunning ? "Stoppa" : "Starta"}
        onPress={handleStartStop}
      />
      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Studietid senaste 7 dagar: {Math.floor(totalStudyTime / 60)} minuter
      </Text>
    </View>
  )
}

export default HomeworkTimer