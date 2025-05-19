import React, { useState, useEffect, Animated } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import EnergyBar from './EnergyBar';
import { useUsageStats } from './UsageStatsContext';
import { useNavigation } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

const generateDeck = () => {
  const suits = ['♠', '♣', '♦', '♥'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let deck: string[] = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push(value + suit);
    }
  }

  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

const calculateScore = (hand: string[]) => {
  let score = 0;
  let aces = 0;

  hand.forEach(card => {
    const value = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(value)) {
      score += 10;
    } else if (value === 'A') {
      aces += 1;
      score += 11;
    } else {
      score += parseInt(value);
    }
  });

  while (score > 21 && aces) {
    score -= 10;
    aces -= 1;
  }

  return score;
};

const BlackJack = () => {
  const { energy, setEnergy } = useUsageStats();

  const [deck, setDeck] = useState<string[]>(generateDeck());
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [stand, setStand] = useState(false);
  const [opacity, setOpacity] = useState(0)
  const navigation = useNavigation();

  /* useEffect(() => {
      Orientation.lockToLandscape();
  
      return ()=> Orientation.lockToPortrait();
    }, []); */

  const startGame = () => {
    const newDeck = generateDeck();
    setDeck(newDeck);

    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setDealerHand([newDeck.pop()!, newDeck.pop()!]);

    setGameOver(false);
    setMessage('');
    setOpacity(0);
    setStand(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    const score = calculateScore(playerHand);
    if (score === 21 && playerHand.length === 2) {
      setMessage("BlackJack!");
      setOpacity(1);
      setEnergy(prev => prev + 10);
      setGameOver(true);
    } else if (score > 21) {
      setMessage("Player busts.");
      setOpacity(1);
      setEnergy(prev => prev - 10);
      setGameOver(true);
    }
  }, [playerHand]);

  useEffect(() => {
    const score = calculateScore(dealerHand);
    if (score > 21) {
      setMessage("Dealer busts. Player wins!");
      setOpacity(1);
      setEnergy(prev => prev + 5);
      setGameOver(true);
    }
  }, [dealerHand]);

  const playerHit = () => {
    if (gameOver) return;

    const newCard = deck.pop();
    setPlayerHand(prev => [...prev, newCard!]);
  };

  const playerStand = async () => {
    if (gameOver) return;
    setStand(true);

    let updatedHand = [...dealerHand];
    let dealerScore = calculateScore(updatedHand);

    while (dealerScore < 17) {
      const newCard = deck.pop();
      if (!newCard) break;
      updatedHand.push(newCard);
      dealerScore = calculateScore(updatedHand);
      setDealerHand([...updatedHand]);
      await new Promise(res => setTimeout(res, 1000));
    }

    const playerScore = calculateScore(playerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
      setMessage("Player wins!");
      setOpacity(1);
      setEnergy(prev => prev + 5);
    } else if (playerScore === dealerScore) {
      setMessage("It's a tie!");
      setOpacity(1);
    } else {
      setMessage("Dealer wins!");
      setOpacity(1);
      setEnergy(prev => prev - 10);
    }

    setGameOver(true);
    setStand(false);
  };

  const getCardColor = (card: string) => {
    const suit = card.slice(-1);
    return suit === '♥' || suit === '♦' ? 'red' : 'black';
  };

  const renderHand = (label: string, hand: string[]) => (
    <View style={styles.handBlock}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.score}>Score: {calculateScore(hand)}</Text>
      <View style={styles.cardRow}>
        {hand.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text style={[styles.cardText, { color: getCardColor(card) }]}>{card}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ImageBackground source={require("../assets/background.png")} style={styles.landscapeContainer}>
      <Image source={require("../assets/Vector.png")} style={{ left: 100, top: 100, zIndex: 1, opacity: opacity}}></Image>
      <Image source={require("../assets/emo.png")} style={{ left: -100, top: 150, position: "absolute",}}></Image>
    <View style={styles.landscapeContainer}>
      <View style={styles.leftSide}>
        {/* <EnergyBar value={energy} /> */}
        {renderHand("Emo's Hand", dealerHand)}
        {renderHand("Your Hand", playerHand)}
      </View>

      <View style={styles.rightSide}>
        <TouchableOpacity style={styles.energyBar}>
          <EnergyBar value={energy} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Blackjack</Text>
        {message && <Text style={styles.message}>{message}</Text>}

        {gameOver ? (
          <TouchableOpacity onPress={startGame} style={styles.button}>
            <ImageBackground source={require("../assets/Bubble1.png")} style={styles.bubbleButton}>
              <Text style={styles.buttonText}>Start Over</Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={playerHit} style={styles.button}>
              <ImageBackground source={require("../assets/Bubble1.png")} style={styles.bubbleButton}>
                <Text style={styles.hitButtonText}>Hit</Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={playerStand} style={styles.button}>
              <ImageBackground source={require("../assets/Bubble1.png")} style={styles.bubbleButton}>
                <Text style={styles.standButtonText}>Stand</Text>
              </ImageBackground>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity onPress={()=> navigation.goBack()} style={styles.backButton}>
          <ImageBackground source={require("../assets/Rektangel.png")} style={styles.backRectangle}>
            <Text style={styles.backButtonText}>Back</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    //backgroundColor: '#f5f5f5',
  },
  leftSide: {
    flex: 2,
    paddingRight: 10,
    paddingLeft: 40,
    justifyContent: "center",
    //backgroundColor: "red"
  },
  rightSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    //backgroundColor: "blue",
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 'bold',
    marginBottom: 20,
    top: -10,
    position: "absolute",
    right: 550
  },
  message: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    //backgroundColor: "red",
    right: 550,
    top: 30,
    zIndex: 1
  },
  handBlock: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "white"
  },
  score: {
    fontSize: 16,
    marginBottom: 5,
    color: "white"
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
   // backgroundColor: "green",
    justifyContent: "center"
  },
  card: {
    width: 50,
    height: 80,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cardText: {
    fontSize: 20,
  },
  button: {
    top: 40,
   // backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginVertical: 10,
    width: 140,
    alignItems: 'center',
  },
  backButton: {
    top: 300,
    //backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginVertical: 10,
    width: 100,
    alignItems: 'center',
    position: "absolute"
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    //backgroundColor: "red",
    top: 20,
    left: 20
    
  },
  hitButtonText: {
    color: '#fff',
    fontSize: 18,
    //backgroundColor: "red",
    top: 25,
    left: 25
  },
  standButtonText: {
    color: '#fff',
    fontSize: 18,
    //backgroundColor: "red",
    top: 25,
    left: 15

  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    left: 20,
    top: 7
  },
  energyBar: {
    flex: 1,
    //backgroundColor: "red",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 200,
    /*bottom: 150,
    left: 60 */
  },
  bubbleButton: {
    width: 80,
    height: 80,
  },
  backRectangle: {
    width: 100,
    height: 40
  }
});

export default BlackJack;
